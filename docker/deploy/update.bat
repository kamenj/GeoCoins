@echo off
REM Update GeoCoins to latest version

cd /d "%~dp0"

echo ========================================
echo Updating GeoCoins
echo ========================================
echo.

echo Step 1: Pulling latest images...
docker-compose pull

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to pull updates!
    pause
    exit /b 1
)

echo.
echo Step 2: Stopping current services...
docker-compose down

echo.
echo Step 3: Starting updated services...
docker-compose up -d

echo.
echo Step 4: Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo Update Complete!
echo ========================================
echo.

docker-compose ps
pause
