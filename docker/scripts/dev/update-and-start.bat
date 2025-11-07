@echo off
REM Update and Start GeoCoins
REM Clones projects if missing, pulls latest changes, and starts the development environment

echo ========================================
echo GeoCoins - Setup and Start
echo ========================================
echo.

REM Determine if running from inside GeoCoins or standalone
set "SCRIPT_DIR=%~dp0"

REM Try to detect if we're already in GeoCoins structure
cd /d "%SCRIPT_DIR%"
if exist "..\..\..\..\docker-compose.base.yml" (
    REM We're inside GeoCoins/docker/scripts/dev/
    cd /d "%SCRIPT_DIR%\..\.."
    set GEOCOINS_PATH=%CD%
    cd /d "%GEOCOINS_PATH%\..\.."
    set PROJECTS_ROOT=%CD%
) else (
    REM Running standalone - use current directory as projects root
    set PROJECTS_ROOT=%CD%
)

set GEOCOINS_PATH=%PROJECTS_ROOT%\GeoCoins
set KZZ_PATH=%PROJECTS_ROOT%\kzzNodeServer

REM GitHub URLs
set GEOCOINS_REPO=https://github.com/kamenj/GeoCoins.git
set KZZ_REPO=https://github.com/kamenj/kzzNodeServer.git

REM Clone GeoCoins if missing
if not exist "%GEOCOINS_PATH%" (
    echo GeoCoins not found. Cloning from GitHub...
    cd /d "%PROJECTS_ROOT%"
    git clone %GEOCOINS_REPO%
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to clone GeoCoins!
        echo Make sure Git is installed and you have internet connection.
        pause
        exit /b 1
    )
    echo.
)

REM Clone kzzNodeServer if missing
if not exist "%KZZ_PATH%" (
    echo kzzNodeServer not found. Cloning from GitHub...
    cd /d "%PROJECTS_ROOT%"
    git clone %KZZ_REPO%
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to clone kzzNodeServer!
        pause
        exit /b 1
    )
    echo.
)

echo Projects:
echo   GeoCoins: %GEOCOINS_PATH%
echo   kzzNodeServer: %KZZ_PATH%
echo.

REM Update both repos
echo Updating GeoCoins...
cd /d "%GEOCOINS_PATH%"
git pull 2>nul

echo Updating kzzNodeServer...
cd /d "%KZZ_PATH%"
git pull 2>nul

echo.
echo ========================================
echo Starting Development Environment...
echo ========================================
echo.

REM Start the app - use absolute path
set START_SCRIPT=%GEOCOINS_PATH%\docker\scripts\dev\start-dev-windows.bat

if not exist "%START_SCRIPT%" (
    echo ERROR: Cannot find start-dev-windows.bat at:
    echo %START_SCRIPT%
    echo.
    echo GeoCoins path: %GEOCOINS_PATH%
    pause
    exit /b 1
)

cd /d "%GEOCOINS_PATH%\docker\scripts\dev"
call "%START_SCRIPT%"

