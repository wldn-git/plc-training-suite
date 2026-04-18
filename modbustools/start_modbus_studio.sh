#!/bin/bash

# Modbus Studio - Easy Startup Script
# This script starts the Modbus Studio application

echo "============================================================"
echo "           🚀 Modbus Studio Launcher 🚀"
echo "============================================================"
echo ""

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed!"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

# Check dependencies
echo ""
echo "📦 Checking dependencies..."

if ! python3 -c "import flask" 2>/dev/null; then
    echo "⚠️  Flask not found. Installing dependencies..."
    pip install -r requirements.txt --break-system-packages
else
    echo "✓ All dependencies installed"
fi

# Start server
echo ""
echo "============================================================"
echo "🚀 Starting Modbus Studio Backend Server..."
echo "============================================================"
echo ""
echo "📡 Server will start on: http://127.0.0.1:5000"
echo "🌐 Open your browser to:  http://127.0.0.1:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 modbus_server.py
