@echo off
echo Installing and Setting up MongoDB for WMH Platform...
echo =====================================================

echo.
echo 📥 Step 1: Download MongoDB Community Server
echo.
echo Please follow these steps:
echo 1. Go to: https://www.mongodb.com/try/download/community
echo 2. Select "Windows" and "msi" package
echo 3. Download and run the installer
echo 4. Choose "Complete" installation
echo 5. Install MongoDB as a Service (recommended)
echo 6. Install MongoDB Compass (optional GUI)
echo.
echo Press any key when MongoDB installation is complete...
pause

echo.
echo 📁 Step 2: Creating MongoDB data directory...
if not exist "C:\data\db" (
    mkdir "C:\data\db"
    echo ✅ Created C:\data\db directory
) else (
    echo ✅ C:\data\db directory already exists
)

echo.
echo 🚀 Step 3: Starting MongoDB service...
net start MongoDB
if %errorlevel% equ 0 (
    echo ✅ MongoDB service started successfully
) else (
    echo ⚠️  MongoDB service might already be running or needs manual start
    echo    You can start it manually with: net start MongoDB
)

echo.
echo 🧪 Step 4: Testing MongoDB connection...
cd backend
call npm run test-db

echo.
echo 🗄️ Step 5: Setting up database...
call npm run setup-db

echo.
echo ✅ MongoDB Setup Complete!
echo =========================
echo.
echo 🔗 MongoDB is now running locally on: mongodb://localhost:27017
echo 📊 You can access MongoDB with:
echo    • MongoDB Compass (if installed)
echo    • Command line: mongo
echo.
echo 🚀 Next steps:
echo    1. Start the backend: npm run dev
echo    2. Start the frontend: cd ../project && npm run dev
echo    3. Access the platform: http://localhost:5173
echo.
echo 🔐 Admin Login:
echo    Email: admin@wmh-platform.com
echo    Password: admin123
echo.
pause
