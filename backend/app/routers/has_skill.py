from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.has_skill import HasSkill

router = APIRouter(prefix="/has_skill", tags=["has_skill"])

class HasSkillSchema(BaseModel):
    id: int
    skill_id: int
    emp_id: int

class HasSkillCreateSchema(BaseModel):
    skill_id: int
    emp_id: int

@router.get("/", response_model=List[HasSkillSchema])
async def get_has_skills(db: Session = Depends(get_db)):
    has_skills = db.query(HasSkill).all()
    return has_skills

@router.post("/", response_model=HasSkillSchema)
async def create_has_skill(has_skill: HasSkillCreateSchema, db: Session = Depends(get_db)):
    new_has_skill = HasSkill(
        skill_id = has_skill.skill_id,
        emp_id = has_skill.emp_id
    )
    db.add(new_has_skill)
    db.commit()
    db.refresh(new_has_skill)
    return new_has_skill

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_enrollment(skill_id: int, db: Session = Depends(get_db)):
    enrollment = db.query(HasSkill).filter(HasSkill.enrollment_id == skill_id).first()
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enrollment with id {skill_id} not found"
        )
    db.delete(enrollment)
    db.commit()
    return {"detail": "HasSkill deleted successfully"}