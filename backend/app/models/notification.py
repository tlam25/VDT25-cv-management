from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    request_id = Column(Integer, ForeignKey("requests.request_id"), index=True, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)