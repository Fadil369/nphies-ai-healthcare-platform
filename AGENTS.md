# Repository Guidelines

## Project Structure & Module Organization
The FastAPI backend lives in `main.py`, exposing REST and WebSocket endpoints while serving assets from `static/`. Frontend assets are split between `static/js` for vanilla modules, `dashboard/` for the Next.js admin interface, and `mobile/` for the Expo client. Architecture, deployment, and compliance references sit in `docs/`, while automation scripts (for example `scripts/test-bottom-sheet.js`) and test plans (`comprehensive_test_suite/TEST_STRATEGY.md`) support delivery.

## Build, Test, and Development Commands
- `pip install -r requirements.txt` — install backend dependencies.
- `uvicorn main:app --reload` — launch the FastAPI server with hot reload; `python main.py` mirrors production config.
- `cd dashboard && npm install && npm run dev` — start the Next.js dashboard; `npm run build` prepares optimized assets.
- `cd mobile && npm install && npm run start` — boot the Expo bundler for the mobile client.
- `npm install jsdom && node scripts/test-bottom-sheet.js` — run the accessibility smoke test against `static/profile.html`.
- Export `JWT_SECRET` (and optionally `SERVICE_ACCOUNT_USERNAME` plus `SERVICE_ACCOUNT_PASSWORD` or `SERVICE_ACCOUNT_PASSWORD_HASH`) before launching the API so `/auth/token` can mint bearer tokens for the clients.

## Coding Style & Naming Conventions
Follow PEP 8 with four-space indentation, type hints, and docstrings for public FastAPI routes and services. Keep Python modules snake_case and group AWS helpers under focused modules (for example `aws-services.py`). In the web stack, author ES modules with camelCase utilities, PascalCase React components (`dashboard/pages`, `static/js` widgets), and BEM-oriented CSS class names. Run `npm run lint` inside `dashboard/` before pushing UI changes.

## Testing Guidelines
Add backend unit tests under `tests/` beside the service they cover; execute them with `python -m pytest` and target ≥80% coverage for new code. Mirror API scenarios from `comprehensive_test_suite/TEST_STRATEGY.md` when writing integration cases. For the Next.js dashboard, co-locate `*.spec.tsx` files with components or inside `dashboard/__tests__/` and run them via `npm test` (configure Jest/RTL if absent). Validate key accessibility paths with `node scripts/test-bottom-sheet.js` and record gaps in the PR description. Exercise `/auth/token`, `/chat`, and `/nphies/claim` in integration tests by acquiring bearer tokens and asserting rate-limit (`429`) behaviour via the in-memory limiter.

## Commit & Pull Request Guidelines
Use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`, `chore:`) and keep messages under 72 characters. Group work on topic branches such as `feature/<summary>` or `fix/<ticket-id>`. Pull requests should include a concise summary, linked work item, screenshots for UI updates, and evidence that tests and linters ran locally. Update relevant docs (README, `docs/`, or API specs) when behavior changes.

## Security & Configuration Tips
Load secrets through environment variables (`AWS_DEFAULT_REGION`, `HEALTHLAKE_DATASTORE_ID`, `ENVIRONMENT`) and avoid committing `.env*` files. Restrict CORS origins when extending `main.py`, log audit events through the existing handlers, and review cloud or infra manifests in `docs/deployment/` when proposing security-impacting changes. Configure JWT variables plus service account credentials before deploying; frontends store issued tokens in `localStorage`/`AsyncStorage` under `nphies_ai_access_token`, so remember to clear that key when implementing logout.
