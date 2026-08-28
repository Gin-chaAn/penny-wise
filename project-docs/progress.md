# Penny Wise — progress.md

Actual development history. One entry per milestone.

## Milestone 1 — Foundation + Income + Fixed Expenses
- Git repo initialized, `.gitignore` added.
- Backend scaffolded: FastAPI app, SQLAlchemy models, database
  session, income routes, fixed-expense CRUD routes.
- Frontend scaffolded: Vite + React + Tailwind, Penny Wise design
  tokens, layout (Header/PageContainer), Dashboard page with
  IncomeCard, FixedExpenses page with full CRUD UI.
- Commit: `feat: initialize Penny Wise and add fixed expenses`

## Milestone 2 — Random Expenses
- Random expense model, schema (with category + date validation),
  and CRUD routes.
- RandomExpenseForm, RandomExpenseList, RandomExpenses page.
- Commit: `feat: add random expense tracking`

## Milestone 3 — Financial Overview
- `calculations.py` service: income/fixed/random totals, total
  expenses, remaining money.
- Dashboard route (`/api/dashboard`) and `SummaryCards` component.
- Commit: `feat: build financial overview dashboard`

## Milestone 4 — Spending Limit + UI Polish
- Settings model/route for `monthly_limit`.
- Spending-limit thresholds (normal/caution/warning/exceeded) and
  `ProgressBar`, `SpendingLimitCard`, `SpendingLimitModal`.
- Category breakdown (`CategoryBreakdown` pie chart), recent
  activity list, empty states, form validation, error alerts.
- Commit: `feat: add spending limit and polish interface`

## Milestone 5 — Testing + Documentation
- Backend unit tests (`test_calculations.py`) and integration tests
  (`test_api.py`) covering CRUD, validation, and dashboard math,
  including zero-income and zero-limit edge cases.
- `project-docs/` (this file and its siblings) and root `README.md`
  written.
- Commit: `docs: finalize README and prepare project release`
