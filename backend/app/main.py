"""
Penny Wise — FastAPI entrypoint.

A small, focused backend: five feature areas, one SQLite database,
no authentication, no unnecessary infrastructure. See
project-docs/plan.md for the full product spec.
"""
import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import Base, engine
from app.routes import income, fixed_expenses, random_expenses, dashboard, settings

# Create tables on startup if they don't already exist.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Penny Wise API",
    description="Personal expense management: fixed vs. random spending, one dashboard.",
    version="1.0.0",
)

# Local dev only — the Vite dev server runs on 5173 by default.
frontend_urls = os.getenv(
    "FRONTEND_URLS",
    "http://localhost:5173,http://127.0.0.1:5173",
)

allowed_origins = [
    origin.strip().rstrip("/")
    for origin in frontend_urls.split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Never leak stack traces to the client (spec section 31 & 40)."""
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Please try again."},
    )


app.include_router(income.router)
app.include_router(fixed_expenses.router)
app.include_router(random_expenses.router)
app.include_router(dashboard.router)
app.include_router(settings.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "penny-wise-api"}
