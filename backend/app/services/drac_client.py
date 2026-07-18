"""
Handles submitting and monitoring fine-tuning jobs on DRAC (Digital
Research Alliance of Canada) via Slurm.

DRAC compute nodes are batch-scheduled and often have no outbound
internet access -- this client only ever talks to the *login* node
over SSH to submit/monitor jobs. It never expects a live connection
to a running job.
"""

import paramiko  # TODO: add to requirements.txt

DRAC_HOST = "narval.alliancecan.ca"  # TODO: set via env var, choose your cluster
DRAC_USER = "your-username"          # TODO: set via env var


def submit_training_job(sbatch_script_path: str) -> str:
    """
    SSH into the DRAC login node and submit a Slurm job via `sbatch`.
    Returns the Slurm job ID.
    """
    # TODO: implement SSH connection + `sbatch <script>` + parse job ID
    raise NotImplementedError


def get_job_status(job_id: str) -> str:
    """Run `squeue -j <job_id>` / `sacct` to check job state."""
    # TODO: implement
    raise NotImplementedError


def fetch_job_logs(job_id: str) -> str:
    """Fetch the Slurm output log file for a given job."""
    # TODO: implement (scp or sftp the .out file back)
    raise NotImplementedError
