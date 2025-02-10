from flask import Flask, request, jsonify
from celery import Celery
import os
import uuid

app = Flask(__name__)
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# In-memory "database" for simplicity (replace with PostgreSQL later)
jobs = {}
tasks = {}

@app.route('/submit_job', methods=['POST'])
def submit_job():
    job_id = str(uuid.uuid4())
    data = request.json
    jobs[job_id] = {
        'status': 'pending',
        'bounty': data['bounty'],
        'script': data['script']  # Training code (e.g., train.py)
    }
    # Split job into 10 dummy tasks for testing
    for i in range(10):
        task_id = f"{job_id}-{i}"
        tasks[task_id] = {'status': 'pending', 'job_id': job_id}
    return jsonify({'job_id': job_id})

if __name__ == '__main__':
    app.run(port=5000, debug=True)