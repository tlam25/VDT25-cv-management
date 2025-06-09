from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.cv_items import CvItem
from app.models.cv_details import CvDetails
from app.models.training import Training
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.has_skill import HasSkill
from app.models.skill import Skill
from app.models.employee import Employee
from app.models.request import Request, RequestStatus
from app.models.notification import Notification

from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from .login import UserResponse, get_current_user

class TrainingSchema(BaseModel):
    training_id: int
    training_name: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    status: Optional[str]
    institution: Optional[str]
    degree: Optional[str]

class CourseSchema(BaseModel):
    course_id: int
    course_name: Optional[str]
    description: Optional[str]
    duration: Optional[str]
    complete_date: Optional[date]
    status: Optional[str]
    duration: Optional[str] = None

class SkillSchema(BaseModel):
    skill_id: int
    skill_name: Optional[str]
    description: Optional[str]

class CvExtraSchema(BaseModel):
    cv_id: Optional[int] = None
    editor_id: int = None 
    update_date: date = None
    status: Optional[str] = None
    summary: Optional[str] = None
    editor_id: Optional[int] = None 
    update_date: Optional[date] = None
    trainings: Optional[List[TrainingSchema]] = []
    courses: Optional[List[CourseSchema]] = []
    skills: Optional[List[SkillSchema]] = []
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

router = APIRouter(prefix="/cv", tags=["CV"])

@router.get("/{emp_id}", response_model=CvExtraSchema)
async def get_cv(emp_id: int, db: Session = Depends(get_db)):
    # summary
    cv_item = db.query(CvItem).filter(CvItem.emp_id == emp_id).order_by(CvItem.update_date.desc()).first()
    summary = None
    if cv_item:
        cv_detail = db.query(CvDetails).filter(CvDetails.cv_id == cv_item.cv_id).first()
        if cv_detail:
            summary = cv_detail.summary

    # trainings
    trainings = db.query(Training).filter(Training.emp_id == emp_id).all()
    trainings_schema = [
        TrainingSchema(
            training_id=t.training_id,
            training_name=t.training_name,
            start_date=t.start_date,
            end_date=t.end_date,
            status=t.status.value,
            institution=t.institution,
            degree=t.degree
        )
        for t in trainings
    ]

    # courses
    enrollments = db.query(Enrollment).filter(Enrollment.emp_id == emp_id).all()
    courses_schema = []
    for e in enrollments:
        course = db.query(Course).filter(Course.course_id == e.course_id).first()
        if course:
            courses_schema.append(
                CourseSchema(
                    course_id=course.course_id,
                    course_name=course.course_name,
                    description=course.description,
                    duration=e.duration,
                    complete_date=e.complete_date,
                    status=e.status.value
                )
            )

    # skills
    has_skills = db.query(HasSkill).filter(HasSkill.emp_id == emp_id).all()
    skill_ids = [hs.skill_id for hs in has_skills]
    skills = db.query(Skill).filter(Skill.skill_id.in_(skill_ids)).all()
    skills_schema = [
        SkillSchema(
            skill_id=s.skill_id,
            skill_name=s.skill_name,
            description=s.description
        )
        for s in skills
    ]

    emp = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    email = emp.email if emp else None
    phone = emp.phone if emp else None
    address = emp.address if emp else None

    return CvExtraSchema(
        cv_id=cv_item.cv_id if cv_item else None,
        editor_id=cv_item.editor_id if cv_item else None,
        update_date=cv_item.update_date if cv_item else None,
        status=cv_item.status if cv_item else None,
        summary=summary,
        trainings=trainings_schema,
        courses=courses_schema,
        skills=skills_schema,
        email=email,
        phone=phone,
        address=address
    )

@router.post("/{emp_id}", response_model=CvExtraSchema)
async def create_cv(emp_id: int, cv_extra_data: CvExtraSchema, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found.")

    existing_cv = db.query(CvItem).filter(CvItem.emp_id == emp.emp_id).first()
    if existing_cv:
        raise HTTPException(status_code=400, detail="CV already exists for this employee.")

    editor_id = cv_extra_data.editor_id or emp_id
    if editor_id not in [emp_id, 1]: 
        raise HTTPException(status_code=403, detail="Editor must be the employee or admin.")

    if cv_extra_data.email:
        emp.email = cv_extra_data.email
    if cv_extra_data.phone:
        emp.phone = cv_extra_data.phone
    if cv_extra_data.address:
        emp.address = cv_extra_data.address
    db.commit()

    new_cv = CvItem(emp_id=emp_id, editor_id=editor_id, status="In Progress")
    db.add(new_cv)
    db.commit()
    db.refresh(new_cv)

    new_cv_detail = CvDetails(cv_id=new_cv.cv_id, summary=cv_extra_data.summary)
    db.add(new_cv_detail)
    db.commit()

    if cv_extra_data.trainings:
        for training in cv_extra_data.trainings:
            new_training = Training(
                emp_id=emp_id,
                training_name=training.training_name,
                start_date=training.start_date,
                end_date=training.end_date,
                status=training.status,
                institution=training.institution,
                degree=training.degree
            )
            db.add(new_training)

    if cv_extra_data.courses:
        for course in cv_extra_data.courses:
            if not course.course_id:
                continue  
            exists = db.query(Enrollment).filter(
                Enrollment.emp_id == emp_id,
                Enrollment.course_id == course.course_id
            ).first()
            if not exists:
                new_enrollment = Enrollment(
                    emp_id=emp_id,
                    course_id=course.course_id,
                    complete_date=course.complete_date,
                    status=course.status,
                    duration=exists.duration
                )
                db.add(new_enrollment)

    if cv_extra_data.skills:
        for skill in cv_extra_data.skills:
            if not skill.skill_id:
                continue 
            exists = db.query(HasSkill).filter(
                HasSkill.emp_id == emp_id,
                HasSkill.skill_id == skill.skill_id
            ).first()
            if not exists:
                new_has_skill = HasSkill(
                    emp_id=emp_id,
                    skill_id=skill.skill_id
                )
                db.add(new_has_skill)

    # update status
    summary_ok = bool(cv_extra_data.summary and cv_extra_data.summary.strip())
    trainings_ok = bool(cv_extra_data.trainings and len(cv_extra_data.trainings) > 0)
    skills_ok = bool(cv_extra_data.skills and len(cv_extra_data.skills) > 0)
    email_ok = bool(cv_extra_data.email and cv_extra_data.email.strip())
    phone_ok = bool(cv_extra_data.phone and cv_extra_data.phone.strip())
    address_ok = bool(cv_extra_data.address and cv_extra_data.address.strip())

    if summary_ok and trainings_ok and skills_ok and email_ok and phone_ok and address_ok:
        new_cv.status = "Updated"
    else:
        new_cv.status = "In Progress"

    new_cv.update_date = func.current_date()
    db.commit()

    return await get_cv(emp_id, db=db)

@router.patch("/{emp_id}", response_model=CvExtraSchema)
async def update_cv(emp_id: int, cv_extra_data: CvExtraSchema, db: Session = Depends(get_db)):
    editor_id = cv_extra_data.editor_id or emp_id
    if editor_id not in [emp_id, 1]:
        raise HTTPException(status_code=403, detail="Editor must be the employee or admin.")

    employee = db.query(Employee).filter(Employee.emp_id == emp_id).first()
    if not employee:
        raise HTTPException(status_code=400, detail="Employee does not exist.")
    cv_item = db.query(CvItem).filter(CvItem.emp_id == emp_id).first()
    if not cv_item:
        raise HTTPException(status_code=400, detail="CV does not exist for this employee.")

    if cv_extra_data.email:
        employee.email = cv_extra_data.email
    if cv_extra_data.phone:
        employee.phone = cv_extra_data.phone
    if cv_extra_data.address:
        employee.address = cv_extra_data.address
    db.commit()

    cv_detail = db.query(CvDetails).filter(CvDetails.cv_id == cv_item.cv_id).first()
    if cv_detail:
        if cv_extra_data.summary is not None:
            cv_detail.summary = cv_extra_data.summary
    else:
        new_cv_detail = CvDetails(cv_id=cv_item.cv_id, summary=cv_extra_data.summary)
        db.add(new_cv_detail)

    if cv_extra_data.trainings is not None:
        old_training = {t.training_id: t for t in db.query(Training).filter(Training.emp_id == emp_id).all()}
        updated_training_ids = set()
        for training_data in cv_extra_data.trainings:
            if training_data.training_id and training_data.training_id in old_training:
                training = old_training[training_data.training_id]
                training.training_name = training_data.training_name or training.training_name
                training.start_date = training_data.start_date or training.start_date
                training.end_date = training_data.end_date or training.end_date
                training.status = training_data.status or training.status
                training.institution = training_data.institution or training.institution
                training.degree = training_data.degree or training.degree
                updated_training_ids.add(training.training_id)
            else:
                new_training = Training(
                    emp_id=emp_id,
                    training_name=training_data.training_name,
                    start_date=training_data.start_date,
                    end_date=training_data.end_date,
                    status=training_data.status,
                    institution=training_data.institution,
                    degree=training_data.degree
                )
                db.add(new_training)
                db.flush()

    if cv_extra_data.courses is not None:
        old_enrollments = {e.course_id: e for e in db.query(Enrollment).filter(Enrollment.emp_id == emp_id).all()}
        for course_data in cv_extra_data.courses:
            if not course_data.course_id:
                continue 
            if course_data.course_id in old_enrollments:
                # có thể cập nhật thông tin enrollment 
                enrollment = old_enrollments[course_data.course_id]
                enrollment.complete_date = course_data.complete_date or enrollment.complete_date
                enrollment.status = course_data.status or enrollment.status
                enrollment.duration = course_data.duration or enrollment.duration
            else:
                new_enrollment = Enrollment(
                    emp_id=emp_id,
                    course_id=course_data.course_id,
                    complete_date=course_data.complete_date,
                    status=course_data.status,
                    duration=course_data.duration
                )
                db.add(new_enrollment)

    if cv_extra_data.skills is not None:
        existing_has_skills = {hs.skill_id: hs for hs in db.query(HasSkill).filter(HasSkill.emp_id == emp_id).all()}
        for skill_data in cv_extra_data.skills:
            if not skill_data.skill_id:
                continue  
            if skill_data.skill_id not in existing_has_skills:
                new_has_skill = HasSkill(
                    emp_id=emp_id,
                    skill_id=skill_data.skill_id
                )
                db.add(new_has_skill)

    # update status cv if all fields are filled
    summary_ok = bool(cv_extra_data.summary and cv_extra_data.summary.strip())
    trainings_ok = bool(cv_extra_data.trainings and len(cv_extra_data.trainings) > 0)
    skills_ok = bool(cv_extra_data.skills and len(cv_extra_data.skills) > 0)
    email_ok = bool(cv_extra_data.email and cv_extra_data.email.strip())
    phone_ok = bool(cv_extra_data.phone and cv_extra_data.phone.strip())
    address_ok = bool(cv_extra_data.address and cv_extra_data.address.strip())

    if summary_ok and trainings_ok and skills_ok and email_ok and phone_ok and address_ok:
        cv_item.status = "Updated"
    else:
        cv_item.status = "In Progress"
    
    # update status if changing after receiving request
    existing_request = db.query(Request).filter(
        Request.cv_id == cv_item.cv_id,
        Request.status == RequestStatus.pending
    ).first()
    if cv_item.status == "Updated" and existing_request:
        existing_request.status = RequestStatus.accepted

    cv_item.update_date = func.current_date()
    cv_item.editor_id = editor_id

    db.commit()
    return await get_cv(emp_id, db=db)

@router.delete("/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(emp_id: int, current_user: UserResponse = Depends(get_current_user), db: Session = Depends(get_db)):
    cv_item = db.query(CvItem).filter(CvItem.emp_id == emp_id).first()
    if not cv_item:
        raise HTTPException(status_code=404, detail="CV not found for this employee.")
    if current_user.role != "admin" and current_user.emp_id != emp_id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this CV.")

    requests = db.query(Request).filter(Request.cv_id == cv_item.cv_id).all()
    request_ids = [r.request_id for r in requests]

    if request_ids:
        db.query(Notification).filter(Notification.request_id.in_(request_ids)).delete(synchronize_session=False)
    
    db.query(Request).filter(Request.cv_id == cv_item.cv_id).delete(synchronize_session=False)
    
    db.query(CvDetails).filter(CvDetails.cv_id == cv_item.cv_id).delete()
    db.query(Training).filter(Training.emp_id == emp_id).delete()
    db.query(Enrollment).filter(Enrollment.emp_id == emp_id).delete()
    db.query(HasSkill).filter(HasSkill.emp_id == emp_id).delete()
    db.delete(cv_item)

    db.commit()
    return {"detail": "CV deleted successfully."}