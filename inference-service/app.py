"""
Model-serving API, deployed as a Hugging Face Space (Docker).

Loads a base model + LoRA adapter into memory once at startup, then
serves generation requests. Kept as a separate service from the core
API so the two can be deployed and scaled independently.
"""

import os

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Tuneforge Inference Service")

BASE_MODEL_NAME = os.environ.get("BASE_MODEL_NAME", "meta-llama/Llama-3.2-1B")
ADAPTER_REPO = os.environ.get("ADAPTER_REPO", "your-username/your-adapter-repo")

model = None
tokenizer = None


@app.on_event("startup")
def load_model():
    """
    Load the base model and LoRA adapter into memory once, at startup,
    rather than per-request.

    TODO:
        from transformers import AutoModelForCausalLM, AutoTokenizer
        from peft import PeftModel
        global model, tokenizer
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_NAME)
        base = AutoModelForCausalLM.from_pretrained(BASE_MODEL_NAME)
        model = PeftModel.from_pretrained(base, ADAPTER_REPO)
    """
    pass


class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 256


class GenerateResponse(BaseModel):
    text: str


@app.post("/generate", response_model=GenerateResponse)
def generate(payload: GenerateRequest):
    """
    Tokenize the prompt, run generation, decode, and return the text.

    TODO:
        inputs = tokenizer(payload.prompt, return_tensors="pt")
        outputs = model.generate(**inputs, max_new_tokens=payload.max_new_tokens)
        text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    """
    return GenerateResponse(text="not yet implemented")


@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}
