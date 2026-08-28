"""
Core financial calculation rules (spec section 29).

Kept as pure functions, separate from routes, so they're easy to
reason about and unit test in isolation.
"""
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import extract

from app import models


def get_month_key(dt: datetime = None) -> str:
    """Returns the current month as 'YYYY-MM'."""
    dt = dt or datetime.utcnow()
    return dt.strftime("%Y-%m")


def get_income_for_month(db: Session, month: str) -> float:
    row = db.query(models.Income).filter(models.Income.month == month).first()
    return row.amount if row else 0.0


def get_fixed_total(db: Session) -> float:
    """Fixed expenses are ongoing commitments, so all active rows count."""
    total = db.query(models.FixedExpense).all()
    return round(sum(e.amount for e in total), 2)


def get_random_total(db: Session, month: str) -> float:
    """Random expenses are summed only for the selected month."""
    year, mon = month.split("-")
    rows = (
        db.query(models.RandomExpense)
        .filter(extract("year", models.RandomExpense.date) == int(year))
        .filter(extract("month", models.RandomExpense.date) == int(mon))
        .all()
    )
    return round(sum(e.amount for e in rows), 2)


def get_settings(db: Session) -> models.Settings:
    """Settings is a single-row table; create it with defaults if missing."""
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings(monthly_limit=0)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def get_category_breakdown(db: Session, month: str) -> list[dict]:
    year, mon = month.split("-")
    rows = (
        db.query(models.RandomExpense)
        .filter(extract("year", models.RandomExpense.date) == int(year))
        .filter(extract("month", models.RandomExpense.date) == int(mon))
        .all()
    )
    totals: dict[str, float] = {}
    for r in rows:
        totals[r.category] = totals.get(r.category, 0) + r.amount

    grand_total = sum(totals.values())
    breakdown = []
    for category, total in sorted(totals.items(), key=lambda kv: kv[1], reverse=True):
        percentage = (total / grand_total * 100) if grand_total > 0 else 0
        breakdown.append({
            "category": category,
            "total": round(total, 2),
            "percentage": round(percentage, 1),
        })
    return breakdown


def get_limit_status(percentage: float) -> str:
    """Thresholds per spec section 20."""
    if percentage >= 100:
        return "exceeded"
    if percentage >= 90:
        return "warning"
    if percentage >= 75:
        return "caution"
    return "normal"


def build_dashboard(db: Session, month: str = None) -> dict:
    month = month or get_month_key()

    income = get_income_for_month(db, month)
    fixed_total = get_fixed_total(db)
    random_total = get_random_total(db, month)
    total_expenses = round(fixed_total + random_total, 2)
    remaining_money = round(income - total_expenses, 2)

    settings = get_settings(db)
    monthly_limit = settings.monthly_limit

    # Protect against division by zero (spec section 29 & 20).
    limit_used_percentage = (
        round((total_expenses / monthly_limit) * 100, 1) if monthly_limit > 0 else 0.0
    )

    return {
        "month": month,
        "income": income,
        "fixed_total": fixed_total,
        "random_total": random_total,
        "total_expenses": total_expenses,
        "remaining_money": remaining_money,
        "monthly_limit": monthly_limit,
        "limit_used_percentage": limit_used_percentage,
        "limit_status": get_limit_status(limit_used_percentage),
        "category_breakdown": get_category_breakdown(db, month),
    }
