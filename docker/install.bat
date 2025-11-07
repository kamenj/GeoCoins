@echo off
REM GeoCoins Docker Installation Script
REM Automatically installs and starts the application

echo ========================================
echo GeoCoins Docker Installation
echo ========================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not installed!
    echo.
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

REM Check if Docker is running
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

cd /d "%~dp0"

echo Step 1: Pulling/Building Docker images...
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml build

echo.
echo Step 2: Starting services...
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml up -d

echo.
echo Step 3: Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Your application is running at:
echo   Local:  http://localhost:8081
echo   Public: https://kkk.kaminooo.com
echo.
echo To stop:  run stop-docker.bat
echo To view logs: docker-compose logs -f
echo.

pause
