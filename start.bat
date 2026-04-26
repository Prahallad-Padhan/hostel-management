@echo off
echo Hostel Management System - Startup Script
echo.
echo Starting Backend Server...
start cmd /k "cd backend && npm install && npm run dev"

timeout /t 5 /nobreak

echo Starting Frontend Application...
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
pause
