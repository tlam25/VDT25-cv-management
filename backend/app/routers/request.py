from app.models.cv_items import CvItem, CvStatus
from app.models.employee import Employee, EmployeeStatus
from app.models.works_on_project import WorksOnProject
from app.models.project import Project
from app.models.notification import Notification

from fastapi import APIRouter, Depends, HTTPException
from app.models.request import Request, RequestStatus
from app.models.role import RoleType
from .login import get_current_user, UserResponse
from app.core.database import get_db
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel

router = APIRouter(prefix="/requests", tags=["requests"])

class RequestCreate(BaseModel):
    cv_id: Optional[int] = None
    message: Optional[str] = None

@router.post("/")
async def create_request(
    req: RequestCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if RoleType.staff.value in current_user.roles:
        raise HTTPException(403, "Staff does not have permission to create requests")
    
    cv_item = db.query(CvItem).filter(CvItem.cv_id == req.cv_id).first()
    if not cv_item:
        raise HTTPException(404, "CV item not found")
    
    existing_pending_request = db.query(Request).filter(
        Request.cv_id == req.cv_id,
        Request.status == RequestStatus.pending
    ).first()
    if existing_pending_request:
        raise HTTPException(400, "Không gửi được do đã có yêu cầu đang chờ xử lý cho CV này!")
    
    # receiver is employee who owns that CV item
    receiver = db.query(Employee).filter(Employee.emp_id == cv_item.emp_id, Employee.status == EmployeeStatus.active).first()
    if not receiver:
        raise HTTPException(404, "Receiver not found or inactive")
    if receiver.emp_id == current_user.emp_id:
        raise HTTPException(403, "Cannot send request to yourself")
    
    # check role
    if RoleType.admin.value in current_user.roles:
        pass
    elif RoleType.lead.value in current_user.roles:
        # can just create requests for same department's staff
        lead = db.query(Employee).filter(Employee.emp_id == current_user.emp_id).first()
        if receiver.dept_id != lead.dept_id or receiver.emp_id == lead.emp_id:
            raise HTTPException(403, "No permission to create request for this employee")
    elif RoleType.pm.value in current_user.roles:
        projects_by_pm = db.query(Project.proj_id).filter(Project.pm_id == current_user.emp_id).all()
        proj_ids = [p.proj_id for p in projects_by_pm]
        in_project = db.query(WorksOnProject).filter(
            WorksOnProject.proj_id.in_(proj_ids),
            WorksOnProject.emp_id == receiver.emp_id
        ).first()
        if not in_project:
            raise HTTPException(403, "No permission to create request for this employee")
    else:
        raise HTTPException(403, "No permission to create request")
    
    # create request
    new_request = Request(
        cv_id=req.cv_id,
        sender_id=current_user.emp_id,
        message=req.message,
        status=RequestStatus.pending,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    new_noti = Notification(
        request_id=new_request.request_id,
        is_read=False
    )
    db.add(new_noti)
    cv_item.status = CvStatus.in_progress

    db.commit()

    return {"detail": "Request created successfully", "request_id": new_request.request_id}

@router.get("/by_cv/{cv_id}")
async def get_pending_request_by_cv(cv_id: int, db: Session = Depends(get_db)):
    req = db.query(Request).filter(Request.cv_id == cv_id, Request.status == RequestStatus.pending).first()
    if not req:
        raise HTTPException(404, "No pending request found for this CV")
    return {
        "request_id": req.request_id,
        "cv_id": req.cv_id,
        "sender_id": req.sender_id,
        "message": req.message,
        "status": req.status
    }    

@router.patch("/{request_id}/cancel")
async def cancel_request(
    request_id: int,
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(Request).filter(Request.request_id == request_id).first()

    if not req:
        raise HTTPException(404, "Request not found")
    if req.sender_id != current_user.emp_id:
        raise HTTPException(403, "No permission to cancel this request")
    
    req.status = RequestStatus.cancelled

    cv_item = db.query(CvItem).filter(CvItem.cv_id == req.cv_id).first()
    if cv_item:
        cv_item.status = "Cancelled"
    db.commit()

    return {"detail": "Successfully cancelled request"}