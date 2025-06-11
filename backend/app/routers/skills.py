from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import List
from app.models.skill import Skill

router = APIRouter(prefix="/skills", tags=["skills"])

class SkillSchema(BaseModel):
    skill_id: int
    skill_name: str
    description: str

class SkillCreateSchema(BaseModel):
    skill_name: str
    description: str

@router.get("/", response_model=List[SkillSchema])
async def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return skills

@router.post("/", response_model=SkillSchema)
async def create_skill(skill: SkillCreateSchema, db: Session = Depends(get_db)):
    new_skill = Skill(
        skill_name = skill.skill_name,
        description = skill.description
    )

    db.add(new_skill)
    db.commit()
    db.refresh(new_skill)
    return new_skill