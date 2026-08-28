# Penny Wise

A small, polished personal expense manager that answers one
question: **how much of my income is already committed, how much
have I spent randomly, and how much do I actually have left?**

Design direction: *Gothic architecture meets a futuristic financial
terminal* — dark, elegant, precise, built from a single crimson-and-
ivory-on-black palette.

## Features

1. **Income management** — set, view, and edit monthly income.
2. **Fixed expenses** — add, view, edit, delete recurring commitments
   (name, amount, category, frequency) with a running total.
3. **Random expenses** — add, view, edit, delete one-off spending
   (description, amount, category, date) with a running total.
4. **Monthly overview** — income, fixed total, random total, total
   expenses, and remaining money, calculated live from stored data.
5. **Spending limit + category breakdown** — set a monthly limit, see
   usage as a progress bar with caution/warning/exceeded states, and
   see random spending grouped by category.

Explicitly out of scope (by design): authentication, multiple users,
bank/payment integrations, crypto, AI advice, notifications, a mobile
app, and cloud infrastructure. This is a focused mini project.

## Visual design

Every color in the app comes from one palette — no default blues,
greens, or generic dashboard status colors:

| Token | Hex | Use |
|---|---|---|
| Void Black | `#080606` | Page background |
| Abyss Black | `#110C0D` | Nav / secondary surfaces |
| Charcoal | `#1A1516` | Card background |
| Dark Wine | `#241114` | Elevated surfaces, borders |
| Deep Crimson | `#4A0F18` | Primary buttons, borders |
| Penny Crimson | `#7A1626` | Primary accent, active states |
| Blood Red | `#A51D2D` | Critical alerts, exceeded limit |
| Muted Rose | `#B85C68` | Warning tones |
| Aged Ivory | `#E8D8C8` | Primary text, financial values |
| Ash | `#B4AAA5` | Secondary text |
| Smoke | `#766D6A` | Muted / placeholder text |

Typography pairs a Gothic display face (Cinzel, for the wordmark and
page titles) with a geometric sans (Inter) for every number, form,
and table — so financial data always stays highly readable.

## Tech stack

- **Backend:** FastAPI, SQLAlchemy, SQLite, Pydantic
- **Frontend:** React (Vite), Tailwind CSS, React Router, Recharts

## Architecture

```
USER
  ├── Sets monthly income
  ├── Adds fixed expenses
  ├── Adds random expenses
  ↓
PENNY WISE DASHBOARD
  ├── Calculates total expenses
  ├── Calculates remaining money
  ├── Compares spending against limit
  └── Shows category breakdown
```

```
FastAPI → API Routes → Business Logic (services/calculations.py) → SQLAlchemy → SQLite
```

```
backend/
├── app/
│   ├── main.py            FastAPI app, CORS, global error handler
│   ├── database.py        Engine + session
│   ├── models.py          Income, FixedExpense, RandomExpense, Settings
│   ├── schemas.py         Pydantic request/response models + validation
│   ├── routes/            income, fixed_expenses, random_expenses, dashboard, settings
│   └── services/
│       └── calculations.py   All financial math, isolated & tested
└── tests/                 pytest unit + integration tests

frontend/
├── src/
│   ├── components/
│   │   ├── ui/            Card, Button, Input, ProgressBar, Modal, Alert, EmptyState
│   │   ├── dashboard/      SummaryCards, SpendingLimitCard, CategoryBreakdown, ...
│   │   ├── expenses/       Forms + lists for fixed & random expenses
│   │   └── layout/         Header, PageContainer
│   ├── pages/              Dashboard, FixedExpenses, RandomExpenses
│   └── services/api.js     Fetch wrapper for the API
```

## Database structure

| Table | Columns |
|---|---|
| `income` | id, amount, month, updated_at |
| `fixed_expenses` | id, name, amount, category, frequency, created_at |
| `random_expenses` | id, description, amount, category, date, created_at |
| `settings` | id, monthly_limit |

## Financial calculation rules

```
Total Fixed Expenses   = SUM(all fixed expenses)
Total Random Expenses  = SUM(random expenses for the selected month)
Total Expenses          = fixed_total + random_total
Remaining Money         = monthly_income - total_expenses
Spending Limit Usage    = (total_expenses / monthly_limit) × 100   [0 if limit is 0]
```

Spending limit thresholds: 0–74% normal · 75–89% caution · 90–99%
warning · 100%+ exceeded.

## Installation

Requires Python 3.11+ and Node 18+.

```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

## How to run

```bash
# Terminal 1 — backend (from backend/, venv active)
uvicorn app.main:app --reload --port 8000

# Terminal 2 — frontend (from frontend/)
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` to
`http://localhost:8000`. The API alone is browsable at
`http://localhost:8000/docs` (FastAPI's auto-generated Swagger UI).

## Running tests

```bash
cd backend
pytest
```

## Screenshots

_Add screenshots here after running the app locally — the dashboard,
the fixed/random expense screens, and the exceeded-limit state are
good ones to capture._

## Development history

See `project-docs/progress.md` for the full milestone-by-milestone
build log, and `project-docs/context.md` for the current technical
state. `project-docs/plan.md` and `workflow.md` capture the original
spec and the working rules the project was built against.

## Future improvements

Out-of-scope items that could extend the project later: authentication
and multi-user support, recurring-expense auto-generation, CSV export,
multi-month history/trends, and a proper CI pipeline.
