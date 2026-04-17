@echo off
REM GGS Boys Backend - Quick Start Script for Windows

echo.
echo 🚀 GGS Boys Backend - Quick Start
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm version: %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo.
    echo ⚠️  .env file not found!
    echo    Creating .env from .env.example...
    copy .env.example .env >nul
    echo.
    echo 📝 Please edit .env and add your API credentials:
    echo    - AMAZON_API_KEY
    echo    - AMAZON_API_SECRET
    echo    - AMAZON_ASSOCIATE_TAG
    echo    - FLIPKART_API_KEY
    echo    - FLIPKART_AFFILIATE_ID
    echo.
)

REM Create data directory if it doesn't exist
if not exist data (
    echo 📁 Creating data directory...
    mkdir data
)

REM Create products.json if it doesn't exist
if not exist data\products.json (
    echo ⚠️  products.json not found!
    echo    Will be created when server starts...
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting server...
echo    Available at: http://localhost:5000
echo    API Base: http://localhost:5000/api
echo.
echo 📊 Available Endpoints:
echo    GET  /api/products              - Get all products
echo    GET  /api/products/:id          - Get single product
echo    GET  /api/redirect/:id          - Redirect to cheapest
echo    GET  /api/price-history/:id     - Get price history
echo.
echo 💡 Tips:
echo    - Press Ctrl+C to stop the server
echo    - Edit .env to change configuration
echo    - Check console for error messages
echo.
echo    Opening http://localhost:5000 in browser...
timeout /t 2 /nobreak

REM Start the server
call npm run dev
pause
