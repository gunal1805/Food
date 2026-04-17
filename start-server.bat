@echo off
REM Food Price Comparison - Quick Start Script for Windows

echo.
echo ========================================
echo Food Price Comparison - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

REM Navigate to backend directory
echo [STEP 1] Installing dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Check for .env file
echo [STEP 2] Checking environment configuration...
if not exist .env (
    echo [NOTICE] No .env file found
    echo Creating from template...
    copy .env.example .env
    echo.
    echo [NOTICE] Edit backend\.env to add API keys (optional for testing)
)
echo.

REM Start the backend server
echo [STEP 3] Starting backend server...
echo.
echo Server will run on: http://localhost:5000
echo.
echo To use the frontend:
echo   - Open food-compare.html in your browser
echo   OR
echo   - Start a local web server and visit http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
