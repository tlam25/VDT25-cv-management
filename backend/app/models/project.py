from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Project(Base):
    __tablename__ = "projects"

    proj_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    pm_id = Column(Integer, ForeignKey("employees.emp_id"), index=True, nullable=False)
    proj_name = Column(String, index=True, nullable=False)
