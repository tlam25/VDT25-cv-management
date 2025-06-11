from fastapi import APIRouter, Depends, HTTPException
from app.models.role import RoleType
from app.models.department import Department
from .login import get_current_user, UserResponse
from app.core.database import get_db
from sqlalchemy.orm import Session

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("/")
async def get_departments(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if RoleType.admin.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    departments = db.query(Department).order_by(Department.dept_id).all()
    result = [
        {
            "dept_id": dept.dept_id,
            "dept_name": dept.dept_name
        }
        for dept in departments
    ]
    return {"departments": result}