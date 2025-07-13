#!/bin/bash

# PM2 Setup Script for Egypt Express TVL
# This script helps set up and manage the application with PM2

echo "🚀 Setting up PM2 for Egypt Express TVL..."

# Check if PM2 is installed globally
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 globally..."
    npm install -g pm2
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Build the application for production
echo "🔨 Building the application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please check the build errors."
    exit 1
fi

# Start the application with PM2
echo "🚀 Starting the application with PM2..."
pm2 start ecosystem.config.cjs --env production

if [ $? -eq 0 ]; then
    echo "✅ Application started successfully!"
    echo ""
    echo "📊 PM2 Status:"
    pm2 status
    echo ""
    echo "📝 Useful PM2 commands:"
    echo "  pm2 logs                    - View logs"
    echo "  pm2 monit                   - Monitor processes"
    echo "  pm2 restart egypt-express-tvl - Restart the app"
    echo "  pm2 stop egypt-express-tvl   - Stop the app"
    echo "  pm2 delete egypt-express-tvl - Delete the app from PM2"
    echo ""
    echo "🌍 Your application should be running at: http://localhost:8080"
else
    echo "❌ Failed to start the application with PM2!"
    exit 1
fi 