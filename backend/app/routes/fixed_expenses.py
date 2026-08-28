"""Fixed expense CRUD endpoints (Feature 2)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/fixed-expenses", tags=["fixed-expenses"])


@router.get("", response_model=list[schemas.FixedExpenseOut])
def list_fixed_expenses(db: Session = Depends(get_db)):
    return db.query(models.FixedExpense).order_by(models.FixedExpense.created_at.desc()).all()


@router.post("", response_model=schemas.FixedExpenseOut, status_code=201)
def create_fixed_expense(payload: schemas.FixedExpenseCreate, db: Session = Depends(get_db)):
    expense = models.FixedExpense(**payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/{expense_id}", response_model=schemas.FixedExpenseOut)
def update_fixed_expense(expense_id: int, payload: schemas.FixedExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(models.FixedExpense).filter(models.FixedExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    for field, value in payload.model_dump().items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=204)
def delete_fixed_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.FixedExpense).filter(models.FixedExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Fixed expense not found")
    db.delete(expense)
    db.commit()
    return None
