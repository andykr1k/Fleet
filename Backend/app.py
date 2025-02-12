from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks import process_task
import uuid
import redis

app = Flask(__name__)
CORS(app)

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, db=0)

@app.route('/')
def landing():
    return "Hello World!"

@app.route('/submit_job', methods=['POST'])
def submit_job():
    job_id = str(uuid.uuid4())
    data = request.json

    # Validate input
    if not data or 'script' not in data:
        return jsonify({"error": "Missing script"}), 400

    # Initialize tasks in Redis (5 shards)
    tasks = {f"{job_id}-{i}": "pending" for i in range(5)}
    r.hset(f"job:{job_id}", mapping=tasks)  # <-- Correct way to set multiple fields

    # Enqueue tasks with proper error handling
    try:
        for task_id in tasks:
            process_task.delay(task_id, data['script'])  # Pass task ID and script
        return jsonify({'job_id': job_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/job_status/<job_id>')
def job_status(job_id):
    # Handle non-existent jobs gracefully
    if not r.exists(f"job:{job_id}"):
        return jsonify({"error": "Job not found"}), 404

    tasks = r.hgetall(f"job:{job_id}")
    return jsonify({
        "tasks": [
            {
                "task_id": task_id.decode(),
                "status": status.decode(),
            } for task_id, status in tasks.items()
        ]
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)