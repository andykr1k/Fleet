from flask import Flask, request, jsonify
from flask_cors import CORS
from tasks import process_task
import uuid

app = Flask(__name__)
CORS(app)

# In-memory storage (replace with database later)
jobs = {}

@app.route('/submit_job', methods=['POST'])
def submit_job():
    job_id = str(uuid.uuid4())
    data = request.json

    jobs[job_id] = {
        'status': 'pending',
        'bounty': data['bounty'],
        'script': data['script']
    }

    # Split into 1 task for testing (modify later)
    task_id = f"{job_id}-0"
    process_task.delay(task_id, data['script'])  # Enqueue to Celery

    return jsonify({'job_id': job_id, 'task_id': task_id})

if __name__ == '__main__':
    app.run(port=5000, debug=True)