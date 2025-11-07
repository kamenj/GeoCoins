@echo off
REM View GeoCoins container logs

cd /d "%~dp0"

echo ========================================
echo GeoCoins - View Logs
echo ========================================
echo.
echo Which logs do you want to view?
echo.
echo 1. All services (combined)
echo 2. Database only
echo 3. Backend only
echo 4. Frontend only
echo 5. Exit
echo.

choice /c 12345 /n /m "Select option (1-5): "

if errorlevel 5 goto :end
if errorlevel 4 goto :frontend
if errorlevel 3 goto :backend
if errorlevel 2 goto :database
if errorlevel 1 goto :all

:all
echo.
echo Showing ALL logs (Ctrl+C to exit)...
docker-compose logs -f
goto :end

:database
echo.
echo Showing DATABASE logs (Ctrl+C to exit)...
docker-compose logs -f db
goto :end

:backend
echo.
echo Showing BACKEND logs (Ctrl+C to exit)...
docker-compose logs -f backend
goto :end

:frontend
echo.
echo Showing FRONTEND logs (Ctrl+C to exit)...
docker-compose logs -f frontend
goto :end

:end
