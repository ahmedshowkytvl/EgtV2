@echo off
REM Website Status Script for Egypt Express TVL
REM This script shows the current status of the website

echo 📊 Egypt Express TVL Website Status
echo ====================================

echo.
echo 🔍 PM2 Status:
pm2 status

echo.
echo 📝 Recent Logs (last 5 lines):
pm2 logs --lines 5

echo.
echo 🌐 Website URLs:
echo    Main Site: http://localhost:8080
echo    Admin Panel: http://localhost:8080/admin-test

echo.
echo 💡 Available Commands:
echo    start-dev.bat     - Start in development mode
echo    start-prod.bat    - Start in production mode
echo    stop-website.bat  - Stop the website
echo    status.bat        - Show this status (current script)

echo.
pause 