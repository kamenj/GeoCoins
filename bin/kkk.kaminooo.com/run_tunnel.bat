@echo off
REM Start Cloudflare Tunnel using only tunnel ID and config file

set TUNNEL_ID=b75605a4-4c9f-442e-ade7-d582a9b3f5e1
set CONFIG_PATH=.\kkk.yml

echo Starting tunnel ID: %TUNNEL_ID%
rem cloudflared tunnel --config "%CONFIG_PATH%" run %TUNNEL_ID%
rem cloudflared tunnel  --no-autoupdate --origincert ".\cert.pem" --credentials-file ".\b75605a4-4c9f-442e-ade7-d582a9b3f5e1.json"
cloudflared tunnel ^
  --no-autoupdate ^
  --origincert ".\cert.pem" ^
  --credentials-file ".\%TUNNEL_ID%.json" ^
  --config "%CONFIG_PATH%"  ^
  run %TUNNEL_ID%