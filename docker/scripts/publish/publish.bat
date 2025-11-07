@echo off
REM Publish Docker images to GitHub Container Registry
REM Run this when you want to release a new version

cd /d "%~dp0\..\.."

echo ========================================
echo Publishing GeoCoins to GitHub Registry
echo ========================================
echo.

REM Check for saved token
set TOKEN_FILE=%USERPROFILE%\.github-docker-token

if exist "%TOKEN_FILE%" (
    echo Logging in with saved token...
    type "%TOKEN_FILE%" | docker login ghcr.io -u kamenj --password-stdin >nul 2>nul
)

REM Check if logged in to GitHub
docker info | findstr "ghcr.io" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo You need to login to GitHub Container Registry first.
    echo.
    echo Choose one of these methods:
    echo   1. Run: save-github-token.bat (saves token for future use)
    echo   2. Run: login-github.bat (uses GitHub CLI)
    echo.
    pause
    exit /b 1
)

echo Step 1: Building images...
docker-compose -f docker-compose.base.yml build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Tagging images for GitHub Container Registry...
docker tag docker-backend ghcr.io/kamenj/geocoins-backend:latest
docker tag docker-frontend ghcr.io/kamenj/geocoins-frontend:latest

echo.
echo Step 3: Pushing backend image...
docker push ghcr.io/kamenj/geocoins-backend:latest

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to push backend image!
    pause
    exit /b 1
)

echo.
echo Step 4: Pushing frontend image...
docker push ghcr.io/kamenj/geocoins-frontend:latest

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
echo   ghcr.io/kamenj/geocoins-backend:latest
echo   ghcr.io/kamenj/geocoins-frontend:latest
echo.
echo Users can now download and run your application!
echo.

pause
