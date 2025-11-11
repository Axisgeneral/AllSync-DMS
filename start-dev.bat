@echo off
echo ========================================
echo Starting AllSync DMS Development Server
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo ========================================
echo.

cd "%~dp0"
npm run dev
