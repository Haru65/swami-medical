#!/bin/bash

echo "🏥 Swami Medical Store - Quick Start Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "📝 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure .env.local exists with VITE_API_URL setting"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "📖 For more information, see README.md"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
