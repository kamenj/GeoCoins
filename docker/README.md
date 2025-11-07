# GeoCoins Docker

This folder contains everything needed to run GeoCoins in Docker containers.

## 📁 Folder Structure

```
docker/
├── scripts/
│   ├── dev/              # Development scripts (for developers)
│   │   ├── start-dev-windows.bat    # Start with 4 terminal windows
│   │   ├── start-dev.bat            # Start with combined logs
│   │   ├── stop-docker.bat          # Stop containers (keep data)
│   │   ├── view-logs.bat            # Interactive log viewer
│   │   └── test-tunnel.bat          # Test Cloudflare tunnel
│   │
│   └── publish/          # Publishing scripts (for distribution)
│       ├── publish.bat              # Publish to GitHub Registry
│       ├── publish-dockerhub.bat    # Publish to Docker Hub
│       ├── login-github.bat         # Easy GitHub login
│       ├── save-github-token.bat    # Save token once
│       └── PUBLISHING_GUIDE.md      # Complete publishing guide
│
├── deploy/               # Distribution package (for end users)
│   ├── install.bat                  # One-click installer
│   ├── start.bat                    # Start services
│   ├── stop.bat                     # Stop services
│   ├── update.bat                   # Update to latest version
│   ├── logs.bat                     # View logs
│   ├── docker-compose.yml           # Production config
│   ├── .env.example                 # Config template
│   └── README.md                    # User instructions
│
├── docker-compose.base.yml          # Base configuration
├── docker-compose.dev.yml           # Development overrides
├── docker-compose.prod.yml          # Production overrides
├── Dockerfile.frontend              # Frontend image definition
├── .dockerignore                    # Excluded files
└── README.md                        # This file
```

## 🚀 Quick Start

### Recommended: Git Clone Method (Easiest for Developers)

**Best for**: Developers who want full source access and easy updates

See **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** for complete step-by-step instructions.

**Quick version**:
1. Install Git + Docker Desktop
2. Clone repos: `git clone https://github.com/kamenj/GeoCoins.git`
3. Run: `GeoCoins\docker\scripts\dev\start-dev-windows.bat`

**Benefits**: Live code editing, instant updates via `git pull`, full control

---

### Alternative: Pre-built Images (For Production Deployment)

### For Development (You):

1. **Start development environment**:
   ```bash
   scripts\dev\start-dev-windows.bat
   ```
   Opens 4 terminal windows (database, backend, frontend, tunnel)

2. **View logs**:
   ```bash
   scripts\dev\view-logs.bat
   ```

3. **Stop and reset database**:
   ```bash
   cd scripts\dev
   stop-and-clean-db.bat
   ```

### For Publishing (Distribution):

1. **Login once**:
   ```bash
   scripts\publish\save-github-token.bat
   ```

2. **Publish new version**:
   ```bash
   scripts\publish\publish.bat
   ```
   OR for Docker Hub:
   ```bash
   scripts\publish\publish-dockerhub.bat
   ```

### For End Users (Distribution):

Give users the `deploy/` folder. They run:
```bash
install.bat
```

## 📖 Documentation

- **Development**: Scripts in `scripts/dev/`
- **Publishing**: Read `scripts/publish/PUBLISHING_GUIDE.md`
- **Deployment**: See `deploy/README.md`

## 🔧 Configuration Files

- `docker-compose.base.yml` - Shared settings (database, networks, volumes)
- `docker-compose.dev.yml` - Development (volume mounts, no restart)
- `docker-compose.prod.yml` - Production (auto-restart, no mounts)

## 📦 Docker Images

- **Backend**: `ghcr.io/kamenj/geocoins-backend`
- **Frontend**: `ghcr.io/kamenj/geocoins-frontend`
- **Database**: `postgres:17` (official)
- **Tunnel**: `cloudflare/cloudflared` (official)

## 🌐 Access Points

- **Frontend (Local)**: http://localhost:8081
- **Frontend (Internet)**: https://kkk.kaminooo.com
- **Backend API**: http://localhost:3000
- **Database**: localhost:5433 (PostgreSQL 17)

## 🆘 Troubleshooting

**Containers won't start**: Run `scripts\dev\stop-and-clean-db.bat` to reset

**Database empty**: Volume persists old data - clean it with script above

**Port conflicts**: Stop local services or other Docker containers

**Tunnel 502 errors**: Check backend is running first

**Image pull fails**: Check you're logged in to registry
