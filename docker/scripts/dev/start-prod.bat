@echo off
REM Start GeoCoins in PRODUCTION mode
REM With production settings and auto-restart

echo ========================================
echo Starting GeoCoins - PRODUCTION MODE
echo ========================================
echo.

cd /d "%~dp0"

REM Check if .env file exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please copy .env.example to .env and configure it:
    echo   copy .env.example .env
    echo.
    pause
    exit /b 1
)

docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml up --build -d

echo.
echo ========================================
echo GeoCoins started in background
echo ========================================
echo.
echo Frontend: http://localhost:8081
echo Backend:  http://localhost:3000
echo Database: localhost:5433
echo.
echo To view logs:
echo   docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml logs -f
echo.
echo To stop:
echo   docker-compose -f docker-compose.base.yml -f docker-compose.prod.yml down
echo.

pause
