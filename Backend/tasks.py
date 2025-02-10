from celery import Celery

celery = Celery('tasks', broker='redis://localhost:6379/0')

@celery.task
def process_task(task_id, script_code):
    # Simulate task execution (replace with real logic later)
    return f"Task {task_id} completed: Ran {script_code}"