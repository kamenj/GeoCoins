@echo off
REM Stop GeoCoins services

cd /d "%~dp0"

echo Stopping GeoCoins services...
docker-compose down

echo.
echo Services stopped!
pause
