@echo off
REM ============================================
REM GGS Food Services - Heroku Quick Deploy
REM ============================================

cls
echo.
echo.    GGS Food Services - Heroku Deployment
echo.    ========================================
echo.
pause

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed.
    echo Download from: https://git-scm.com/
    pause
    exit /b 1
)

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Heroku CLI is not installed.
    echo Download from: https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

echo ✅ Prerequisites checked
echo.

REM Initialize git if not already
if not exist ".git" (
    echo 📂 Initializing Git repository...
    call git init
    call git add .
    call git commit -m "GGS Food Services - Initial deployment"
    echo.
)

REM Login to Heroku
echo 🔐 Logging in to Heroku...
call heroku login

REM Get app name
set /p APP_NAME="Enter your Heroku app name (or press Enter to create new): "

if "%APP_NAME%"=="" (
    echo 📝 Creating new Heroku app...
    call heroku create
    echo.
    echo ✅ App created! Check the URL above.
    echo.
) else (
    echo ✅ Using existing app: %APP_NAME%
    echo.
)

REM Deploy
echo 🚀 Deploying to Heroku...
echo.

call git push heroku master

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 🌍 Your website is live!
    echo.
    echo 📱 Opening in browser...
    call heroku open
) else (
    echo.
    echo ❌ Deployment failed.
    echo.
    echo 📋 View logs:
    echo    heroku logs --tail
    echo.
)

echo.
echo ✨ Done! 
echo.
pause
