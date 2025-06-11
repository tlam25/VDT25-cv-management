from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db
from typing import List, Optional
from datetime import date
from app.models.training import Training, TrainingStatus

router = APIRouter(prefix="/trainings", tags=["trainings"])

class TrainingCreate(BaseModel):
    training_name: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[TrainingStatus] = None
    institution: Optional[str] = None
    degree: Optional[str] = None
    emp_id: Optional[int] = None

class TrainingSchemas(TrainingCreate):
    training_id: int


@router.get("/", response_model=List[TrainingSchemas])
async def get_trainings(emp_id: int, db: Session = Depends(get_db)):
    trainings = db.query(Training).filter(Training.emp_id == emp_id).all()
    return trainings

@router.post("/", response_model=TrainingSchemas)
async def create_training(training: TrainingCreate, db: Session = Depends(get_db)):
    new_training = Training(
        training_name=training.training_name,
        start_date=training.start_date,
        end_date=training.end_date,
        status=training.status,
        institution=training.institution,
        degree=training.degree,
        emp_id=training.emp_id
    )

    db.add(new_training)
    db.commit()
    db.refresh(new_training)
    return new_training

@router.patch("/{training_id}", response_model=TrainingSchemas)
async def update_training(training_id: int, training: TrainingCreate, db: Session = Depends(get_db)):
    db_training = db.query(Training).filter(Training.training_id == training_id).first()
    if not db_training:
        raise HTTPException(status_code=404, detail="Training not found")

    for field, value in training.dict(exclude_unset=True).items():
        setattr(db_training, field, value)

    db.commit()
    db.refresh(db_training)
    return db_training

@router.delete("/{training_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_training(training_id: int, db: Session = Depends(get_db)):
    training = db.query(Training).filter(Training.training_id == training_id).first()
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    db.delete(training)
    db.commit()
    return {"detail": "Training deleted successfully"}