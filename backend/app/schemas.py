"""
Pydantic schemas — request/response validation for the API.

Amounts must be numeric and > 0 (per spec section 30); required fields
cannot be empty. Backend validation exists even though the frontend
also validates, because it's the last line of defense against bad data.
"""
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.models import VALID_CATEGORIES, VALID_FREQUENCIES


class AmountValidatedModel(BaseModel):
    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v):
        if v is None:
            raise ValueError("Amount is required")
        if v <= 0:
            raise ValueError("Amount must be greater than zero")
        return round(float(v), 2)


# ---------- Income ----------

class IncomeBase(AmountValidatedModel):
    amount: float
    month: str = Field(..., min_length=7, max_length=7, description="Format: YYYY-MM")


class IncomeCreate(IncomeBase):
    pass


class IncomeUpdate(AmountValidatedModel):
    amount: float


class IncomeOut(IncomeBase):
    id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Fixed Expenses ----------

class FixedExpenseBase(AmountValidatedModel):
    name: str = Field(..., min_length=1, max_length=120)
    amount: float
    category: str = "Other"
    frequency: str = "monthly"

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        if v not in VALID_CATEGORIES:
            raise ValueError(f"Category must be one of {VALID_CATEGORIES}")
        return v

    @field_validator("frequency")
    @classmethod
    def validate_frequency(cls, v):
        if v not in VALID_FREQUENCIES:
            raise ValueError(f"Frequency must be one of {VALID_FREQUENCIES}")
        return v


class FixedExpenseCreate(FixedExpenseBase):
    pass


class FixedExpenseUpdate(FixedExpenseBase):
    pass


class FixedExpenseOut(FixedExpenseBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Random Expenses ----------

class RandomExpenseBase(AmountValidatedModel):
    description: str = Field(..., min_length=1, max_length=200)
    amount: float
    category: str = "Other"
    date: date

    @field_validator("category")
    @classmethod
    def validate_category(cls, v):
        if v not in VALID_CATEGORIES:
            raise ValueError(f"Category must be one of {VALID_CATEGORIES}")
        return v


class RandomExpenseCreate(RandomExpenseBase):
    pass


class RandomExpenseUpdate(RandomExpenseBase):
    pass


class RandomExpenseOut(RandomExpenseBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Settings / Spending Limit ----------

class SettingsUpdate(BaseModel):
    monthly_limit: float = Field(..., ge=0)


class SettingsOut(BaseModel):
    id: int
    monthly_limit: float

    class Config:
        from_attributes = True


# ---------- Dashboard ----------

class CategoryBreakdownItem(BaseModel):
    category: str
    total: float
    percentage: float


class DashboardOut(BaseModel):
    month: str
    income: float
    fixed_total: float
    random_total: float
    total_expenses: float
    remaining_money: float
    monthly_limit: float
    limit_used_percentage: float
    limit_status: str  # normal | caution | warning | exceeded
    category_breakdown: list[CategoryBreakdownItem]
