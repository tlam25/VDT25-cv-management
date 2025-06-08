from fastapi import APIRouter, Depends, HTTPException, Query, Body

from app.models.notification import Notification
from app.models.request import Request
from app.models.role import RoleType, Role
from app.models.has_role import HasRole
from app.models.cv_items import CvItem
from app.models.employee import Employee

from .login import get_current_user, UserResponse

from app.core.database import get_db
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/notifications", tags=["notifications"])

class NotificationResponse(BaseModel):
    notification_id: int
    message: Optional[str] = None
    status: str
    date: date
    sender: str
    sender_roles: List[str]
    is_read: bool

class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]

class NotificationMarkAsRead(BaseModel):
    is_read: bool

@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(10, ge=1, le=100),  # Pagination: default limit 10, max 100
    offset: int = Query(0, ge=0),
    is_read: Optional[bool] = None
):
    if RoleType.admin.value in current_user.roles:
        raise HTTPException(403, "Admin does not have permission to access this resource")

    notifications_query = (
        db.query(Notification)
        .filter(
            Notification.request_id.in_(
                db.query(Request.request_id)
                .filter(Request.cv_id.in_(
                    db.query(CvItem.cv_id)
                    .filter(CvItem.emp_id == current_user.emp_id)
                ))
            )
        )
        .order_by(Notification.notification_id.desc())
    )

    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)

    # apply pagination
    notifications = notifications_query.offset(offset).limit(limit).all()

    if not notifications:
        return {"notifications": []}

    noti_list = []
    for noti in notifications:
        req = db.query(Request).filter(Request.request_id == noti.request_id).first()
        sender = db.query(Employee).filter(Employee.emp_id == req.sender_id).first()
        sender_name = f"{sender.first_name} {sender.last_name}" if sender else "Unknown"
        roles_raw = (
            db.query(Role.role_name)
            .join(HasRole, Role.role_id == HasRole.role_id)
            .filter(HasRole.emp_id == req.sender_id)
            .all()
        )
        sender_roles = [
            r[0].value if hasattr(r[0], "value") else r[0]
            for r in roles_raw
        ]
        noti_list.append({
            "notification_id": noti.notification_id,
            "message": req.message,
            "status": req.status,
            "date": req.request_date,
            "sender": sender_name,
            "sender_roles": sender_roles,
            "is_read": noti.is_read
        })

    return {"notifications": noti_list}

@router.patch("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: int, 
    update_data: NotificationMarkAsRead = Body(...),
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = db.query(Notification).filter(Notification.notification_id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    req = db.query(Request).filter(Request.request_id == notification.request_id).first()
    cv_item = db.query(CvItem).filter(CvItem.cv_id == req.cv_id, CvItem.emp_id == current_user.emp_id).first()
    if not cv_item:
        raise HTTPException(status_code=403, detail="You do not have permission to update this notification")
    
    notification.is_read = update_data.is_read
    db.commit()
    db.refresh(notification)

    return {"message": "Marked as read successfully", "notification_id": notification.notification_id, "is_read": notification.is_read}