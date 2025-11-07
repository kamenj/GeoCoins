@echo off
REM Publish Docker images to Docker Hub
REM Simpler alternative to GitHub Container Registry

cd /d "%~dp0\..\.."

echo ========================================
echo Publishing GeoCoins to Docker Hub
echo ========================================
echo.

REM Check if logged in to Docker Hub
docker info | findstr "Username" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo You need to login to Docker Hub first.
    echo.
    echo If you don't have an account:
    echo   1. Go to: https://hub.docker.com/signup
    echo   2. Create free account (takes 1 minute)
    echo.
    set /p USERNAME="Enter your Docker Hub username: "
    
    echo.
    echo Logging in...
    docker login -u %USERNAME%
    
    if %ERRORLEVEL% NEQ 0 (
        echo Login failed!
        pause
        exit /b 1
    )
)

echo.
echo Step 1: Building images...
docker-compose -f docker-compose.base.yml build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

REM Get Docker Hub username
for /f "tokens=2" %%i in ('docker info ^| findstr "Username"') do set DOCKER_USER=%%i

echo.
echo Step 2: Tagging images for Docker Hub...
docker tag docker-backend %DOCKER_USER%/geocoins-backend:latest
docker tag docker-frontend %DOCKER_USER%/geocoins-frontend:latest

echo.
echo Step 3: Pushing backend image...
docker push %DOCKER_USER%/geocoins-backend:latest

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to push backend image!
    pause
    exit /b 1
)

echo.
echo Step 4: Pushing frontend image...
docker push %DOCKER_USER%/geocoins-frontend:latest

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to push frontend image!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Publish Complete!
echo ========================================
echo.
echo Images published:
echo   %DOCKER_USER%/geocoins-backend:latest
echo   %DOCKER_USER%/geocoins-frontend:latest
echo.
echo Update deploy/docker-compose.yml to use:
echo   image: %DOCKER_USER%/geocoins-backend:latest
echo   image: %DOCKER_USER%/geocoins-frontend:latest
echo.

pause
