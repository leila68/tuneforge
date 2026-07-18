from fastapi import APIRouter, UploadFile

router = APIRouter()


@router.post("/upload")
async def upload_dataset(file: UploadFile):
    """
    Accept a dataset file, validate its structure, and store it.

    TODO:
    - validate required columns / format
    - push to Hugging Face Hub via services/hf_hub_client.py
    - record metadata in Postgres
    """
    return {"filename": file.filename, "status": "not yet implemented"}


@router.get("/{dataset_id}")
def get_dataset(dataset_id: str):
    """Get dataset metadata and validation status."""
    return {"dataset_id": dataset_id}
