from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Date, func, Enum
import enum

class RequestStatus (enum.Enum):
    pending = "pending"
    accepted = "accepted"
    cancelled = "cancelled"

class Request(Base):
    __tablename__ = "requests"

    request_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    cv_id = Column(Integer, ForeignKey("cv_items.cv_id"), index=True, nullable=False)
    sender_id = Column(Integer, ForeignKey("employees.emp_id"), index=True, nullable=False)
    request_date = Column(Date, default=func.current_date(), nullable=False)
    message = Column(String(255))
    status = Column(Enum(RequestStatus, values_callable=lambda obj: [e.value for e in obj]), default=RequestStatus.pending)