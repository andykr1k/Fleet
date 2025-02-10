# Base image with Python (minimal to reduce size)
FROM python:3.9-slim

# Install system dependencies (e.g., for PyTorch/TensorFlow later)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Allow dynamic script injection via build argument
ARG SCRIPT
COPY $SCRIPT /app/task.py

# Install Python dependencies (customize this for ML libraries)
# RUN pip install numpy torch  # Example for future ML tasks

# Run the script
CMD ["python", "/app/task.py"]