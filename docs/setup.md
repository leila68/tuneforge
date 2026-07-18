# Local setup

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker
- A Supabase project (for Postgres) -- or a local Postgres instance for development
- A DRAC account (for actually running training jobs -- not required to run the app locally)
- A Hugging Face account + access token

## Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET_KEY, HF_TOKEN, etc.
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

## Inference service (optional locally -- needs a GPU or patience on CPU)

```bash
cd inference-service
pip install -r requirements.txt
uvicorn app:app --reload --port 7860
```

## Everything together

```bash
docker-compose up --build
```

Runs the backend + a local Postgres instance together. The frontend and inference service still run separately during development (see above).
