@echo off
setlocal
set ROOT=%~dp0
echo Starting local server on 127.0.0.1:4000 ...
start "MyApp Server" cmd /c ""%ROOT%start.cmd""
timeout /t 2 >nul
echo Opening public tunnel (Cloudflare) ...
"%ROOT%tools\node\node.exe" "%ROOT%tools\run-public-tunnel.js"
endlocal

