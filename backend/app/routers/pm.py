from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.sql import func

from app.core.database import get_db
from sqlalchemy.orm import Session

from app.models.employee import Employee, EmployeeStatus
from app.models.department import Department
from app.models.role import Role, RoleType
from app.models.has_role import HasRole
from app.models.project import Project
from app.models.works_on_project import WorksOnProject

from .login import get_current_user, UserResponse

router = APIRouter(prefix="/pm", tags=["pm"])

@router.get("/employeeslist")
async def get_employees_list(current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.pm.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    pm = db.query(Employee).filter(Employee.emp_id == current_user.emp_id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Project manager not found")
    
    subquery_project = (
        db.query(Project.proj_id)
        .filter(Project.pm_id == pm.emp_id)
        .subquery()
    )

    subquery_emps_works_on_project = (
        db.query(WorksOnProject.emp_id)
        .filter(WorksOnProject.proj_id.in_(subquery_project))
        .subquery()
    )

    subquery_dept = (
        db.query(Department.dept_name)
        .filter(Department.dept_id == Employee.dept_id)
        .scalar_subquery()
    )

    results = (
        db.query(Employee.emp_id, Employee.first_name, Employee.last_name, Employee.dob, Employee.gender, 
                 subquery_dept.label("department"), Employee.start_date, Employee.phone, Employee.email, Employee.address)
        .filter(
            Employee.emp_id.in_(subquery_emps_works_on_project),
            Employee.status == EmployeeStatus.active)
        .all()
    )

    

    emp_list = []

    for emp in results:
        subquery_roles = (
            db.query(Role.role_name)
            .filter(Role.role_id.in_(
                db.query(HasRole.role_id)
                .filter(HasRole.emp_id == emp.emp_id)
                .subquery()))
            .filter(Role.role_name != RoleType.pm.value)
            .subquery()
        )
        emp_roles = db.query(subquery_roles).all()
        
        project_ids = [
            str(row[0]) for row in db.query(WorksOnProject.proj_id)
            .filter(WorksOnProject.emp_id == emp.emp_id)
            .all()
        ]

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
            "address": emp.address,
            "project_ids": project_ids
        }
        emp_list.append(emp_info)

    return {"employees": emp_list}

@router.get("/projects")
async def get_projects(current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.pm.value not in current_user.roles not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )

    projects = (
        db.query(Project)
        .filter(Project.pm_id == current_user.emp_id)
        .order_by(Project.proj_id).all())
    
    result = [
        {
            "proj_id": proj.proj_id,
            "proj_name": proj.proj_name
        }
        for proj in projects
    ]
    return {"projects": result}

@router.get("/me")
async def get_my_info(current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    if RoleType.lead.value not in current_user.roles:
        raise HTTPException(
            status_code=403,
            detail="User does not have permission to access this resource"
        )
    
    employee = db.query(Employee).filter(Employee.emp_id == current_user.emp_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    subquery_role = (
        db.query(Role.role_name)
        .filter(Role.role_id.in_(
            db.query(HasRole.role_id)
            .filter(HasRole.emp_id == employee.emp_id)
            .subquery()
        ))
    )

    emp = db.query(Employee).filter(Employee.emp_id == current_user.emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    emp_info = {
            "emp_id": emp.emp_id,
            "fullname": f"{emp.last_name} {emp.first_name}",
            "first_name": emp.first_name,
            "last_name": emp.last_name,
            "dob": emp.dob,
            "gender": emp.gender,
            "department": emp.department.dept_name if emp.dept_id else None,
            "roles": [role.role_name for role in subquery_role],
            "start_date": emp.start_date,
            "phone": emp.phone,
            "email": emp.email,
            "address": emp.address
        }
    
    return {"employee": emp_info}
