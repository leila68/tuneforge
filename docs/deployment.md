# Deployment

Each service deploys independently.

## Frontend -> Vercel

Connect the repo to Vercel, set the root directory to `frontend/`, set `VITE_API_BASE_URL` to the deployed backend URL. Vercel auto-deploys on push to `main`.

## Core API -> Render

Create a new Web Service on Render, root directory `backend/`, build with the included `Dockerfile`. Set environment variables from `.env.example`. Free tier sleeps after 15 minutes idle.

## Inference service -> Hugging Face Spaces

Create a new Space, SDK: Docker. Push the contents of `inference-service/` to the Space's git remote (Spaces are git repos). Set `BASE_MODEL_NAME` and `ADAPTER_REPO` as Space secrets.

## Database -> Supabase

Create a Supabase project, copy the Postgres connection string into `DATABASE_URL`. Used purely as hosted Postgres -- schema is managed by the backend, not Supabase's dashboard tools.

## Training -> DRAC

No "deployment" step -- training configs and Slurm scripts in `/training` are submitted as jobs by the backend via SSH, on demand, per training run.

## CI/CD

GitHub Actions (`.github/workflows/`) lint, test, and build a Docker image for each service on every push to its respective folder. Actual deploys currently happen via each platform's git integration (Vercel/Render auto-deploy on push, Spaces on push to its own remote) rather than pushed from GitHub Actions -- documented here as a known next step if full CD is added later.
