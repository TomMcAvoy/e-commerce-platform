@echo off
REM WhiteStartups - Shopping Online Platform Startup Script (Windows)
REM Generic startup script for Windows developers
REM Author: GitHub Copilot
REM Date: July 21, 2025

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=WhiteStartups Shopping Platform
set BACKEND_PORT=3000
set FRONTEND_PORT=3001
set MONGODB_DEFAULT_URI=mongodb://localhost:27017/whitestartups-shopping
set REDIS_DEFAULT_URL=redis://localhost:6379

REM Colors (basic Windows console colors)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set PURPLE=[95m
set CYAN=[96m
set WHITE=[97m
set NC=[0m

echo.
echo ============================================
echo   %PROJECT_NAME%
echo ============================================
echo.

REM Function to check if command exists
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ Node.js is not installed%NC%
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ npm is not installed%NC%
    echo npm should come with Node.js installation
    pause
    exit /b 1
)

echo %GREEN%✅ Node.js and npm found%NC%

REM Check if MongoDB is running
echo Checking MongoDB...
mongosh --eval "db.runCommand('ping')" --quiet >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✅ MongoDB is running%NC%
) else (
    echo %YELLOW%⚠️  MongoDB is not running or not installed%NC%
    echo The application will work with limited functionality
)

REM Check if Redis is running
echo Checking Redis...
redis-cli ping >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✅ Redis is running%NC%
) else (
    echo %YELLOW%⚠️  Redis is not running or not installed%NC%
    echo The application will work without caching
)

REM Setup environment file
echo.
echo Setting up environment...
if not exist .env (
    echo Creating .env file...
    (
        echo # Environment Configuration
        echo NODE_ENV=development
        echo PORT=%BACKEND_PORT%
        echo FRONTEND_URL=http://localhost:%FRONTEND_PORT%
        echo.
        echo # Database Configuration
        echo MONGODB_URI=%MONGODB_DEFAULT_URI%
        echo REDIS_URL=%REDIS_DEFAULT_URL%
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your-super-secret-jwt-key-replace-in-production
        echo JWT_EXPIRE=7d
        echo.
        echo # Email Configuration ^(Optional^)
        echo EMAIL_SERVICE=gmail
        echo EMAIL_FROM=noreply@whitestartups.com
        echo EMAIL_USER=your-email@gmail.com
        echo EMAIL_PASS=your-app-password
        echo.
        echo # Dropshipping API Keys ^(Optional^)
        echo PRINTFUL_API_KEY=your-printful-api-key
        echo SPOCKET_API_KEY=your-spocket-api-key
        echo.
        echo # Rate Limiting
        echo RATE_LIMIT_WINDOW=15
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo.
        echo # CORS Configuration
        echo CORS_ORIGIN=http://localhost:%FRONTEND_PORT%
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=10485760
        echo UPLOAD_PATH=./uploads
    ) > .env
    echo %GREEN%✅ Environment file created%NC%
) else (
    echo %GREEN%✅ Environment file already exists%NC%
)

REM Install dependencies
echo.
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo %RED%❌ Backend dependency installation failed%NC%
    pause
    exit /b 1
)
echo %GREEN%✅ Backend dependencies installed%NC%

if exist frontend\package.json (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo %RED%❌ Frontend dependency installation failed%NC%
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo %GREEN%✅ Frontend dependencies installed%NC%
)

REM Build the project
echo.
echo Building the project...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✅ Project built successfully%NC%
) else (
    echo %YELLOW%⚠️  Build failed, trying to continue...%NC%
)

REM Setup database
echo.
echo Setting up database...
call npm run seed >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✅ Database seeded successfully%NC%
) else (
    echo %YELLOW%⚠️  Database seeding failed or not available%NC%
)

REM Check if ports are available
netstat -an | find ":%BACKEND_PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠️  Port %BACKEND_PORT% is already in use%NC%
    echo Attempting to stop existing processes...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 >nul
)

netstat -an | find ":%FRONTEND_PORT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠️  Port %FRONTEND_PORT% is already in use%NC%
    echo Attempting to stop existing processes...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 >nul
)

REM Start the application
echo.
echo %GREEN%✅ Starting the application...%NC%
echo.
echo Backend will be available at: http://localhost:%BACKEND_PORT%
echo Frontend will be available at: http://localhost:%FRONTEND_PORT%
echo API Documentation: http://localhost:%BACKEND_PORT%/api/status
echo Debug Dashboard: http://localhost:%FRONTEND_PORT%/debug
echo.
echo %YELLOW%Press Ctrl+C to stop all servers%NC%
echo.

REM Try to start using the npm script
call npm run dev:all
if %errorlevel% neq 0 (
    echo %YELLOW%Trying alternative startup method...%NC%
    
    REM Start backend in background
    start "Backend Server" cmd /c "npm run dev:server"
    
    REM Start frontend if it exists
    if exist frontend\package.json (
        timeout /t 3 >nul
        cd frontend
        start "Frontend Server" cmd /c "npm run dev"
        cd ..
    )
    
    echo.
    echo %GREEN%✅ Servers started in separate windows%NC%
    echo Check the Backend Server and Frontend Server windows for logs
)

echo.
echo %GREEN%✅ Startup complete!%NC%
pause
