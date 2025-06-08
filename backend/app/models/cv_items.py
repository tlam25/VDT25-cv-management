from app.core.database import Base
from sqlalchemy import Column, Integer, Date, ForeignKey, func, Enum
import enum

class CvStatus(enum.Enum):
    updated = "Updated"
    in_progress = "In Progress"
    cancalled = "Cancelled"

class CvItem(Base):
    __tablename__ = "cv_items"

    cv_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True, nullable=False)
    update_date = Column(Date)
    editor_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)
    status = Column(Enum(CvStatus, values_callable=lambda obj: [e.value for e in obj]), default=CvStatus.updated)