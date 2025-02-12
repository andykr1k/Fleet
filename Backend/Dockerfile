FROM python:3.9-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip install torch torchvision matplotlib

ARG SCRIPT
COPY $SCRIPT /app/task.py

CMD ["python", "/app/task.py"]