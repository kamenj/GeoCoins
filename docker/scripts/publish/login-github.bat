@echo off
REM Easy GitHub Container Registry Login using GitHub CLI

echo ========================================
echo GitHub Container Registry - Easy Login
echo ========================================
echo.

REM Check if GitHub CLI is installed
where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo GitHub CLI is not installed.
    echo.
    echo Installing GitHub CLI...
    echo.
    echo Option 1: Using winget (Windows 11/10)
    echo   winget install --id GitHub.cli
    echo.
    echo Option 2: Download manually
    echo   https://cli.github.com/
    echo.
    pause
    exit /b 1
)

echo Authenticating with GitHub...
gh auth login

echo.
echo Logging into GitHub Container Registry...
gh auth token | docker login ghcr.io -u kamenj --password-stdin

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Login Successful!
    echo ========================================
    echo.
    echo You can now run publish.bat
    echo.
) else (
    echo.
    echo Login failed! Please try again.
    echo.
)

pause
