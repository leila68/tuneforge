# Tuneforge

A full-stack platform for fine-tuning open-source LLMs with LoRA and QLoRA, evaluating the results against the base model, and deploying the fine-tuned model behind a chat interface.

Upload a dataset -> fine-tune -> evaluate -> deploy -> chat with the result.

## Why this exists

Generic LLMs don't know a company's tone, policies, or domain-specific patterns. Tuneforge takes a dataset of real examples and produces a small, fine-tuned adapter (via LoRA/QLoRA) that captures that behavior, without needing a full retrain or a massive GPU budget.

## Architecture

Training and serving are deliberately split, because they need very different infrastructure:

- **Training** runs as a batch job on the Digital Research Alliance of Canada (DRAC), an academic HPC cluster, submitted via Slurm. Compute nodes here are offline and job-scheduled -- perfect for training, wrong shape for a live API.
- **Serving** runs as a persistent, internet-facing FastAPI service on Hugging Face Spaces, which loads the fine-tuned adapter and answers requests in real time.
- **Core API** (auth, project/dataset management, job orchestration) runs on Render.
- **Frontend** is a React/TypeScript app deployed on Vercel.
- **Database** is Postgres, hosted on Supabase (used purely as hosted Postgres -- auth is custom-built, not outsourced to a BaaS).

See [`docs/architecture.md`](docs/architecture.md) for the full breakdown and diagram.

## Tech stack

| Layer | Tool |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Core API | FastAPI (Python) |
| Auth | Custom JWT (passlib, python-jose) |
| Database | PostgreSQL (Supabase-hosted) |
| Fine-tuning engine | Axolotl / Unsloth (LoRA, QLoRA) |
| Training compute | DRAC (Slurm batch jobs) |
| Experiment tracking | Weights & Biases |
| Inference serving | FastAPI on Hugging Face Spaces |
| Dataset/model storage | Hugging Face Hub |
| CI/CD | GitHub Actions, Docker |

## Repo layout

```
tuneforge/
├── frontend/            React app (deployed to Vercel)
├── backend/              Core API (deployed to Render)
├── inference-service/    Model-serving API (deployed to Hugging Face Spaces)
├── training/              Axolotl configs, Slurm job scripts, reference training code
├── docs/                  Architecture, setup, and deployment docs
└── .github/workflows/     CI pipelines
```

## Getting started

See [`docs/setup.md`](docs/setup.md) for local development setup, and [`docs/deployment.md`](docs/deployment.md) for how each service gets deployed.

## Status

Actively in development. See [Issues](../../issues) for current progress.
