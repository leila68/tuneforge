#!/bin/bash
#SBATCH --job-name=tuneforge-train
#SBATCH --account=def-yourpi          # TODO: your DRAC allocation/account
#SBATCH --gres=gpu:1
#SBATCH --cpus-per-task=4
#SBATCH --mem=32G
#SBATCH --time=03:00:00
#SBATCH --output=logs/%x-%j.out

# Submitted by the backend (services/drac_client.py) via `sbatch` on the
# DRAC login node. The compute node this runs on has no outbound internet
# access, so everything needed (base model, dataset) must already be
# cached locally before this job starts.

module load python/3.11 cuda/12.2

source ~/tuneforge-env/bin/activate

CONFIG_PATH=${1:-configs/lora_example.yml}

accelerate launch -m axolotl.cli.train "$CONFIG_PATH"
