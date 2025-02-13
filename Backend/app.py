from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks import process_task
import uuid
import redis
from datetime import datetime
from collections import defaultdict

app = Flask(__name__)
CORS(app)

r = redis.Redis(host='localhost', port=6379, db=0)


@app.route('/')
def landing():
    return "Hello World!"


@app.route('/submit_job', methods=['POST'])
def submit_job():
    job_id = str(uuid.uuid4())
    data = request.json

    if not data or 'script' not in data:
        return jsonify({"error": "Missing script"}), 400

    # Initialize job metadata
    total_tasks = 5  # For demo purposes
    with r.pipeline() as pipe:
        pipe.multi()
        # Store job metadata
        pipe.hset(f"job:{job_id}", "meta:created_at",
                  datetime.now().isoformat())
        pipe.hset(f"job:{job_id}", "meta:total_tasks", total_tasks)
        pipe.hset(f"job:{job_id}", "meta:overall_status", "pending")

        # Initialize task statuses
        for i in range(total_tasks):
            task_id = f"{job_id}-{i}"
            pipe.hset(f"job:{job_id}", task_id, "pending")

        pipe.execute()

    try:
        for i in range(total_tasks):
            task_id = f"{job_id}-{i}"
            process_task.delay(task_id, data['script'])
        return jsonify({'job_id': job_id})
    except Exception as e:
        r.delete(f"job:{job_id}")
        return jsonify({"error": str(e)}), 500

# app.py - Update job_status endpoint


@app.route('/job_status/<job_id>')
def job_status(job_id):
    if not r.exists(f"job:{job_id}"):
        return jsonify({"error": "Job not found"}), 404

    # Get all fields from the job hash
    all_fields = {k.decode(): v.decode()
                  for k, v in r.hgetall(f"job:{job_id}").items()}

    # Separate metadata and task statuses
    meta = {k: v for k, v in all_fields.items() if k.startswith("meta:")}
    task_statuses = {k: v for k, v in all_fields.items()
                     if not k.startswith("meta:")}

    tasks = []
    for task_id, status in task_statuses.items():
        task_data = {
            "task_id": task_id,
            "status": status,
            "output": None,
            "error": None
        }

        if r.exists(f"task:{task_id}"):
            task_info = r.hgetall(f"task:{task_id}")
            task_data.update({
                "output": task_info.get(b"output", b"").decode(),
                "error": task_info.get(b"error", b"").decode()
            })

        tasks.append(task_data)

    # Calculate overall status based on actual task statuses
    status_counts = defaultdict(int)
    for task in tasks:
        status_counts[task["status"]] += 1

    overall_status = "pending"
    if status_counts.get("running", 0) > 0:
        overall_status = "running"
    elif status_counts.get("failed", 0) > 0:
        overall_status = "failed"
    elif status_counts.get("completed", 0) == len(tasks):
        overall_status = "completed"

    return jsonify({
        "tasks": sorted(tasks, key=lambda x: x['task_id']),
        "overall_status": overall_status,
        "meta": {
            "created_at": meta.get("meta:created_at"),
            "total_tasks": int(meta.get("meta:total_tasks", 0)),
            "completed_tasks": status_counts.get("completed", 0)
        }
    })


if __name__ == '__main__':
    app.run(port=5001, debug=True)
