@echo off
REM Stop Website Script for Egypt Express TVL
REM This script stops all PM2 processes

echo 🛑 Stopping Egypt Express TVL website...

REM Stop all PM2 processes
pm2 stop all

if %errorlevel% equ 0 (
    echo ✅ Website stopped successfully!
    echo.
    echo 📊 Current PM2 Status:
    pm2 status
) else (
    echo ❌ Failed to stop website!
    echo.
    echo 🔍 Checking if any processes are still running...
    pm2 status
)

echo.
echo 💡 To start the website again, use:
echo    start-dev.bat     - Start in development mode
echo    start-prod.bat    - Start in production mode
echo.
pause 