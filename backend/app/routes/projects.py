from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def list_projects():
    """List all projects for the current user."""
    # TODO: query Postgres, scoped to authenticated user
    return []


@router.post("/")
def create_project():
    """Create a new project."""
    # TODO: insert into Postgres
    return {"message": "not yet implemented"}


@router.get("/{project_id}")
def get_project(project_id: str):
    """Get a single project's details."""
    # TODO: query Postgres
    return {"project_id": project_id}
