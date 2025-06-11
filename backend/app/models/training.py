from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date
import enum

class TrainingStatus(enum.Enum):
    in_progress = "In Progress"
    completed = "Completed"

class Training(Base):
    __tablename__ = "trainings"

    training_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    training_name = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(Enum(TrainingStatus, values_callable=lambda obj: [e.value for e in obj]), default=TrainingStatus.completed)
    institution = Column(String)
    degree = Column(String)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True)