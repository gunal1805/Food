#!/bin/bash

# ============================================
# GGS Food Services - Heroku Quick Deploy
# ============================================

echo ""
echo "🚀 GGS Food Services - Heroku Deployment"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "📥 Download from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "✅ Prerequisites checked"
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "📂 Initializing Git repository..."
    git init
    git add .
    git commit -m "GGS Food Services - Initial deployment"
fi

# Login to Heroku
echo "🔐 Logging in to Heroku..."
heroku login

# Get app name
read -p "Enter your Heroku app name (or leave blank to create new): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "📝 Creating new Heroku app..."
    heroku create
    APP_NAME=$(heroku apps:info --shell | grep "^name=" | cut -d= -f2)
else
    echo "✅ Using existing app: $APP_NAME"
fi

# Deploy
echo ""
echo "🚀 Deploying to Heroku..."
echo ""

BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push heroku $BRANCH:main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌍 Your website is live at:"
    echo "   https://$APP_NAME.herokuapp.com"
    echo ""
    echo "📱 Opening in browser..."
    heroku open
else
    echo ""
    echo "❌ Deployment failed. Check error messages above."
    echo ""
    echo "📋 View logs:"
    echo "   heroku logs --tail"
    exit 1
fi

echo ""
echo "✨ Done! Your GGS Food Services is now online!"
echo ""
