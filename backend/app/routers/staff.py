from typing import Optional
from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_db
from sqlalchemy.orm import Session

from app.models.employee import Employee, EmployeeStatus
from app.models.department import Department
from app.models.role import Role, RoleType
from app.models.has_role import HasRole

from .login import get_current_user, UserResponse

router = APIRouter(prefix="/staff", tags=["staff"])

@router.get("/employeeslist")
async def get_employees_list(current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.staff.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    staff = db.query(Employee).filter(Employee.emp_id == current_user.emp_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    subquery_dept = (
        db.query(Department.dept_name)
        .filter(Department.dept_id == Employee.dept_id)
        .scalar_subquery()
    )

    results = (
        db.query(Employee.emp_id, Employee.first_name, Employee.last_name, Employee.dob, 
                        Employee.gender, subquery_dept.label("department"), Employee.start_date, 
                        Employee.phone, Employee.email, Employee.address)
        .filter(
            Employee.emp_id == staff.emp_id,
            Employee.status == EmployeeStatus.active
        )
    ).all()

    emp_list = []
    for emp in results:
        subquery_role = (
            db.query(Role.role_name)
            .filter(Role.role_id.in_(
                db.query(HasRole.role_id)
                .filter(HasRole.emp_id == emp.emp_id)
                .subquery()
            ))
        )

        emp_info = {
            "emp_id": emp.emp_id,
            "fullname": f"{emp.last_name} {emp.first_name}",
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "dob": emp.dob,
            "gender": emp.gender,
            "department": emp.department,
            "roles": [role.role_name for role in subquery_role],
            "start_date": emp.start_date,
            "phone": emp.phone,
            "email": emp.email,
            "address": emp.address
        }
        emp_list.append(emp_info)

    return {"employees": emp_list}