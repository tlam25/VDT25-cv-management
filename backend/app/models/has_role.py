from app.core.database import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship


class HasRole(Base):
    __tablename__ = "has_role"

    id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"), index=True)

    employee = relationship("Employee", back_populates="has_roles")
    role = relationship("Role", back_populates="has_roles")