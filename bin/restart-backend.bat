@echo off
REM Restart the backend server to apply CORS configuration changes

echo ========================================
echo Restarting Backend Server
echo ========================================
echo.

REM Kill any Node.js process running on port 3000
echo Stopping any existing backend server...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

REM Wait a moment
timeout /t 2 /nobreak >nul

echo.
echo Starting backend server with updated CORS configuration...
echo.

REM Start the backend server
cd /d "c:\my.desktop\projects\.mind.maps\main\software\kzz\kzzNodeServer\bin"
call start-server.bat

echo.
echo ========================================
echo Backend server should now be starting
echo Check the new terminal window for logs
echo ========================================
pause
