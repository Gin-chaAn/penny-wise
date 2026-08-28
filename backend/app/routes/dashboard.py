"""Dashboard endpoint — the financial overview (Feature 4 & 5)."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schemas
from app.database import get_db
from app.services.calculations import build_dashboard

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=schemas.DashboardOut)
def get_dashboard(month: str = None, db: Session = Depends(get_db)):
    return build_dashboard(db, month)
