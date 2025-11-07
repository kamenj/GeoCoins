@echo off
REM Test Cloudflare Tunnel container in isolation
REM This verifies the tunnel can connect to Cloudflare successfully

echo ========================================
echo Testing Cloudflare Tunnel Container
echo ========================================
echo.
echo This will start ONLY the tunnel container.
echo You should see "Connection registered" messages.
echo.
echo Press Ctrl+C to stop the test.
echo.
echo ========================================
echo.

cd /d "%~dp0"

docker run --rm -it ^
  -v "%~dp0..\bin\kkk.kaminooo.com\kkk-docker.yml:/etc/cloudflared/config.yml:ro" ^
  -v "%~dp0..\bin\kkk.kaminooo.com\b75605a4-4c9f-442e-ade7-d582a9b3f5e1.json:/etc/cloudflared/credentials.json:ro" ^
  -v "%~dp0..\bin\kkk.kaminooo.com\cert.pem:/etc/cloudflared/cert.pem:ro" ^
  cloudflare/cloudflared:latest ^
  tunnel --no-autoupdate run

echo.
echo ========================================
echo Tunnel test stopped
echo ========================================
echo.

pause
