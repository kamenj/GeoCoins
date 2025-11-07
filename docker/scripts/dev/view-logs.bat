@echo off
REM View logs from individual Docker services
REM Useful for debugging specific components

cd /d "%~dp0"

echo ========================================
echo GeoCoins - View Service Logs
echo ========================================
echo.
echo Which service logs do you want to view?
echo.
echo 1. Database (PostgreSQL)
echo 2. Backend (kzzNodeServer)
echo 3. Frontend (Web Server)
echo 4. Tunnel (Cloudflare)
echo 5. All services combined
echo 6. Exit
echo.

choice /c 123456 /n /m "Select option (1-6): "

if errorlevel 6 goto :end
if errorlevel 5 goto :all
if errorlevel 4 goto :tunnel
if errorlevel 3 goto :frontend
if errorlevel 2 goto :backend
if errorlevel 1 goto :database

:database
echo.
echo Showing DATABASE logs (Ctrl+C to exit)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f db
goto :end

:backend
echo.
echo Showing BACKEND logs (Ctrl+C to exit)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f backend
goto :end

:frontend
echo.
echo Showing FRONTEND logs (Ctrl+C to exit)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f frontend
goto :end

:tunnel
echo.
echo Showing TUNNEL logs (Ctrl+C to exit)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f tunnel
goto :end

:all
echo.
echo Showing ALL logs (Ctrl+C to exit)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml logs -f
goto :end

:end
pause
