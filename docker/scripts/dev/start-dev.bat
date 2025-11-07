@echo off
REM Start GeoCoins in DEVELOPMENT mode
REM With live code editing and dev settings

echo ========================================
echo Starting GeoCoins - DEVELOPMENT MODE
echo ========================================
echo.

cd /d "%~dp0"
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up --build

pause
