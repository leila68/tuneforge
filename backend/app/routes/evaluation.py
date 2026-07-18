from fastapi import APIRouter

router = APIRouter()


@router.post("/{project_id}/run")
def run_evaluation(project_id: str):
    """Evaluate the fine-tuned model against the base model on a held-out set."""
    return {"project_id": project_id, "status": "not yet implemented"}


@router.get("/{project_id}/results")
def get_evaluation_results(project_id: str):
    """Return stored evaluation metrics and example comparisons."""
    return {"project_id": project_id, "results": []}
