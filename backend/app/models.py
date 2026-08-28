"""
SQLAlchemy models for Penny Wise.

Kept intentionally minimal — four tables, no unnecessary relations,
matching the "focused mini project" scope of the spec.
"""
from datetime import datetime, date

from sqlalchemy import Column, Integer, Float, String, Date, DateTime
from sqlalchemy.sql import func

from app.database import Base

VALID_FREQUENCIES = ["monthly", "weekly", "yearly"]

VALID_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
    "Education",
    "Other",
]


class Income(Base):
    """
    Monthly income. One row per month (identified by 'month', e.g. '2026-08').
    """
    __tablename__ = "income"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False, default=0)
    month = Column(String, nullable=False, unique=True, index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())


class FixedExpense(Base):
    """Predictable, recurring monthly commitments."""
    __tablename__ = "fixed_expenses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False, default="Other")
    frequency = Column(String, nullable=False, default="monthly")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RandomExpense(Base):
    """One-time or spontaneous spending during the month."""
    __tablename__ = "random_expenses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False, default="Other")
    date = Column(Date, nullable=False, default=date.today)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Settings(Base):
    """Single-row table holding the monthly spending limit."""
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    monthly_limit = Column(Float, nullable=False, default=0)
