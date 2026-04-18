@echo off
setlocal
set ROOT=%~dp0

echo ============================================
echo My Second Brain - Public launch
echo ============================================
echo.

if not exist "%ROOT%node_modules" (
  echo Dependencies not found, running install.cmd first...
  call "%ROOT%install.cmd"
  if errorlevel 1 (
    echo Install failed. Please run install.cmd manually.
    exit /b 1
  )
)

echo Starting public mode...
echo Keep this window open while website is online.
echo Public link will appear below.
echo.
call "%ROOT%start-public.cmd"

endlocal
