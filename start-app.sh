#!/bin/bash

# GGS Food Services - Automatic Startup Script for Mac/Linux

echo ""
echo "======================================"
echo "   GGS Food Services - Starting"
echo "======================================"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Run the startup script
node start-app.js
