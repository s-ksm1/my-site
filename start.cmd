@echo off
setlocal
set ROOT=%~dp0
set ALLOW_LAN=false
"%ROOT%tools\node\node.exe" -e "if(!process.env.APP_ENCRYPTION_KEY){console.log('WARNING: APP_ENCRYPTION_KEY is not set. Data encryption at rest is disabled.');}"
"%ROOT%tools\node\node.exe" "%ROOT%server\index.js"
endlocal

