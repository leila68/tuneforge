# Architecture

Tuneforge deliberately separates training (batch, offline) from serving (persistent, internet-facing), because they need different infrastructure.

## Components

- **Frontend** (`/frontend`) -- React + TypeScript, deployed on Vercel. Talks to the core API and the inference service.
- **Core API** (`/backend`) -- FastAPI, deployed on Render. Handles auth, project/dataset management, and submits/monitors training jobs on DRAC.
- **Training** (`/training`) -- Axolotl/Unsloth configs and Slurm job scripts, run on DRAC (Digital Research Alliance of Canada) compute nodes. These nodes are batch-scheduled and often have no outbound internet access, so this only ever runs as a submitted job, never as a live service.
- **Inference service** (`/inference-service`) -- a separate FastAPI app, deployed as a Hugging Face Space (Docker). Loads the fine-tuned adapter and serves generation requests.
- **Database** -- PostgreSQL, hosted on Supabase (used purely as hosted Postgres, not their Auth/Storage SDK).
- **Dataset/model storage** -- Hugging Face Hub (dataset repos + model/adapter repos).

## Request flow (training)

1. User configures hyperparameters in the frontend and submits.
2. Core API generates an Axolotl config and SSHes into the DRAC login node to run `sbatch`.
3. The Slurm job trains the model on a DRAC GPU node, offline, and writes checkpoints + logs.
4. Core API polls job status and surfaces logs/loss curves in the frontend.
5. On completion, the resulting LoRA adapter is pushed to a Hugging Face model repo.

## Request flow (inference)

1. User sends a prompt through the chat interface.
2. Frontend calls the inference service directly (not through the core API).
3. Inference service (already has the base model + adapter loaded in memory) tokenizes, generates, decodes, and returns the response.

## Why the split matters

DRAC is free, powerful, and purpose-built for batch compute -- but it cannot host a persistent API. Hugging Face Spaces and Render can host persistent services but aren't built for large-scale batch training on a schedule. Using each for what it's actually built for is the core architectural decision of this project.
