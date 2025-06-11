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

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_has_skill(id: int, db: Session = Depends(get_db)):
    has_skill = db.query(HasSkill).filter(HasSkill.id == id).first()
    if not has_skill:
        raise HTTPException(status_code=404, detail="HasSkill not found")
    db.delete(has_skill)
    db.commit()
    return {"detail": "HasSkill deleted successfully"}