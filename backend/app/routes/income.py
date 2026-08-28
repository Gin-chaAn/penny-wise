"""Income endpoints — set, view, and edit monthly income (Feature 1)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.services.calculations import get_month_key

router = APIRouter(prefix="/api/income", tags=["income"])


@router.get("", response_model=schemas.IncomeOut)
def get_income(month: str = None, db: Session = Depends(get_db)):
    month = month or get_month_key()
    income = db.query(models.Income).filter(models.Income.month == month).first()
    if not income:
        # No income set yet for this month — return a zeroed placeholder
        # rather than a 404, since "no income" is a valid, expected state.
        income = models.Income(amount=0, month=month)
        db.add(income)
        db.commit()
        db.refresh(income)
    return income


@router.post("", response_model=schemas.IncomeOut)
def set_income(payload: schemas.IncomeCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Income).filter(models.Income.month == payload.month).first()
    if existing:
        existing.amount = payload.amount
        db.commit()
        db.refresh(existing)
        return existing

    income = models.Income(amount=payload.amount, month=payload.month)
    db.add(income)
    db.commit()
    db.refresh(income)
    return income


@router.put("", response_model=schemas.IncomeOut)
def update_income(payload: schemas.IncomeUpdate, month: str = None, db: Session = Depends(get_db)):
    month = month or get_month_key()
    income = db.query(models.Income).filter(models.Income.month == month).first()
    if not income:
        raise HTTPException(status_code=404, detail="No income record for this month")
    income.amount = payload.amount
    db.commit()
    db.refresh(income)
    return income
