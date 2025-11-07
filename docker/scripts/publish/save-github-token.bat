@echo off
REM Save GitHub token for Docker authentication

echo ========================================
echo Save GitHub Token (One-Time Setup)
echo ========================================
echo.
echo This will save your GitHub Personal Access Token
echo so you don't have to enter it every time.
echo.

REM Create token file location
set TOKEN_FILE=%USERPROFILE%\.github-docker-token

echo To create a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Select: write:packages, read:packages
echo 4. Click "Generate token"
echo 5. Copy the token
echo.
echo Opening GitHub token page in browser...
timeout /t 3 /nobreak >nul
start https://github.com/settings/tokens/new

echo.
set /p TOKEN="Paste your GitHub token here: "

if "%TOKEN%"=="" (
    echo No token entered!
    pause
    exit /b 1
)

REM Save token to file
echo %TOKEN%> "%TOKEN_FILE%"

REM Login using saved token
type "%TOKEN_FILE%" | docker login ghcr.io -u kamenj --password-stdin

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Token Saved and Login Successful!
    echo ========================================
    echo.
    echo Token saved to: %TOKEN_FILE%
    echo You won't need to enter it again.
    echo.
) else (
    echo.
    echo Login failed! Check if token is valid.
    del "%TOKEN_FILE%" 2>nul
    echo.
)

pause
