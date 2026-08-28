# Penny Wise — workflow.md

How an AI agent (or a human) should operate on this repo.

## Before coding
1. Read `plan.md`, `workflow.md`, `context.md`, `progress.md`.
2. Inspect the repo and run `git log --oneline` to see real history.
3. Identify the current milestone from `progress.md`.

## While coding
1. Work on one milestone at a time.
2. Inspect existing code before changing it — reuse components,
   avoid unnecessary rewrites, avoid new dependencies unless needed.
3. Preserve the design system: semantic color tokens only, no
   one-off hex codes in components.
4. Keep the backend and frontend structure as laid out below.

## After coding
1. Run the app end to end (or run tests) and check for regressions.
2. Update `context.md` with the current technical state.
3. Append an entry to `progress.md`.
4. Report exactly which files changed and how it was verified.
5. Do not commit unless explicitly instructed to.

## Repo layout
```
backend/app/{main,database,models,schemas}.py
backend/app/routes/{income,fixed_expenses,random_expenses,dashboard,settings}.py
backend/app/services/calculations.py
frontend/src/components/{ui,dashboard,expenses,layout}/
frontend/src/pages/{Dashboard,FixedExpenses,RandomExpenses}.jsx
frontend/src/services/api.js
```
