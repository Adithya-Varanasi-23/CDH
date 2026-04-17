# CDH

## Overview

This repository contains a full-stack climate-driven stock prediction app.

- `frontend/`: Next.js app for UI and data visualization
- `backend/`: FastAPI server for model inference and data endpoints

## Deployment

### Frontend
The frontend is configured for GitHub Pages deployment as a static export.

1. Set `NEXT_PUBLIC_API_URL` in `frontend/.env.example` or GitHub Pages build environment.
2. Configure GitHub Pages to build the `frontend` static output.

### Backend
The backend is configured to deploy from the repository root using Docker.

1. Add `ALPHA_VANTAGE_API_KEY` to `backend/.env.local` or environment variables.
2. Deploy the backend from the root using the provided `Dockerfile`.
3. Use the deployed backend URL in `NEXT_PUBLIC_API_URL` for the frontend.

## Local setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Notes

- The backend allows CORS from all origins so the frontend can access it from GitHub Pages.
- The GitHub Pages workflow is configured in `.github/workflows/deploy.yml`.
- `backend/requirements.txt` and `Dockerfile` make backend deployment easier.
