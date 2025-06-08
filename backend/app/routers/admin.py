from fastapi import APIRouter, Depends, HTTPException

from app.core.database import get_db
from sqlalchemy.orm import Session

from app.models.employee import Employee, EmployeeStatus
from app.models.department import Department
from app.models.role import Role, RoleType
from app.models.has_role import HasRole

from .login import get_current_user, UserResponse

router = APIRouter(prefix="/admin", tags=["admin"])

# Xem danh sach nhan vien
@router.get("/employeeslist")
async def get_employees_list(current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.admin.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    subquery_dept = (
        db.query(Department.dept_name)
        .filter(Department.dept_id == Employee.dept_id)
        .scalar_subquery()
    )

    subquery_roles_not_admin = (
        db.query(Role.role_id)
        .filter(
            Role.role_id == HasRole.role_id,
            Role.role_name != RoleType.admin.value
        )
    )

    subquery_emps_not_admin = (
        db.query(Employee.emp_id)
        .filter(
            Employee.emp_id == HasRole.emp_id,
            HasRole.role_id.in_(subquery_roles_not_admin)
        )
    )

    results = (db.query(Employee.emp_id, Employee.first_name, Employee.last_name, Employee.dob, 
                        Employee.gender, subquery_dept.label("department"), Employee.start_date, 
                        Employee.phone, Employee.email, Employee.address)
        .filter(
            Employee.emp_id.in_(subquery_emps_not_admin),
            Employee.status == EmployeeStatus.active
        )
        .order_by(Employee.emp_id)
    ).all()

    emp_list = []
    for emp in results:
        subquery_roles = (
            db.query(Role.role_name)
            .filter(Role.role_id.in_(
                db.query(HasRole.role_id)
                .filter(HasRole.emp_id == emp.emp_id)
                .subquery()))
            .subquery()
        )
        emp_roles = db.query(subquery_roles).all()

        emp_info = {
            "emp_id": emp.emp_id,
            "fullname": f"{emp.last_name} {emp.first_name}",
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "dob": emp.dob,
            "gender": emp.gender,
            "department": emp.department,
            "roles": [role.role_name for role in emp_roles],
            "start_date": emp.start_date,
            "phone": emp.phone,
            "email": emp.email,
            "address": emp.address
        }
        emp_list.append(emp_info)

    return {"employees": emp_list}

@router.get("/employeeslist/{emp_id}")
async def get_employee_by_id(emp_id: int, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.admin.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    emp = db.query(Employee).filter(Employee.emp_id == emp_id, Employee.status == EmployeeStatus.active).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    dept_name = db.query(Department.dept_name).filter(Department.dept_id == emp.dept_id).scalar()
    emp_roles = db.query(Role.role_name).join(HasRole, Role.role_id == HasRole.role_id)\
        .filter(HasRole.emp_id == emp.emp_id).all()
    roles_list = [role[0] if isinstance(role, tuple) else role.role_name for role in emp_roles]

    emp_info = {
        "emp_id": emp.emp_id,
        "fullname": f"{emp.last_name} {emp.first_name}",
        "first_name": emp.first_name,
        "last_name": emp.last_name,
        "dob": emp.dob,
        "gender": emp.gender,
        "department": dept_name,
        "roles": roles_list,
        "start_date": emp.start_date,
        "phone": emp.phone,
        "email": emp.email,
        "address": emp.address
    }

    return emp_info