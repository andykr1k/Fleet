# Fleet: Distributed AI Training Platform

A decentralized computing platform that enables businesses to train AI models using a distributed network of consumer devices, while allowing individuals to monetize their idle computing resources.

## Features

- 🚀 **Bounty-Based Training Jobs** - Companies post training jobs with monetary rewards
- 🌐 **Distributed Computing** - Leverage idle computing power from network participants
- 🐳 **Docker Isolation** - Secure execution of training tasks in isolated containers
- 📊 **Real-Time Monitoring** - Track task progress through web dashboard
- ⚡ **Scalable Architecture** - Built with Redis and Celery for horizontal scaling

## Tech Stack

### Backend
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Framework       | Python Flask                        |
| Task Queue      | Celery + Redis                      |
| Containerization| Docker                              |
| API Docs        | Swagger (Planned)                   |

### Frontend
| Component       | Technology                          |
|-----------------|-------------------------------------|
| Framework       | React 18 + TypeScript               |
| Styling         | Tailwind CSS                        |
| State Management| Context API                         |
| Build Tool      | Vite                                |

## Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- Docker Desktop
- Redis 6+

### Backend Setup
```bash
git clone https://github.com/yourusername/fleet.git
cd fleet/backend
```

#### Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Start services
```bash
redis-server
python app.py
celery -A tasks.celery worker --pool=solo --loglevel=info
```

### Frontend Setup
```bash
cd fleet/frontend
npm install
npm run dev
```

#### Configuration
Environment Variables (Create .env in backend):

```bash
FLASK_ENV=development
REDIS_URL=redis://localhost:6379/0
```

#### Usage
1. Access Web Interface

    ```bash
    http://localhost:3000
    ```

2. Submit Training Job

    ```python
    # Sample training script
    import torch
    print("CUDA available:", torch.cuda.is_available())
    ```

3. Monitor Progress
    - Real-time status updates
    - Task-specific logs
    - Resource utilization metrics

## Troubleshooting
Common Issues:

```bash
# Check Redis connection
redis-cli ping

# Verify Docker permissions
docker ps

# Clear stuck tasks
docker system prune -af
redis-cli FLUSHALL
```

## Future Roadmap
🔒 Authentication System - JWT-based user accounts

💸 Payment Integration - Stripe/Crypto payouts

🧠 Model Aggregation - Federated learning support

🎛️ GPU Support - CUDA-enabled containers

📈 Advanced Monitoring - Prometheus + Grafana dashboards

## License
MIT License - See LICENSE

## Contributing
PRs welcome! Please open an issue first to discuss proposed changes.