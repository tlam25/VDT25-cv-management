from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.core.database import get_db
from app.models.enrollment import Enrollment, EnrollmentStatus

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

class EnrollmentSchema(BaseModel):
    enrollment_id: int
    course_id: int
    emp_id: int
    complete_date: Optional[date]
    status: EnrollmentStatus
    duration: Optional[str] = None

class EnrollmentCreateSchema(BaseModel):
    course_id: int
    emp_id: int
    complete_date: Optional[date] = None
    status: EnrollmentStatus = EnrollmentStatus.in_progress
    duration: Optional[str] = None

@router.get("/{emp_id}", response_model=List[EnrollmentSchema])
async def get_enrollments(emp_id: int, db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).filter(Enrollment.emp_id == emp_id).all()
    if not enrollments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No enrollments found for employee with id {emp_id}"
        )
    
    return enrollments

@router.post("/", response_model=EnrollmentSchema)
async def create_enrollment(enrollment: EnrollmentCreateSchema, db: Session = Depends(get_db)):
    new_enrollment = Enrollment(
        course_id = enrollment.course_id,
        emp_id = enrollment.emp_id,
        complete_date = enrollment.complete_date,
        status = enrollment.status,
        duration = enrollment.duration
    )
    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)
    return new_enrollment

@router.delete("/{enrollment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).filter(Enrollment.enrollment_id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enrollment with id {enrollment_id} not found"
        )
    db.delete(enrollment)
    db.commit()
    return {"detail": "Enrollment deleted successfully"}