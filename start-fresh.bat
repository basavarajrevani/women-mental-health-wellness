@echo off
echo Starting Women's Mental Health Platform...
echo Clean development startup
echo.

echo Clearing frontend cache...
cd project
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
cd ..

echo Starting MongoDB (if not already running)...
start "MongoDB" cmd /k "mongod --dbpath C:\data\db"
timeout /t 3

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 5

echo Starting Frontend...
start "Frontend" cmd /k "cd project && npm run dev"

echo.
echo ✅ All services starting...
echo 🔗 Backend API: http://localhost:5000
echo 🌐 Frontend: http://localhost:5173
echo.
echo 💡 Platform Features:
echo - Complete user authentication and profiles
echo - Community posts and support groups
echo - Events and mental health resources
echo - Admin dashboard and content management
echo.
echo Press any key to exit...
pause
