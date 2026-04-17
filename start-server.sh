#!/bin/bash
# Food Price Comparison - Quick Start Script for Mac/Linux

echo ""
echo "========================================"
echo "Food Price Comparison - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Then run this script again."
    exit 1
fi

echo "[OK] Node.js is installed"
node --version
npm --version
echo ""

# Navigate to backend directory
echo "[STEP 1] Installing dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        exit 1
    fi
else
    echo "[OK] Dependencies already installed"
fi
echo ""

# Check for .env file
echo "[STEP 2] Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo "[NOTICE] No .env file found"
    echo "Creating from template..."
    cp .env.example .env
    echo ""
    echo "[NOTICE] Edit backend/.env to add API keys (optional for testing)"
fi
echo ""

# Start the backend server
echo "[STEP 3] Starting backend server..."
echo ""
echo "Server will run on: http://localhost:5000"
echo ""
echo "To use the frontend:"
echo "   - Open food-compare.html in your browser"
echo "   OR"
echo "   - Start a local web server and visit http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
