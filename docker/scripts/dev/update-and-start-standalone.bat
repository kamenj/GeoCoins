@echo off
REM Standalone GeoCoins Setup and Start
REM Run this from ANY empty folder - it will clone both repos and start everything

echo ========================================
echo GeoCoins - Standalone Setup and Start
echo ========================================
echo.

REM Use current directory as projects root
set PROJECTS_ROOT=%CD%
set GEOCOINS_PATH=%PROJECTS_ROOT%\GeoCoins
set KZZ_PATH=%PROJECTS_ROOT%\kzzNodeServer

REM GitHub URLs
set GEOCOINS_REPO=https://github.com/kamenj/GeoCoins.git
set KZZ_REPO=https://github.com/kamenj/kzzNodeServer.git

echo Projects will be installed in:
echo   %PROJECTS_ROOT%
echo.

REM Clone GeoCoins if missing
if not exist "%GEOCOINS_PATH%" (
    echo Cloning GeoCoins from GitHub...
    git clone %GEOCOINS_REPO%
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to clone GeoCoins!
        echo Make sure Git is installed and you have internet connection.
        pause
        exit /b 1
    )
    echo.
) else (
    echo GeoCoins already exists. Updating...
    cd /d "%GEOCOINS_PATH%"
    git pull
    cd /d "%PROJECTS_ROOT%"
    echo.
)

REM Clone kzzNodeServer if missing
if not exist "%KZZ_PATH%" (
    echo Cloning kzzNodeServer from GitHub...
    git clone %KZZ_REPO%
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to clone kzzNodeServer!
        pause
        exit /b 1
    )
    echo.
) else (
    echo kzzNodeServer already exists. Updating...
    cd /d "%KZZ_PATH%"
    git pull
    cd /d "%PROJECTS_ROOT%"
    echo.
)

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Projects installed:
echo   GeoCoins: %GEOCOINS_PATH%
echo   kzzNodeServer: %KZZ_PATH%
echo.
echo Starting development environment...
echo.

REM Start the app
cd /d "%GEOCOINS_PATH%\docker\scripts\dev"
call start-dev-windows.bat
