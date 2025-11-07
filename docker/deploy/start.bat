@echo off
REM Start GeoCoins services

cd /d "%~dp0"

echo Starting GeoCoins services...
docker-compose up -d

echo.
echo Services started!
echo Application: http://localhost:8081
echo.

docker-compose ps
pause
