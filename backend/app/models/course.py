from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    course_name = Column(String)
    description = Column(String)
