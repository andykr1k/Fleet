from celery import Celery
import subprocess
import os
from redis import Redis
from redis.exceptions import WatchError

celery = Celery('tasks', broker='redis://localhost:6379/0')
celery.conf.update(
    broker_connection_retry_on_startup=True,
    task_default_retry_delay=30,
    task_track_started=True,
    worker_concurrency=4,
    task_acks_late=True
)

redis = Redis(host='localhost', port=6379, db=0)


def update_job_progress(job_id):
    with redis.pipeline() as pipe:
        while True:
            try:
                pipe.watch(f"job:{job_id}")
                task_keys = [k.decode() for k in pipe.hkeys(f"job:{job_id}")
                             if k.decode().startswith(f"{job_id}-")]

                completed = 0
                statuses = []
                for task_key in task_keys:
                    status = pipe.hget(f"job:{job_id}", task_key)
                    statuses.append(status.decode() if status else 'pending')

                completed = sum(1 for s in statuses if s in [
                                'completed', 'failed'])
                pipe.multi()
                pipe.hset(f"job:{job_id}", "meta:completed_tasks", completed)

                # Update overall status
                if all(s == 'completed' for s in statuses):
                    pipe.hset(f"job:{job_id}",
                              "meta:overall_status", "completed")
                elif any(s == 'failed' for s in statuses):
                    pipe.hset(f"job:{job_id}", "meta:overall_status", "failed")
                elif any(s == 'running' for s in statuses):
                    pipe.hset(f"job:{job_id}",
                              "meta:overall_status", "running")
                else:
                    pipe.hset(f"job:{job_id}",
                              "meta:overall_status", "pending")

                pipe.execute()
                break
            except WatchError:
                continue


@celery.task(bind=True)
def process_task(self, task_id, script_code):
    parts = task_id.split('-')
    job_id = '-'.join(parts[:-1])
    redis_key = f"job:{job_id}"

    try:
        # Update task status to running
        with redis.pipeline() as pipe:
            pipe.multi()
            pipe.hset(redis_key, task_id, "running")
            pipe.execute()

        # Save and build task script
        script_path = f"task_{task_id}.py"
        with open(script_path, "w") as f:
            f.write(script_code)

        # Build Docker container
        subprocess.run(
            ["docker", "build", "-t", f"task-{task_id}",
             "--build-arg", f"SCRIPT={script_path}", "."],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Execute task in container
        result = subprocess.run(
            ["docker", "run", "--rm", "--memory=4g",
                "--cpus=1", f"task-{task_id}"],
            text=True,
            capture_output=True
        )

        # Store results
        with redis.pipeline() as pipe:
            pipe.multi()
            pipe.hset(f"task:{task_id}", mapping={
                "output": result.stdout,
                "error": result.stderr,
                "status": "completed"
            })
            pipe.hset(redis_key, task_id, "completed")
            pipe.execute()

    except subprocess.CalledProcessError as e:
        with redis.pipeline() as pipe:
            pipe.multi()
            pipe.hset(f"task:{task_id}", mapping={
                "error": str(e),
                "status": "failed"
            })
            pipe.hset(f"job:{job_id}", task_id, "failed")
            pipe.execute()
        self.retry(exc=e, max_retries=2)

    except Exception as e:
        with redis.pipeline() as pipe:
            pipe.multi()
            pipe.hset(f"task:{task_id}", mapping={
                "error": str(e),
                "status": "failed"
            })
            pipe.hset(f"job:{job_id}", task_id, "failed")
            pipe.execute()
        raise

    finally:
        try:
            subprocess.run(["docker", "rmi", f"task-{task_id}"],
                           stderr=subprocess.DEVNULL,
                           stdout=subprocess.DEVNULL)
            if os.path.exists(script_path):
                os.remove(script_path)
        except Exception as cleanup_error:
            print(f"Cleanup error for {task_id}: {cleanup_error}")

    update_job_progress(job_id)
