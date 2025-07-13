@echo off
REM Start Website in Production Mode
REM This script starts the Egypt Express TVL website in production mode

echo 🚀 Starting Egypt Express TVL website in PRODUCTION mode...

REM Stop any existing processes first
echo 🛑 Stopping any existing processes...
pm2 stop all >nul 2>&1
pm2 delete all >nul 2>&1

REM Wait a moment for processes to stop
timeout /t 2 /nobreak >nul

REM Build the application first
echo 🔨 Building the application...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed! Please check the build errors.
    pause
    exit /b 1
)

echo ✅ Build successful!

REM Start in production mode
echo 🏭 Starting production server...
pm2 start ecosystem.config.cjs --only egypt-express-tvl --env production

if %errorlevel% equ 0 (
    echo ✅ Website started successfully in PRODUCTION mode!
    echo.
    echo 📊 PM2 Status:
    pm2 status
    echo.
    echo 🌍 Your website is available at: http://localhost:8080
    echo 🏭 Production mode with optimized build
    echo.
    echo 📝 Useful commands:
    echo   pm2 logs egypt-express-tvl       - View logs
    echo   pm2 restart egypt-express-tvl    - Restart the application
    echo   pm2 monit                        - Monitor performance
    echo   stop-website.bat                 - Stop the website
) else (
    echo ❌ Failed to start website in production mode!
    echo.
    echo 🔍 Checking for errors...
    pm2 logs --lines 10
)

echo.
pause 