import requests
import subprocess
import time

SERVER_URL = "http://localhost:5000"

while True:
    # Poll server for tasks
    response = requests.get(f"{SERVER_URL}/get_task")
    if response.status_code == 200:
        task = response.json()
        task_id = task['task_id']
        script = task['script']

        # Write script to file
        with open(f"task_{task_id}.py", "w") as f:
            f.write(script)

        # Run in Docker container
        subprocess.run([
            "docker", "build", "-t", "task-image", ".",
            "--build-arg", f"SCRIPT=task_{task_id}.py"
        ])
        subprocess.run(["docker", "run", "--rm", "task-image"])

        # Notify server of completion
        requests.post(f"{SERVER_URL}/complete_task", json={'task_id': task_id})

    time.sleep(5)