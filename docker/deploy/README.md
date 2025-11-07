# GeoCoins - Deployment Package

This folder contains everything needed to deploy GeoCoins to production using Docker.

## Prerequisites

- Docker Desktop installed and running
- Internet connection (to pull images from GitHub Container Registry)

## Quick Start

1. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Edit `.env` and set your production values

2. **Run the installer**:
   ```bash
   install.bat
   ```

3. **Access your application**:
   - Local: http://localhost:8081
   - Public: Configure your Cloudflare tunnel

## Files Included

- `docker-compose.yml` - Production configuration
- `.env.example` - Environment variables template
- `install.bat` - One-click installation script
- `start.bat` - Start services
- `stop.bat` - Stop services
- `update.bat` - Pull latest images and restart
- `logs.bat` - View container logs
- `README.md` - This file

## Manual Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Update to latest version
docker-compose pull
docker-compose up -d

# Restart with fresh database
docker-compose down -v
docker-compose up -d
```

## Support

For issues or questions, contact: kamenj@hotmail.com
