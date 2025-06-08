from app.core.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class Account(Base):
    __tablename__ = "accounts"

    account_id = Column(Integer, primary_key=True, index=True, nullable=False, autoincrement=True)
    emp_id = Column(Integer, ForeignKey("employees.emp_id"), index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)