@echo off
REM GGS Food Services - Automatic Startup Script for Windows
echo.
echo ======================================
echo   GGS Food Services - Starting
echo ======================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Run the startup script
node start-app.js

pause
