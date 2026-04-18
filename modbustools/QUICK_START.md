# 🚀 Modbus Studio - Quick Start Guide

## ⚡ Super Cepat - 3 Langkah!

### Windows:
```
1. Double-click: start_modbus_studio.bat
2. Browser otomatis membuka http://127.0.0.1:5000
3. Pilih mode → Connect → Selesai!
```

### Linux/Mac:
```bash
1. ./start_modbus_studio.sh
2. Buka browser: http://127.0.0.1:5000
3. Pilih mode → Connect → Selesai!
```

---

## 📝 Cara Pakai - Mode Master (Polling)

### 1️⃣ Connect ke Device

**Modbus TCP:**
```
✓ Pilih mode: Master
✓ Transport: Modbus TCP
✓ IP Address: 192.168.1.100
✓ Port: 502
✓ Slave ID: 1
✓ Klik: Connect
```

**Modbus RTU:**
```
✓ Pilih mode: Master
✓ Transport: Modbus RTU
✓ Serial Port: COM3 (Windows) atau /dev/ttyUSB0 (Linux)
✓ Baud Rate: 9600
✓ Slave ID: 1
✓ Klik: Connect
```

### 2️⃣ Baca Data

**Contoh: Baca Register**
```
1. Klik card: "Read Holding Registers"
2. Start Address: 0
3. Count: 10
4. Klik: Execute
```

**Hasil ditampilkan dalam tabel:**
```
Address | Value | Hex      | Binary
--------|-------|----------|------------------
0       | 100   | 0x0064   | 0000000001100100
1       | 200   | 0x00C8   | 0000000011001000
...
```

### 3️⃣ Tulis Data

**Contoh: Tulis 1 Register**
```
1. Klik card: "Write Single Register"
2. Start Address: 100
3. Value: 12345
4. Klik: Execute
```

**Contoh: Tulis Banyak Register**
```
1. Klik card: "Write Multiple Registers"
2. Start Address: 0
3. Count: 5
4. Values: 100,200,300,400,500
5. Klik: Execute
```

---

## 🖥️ Cara Pakai - Mode Slave (Server)

### 1️⃣ Start Server

**Modbus TCP:**
```
✓ Pilih mode: Slave
✓ Transport: Modbus TCP
✓ IP: 0.0.0.0 (untuk accept semua koneksi)
✓ Port: 502
✓ Server Slave ID: 1
✓ Klik: Connect
```

**Modbus RTU:**
```
✓ Pilih mode: Slave
✓ Transport: Modbus RTU
✓ Serial Port: COM3 atau /dev/ttyUSB0
✓ Baud Rate: 9600
✓ Server Slave ID: 1
✓ Klik: Connect
```

### 2️⃣ Monitor Data

Server akan menampilkan 4 jenis data secara real-time:

```
📊 Coils (0x)              - Digital Output (Read/Write)
📊 Discrete Inputs (1x)    - Digital Input (Read Only)
📊 Holding Registers (4x)  - Analog Output (Read/Write)
📊 Input Registers (3x)    - Analog Input (Read Only)
```

**Setiap data menampilkan 16 address pertama:**
```
Address: 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
Value:   [nilai berubah secara real-time setiap 2 detik]
```

**Warna indikator:**
- 🟢 **Hijau** = Bit ON / Nilai Aktif
- ⚪ **Abu-abu** = Bit OFF / Nilai Nonaktif
- 🔵 **Biru** = Nilai Register

### 3️⃣ Test dengan Client

Buka tab browser baru → Mode Master → Connect ke localhost:502

---

## 🎯 Contoh Penggunaan Real

### Scenario 1: Test PLC
```
1. Mode: Master
2. Transport: Modbus TCP
3. IP: 192.168.1.10 (IP PLC)
4. Port: 502
5. Connect
6. Baca holding register 0-99
7. Tulis nilai setpoint ke register 100
```

### Scenario 2: Simulasi Device
```
1. Mode: Slave
2. Transport: Modbus TCP
3. IP: 0.0.0.0
4. Port: 5020 (port bebas > 1024)
5. Connect
6. Monitor data yang masuk
7. Test dengan Modbus Master client
```

### Scenario 3: Debug Serial Device
```
1. Mode: Master
2. Transport: Modbus RTU
3. Port: /dev/ttyUSB0
4. Baud: 9600
5. Slave ID: 1
6. Test komunikasi dengan berbagai function code
```

---

## 🔥 Tips & Trik

### Tip 1: Port Permission (Linux)
```bash
# Jika "Permission Denied" pada /dev/ttyUSB0
sudo chmod 666 /dev/ttyUSB0

# Atau tambah user ke group dialout (permanent)
sudo usermod -a -G dialout $USER
# Logout & login lagi
```

### Tip 2: Port < 1024 Butuh Root
```bash
# Port 502 di Linux butuh sudo
# Solusi: Gunakan port > 1024 (misal 5020)

# Atau jalankan dengan sudo (not recommended)
sudo python3 modbus_server.py
```

### Tip 3: Test Koneksi TCP
```bash
# Test apakah port terbuka
telnet 192.168.1.100 502

# Atau gunakan nc
nc -zv 192.168.1.100 502
```

### Tip 4: Cek Serial Port
```bash
# Linux - List serial devices
ls /dev/tty*

# Atau lebih detail
dmesg | grep tty

# Windows - Device Manager
# Control Panel → Device Manager → Ports (COM & LPT)
```

### Tip 5: Multiple Instances
```
Bisa jalankan multiple instance dengan port berbeda:

Instance 1: Slave di port 5020
Instance 2: Master connect ke localhost:5020
Instance 3: Master connect ke device lain
```

---

## ❓ Troubleshooting Cepat

### Problem: Browser tidak bisa connect
```
Solusi:
1. Pastikan server sudah running
2. Cek URL: http://127.0.0.1:5000
3. Cek firewall tidak block port 5000
4. Refresh browser (Ctrl+F5)
```

### Problem: Serial port not found
```
Solusi:
1. Cek kabel terhubung: ls /dev/tty*
2. Cek permission: sudo chmod 666 /dev/ttyUSB0
3. Install driver jika perlu
4. Restart komputer
```

### Problem: Modbus timeout
```
Solusi:
1. Cek koneksi fisik (kabel, network)
2. Verify IP/Port benar
3. Pastikan slave ID match
4. Cek baud rate sama (RTU)
5. Test dengan ping dulu (TCP)
```

### Problem: "Address already in use"
```
Solusi:
1. Port sudah dipakai program lain
2. Kill process: lsof -ti:5000 | xargs kill
3. Atau gunakan port lain
4. Restart komputer
```

---

## 📞 Bantuan Lebih Lanjut

**Cek Activity Log:**
- Semua operasi tercatat di log panel
- Warna hijau = sukses
- Warna merah = error
- Baca pesan error untuk detail

**File Penting:**
```
modbus_studio.html  → Interface web
modbus_server.py    → Backend server
modbus_tools.py     → Core Modbus engine
README_GUI.md       → Dokumentasi lengkap
```

---

## ✅ Checklist Sebelum Mulai

```
☐ Python 3.8+ terinstall
☐ Dependencies terinstall (Flask, pyserial)
☐ Backend server running
☐ Browser dibuka ke http://127.0.0.1:5000
☐ Device/simulator ready (untuk testing)
☐ Koneksi network OK (untuk TCP)
☐ Serial cable terhubung (untuk RTU)
```

---

**Selamat Menggunakan Modbus Studio! 🎉**

**Support:** Baca README_GUI.md untuk dokumentasi lengkap

**Happy Modbus Testing! ⚡**
