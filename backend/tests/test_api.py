"""
Integration tests for the API, using FastAPI's TestClient with an
isolated in-memory SQLite database (so tests never touch pennywise.db).
Run with: pytest (from the backend/ directory)
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


def test_health_check():
    resp = client.get("/api/health")
    assert resp.status_code == 200


def test_set_and_get_income():
    resp = client.post("/api/income", json={"amount": 50000, "month": "2026-08"})
    assert resp.status_code == 200
    assert resp.json()["amount"] == 50000

    resp = client.get("/api/income", params={"month": "2026-08"})
    assert resp.json()["amount"] == 50000


def test_income_rejects_negative_amount():
    resp = client.post("/api/income", json={"amount": -100, "month": "2026-08"})
    assert resp.status_code == 422


def test_fixed_expense_crud():
    create = client.post("/api/fixed-expenses", json={
        "name": "Rent", "amount": 15000, "category": "Bills", "frequency": "monthly"
    })
    assert create.status_code == 201
    expense_id = create.json()["id"]

    listed = client.get("/api/fixed-expenses")
    assert len(listed.json()) == 1

    updated = client.put(f"/api/fixed-expenses/{expense_id}", json={
        "name": "Rent", "amount": 16000, "category": "Bills", "frequency": "monthly"
    })
    assert updated.json()["amount"] == 16000

    deleted = client.delete(f"/api/fixed-expenses/{expense_id}")
    assert deleted.status_code == 204
    assert client.get("/api/fixed-expenses").json() == []


def test_random_expense_crud():
    create = client.post("/api/random-expenses", json={
        "description": "Coffee", "amount": 250, "category": "Food", "date": "2026-08-15"
    })
    assert create.status_code == 201
    expense_id = create.json()["id"]

    deleted = client.delete(f"/api/random-expenses/{expense_id}")
    assert deleted.status_code == 204


def test_dashboard_handles_zero_income_and_zero_limit():
    resp = client.get("/api/dashboard", params={"month": "2026-08"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["remaining_money"] == 0
    assert data["limit_used_percentage"] == 0  # no division-by-zero crash


def test_dashboard_math():
    client.post("/api/income", json={"amount": 50000, "month": "2026-08"})
    client.post("/api/fixed-expenses", json={
        "name": "Rent", "amount": 15000, "category": "Bills", "frequency": "monthly"
    })
    client.post("/api/random-expenses", json={
        "description": "Coffee", "amount": 500, "category": "Food", "date": "2026-08-15"
    })
    client.put("/api/settings", json={"monthly_limit": 20000})

    resp = client.get("/api/dashboard", params={"month": "2026-08"})
    data = resp.json()
    assert data["fixed_total"] == 15000
    assert data["random_total"] == 500
    assert data["total_expenses"] == 15500
    assert data["remaining_money"] == 34500
    assert data["limit_used_percentage"] == 77.5
    assert data["limit_status"] == "caution"
