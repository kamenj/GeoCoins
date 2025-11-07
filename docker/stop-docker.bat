@echo off
REM Stop all GeoCoins Docker containers

cd /d "%~dp0"

echo Stopping GeoCoins containers...

docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml down
docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml down

echo.
echo ✅ All containers stopped
echo.

pause
