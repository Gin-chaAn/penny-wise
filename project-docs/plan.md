# Penny Wise — plan.md

This file is the long-term memory of *what the project is and how it
should work*. It mirrors the original specification the project was
built from.

## Concept
Penny Wise is a personal expense manager built around one question:
how much income is already committed, how much was spent randomly,
and how much is left? Expenses are split into **Fixed** (recurring
commitments) and **Random** (spontaneous spending).

## The five features
1. Income management (set/view/edit monthly income)
2. Fixed expense management (CRUD + total)
3. Random expense management (CRUD + total)
4. Monthly financial overview (income, fixed, random, total, remaining)
5. Spending limit + category breakdown (usage %, warnings, exceeded state)

## Explicitly out of scope
Auth, multi-user, bank/payment integrations, crypto, AI advisor, ML,
notifications, email alerts, mobile app, cloud infra, forecasting.
Keep this a focused mini project.

## Design direction
"Gothic architecture meets a futuristic financial terminal." Dark,
elegant, precise. One palette (see `frontend/tailwind.config.js` and
`frontend/src/index.css`) drives every color decision — no default
Tailwind blues/greens, no generic SaaS status colors.

## Stack
- Backend: FastAPI + SQLAlchemy + SQLite
- Frontend: React + Vite + Tailwind CSS + Recharts
- No authentication, single implicit user, local-first
