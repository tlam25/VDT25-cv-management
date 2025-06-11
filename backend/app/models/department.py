from app.core.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class Department(Base):
    __tablename__ = "departments"

    dept_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    dept_name = Column(String, index=True, nullable=False)

    employees = relationship("Employee", back_populates="department")
