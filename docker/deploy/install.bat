@echo off
REM GeoCoins - One-Click Installation Script
REM Automatically downloads and starts all services

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

REM Check if .env exists
if not exist ".env" (
    echo.
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo.
    echo IMPORTANT: Please edit .env file and set your passwords!
    echo.
    echo Press any key to open .env in notepad...
    pause >nul
    notepad .env
    echo.
    echo After saving .env, press any key to continue installation...
    pause >nul
)

echo.
echo Step 1: Pulling latest images from GitHub Container Registry...
docker-compose pull

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to pull images!
    echo Make sure you have internet connection.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Starting services...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to start services!
    echo Check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 3: Waiting for services to initialize...
timeout /t 15 /nobreak >nul

echo.
echo Step 4: Checking service health...
docker-compose ps

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Your application is running at:
echo   Local:  http://localhost:8081
echo.
echo Useful commands:
echo   View logs:    logs.bat
echo   Stop:         stop.bat
echo   Restart:      start.bat
echo   Update:       update.bat
echo.
echo Opening application in browser...
timeout /t 2 /nobreak >nul
start http://localhost:8081

pause
