# GeoCoins - Installation Guide for Developers

Complete setup guide to get GeoCoins running on your machine using Docker.

## Prerequisites

Install these tools first:

### 1. Git
- Download: https://git-scm.com/download/win
- During installation: Choose "Git from the command line and also from 3rd-party software"
- Verify: Open cmd and run `git --version`

### 2. Docker Desktop
- Download: https://www.docker.com/products/docker-desktop
- Requirements: Windows 10/11 with WSL 2
- After install: Start Docker Desktop and wait for it to be running

### 3. VS Code (Optional but Recommended)
- Download: https://code.visualstudio.com/
- Extensions (optional): Docker, Remote-Containers

---

## Quick Setup (5 minutes)

### Step 1: Clone the Projects

Open Command Prompt or PowerShell and run:

```bash
# Create a projects folder
mkdir c:\projects
cd c:\projects

# Clone GeoCoins frontend
git clone https://github.com/kamenj/GeoCoins.git

# Clone kzzNodeServer backend
git clone https://github.com/kamenj/kzzNodeServer.git
```

**Expected result:**
```
c:\projects\
├── GeoCoins\
└── kzzNodeServer\
```

### Step 2: Start Docker Desktop

1. Open Docker Desktop from Start Menu
2. Wait until you see "Docker Desktop is running" (bottom left shows green)
3. Keep it running in the background

### Step 3: Run the Startup Script

```bash
cd c:\projects\GeoCoins\docker\scripts\dev
start-dev-windows.bat
```

**What happens:**
- Main window builds images (first time: 2-3 minutes)
- 4 new windows open showing logs for:
  - Database (PostgreSQL)
  - Backend (API server)
  - Frontend (Web server)
  - Tunnel (Cloudflare - public access)

### Step 4: Open the Application

After about 15 seconds, the app opens automatically in your browser:
- **Local**: http://localhost:8081
- **Public**: https://kkk.kaminooo.com

**Default login**: Check with Kamen for credentials

---

## Daily Usage

### Starting the App
```bash
cd c:\projects\GeoCoins\docker\scripts\dev
start-dev-windows.bat
```

### Stopping the App
Press `Ctrl+C` in any of the 4 terminal windows, or close the main window.

### Updating to Latest Version
```bash
# Update GeoCoins
cd c:\projects\GeoCoins
git pull

# Update backend
cd c:\projects\kzzNodeServer
git pull

# Rebuild and restart
cd c:\projects\GeoCoins\docker\scripts\dev
start-dev-windows.bat
```

### Viewing Logs
If windows are closed, view logs with:
```bash
cd c:\projects\GeoCoins\docker\scripts\dev
view-logs.bat
```

### Resetting Database
If something goes wrong with data:
```bash
cd c:\projects\GeoCoins\docker\scripts\dev
stop-and-clean-db.bat
```
Then start again.

---

## Folder Structure

After setup, you'll have:

```
c:\projects\
├── GeoCoins\
│   ├── v5\                     # Frontend code (HTML/JS/CSS)
│   ├── bin\                    # Local development scripts
│   │   └── webserver.js
│   └── docker\
│       ├── scripts\
│       │   └── dev\            # ← Start here
│       │       └── start-dev-windows.bat
│       ├── docker-compose.*.yml
│       └── Dockerfile.frontend
│
└── kzzNodeServer\
    ├── src\                    # Backend code (Node.js)
    │   ├── index.js
    │   ├── config\
    │   └── ...
    ├── database\
    │   └── geocoins_v1.sql     # Database schema
    └── docker\
        └── Dockerfile
```

---

## Development Workflow

### Making Code Changes

**Frontend changes** (HTML/CSS/JavaScript):
1. Edit files in `c:\projects\GeoCoins\v5\`
2. Changes appear **instantly** in browser (refresh page)
3. No restart needed!

**Backend changes** (Node.js API):
1. Edit files in `c:\projects\kzzNodeServer\src\`
2. Changes appear **instantly** (nodemon auto-restarts)
3. Watch backend terminal window for "Server restarted"

**Database schema changes**:
1. Edit `c:\projects\kzzNodeServer\database\geocoins_v1.sql`
2. Run `stop-and-clean-db.bat` to reset database
3. Start again - new schema is loaded

### Testing Your Changes

1. Make changes to code
2. Refresh browser or wait for auto-reload
3. Check terminal windows for errors
4. Use browser DevTools (F12) for debugging

### Committing Changes

```bash
# Commit frontend changes
cd c:\projects\GeoCoins
git add .
git commit -m "Description of changes"
git push

# Commit backend changes
cd c:\projects\kzzNodeServer
git add .
git commit -m "Description of changes"
git push
```

---

## Troubleshooting

### "Docker is not running"
→ Open Docker Desktop and wait for it to start

### Port already in use (8081 or 3000)
→ Stop other services using those ports:
```bash
# Find what's using port 8081
netstat -ano | findstr :8081
# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Database tables missing
→ Reset database:
```bash
cd c:\projects\GeoCoins\docker\scripts\dev
stop-and-clean-db.bat
start-dev-windows.bat
```

### Images fail to build
→ Check Docker Desktop is running and you have internet connection

### Cloudflare tunnel errors (502)
→ Check backend is running first, then restart tunnel window

### Changes not appearing
→ Clear browser cache (Ctrl+Shift+Delete) or use Incognito mode

---

## VS Code Tips

If using VS Code:

### Open Both Projects
```
File → Open Folder → c:\projects\GeoCoins
```
Then:
```
File → Add Folder to Workspace → c:\projects\kzzNodeServer
```

### Useful Extensions
- **Docker** - Manage containers from VS Code
- **GitLens** - Enhanced Git features
- **Live Server** - Alternative to Docker for frontend-only testing
- **Thunder Client** - Test backend API directly

### Integrated Terminal
Use `Ctrl+`` to open terminal inside VS Code instead of separate windows

---

## Getting Help

1. **Check terminal windows** for error messages
2. **Browser Console** (F12) shows JavaScript errors
3. **Docker logs**: `docker logs geocoins-backend`
4. **Contact Kamen**: kamenj@hotmail.com

---

## Summary

✅ **One-time setup**: Clone repos, install Docker
✅ **Daily usage**: Just run `start-dev-windows.bat`
✅ **Live editing**: Changes appear instantly
✅ **Easy updates**: `git pull` and restart
✅ **Full control**: All source code available

This approach gives you maximum flexibility while still being easy to set up!
