@echo off
REM Modbus Studio - Windows Startup Script

echo ============================================================
echo            🚀 Modbus Studio Launcher 🚀
echo ============================================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed!
    echo Please install Python 3.8 or higher from python.org
    pause
    exit /b 1
)

echo ✓ Python found
python --version
echo.

REM Check dependencies
echo 📦 Checking dependencies...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Flask not found. Installing dependencies...
    pip install -r requirements.txt
) else (
    echo ✓ All dependencies installed
)

echo.
echo ============================================================
echo 🚀 Starting Modbus Studio Backend Server...
echo ============================================================
echo.
echo 📡 Server will start on: http://127.0.0.1:5000
echo 🌐 Open your browser to:  http://127.0.0.1:5000
echo.
echo Press Ctrl+C to stop the server
echo.

python modbus_server.py

pause
