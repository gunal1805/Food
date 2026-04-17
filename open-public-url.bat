@echo off
REM ============================================
REM GGS Food Services - Public Mobile URL
REM ============================================

title GGS Food Services - Public URL

cls
echo.
echo     GGS Food Services - Public Mobile Testing
echo     =========================================
echo.
echo     Your website will be publicly accessible!
echo.

REM Start server in background
echo Starting backend server...
cd backend
start cmd /k "&\"C:\Program Files\nodejs\node.exe\" server.js"

REM Wait 3 seconds for server to start
timeout /t 3 /nobreak >nul

REM Open ngrok tunnel
echo.
echo ============================================
echo 📱 PUBLIC URL FOR MOBILE
echo ============================================
echo.
echo Starting ngrok tunnel to create public URL...
echo.

ngrok http 5000

pause
