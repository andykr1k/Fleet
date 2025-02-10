from celery import Celery
import subprocess
import os

celery = Celery('tasks', broker='redis://localhost:6379/0')
celery.conf.update(broker_connection_retry_on_startup=True)

@celery.task
def process_task(task_id, script_code):
    # Save script to a file
    script_path = f"task_{task_id}.py"
    with open(script_path, "w") as f:
        f.write(script_code)

    # Build and run Docker container
    try:
        # Build Docker image
        build_cmd = [
            "docker", "build",
            "-t", f"task-{task_id}",
            "--build-arg", f"SCRIPT={script_path}",
            "."
        ]
        subprocess.run(build_cmd, check=True)

        # Run container and capture output
        run_cmd = ["docker", "run", "--rm", f"task-{task_id}"]
        result = subprocess.run(run_cmd, capture_output=True, text=True)

        return {
            "task_id": task_id,
            "status": "completed",
            "output": result.stdout,
            "error": result.stderr
        }
    except subprocess.CalledProcessError as e:
        return {"task_id": task_id, "status": "failed", "error": str(e)}
    finally:
        # Remove the Docker image
        subprocess.run(["docker", "rmi", f"task-{task_id}"], stderr=subprocess.DEVNULL)
        # Delete the script file
        if os.path.exists(script_path):
            os.remove(script_path)