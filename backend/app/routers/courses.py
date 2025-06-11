from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import List
from app.models.course import Course

router = APIRouter(prefix="/courses", tags=["courses"])

class CourseSchema(BaseModel):
    course_id: int
    course_name: str
    description: str

class CourseCreateSchema(BaseModel):
    course_name: str
    description: str

@router.get("/", response_model=List[CourseSchema])
async def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses

@router.post("/", response_model=CourseSchema)
async def create_course(course: CourseCreateSchema, db: Session = Depends(get_db)):
    new_course = Course(
        course_name = course.course_name,
        description = course.description,
    )

    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course