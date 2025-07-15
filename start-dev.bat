@echo off
echo Starting Women's Mental Health & Wellness Platform...
echo.

echo Starting MongoDB (if not already running)...
start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
timeout /t 3

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 5

echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd project && npm run dev"

echo.
echo All services are starting up...
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause
