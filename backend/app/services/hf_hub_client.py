"""
Pushes uploaded datasets and pulls/pushes fine-tuned LoRA adapters
to/from the Hugging Face Hub, which acts as this project's
dataset + model storage layer.
"""

from huggingface_hub import HfApi  # TODO: add to requirements.txt

HF_TOKEN = "hf_..."  # TODO: load from environment variable

api = HfApi(token=HF_TOKEN)


def upload_dataset(local_path: str, repo_id: str) -> str:
    """Push a validated dataset file to a Hugging Face dataset repo."""
    # TODO: api.upload_file(...) with repo_type="dataset"
    raise NotImplementedError


def upload_adapter(local_path: str, repo_id: str) -> str:
    """Push a trained LoRA adapter to a Hugging Face model repo."""
    # TODO: api.upload_folder(...) with repo_type="model"
    raise NotImplementedError
