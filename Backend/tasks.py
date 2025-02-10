from celery import Celery
import subprocess
import os
from redis import Redis

celery = Celery('tasks', broker='redis://localhost:6379/0')
celery.conf.update(
    broker_connection_retry_on_startup=True,
    task_default_retry_delay=30,  # Retry failed tasks after 30 seconds
    task_track_started=True
)
redis = Redis(host='localhost', port=6379, db=0)

@celery.task(bind=True)  # Added bind=True for task context
def process_task(self, task_id, script_code):
    job_id = task_id.split('-')[0]  # Extract job ID from task ID
    print(f"\n=== Starting task {task_id} ===")  # Added logging

    try:
        # Update status to "running"
        print(f"Updating {task_id} to 'running'")
        redis.hset(f"job:{job_id}", task_id, "running")

        # Save script to file
        script_path = f"task_{task_id}.py"
        with open(script_path, "w") as f:
            f.write(script_code)

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

        # Update status to "completed"
        print(f"Updating {task_id} to 'completed'")
        redis.hset(f"job:{job_id}", task_id, "completed")

        return {
            "task_id": task_id,
            "status": "completed",
            "output": result.stdout,
            "error": result.stderr
        }

    except subprocess.CalledProcessError as e:
        # Update status to "failed"
        print(f"Error in task {task_id}: {str(e)}")
        redis.hset(f"job:{job_id}", task_id, "failed")
        raise self.retry(exc=e, max_retries=3)

    except Exception as e:
        # Handle other exceptions
        redis.hset(f"job:{job_id}", task_id, "failed")
        raise self.retry(exc=e, max_retries=3)

    finally:
        # Cleanup resources
        try:
            subprocess.run(["docker", "rmi", f"task-{task_id}"],
                         stderr=subprocess.DEVNULL)
            if os.path.exists(script_path):
                os.remove(script_path)
        except Exception as cleanup_error:
            print(f"Cleanup failed: {cleanup_error}")