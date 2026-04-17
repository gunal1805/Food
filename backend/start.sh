#!/bin/bash

# GGS Boys Backend - Quick Start Script
# This script sets up and starts the backend server

echo "🚀 GGS Boys Backend - Quick Start"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed!"
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install or update dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]
then
    echo ""
    echo "⚠️  .env file not found!"
    echo "   Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and add your API credentials:"
    echo "   - AMAZON_API_KEY"
    echo "   - AMAZON_API_SECRET"
    echo "   - AMAZON_ASSOCIATE_TAG"
    echo "   - FLIPKART_API_KEY"
    echo "   - FLIPKART_AFFILIATE_ID"
    echo ""
fi

# Create data directory if it doesn't exist
if [ ! -d "data" ]
then
    echo "📁 Creating data directory..."
    mkdir -p data
fi

# Check if products.json exists
if [ ! -f "data/products.json" ]
then
    echo "⚠️  products.json not found!"
    echo "   Creating from template..."
    cp data/products.json.example data/products.json 2>/dev/null || echo "[]" > data/products.json
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting server..."
echo "   Available at: http://localhost:5000"
echo "   API Base: http://localhost:5000/api"
echo ""
echo "📊 Available Endpoints:"
echo "   GET  /api/products              - Get all products"
echo "   GET  /api/products/:id          - Get single product"
echo "   GET  /api/redirect/:id          - Redirect to cheapest"
echo "   GET  /api/price-history/:id     - Get price history"
echo ""
echo "💡 Tips:"
echo "   - Press Ctrl+C to stop the server"
echo "   - Edit .env to change configuration"
echo "   - Check logs for error messages"
echo ""

# Start the server
npm run dev
