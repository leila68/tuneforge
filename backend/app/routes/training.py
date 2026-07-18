from fastapi import APIRouter

router = APIRouter()


@router.post("/{project_id}/start")
def start_training(project_id: str):
    """
    Generate an Axolotl/Unsloth config from the submitted hyperparameters
    and submit it to DRAC as a Slurm batch job.

    TODO: call services/drac_client.py to SSH in and run `sbatch`
    """
    return {"project_id": project_id, "status": "not yet implemented"}


@router.get("/{project_id}/status")
def training_status(project_id: str):
    """Poll the Slurm job status and return current state + latest logs."""
    return {"project_id": project_id, "status": "unknown"}


@router.get("/{project_id}/logs")
def training_logs(project_id: str):
    """Return training logs / loss curve data for the dashboard."""
    return {"project_id": project_id, "logs": []}
