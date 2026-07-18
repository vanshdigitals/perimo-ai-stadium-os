# PERIMO AI Stadium OS

PERIMO is an AI-powered smart stadium operating system for fans, volunteers, staff, and administrators. It combines public fan experiences, operational tooling, live intelligence, and authentication flows in one React + FastAPI codebase.

## Project Overview

This repository contains the production frontend, the FastAPI backend, shared documentation, and deployment configuration for the PERIMO prompt challenge submission.

## Challenge Vertical

Smart stadiums and tournament operations.

## Architecture

- `frontend/` contains the Vite + React 19 application.
- `backend/` contains the FastAPI backend and tests.
- `docs/` contains product and implementation documentation.
- `shared/` contains shared assets and utilities used across the repo.

## Features

- Landing experience with role selection for fan, volunteer, staff, and admin entry points.
- Fan experience with personalized navigation and live stadium information.
- Volunteer workspace for task and shift coordination.
- Staff operations dashboard for stadium control workflows.
- Admin command center with MFA-protected access.
- FastAPI backend with authentication, rate limiting, security headers, and health checks.

## AI Features

- Gemini-backed AI assistant paths where configured.
- Offline-safe fallback behavior when AI keys are not present.
- Live operations and recommendation surfaces designed for stadium decision support.

## Technology Stack

- Frontend: React 19, Vite, TypeScript, React Router, Tailwind CSS v4, Framer Motion
- Backend: FastAPI, Pydantic v2, Python
- Tooling: oxlint, pytest, Vercel

## Installation

### Frontend

```bash
cd PERIMO/frontend
npm install
```

### Backend

```bash
cd PERIMO/backend
python -m pip install -r requirements.txt
```

## Environment Variables

Do not commit real secrets. Use environment variables in your hosting platform or local `.env` files.

### Frontend

```env
VITE_API_BASE_URL=https://your-backend.example.com
VITE_WSS_ENDPOINT=wss://your-backend.example.com/live
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_BACKUP_GEMINI_API_KEY=your_backup_gemini_key
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_DEMO_MODE=true
```

### Backend

```env
JWT_SECRET=replace_with_a_strong_secret
GEMINI_API_KEY=optional
BACKUP_GEMINI_API_KEY=optional
FIRESTORE_PROJECT_ID=optional
FIRESTORE_EMULATOR_HOST=optional
ALLOWED_ORIGINS=https://your-frontend.example.com
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=replace_me
SEED_ADMIN_NAME=Operations Admin
```

## Running Frontend

```bash
cd PERIMO/frontend
npm run dev
```

## Running Backend

```bash
cd PERIMO/backend
python -m uvicorn src.main:app --reload --port 8099
```

## Testing

```bash
cd PERIMO/frontend
npm run build
npm run lint
```

```bash
cd PERIMO/backend
python -m pytest -q
```

## Deployment

- Frontend: deploy the `frontend/` directory on Vercel.
- Backend: deploy FastAPI to your production Python host and set the frontend base URL and websocket URL to the live backend.
- Make sure CORS, health checks, JWT secrets, and AI keys are configured before release.

## Folder Structure

```text
PERIMO/
├── backend/
├── docs/
├── frontend/
├── infra/
├── scripts/
└── shared/
```

## Screenshots

Add production screenshots here after final release for Landing, Role Selection, Fan, Volunteer, Staff, and Admin.

## Future Scope

- Production backend URL wiring for live WebSocket feeds.
- Expanded observability and incident reporting.
- Further performance tuning for large-screen command center views.

## License

See [LICENSE](LICENSE).

## Author

PERIMO / PromptWars Challenge 4 submission.

## GitHub

Repository: https://github.com/vanshdigitals/perimo-ai-stadium-os
