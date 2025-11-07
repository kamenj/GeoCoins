# GeoCoins Docker Setup

This folder contains all Docker-related files for the GeoCoins application.

## Structure

```
docker/
├── Dockerfile.frontend              # Frontend container definition
├── docker-compose.base.yml          # Base configuration (shared)
├── docker-compose.dev.yml           # Development overrides
├── docker-compose.prod.yml          # Production overrides
├── cloudflare-config.yml            # Cloudflare tunnel configuration
├── tunnel-credentials.json          # Cloudflare credentials (NOT in git)
├── tunnel-credentials.json.example  # Template for credentials
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── start-dev.bat                    # Start in development mode
├── start-prod.bat                   # Start in production mode
├── stop-docker.bat                  # Stop all containers
└── README.md                        # This file

kzzNodeServer/docker/
├── Dockerfile                       # Backend container definition
└── .dockerignore                    # Files to exclude from backend image
```

## Quick Start

### Development Mode
```bash
cd docker
start-dev.bat
```
- Live code editing enabled
- Development settings
- Runs in foreground

### Production Mode
```bash
cd docker
copy .env.example .env
notepad .env  (configure secrets)
start-prod.bat
```
- Optimized for production
- Uses .env for secrets
- Runs in background

### Stop Everything
```bash
cd docker
stop-docker.bat
```

## Access Points

- **Frontend (Local):** http://localhost:8081
- **Frontend (Internet):** https://kkk.kaminooo.com
- **Backend API:** http://localhost:3000
- **Database:** localhost:5433 (PostgreSQL 17)

## Services

1. **db** - PostgreSQL 17 database
2. **backend** - kzzNodeServer (Node.js Express API)
3. **frontend** - GeoCoins v5 web interface
4. **tunnel** - Cloudflare Tunnel (exposes app to internet via kkk.kaminooo.com)

## Environment Variables

Copy `.env.example` to `.env` for production:
- `POSTGRES_PASSWORD` - Database password
- `JWT_SECRET` - JWT token secret key

## Volumes

- `postgres_data` - Persistent database storage

## Network

All services communicate via `geocoins-network` bridge network.

## Cloudflare Tunnel Setup

The tunnel exposes your local app to the internet via `kkk.kaminooo.com`.

**What it does:**
- Routes internet traffic through Cloudflare to your Docker frontend
- No port forwarding needed
- Automatic HTTPS with Cloudflare certificate

**Configuration:**
- `cloudflare-config.yml` - Tunnel routing configuration
- `tunnel-credentials.json` - Your tunnel credentials (NOT in git!)

**Note:** The tunnel container connects to `http://frontend:8081` internally, not `localhost`.
