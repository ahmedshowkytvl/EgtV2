@echo off
REM Start Website in Development Mode
REM This script starts the Egypt Express TVL website in development mode

echo 🚀 Starting Egypt Express TVL website in DEVELOPMENT mode...

REM Stop any existing processes first
echo 🛑 Stopping any existing processes...
pm2 stop all >nul 2>&1
pm2 delete all >nul 2>&1

REM Wait a moment for processes to stop
timeout /t 2 /nobreak >nul

REM Start in development mode
echo 🔧 Starting development server...
pm2 start ecosystem.config.cjs --only egypt-express-tvl-dev

if %errorlevel% equ 0 (
    echo ✅ Website started successfully in DEVELOPMENT mode!
    echo.
    echo 📊 PM2 Status:
    pm2 status
    echo.
    echo 🌍 Your website is available at: http://localhost:8080
    echo 🔧 Development mode with hot reload enabled
    echo.
    echo 📝 Useful commands:
    echo   pm2 logs egypt-express-tvl-dev    - View logs
    echo   pm2 restart egypt-express-tvl-dev - Restart after code changes
    echo   stop-website.bat                  - Stop the website
) else (
    echo ❌ Failed to start website in development mode!
    echo.
    echo 🔍 Checking for errors...
    pm2 logs --lines 10
)

echo.
pause 