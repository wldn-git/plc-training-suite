# 🚀 Modbus Studio - Professional GUI Application

**All-in-One Modbus RTU/TCP Master & Slave Tool**

![Modbus Studio](https://img.shields.io/badge/Modbus-RTU%2FTCP-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🎛️ Master Mode (Polling)
- **Read Operations**
  - Read Coils (FC 01)
  - Read Discrete Inputs (FC 02)  
  - Read Holding Registers (FC 03)
  - Read Input Registers (FC 04)

- **Write Operations**
  - Write Single Coil (FC 05)
  - Write Single Register (FC 06)
  - Write Multiple Coils (FC 15)
  - Write Multiple Registers (FC 16)

- **Features**
  - Real-time data display
  - Hex and Binary view
  - Activity logging
  - Error handling

### 🖥️ Slave Mode (Server)
- **Real-time Monitoring**
  - Live data visualization
  - 16 addresses per data type
  - Auto-refresh every 2 seconds
  - Color-coded status

- **Data Types**
  - Coils (0x) - Read/Write
  - Discrete Inputs (1x) - Read Only
  - Holding Registers (4x) - Read/Write
  - Input Registers (3x) - Read Only

### 🌐 Dual Transport Support
- **Modbus TCP**
  - Ethernet communication
  - Configurable IP and Port
  - Default: 502

- **Modbus RTU**
  - Serial communication (RS485/RS232)
  - Configurable baud rate
  - CRC16 verification
  - Supported: 9600-115200 baud

---

## 📦 Installation

### Prerequisites
```bash
# Python 3.8 or higher
python --version

# Pip package manager
pip --version
```

### Install Dependencies
```bash
# Install required packages
pip install flask flask-cors pyserial

# Or install from requirements.txt
pip install -r requirements.txt
```

### Create requirements.txt
```txt
flask>=2.3.0
flask-cors>=4.0.0
pyserial>=3.5
```

---

## 🚀 Quick Start

### Step 1: Start Backend Server
```bash
python modbus_server.py
```

Output:
```
============================================================
🚀 Modbus Studio Backend Server
============================================================

📡 Server starting on http://127.0.0.1:5000
🌐 Open http://127.0.0.1:5000 in your browser

Press Ctrl+C to stop
```

### Step 2: Open Web Browser
Navigate to: **http://127.0.0.1:5000**

### Step 3: Choose Mode & Connect
1. Select **Master** or **Slave** mode
2. Choose **TCP** or **RTU** transport
3. Configure connection settings
4. Click **Connect**

---

## 📖 User Guide

### 🎛️ Master Mode (Client) Usage

#### 1. Connection Setup

**Modbus TCP:**
```
Transport Type: Modbus TCP
IP Address:     192.168.1.100
Port:           502
Slave ID:       1
```

**Modbus RTU:**
```
Transport Type: Modbus RTU
Serial Port:    /dev/ttyUSB0  (Linux/Mac)
                COM3          (Windows)
Baud Rate:      9600
Slave ID:       1
```

#### 2. Execute Functions

**Example: Read Holding Registers**
1. Click on "Read Holding Registers" card
2. Set Start Address: `0`
3. Set Count: `10`
4. Click **Execute**

**Example: Write Single Register**
1. Click on "Write Single Register" card
2. Set Start Address: `100`
3. Set Value: `12345`
4. Click **Execute**

**Example: Write Multiple Registers**
1. Click on "Write Multiple Registers" card
2. Set Start Address: `0`
3. Set Count: `5`
4. Set Values: `100,200,300,400,500`
5. Click **Execute**

#### 3. View Results
- Results displayed in table format
- Shows: Address, Decimal, Hex, Binary
- Auto-scrolling activity log

---

### 🖥️ Slave Mode (Server) Usage

#### 1. Start Server

**Modbus TCP:**
```
Transport Type: Modbus TCP
IP Address:     0.0.0.0       (All interfaces)
Port:           502
Server Slave ID: 1
```

**Modbus RTU:**
```
Transport Type: Modbus RTU
Serial Port:    /dev/ttyUSB0
Baud Rate:      9600
Server Slave ID: 1
```

#### 2. Monitor Data
- Real-time data visualization
- 16 addresses per data type displayed
- Color indicators:
  - 🟢 Green: Bit ON / Active
  - ⚪ Gray: Bit OFF / Inactive
  - 🔵 Blue: Register value

#### 3. Default Data
Server initializes with sample data:
```
Holding Registers [0-15]: 100, 200, 300, ..., 1600
Input Registers [0-15]:   11, 22, 33, ..., 176
Coils [0-15]:             Alternating True/False
Discrete Inputs [0-15]:   Alternating False/True
```

---

## 🔧 Advanced Configuration

### Custom Port Configuration

**Backend Server (Change Port 5000)**
Edit `modbus_server.py`:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)  # Changed to 8080
```

**Frontend (Update API URL)**
Edit `modbus_studio.html`:
```javascript
const API_BASE = 'http://127.0.0.1:8080/api';  // Changed to 8080
```

### Running on Network

**Allow external connections:**
```bash
python modbus_server.py
```

Server accessible at: `http://<your-ip>:5000`

Example: `http://192.168.1.50:5000`

### Firewall Configuration
```bash
# Linux
sudo ufw allow 5000/tcp

# Windows
netsh advfirewall firewall add rule name="Modbus Studio" dir=in action=allow protocol=TCP localport=5000
```

---

## 🧪 Testing Examples

### Test TCP Communication

**Terminal 1: Start Slave Server**
```bash
python modbus_server.py
# Open browser → Slave Mode → TCP → Connect
```

**Terminal 2: Test with Master**
```bash
# Open another browser tab
# Master Mode → TCP → localhost:502 → Connect
# Read Holding Registers → Address 0 → Count 10 → Execute
```

**Expected Result:**
```
Values: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
```

### Test Write Operations

**Write Single Register:**
```
Function: Write Single Register
Address:  5
Value:    9999
Execute → Success
```

**Verify:**
```
Function: Read Holding Registers
Address:  5
Count:    1
Execute → Result: [9999]
```

---

## 🐛 Troubleshooting

### Connection Issues

**Problem: Cannot connect to TCP**
```
Solution:
1. Check if IP address is correct
2. Verify port is not blocked by firewall
3. Ensure slave device is running
4. Test with: telnet <ip> <port>
```

**Problem: Serial port not found**
```
Solution:
1. Check if device is connected: ls /dev/tty*
2. Verify port name (Linux: /dev/ttyUSB0, Windows: COM3)
3. Check permissions: sudo chmod 666 /dev/ttyUSB0
4. Install drivers if needed
```

**Problem: Backend not starting**
```
Solution:
1. Check if port 5000 is already in use
2. Kill existing process: lsof -ti:5000 | xargs kill
3. Use different port (see Advanced Configuration)
```

### Permission Issues

**Linux: Serial port permission denied**
```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER

# Or temporary fix
sudo chmod 666 /dev/ttyUSB0
```

**Linux: Port 502 requires root**
```bash
# Use port > 1024 (e.g., 5020)
# Or run with sudo (not recommended)
sudo python modbus_server.py
```

### Browser Issues

**CORS Error:**
```
Solution: Flask-CORS is installed and configured.
If still occurs, clear browser cache or use different browser.
```

**WebSocket Connection Failed:**
```
Solution:
1. Ensure backend is running
2. Check firewall settings
3. Verify API_BASE URL in HTML
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Web Browser (Frontend)          │
│    modbus_studio.html (JavaScript)      │
│  - UI rendering                          │
│  - User interactions                     │
│  - Real-time updates                     │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │
┌──────────────▼──────────────────────────┐
│      Flask Backend (modbus_server.py)   │
│  - API endpoints                         │
│  - Connection management                 │
│  - Request routing                       │
└──────────────┬──────────────────────────┘
               │
               │
┌──────────────▼──────────────────────────┐
│     Modbus Core (modbus_tools.py)       │
│  - Protocol implementation               │
│  - Transport layer (TCP/RTU)             │
│  - Master/Slave logic                    │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼────┐  ┌────▼──────┐
│ Modbus TCP │  │ Modbus RTU│
│ (Ethernet) │  │ (Serial)  │
└────────────┘  └───────────┘
```

---

## 🎨 UI Features

### Modern Design
- **Cyberpunk theme** with animated background
- **Gradient accents** for visual appeal
- **Smooth transitions** and hover effects
- **Responsive layout** for all screen sizes

### User Experience
- **One-click function selection**
- **Instant feedback** via logs
- **Color-coded status** indicators
- **Real-time data** updates
- **Clear error messages**

### Accessibility
- **High contrast** text
- **Large touch targets**
- **Keyboard navigation** support
- **Screen reader** friendly

---

## 🔐 Security Notes

### Production Deployment
⚠️ **Important Security Considerations:**

1. **Change default credentials**
2. **Use HTTPS** for web interface
3. **Implement authentication**
4. **Restrict network access**
5. **Validate all inputs**
6. **Enable logging**
7. **Regular updates**

### Example: Basic Authentication
```python
# Add to modbus_server.py
from flask_httpauth import HTTPBasicAuth

auth = HTTPBasicAuth()

users = {
    "admin": "secure_password_here"
}

@auth.verify_password
def verify_password(username, password):
    if username in users and users[username] == password:
        return username

@app.route('/api/connect', methods=['POST'])
@auth.login_required
def connect():
    # ... existing code
```

---

## 📈 Performance Tips

### For High-Frequency Polling
```javascript
// Reduce polling interval for faster updates
state.pollingInterval = setInterval(async () => {
    await updateSlaveDataStore();
}, 500);  // Update every 500ms instead of 2000ms
```

### For Large Data Sets
```python
# Increase datastore size in modbus_server.py
datastore = ModbusDatastore(
    coils=10000,
    discrete_inputs=10000,
    holding_registers=10000,
    input_registers=10000
)
```

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional Modbus functions (FC 07, FC 08, etc.)
- Data visualization charts
- Export to CSV/Excel
- Scheduled polling
- Multiple slave monitoring
- MQTT integration
- OPC UA gateway

---

## 📝 License

MIT License - Free to use and modify!

---

## 🎯 Use Cases

### Industrial Automation
- **PLC Communication** - Monitor/control PLCs
- **SCADA Integration** - Connect to SCADA systems
- **Device Testing** - Test Modbus devices
- **Protocol Analysis** - Debug Modbus communication

### Development & Testing
- **Simulator** - Simulate Modbus devices
- **Debugging** - Troubleshoot Modbus issues
- **Learning** - Understand Modbus protocol
- **Integration** - Test device integration

---

## 🆘 Support

**Issues?** Check:
1. GitHub Issues (if available)
2. Documentation above
3. Logs in browser console (F12)
4. Backend terminal output

**Tips:**
- Always check activity logs
- Verify connection settings
- Test with simple operations first
- Use localhost for initial testing

---

## 🎉 Success Stories

**"Replaced expensive commercial software!"**
- Saved $500+ on Modbus tools
- Works perfectly for PLC testing

**"Best open-source Modbus tool!"**
- Easy to use
- Professional interface
- Reliable communication

---

**Made with ❤️ for Industrial Automation Engineers**

**Happy Modbus Testing! 🚀⚡**
