@echo off
REM Start each Docker service in a separate terminal window
REM Similar to your current 3-terminal development setup

cd /d "%~dp0\..\.."

echo ========================================
echo Starting GeoCoins in Multi-Window Mode
echo ========================================
echo.

echo Detecting project structure...

REM Find kzzNodeServer location relative to GeoCoins
set PROJECTS_ROOT=%cd%\..
set KZZ_PATH_2UP=..\..\kzzNodeServer
set KZZ_PATH_7UP=..\..\..\..\..\..\..\kzz\kzzNodeServer

REM Check which path exists
if exist "%PROJECTS_ROOT%\kzzNodeServer" (
    echo Found kzzNodeServer at standard location: %PROJECTS_ROOT%\kzzNodeServer
    set KZZ_RELATIVE_PATH=%KZZ_PATH_2UP%
    set STRUCTURE=STANDARD
) else if exist "%cd%\..\..\..\..\..\..\..\kzz\kzzNodeServer" (
    echo Found kzzNodeServer at original dev location
    set KZZ_RELATIVE_PATH=%KZZ_PATH_7UP%
    set STRUCTURE=ORIGINAL
) else (
    echo ERROR: Cannot find kzzNodeServer directory!
    echo Searched:
    echo   - %PROJECTS_ROOT%\kzzNodeServer
    echo   - %cd%\..\..\..\..\..\..\..\kzz\kzzNodeServer
    echo.
    echo Please ensure kzzNodeServer is cloned next to GeoCoins folder.
    pause
    exit /b 1
)

echo Using %STRUCTURE% structure with path: %KZZ_RELATIVE_PATH%
echo.

REM Generate docker-compose override with correct paths
echo Generating docker-compose.paths.yml with correct paths...
(
echo # Auto-generated path overrides based on detected structure
echo.
echo services:
echo   backend:
echo     build:
echo       context: %KZZ_RELATIVE_PATH%
echo       dockerfile: docker/Dockerfile
echo     volumes:
echo       - %KZZ_RELATIVE_PATH%/src:/app/src
echo.
echo   db:
echo     volumes:
echo       - postgres_data:/var/lib/postgresql/data
echo       - %KZZ_RELATIVE_PATH%/database/geocoins_v1.sql:/docker-entrypoint-initdb.d/init.sql
) > docker-compose.paths.yml

echo Cleaning up existing containers...
docker rm -f geocoins-db geocoins-backend geocoins-frontend geocoins-tunnel 2>nul
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.paths.yml down 2>nul

echo.
echo Building Docker images (first time may take 2-3 minutes)...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.paths.yml build

echo.
echo Starting all services in detached mode...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.paths.yml up -d

echo.
echo Waiting 10 seconds for containers to fully start...
timeout /t 10 /nobreak

echo.
echo Opening 4 log windows...
echo.

start "GeoCoins - Database" cmd /k "cd /d %~dp0 && docker logs --follow --tail=100 geocoins-db"
timeout /t 1 /nobreak >nul

start "GeoCoins - Backend" cmd /k "cd /d %~dp0 && docker logs --follow --tail=100 geocoins-backend"
timeout /t 1 /nobreak >nul

start "GeoCoins - Frontend" cmd /k "cd /d %~dp0 && docker logs --follow --tail=100 geocoins-frontend"
timeout /t 1 /nobreak >nul

start "GeoCoins - Tunnel" cmd /k "cd /d %~dp0 && docker logs --follow --tail=100 geocoins-tunnel"

timeout /t 3 /nobreak >nul

rem start chrome kkk.kaminooo.com
start chrome kkk.kaminooo.com

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo App running at: http://localhost:8081
echo.
echo To stop all services:
echo   Run stop-docker.bat
echo.

pause

echo.
echo Stopping all containers...
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.paths.yml down

echo.
echo Closing log windows...
taskkill /FI "WINDOWTITLE eq GeoCoins - Database*" /F 2>nul
taskkill /FI "WINDOWTITLE eq GeoCoins - Backend*" /F 2>nul
taskkill /FI "WINDOWTITLE eq GeoCoins - Frontend*" /F 2>nul
taskkill /FI "WINDOWTITLE eq GeoCoins - Tunnel*" /F 2>nul

echo.
echo All containers stopped and windows closed!
timeout /t 2 /nobreak >nul
