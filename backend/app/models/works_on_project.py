from app.core.database import Base
from sqlalchemy import Column, Integer, ForeignKey

class WorksOnProject(Base):
    __tablename__ = "works_on_project"

    id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)
    proj_id = Column(Integer, ForeignKey("projects.proj_id"), index=True)