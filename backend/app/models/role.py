from app.core.database import Base
from sqlalchemy import Column, Integer, Enum
import enum
from sqlalchemy.orm import relationship

class RoleType(enum.Enum):
    admin = 'Admin'
    pm = 'Project Manager'
    lead = 'Leader'
    staff = 'Staff'

class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    role_name = Column(Enum(RoleType, values_callable=lambda obj: [e.value for e in obj]), index=True, nullable=False)

    has_roles = relationship("HasRole", back_populates="role")