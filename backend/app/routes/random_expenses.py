"""Random expense CRUD endpoints (Feature 3)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/random-expenses", tags=["random-expenses"])


@router.get("", response_model=list[schemas.RandomExpenseOut])
def list_random_expenses(month: str = None, db: Session = Depends(get_db)):
    query = db.query(models.RandomExpense)
    if month:
        year, mon = month.split("-")
        query = query.filter(
            models.RandomExpense.date >= f"{year}-{mon}-01",
            models.RandomExpense.date < f"{year}-{int(mon) + 1:02d}-01"
            if int(mon) < 12 else f"{int(year) + 1}-01-01",
        )
    return query.order_by(models.RandomExpense.date.desc()).all()


@router.post("", response_model=schemas.RandomExpenseOut, status_code=201)
def create_random_expense(payload: schemas.RandomExpenseCreate, db: Session = Depends(get_db)):
    expense = models.RandomExpense(**payload.model_dump())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.put("/{expense_id}", response_model=schemas.RandomExpenseOut)
def update_random_expense(expense_id: int, payload: schemas.RandomExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(models.RandomExpense).filter(models.RandomExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Random expense not found")
    for field, value in payload.model_dump().items():
        setattr(expense, field, value)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=204)
def delete_random_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.RandomExpense).filter(models.RandomExpense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Random expense not found")
    db.delete(expense)
    db.commit()
    return None
