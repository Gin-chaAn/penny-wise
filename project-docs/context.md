# Penny Wise — context.md

Current technical state, updated as of initial build.

## Status
All five core features are implemented end to end (backend routes +
frontend pages). The project has not yet been run in a live
environment with dependencies installed — this container had no
network access, so `pip install` / `npm install` could not be
executed here. All Python files pass `py_compile`; JS/JSX files were
written and reviewed manually (no bundler available offline to
verify).

## Backend
- FastAPI app in `backend/app/main.py`, CORS enabled for the Vite
  dev server (localhost:5173).
- SQLite file `pennywise.db`, created automatically on first run via
  `Base.metadata.create_all`.
- Four tables: `income`, `fixed_expenses`, `random_expenses`,
  `settings` (single row, holds `monthly_limit`).
- All calculation logic lives in `app/services/calculations.py`,
  kept separate from routes and covered by `tests/test_calculations.py`.
- Division-by-zero protected in `limit_used_percentage`.
- Global exception handler returns a generic message, never a stack
  trace, for unhandled errors.

## Frontend
- Vite + React + Tailwind. Design tokens centralized in
  `tailwind.config.js` (`theme.extend.colors`) and mirrored as CSS
  variables in `src/index.css`.
- Three routes: `/` (Dashboard), `/fixed`, `/random`, via
  `react-router-dom`.
- No global state library — plain `useState`/`useEffect` per page,
  talking to `src/services/api.js`.
- Category chart uses Recharts `PieChart` with palette-only colors.

## Known gaps / next steps
- Dependencies have never actually been installed or run — do that
  first (`pip install -r backend/requirements.txt`,
  `npm install` in `frontend/`) and fix anything that surfaces.
- No CI configured.
- Screenshots for the README have not been captured (needs a live run).
