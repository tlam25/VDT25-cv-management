from app.core.database import Base
from sqlalchemy import Column, Integer, ForeignKey, Date, Enum, String
import enum

class EnrollmentStatus(enum.Enum):
    in_progress = "In Progress"
    completed = "Completed"

class Enrollment(Base):
    __tablename__ = "enrollments"

    enrollment_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.course_id"), index=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)
    duration = Column(String)
    complete_date = Column(Date)
    status = Column(Enum(EnrollmentStatus, values_callable=lambda obj: [e.value for e in obj]), default=EnrollmentStatus.completed)