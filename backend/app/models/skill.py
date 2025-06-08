from app.core.database import Base
from sqlalchemy import Column, Integer, String

class Skill(Base):
    __tablename__ = "skills"

    skill_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    skill_name = Column(String)
    description = Column(String)
