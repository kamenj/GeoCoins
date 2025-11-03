@echo off
REM Start a simple Node.js web server on port 8081
REM Serves the GeoCoins v5 folder

REM Start the kzzNodeServer backend in a separate terminal
start "kzzNodeServer" cmd /c "cd /d "c:\my.desktop\projects\.mind.maps\main\software\kzz\kzzNodeServer\bin" && start-server.bat"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Start the server in background and wait for it to be ready, then open Chrome
start "GeoCoins WebServer (Port 8081)" cmd /c "node "%~dp0webserver.js" 8081"

REM Wait 2 seconds for server to start, then open Chrome
timeout /t 2 /nobreak >nul
start chrome http://localhost:8081
