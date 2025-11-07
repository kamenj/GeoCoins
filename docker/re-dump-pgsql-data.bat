@echo off
REM Stop all Docker containers and remove volumes (including database)
REM This forces a fresh database initialization on next startup

cd /d "%~dp0"

echo ========================================
echo Stopping and Cleaning Docker Services
echo ========================================
echo.
echo This will:
echo   - Stop all containers
echo   - Remove all containers
echo   - Delete database volume (fresh start)
echo.

docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml down -v

echo.
echo ========================================
echo Cleanup complete!
echo ========================================
echo.
echo Next time you run start-dev-windows.bat,
echo the database will be initialized fresh.
echo.

pause
