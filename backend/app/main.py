"""
Tuneforge core API entrypoint.

Handles auth, project/dataset management, and orchestrates fine-tuning
jobs on DRAC. Model inference lives in the separate inference-service.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import projects, datasets, training, evaluation
from app.auth import routes as auth_routes

app = FastAPI(
    title="Tuneforge API",
    description="Core API for the LLM fine-tuning platform",
    version="0.1.0",
)

# TODO: restrict allow_origins to the deployed frontend URL before going live
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
app.include_router(training.router, prefix="/training", tags=["training"])
app.include_router(evaluation.router, prefix="/evaluation", tags=["evaluation"])


@app.get("/health")
def health_check():
    """Used by Render and uptime checks."""
    return {"status": "ok"}
