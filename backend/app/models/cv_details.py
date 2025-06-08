from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class CvDetails(Base):
    __tablename__ = "cv_details"

    id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    cv_id = Column(Integer, ForeignKey("cv_items.cv_id"), index=True, nullable=False)
    summary = Column(String)
