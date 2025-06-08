from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date, func
import enum
from sqlalchemy.orm import relationship

class EmployeeStatus(enum.Enum):
    active = "active"
    inactive = "inactive"

class Employee(Base):
    __tablename__ = "employees"

    emp_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    dept_id = Column(Integer, ForeignKey("departments.dept_id"), index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True)
    start_date = Column(Date, nullable=False)
    status = Column(Enum(EmployeeStatus), index=True, nullable=False, default=EmployeeStatus.active)
    address = Column(String)
    gender = Column(String, nullable=False)
    dob = Column(Date, nullable=False)

    department = relationship("Department", back_populates="employees")
    has_roles = relationship("HasRole", back_populates="employee")