from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class HasSkill(Base):
    __tablename__ = "has_skill"

    id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    skill_id = Column(Integer, ForeignKey("skills.skill_id"), index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)
