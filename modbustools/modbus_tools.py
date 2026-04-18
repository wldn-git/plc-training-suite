#!/usr/bin/env python3
"""
Modbus Tools - Complete RTU/TCP Master/Slave Implementation
Supports: Modbus RTU Master/Slave, Modbus TCP Master/Slave
"""

import struct
import socket
import serial
import threading
import time
from abc import ABC, abstractmethod
from enum import IntEnum
from typing import List, Optional, Tuple, Dict
from dataclasses import dataclass


# ============================================================================
# CORE - Protocol Definition
# ============================================================================

class ModbusFunction(IntEnum):
    """Modbus function codes"""
    READ_COILS = 0x01
    READ_DISCRETE_INPUTS = 0x02
    READ_HOLDING_REGISTERS = 0x03
    READ_INPUT_REGISTERS = 0x04
    WRITE_SINGLE_COIL = 0x05
    WRITE_SINGLE_REGISTER = 0x06
    WRITE_MULTIPLE_COILS = 0x0F
    WRITE_MULTIPLE_REGISTERS = 0x10


class ModbusException(IntEnum):
    """Modbus exception codes"""
    ILLEGAL_FUNCTION = 0x01
    ILLEGAL_DATA_ADDRESS = 0x02
    ILLEGAL_DATA_VALUE = 0x03
    SLAVE_DEVICE_FAILURE = 0x04


@dataclass
class ModbusRequest:
    """Modbus request PDU"""
    slave_id: int
    function_code: int
    address: int
    count: Optional[int] = None
    values: Optional[List[int]] = None


@dataclass
class ModbusResponse:
    """Modbus response PDU"""
    slave_id: int
    function_code: int
    data: bytes
    exception_code: Optional[int] = None


# ============================================================================
# UTILS - CRC and Helpers
# ============================================================================

class ModbusCRC:
    """CRC16 calculation for Modbus RTU"""
    
    @staticmethod
    def calculate(data: bytes) -> int:
        """Calculate CRC16 for Modbus RTU"""
        crc = 0xFFFF
        for byte in data:
            crc ^= byte
            for _ in range(8):
                if crc & 0x0001:
                    crc = (crc >> 1) ^ 0xA001
                else:
                    crc >>= 1
        return crc
    
    @staticmethod
    def verify(data: bytes) -> bool:
        """Verify CRC16"""
        if len(data) < 3:
            return False
        received_crc = struct.unpack('<H', data[-2:])[0]
        calculated_crc = ModbusCRC.calculate(data[:-2])
        return received_crc == calculated_crc


# ============================================================================
# TRANSPORT LAYER - Abstract Base
# ============================================================================

class ModbusTransport(ABC):
    """Abstract transport layer"""
    
    @abstractmethod
    def send(self, data: bytes) -> None:
        """Send data"""
        pass
    
    @abstractmethod
    def receive(self, timeout: float = 1.0) -> bytes:
        """Receive data"""
        pass
    
    @abstractmethod
    def close(self) -> None:
        """Close connection"""
        pass


# ============================================================================
# TRANSPORT - TCP Implementation
# ============================================================================

class ModbusTCPTransport(ModbusTransport):
    """Modbus TCP transport layer"""
    
    def __init__(self, host: str, port: int = 502):
        self.host = host
        self.port = port
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.settimeout(5.0)
        self.transaction_id = 0
        self.connected = False
    
    def connect(self):
        """Connect to TCP server"""
        if not self.connected:
            self.socket.connect((self.host, self.port))
            self.connected = True
    
    def send(self, pdu: bytes, slave_id: int = 1) -> None:
        """Send Modbus TCP frame (MBAP + PDU)"""
        self.transaction_id = (self.transaction_id + 1) % 65536
        # MBAP Header: Transaction ID (2) + Protocol ID (2) + Length (2) + Unit ID (1)
        length = len(pdu) + 1  # PDU + Unit ID
        mbap = struct.pack('>HHHB', self.transaction_id, 0, length, slave_id)
        frame = mbap + pdu
        self.socket.send(frame)
    
    def receive(self, timeout: float = 1.0) -> Tuple[bytes, int]:
        """Receive Modbus TCP frame, returns (PDU, slave_id)"""
        self.socket.settimeout(timeout)
        # Read MBAP header (7 bytes)
        header = self.socket.recv(7)
        if len(header) < 7:
            raise Exception("Incomplete MBAP header")
        
        trans_id, proto_id, length, unit_id = struct.unpack('>HHHB', header)
        
        # Read PDU
        pdu = self.socket.recv(length - 1)
        return pdu, unit_id
    
    def close(self) -> None:
        """Close TCP connection"""
        if self.connected:
            self.socket.close()
            self.connected = False


# ============================================================================
# TRANSPORT - RTU Implementation
# ============================================================================

class ModbusRTUTransport(ModbusTransport):
    """Modbus RTU transport layer (Serial)"""
    
    def __init__(self, port: str, baudrate: int = 9600, 
                 bytesize: int = 8, parity: str = 'N', stopbits: int = 1):
        self.port = port
        self.serial = serial.Serial(
            port=port,
            baudrate=baudrate,
            bytesize=bytesize,
            parity=parity,
            stopbits=stopbits,
            timeout=1.0
        )
    
    def send(self, pdu: bytes, slave_id: int = 1) -> None:
        """Send Modbus RTU frame (Slave ID + PDU + CRC)"""
        frame = bytes([slave_id]) + pdu
        crc = ModbusCRC.calculate(frame)
        frame += struct.pack('<H', crc)
        self.serial.write(frame)
    
    def receive(self, timeout: float = 1.0) -> Tuple[bytes, int]:
        """Receive Modbus RTU frame, returns (PDU, slave_id)"""
        self.serial.timeout = timeout
        
        # Wait for first byte
        first_byte = self.serial.read(1)
        if not first_byte:
            raise TimeoutError("No response received")
        
        slave_id = first_byte[0]
        
        # Read function code
        func_code = self.serial.read(1)
        if not func_code:
            raise Exception("Incomplete frame")
        
        # Estimate frame size based on function code
        if func_code[0] & 0x80:  # Exception response
            data_length = 1
        elif func_code[0] in [0x01, 0x02, 0x03, 0x04]:
            byte_count = self.serial.read(1)
            if byte_count:
                data_length = 1 + byte_count[0]
        else:
            data_length = 4  # Standard response
        
        # Read remaining data + CRC
        remaining = self.serial.read(data_length + 2)
        
        frame = first_byte + func_code + remaining
        
        # Verify CRC
        if not ModbusCRC.verify(frame):
            raise Exception("CRC error")
        
        # Return PDU (without slave_id and CRC)
        pdu = frame[1:-2]
        return pdu, slave_id
    
    def close(self) -> None:
        """Close serial port"""
        if self.serial.is_open:
            self.serial.close()


# ============================================================================
# MASTER - Client Implementation
# ============================================================================

class ModbusMaster:
    """Modbus Master/Client"""
    
    def __init__(self, transport: ModbusTransport):
        self.transport = transport
        if isinstance(transport, ModbusTCPTransport):
            transport.connect()
    
    def _send_request(self, slave_id: int, function_code: int, 
                      address: int, count: int = 1, values: List[int] = None) -> bytes:
        """Build and send Modbus request"""
        if function_code in [ModbusFunction.READ_COILS, 
                            ModbusFunction.READ_DISCRETE_INPUTS,
                            ModbusFunction.READ_HOLDING_REGISTERS,
                            ModbusFunction.READ_INPUT_REGISTERS]:
            pdu = struct.pack('>BHH', function_code, address, count)
        
        elif function_code == ModbusFunction.WRITE_SINGLE_COIL:
            value = 0xFF00 if values[0] else 0x0000
            pdu = struct.pack('>BHH', function_code, address, value)
        
        elif function_code == ModbusFunction.WRITE_SINGLE_REGISTER:
            pdu = struct.pack('>BHH', function_code, address, values[0])
        
        elif function_code == ModbusFunction.WRITE_MULTIPLE_COILS:
            byte_count = (count + 7) // 8
            coil_bytes = bytearray(byte_count)
            for i, val in enumerate(values[:count]):
                if val:
                    coil_bytes[i // 8] |= (1 << (i % 8))
            pdu = struct.pack('>BHHB', function_code, address, count, byte_count)
            pdu += bytes(coil_bytes)
        
        elif function_code == ModbusFunction.WRITE_MULTIPLE_REGISTERS:
            byte_count = count * 2
            pdu = struct.pack('>BHHB', function_code, address, count, byte_count)
            for val in values[:count]:
                pdu += struct.pack('>H', val)
        
        else:
            raise ValueError(f"Unsupported function code: {function_code}")
        
        self.transport.send(pdu, slave_id)
        response_pdu, _ = self.transport.receive()
        
        return self._parse_response(response_pdu, function_code)
    
    def _parse_response(self, pdu: bytes, expected_function: int) -> bytes:
        """Parse Modbus response"""
        if len(pdu) < 1:
            raise Exception("Empty response")
        
        function_code = pdu[0]
        
        # Check for exception
        if function_code & 0x80:
            exception_code = pdu[1] if len(pdu) > 1 else 0
            raise Exception(f"Modbus Exception {exception_code}")
        
        if function_code != expected_function:
            raise Exception(f"Function code mismatch: {function_code} != {expected_function}")
        
        return pdu[1:]  # Return data without function code
    
    def read_coils(self, slave_id: int, address: int, count: int) -> List[bool]:
        """Read coils (FC01)"""
        data = self._send_request(slave_id, ModbusFunction.READ_COILS, address, count)
        byte_count = data[0]
        coil_bytes = data[1:1+byte_count]
        
        coils = []
        for i in range(count):
            byte_idx = i // 8
            bit_idx = i % 8
            if byte_idx < len(coil_bytes):
                coils.append(bool(coil_bytes[byte_idx] & (1 << bit_idx)))
        return coils
    
    def read_discrete_inputs(self, slave_id: int, address: int, count: int) -> List[bool]:
        """Read discrete inputs (FC02)"""
        data = self._send_request(slave_id, ModbusFunction.READ_DISCRETE_INPUTS, address, count)
        byte_count = data[0]
        input_bytes = data[1:1+byte_count]
        
        inputs = []
        for i in range(count):
            byte_idx = i // 8
            bit_idx = i % 8
            if byte_idx < len(input_bytes):
                inputs.append(bool(input_bytes[byte_idx] & (1 << bit_idx)))
        return inputs
    
    def read_holding_registers(self, slave_id: int, address: int, count: int) -> List[int]:
        """Read holding registers (FC03)"""
        data = self._send_request(slave_id, ModbusFunction.READ_HOLDING_REGISTERS, address, count)
        byte_count = data[0]
        reg_data = data[1:1+byte_count]
        
        registers = []
        for i in range(0, byte_count, 2):
            if i+1 < len(reg_data):
                registers.append(struct.unpack('>H', reg_data[i:i+2])[0])
        return registers
    
    def read_input_registers(self, slave_id: int, address: int, count: int) -> List[int]:
        """Read input registers (FC04)"""
        data = self._send_request(slave_id, ModbusFunction.READ_INPUT_REGISTERS, address, count)
        byte_count = data[0]
        reg_data = data[1:1+byte_count]
        
        registers = []
        for i in range(0, byte_count, 2):
            if i+1 < len(reg_data):
                registers.append(struct.unpack('>H', reg_data[i:i+2])[0])
        return registers
    
    def write_single_coil(self, slave_id: int, address: int, value: bool) -> None:
        """Write single coil (FC05)"""
        self._send_request(slave_id, ModbusFunction.WRITE_SINGLE_COIL, address, values=[value])
    
    def write_single_register(self, slave_id: int, address: int, value: int) -> None:
        """Write single register (FC06)"""
        self._send_request(slave_id, ModbusFunction.WRITE_SINGLE_REGISTER, address, values=[value])
    
    def write_multiple_coils(self, slave_id: int, address: int, values: List[bool]) -> None:
        """Write multiple coils (FC15)"""
        self._send_request(slave_id, ModbusFunction.WRITE_MULTIPLE_COILS, 
                          address, len(values), values)
    
    def write_multiple_registers(self, slave_id: int, address: int, values: List[int]) -> None:
        """Write multiple registers (FC16)"""
        self._send_request(slave_id, ModbusFunction.WRITE_MULTIPLE_REGISTERS, 
                          address, len(values), values)
    
    def close(self):
        """Close connection"""
        self.transport.close()


# ============================================================================
# SLAVE - Datastore
# ============================================================================

class ModbusDatastore:
    """Modbus data storage for slave"""
    
    def __init__(self, coils: int = 1000, discrete_inputs: int = 1000,
                 holding_registers: int = 1000, input_registers: int = 1000):
        self.coils = [False] * coils
        self.discrete_inputs = [False] * discrete_inputs
        self.holding_registers = [0] * holding_registers
        self.input_registers = [0] * input_registers
        self.lock = threading.Lock()
    
    def read_coils(self, address: int, count: int) -> List[bool]:
        """Read coils"""
        with self.lock:
            if address + count > len(self.coils):
                raise IndexError("Address out of range")
            return self.coils[address:address+count]
    
    def read_discrete_inputs(self, address: int, count: int) -> List[bool]:
        """Read discrete inputs"""
        with self.lock:
            if address + count > len(self.discrete_inputs):
                raise IndexError("Address out of range")
            return self.discrete_inputs[address:address+count]
    
    def read_holding_registers(self, address: int, count: int) -> List[int]:
        """Read holding registers"""
        with self.lock:
            if address + count > len(self.holding_registers):
                raise IndexError("Address out of range")
            return self.holding_registers[address:address+count]
    
    def read_input_registers(self, address: int, count: int) -> List[int]:
        """Read input registers"""
        with self.lock:
            if address + count > len(self.input_registers):
                raise IndexError("Address out of range")
            return self.input_registers[address:address+count]
    
    def write_coils(self, address: int, values: List[bool]) -> None:
        """Write coils"""
        with self.lock:
            if address + len(values) > len(self.coils):
                raise IndexError("Address out of range")
            for i, val in enumerate(values):
                self.coils[address + i] = val
    
    def write_holding_registers(self, address: int, values: List[int]) -> None:
        """Write holding registers"""
        with self.lock:
            if address + len(values) > len(self.holding_registers):
                raise IndexError("Address out of range")
            for i, val in enumerate(values):
                self.holding_registers[address + i] = val & 0xFFFF


# ============================================================================
# SLAVE - Server Implementation
# ============================================================================

class ModbusSlave:
    """Modbus Slave/Server"""
    
    def __init__(self, slave_id: int, datastore: ModbusDatastore, 
                 transport_type: str = 'tcp', **kwargs):
        self.slave_id = slave_id
        self.datastore = datastore
        self.running = False
        self.transport_type = transport_type
        
        if transport_type == 'tcp':
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            host = kwargs.get('host', '0.0.0.0')
            port = kwargs.get('port', 502)
            self.server_socket.bind((host, port))
            self.server_socket.listen(5)
            print(f"[SLAVE] Listening on {host}:{port} (TCP)")
        
        elif transport_type == 'rtu':
            port = kwargs.get('port', '/dev/ttyUSB0')
            baudrate = kwargs.get('baudrate', 9600)
            self.serial = serial.Serial(port=port, baudrate=baudrate, timeout=0.1)
            print(f"[SLAVE] Listening on {port} @ {baudrate} baud (RTU)")
    
    def _process_request(self, pdu: bytes) -> bytes:
        """Process Modbus request and generate response"""
        if len(pdu) < 1:
            return self._exception_response(0, ModbusException.ILLEGAL_FUNCTION)
        
        function_code = pdu[0]
        
        try:
            if function_code == ModbusFunction.READ_COILS:
                address, count = struct.unpack('>HH', pdu[1:5])
                values = self.datastore.read_coils(address, count)
                return self._read_bits_response(function_code, values)
            
            elif function_code == ModbusFunction.READ_DISCRETE_INPUTS:
                address, count = struct.unpack('>HH', pdu[1:5])
                values = self.datastore.read_discrete_inputs(address, count)
                return self._read_bits_response(function_code, values)
            
            elif function_code == ModbusFunction.READ_HOLDING_REGISTERS:
                address, count = struct.unpack('>HH', pdu[1:5])
                values = self.datastore.read_holding_registers(address, count)
                return self._read_registers_response(function_code, values)
            
            elif function_code == ModbusFunction.READ_INPUT_REGISTERS:
                address, count = struct.unpack('>HH', pdu[1:5])
                values = self.datastore.read_input_registers(address, count)
                return self._read_registers_response(function_code, values)
            
            elif function_code == ModbusFunction.WRITE_SINGLE_COIL:
                address, value = struct.unpack('>HH', pdu[1:5])
                self.datastore.write_coils(address, [value == 0xFF00])
                return pdu  # Echo request
            
            elif function_code == ModbusFunction.WRITE_SINGLE_REGISTER:
                address, value = struct.unpack('>HH', pdu[1:5])
                self.datastore.write_holding_registers(address, [value])
                return pdu  # Echo request
            
            elif function_code == ModbusFunction.WRITE_MULTIPLE_COILS:
                address, count, byte_count = struct.unpack('>HHB', pdu[1:6])
                coil_bytes = pdu[6:6+byte_count]
                values = []
                for i in range(count):
                    byte_idx = i // 8
                    bit_idx = i % 8
                    if byte_idx < len(coil_bytes):
                        values.append(bool(coil_bytes[byte_idx] & (1 << bit_idx)))
                self.datastore.write_coils(address, values)
                return struct.pack('>BHH', function_code, address, count)
            
            elif function_code == ModbusFunction.WRITE_MULTIPLE_REGISTERS:
                address, count, byte_count = struct.unpack('>HHB', pdu[1:6])
                reg_data = pdu[6:6+byte_count]
                values = []
                for i in range(0, byte_count, 2):
                    values.append(struct.unpack('>H', reg_data[i:i+2])[0])
                self.datastore.write_holding_registers(address, values)
                return struct.pack('>BHH', function_code, address, count)
            
            else:
                return self._exception_response(function_code, ModbusException.ILLEGAL_FUNCTION)
        
        except IndexError:
            return self._exception_response(function_code, ModbusException.ILLEGAL_DATA_ADDRESS)
        except Exception as e:
            print(f"[SLAVE ERROR] {e}")
            return self._exception_response(function_code, ModbusException.SLAVE_DEVICE_FAILURE)
    
    def _read_bits_response(self, function_code: int, values: List[bool]) -> bytes:
        """Build response for bit reading functions"""
        byte_count = (len(values) + 7) // 8
        response = struct.pack('>BB', function_code, byte_count)
        
        data_bytes = bytearray(byte_count)
        for i, val in enumerate(values):
            if val:
                data_bytes[i // 8] |= (1 << (i % 8))
        
        return response + bytes(data_bytes)
    
    def _read_registers_response(self, function_code: int, values: List[int]) -> bytes:
        """Build response for register reading functions"""
        byte_count = len(values) * 2
        response = struct.pack('>BB', function_code, byte_count)
        
        for val in values:
            response += struct.pack('>H', val)
        
        return response
    
    def _exception_response(self, function_code: int, exception_code: int) -> bytes:
        """Build exception response"""
        return struct.pack('>BB', function_code | 0x80, exception_code)
    
    def _handle_tcp_client(self, client_socket):
        """Handle TCP client connection"""
        try:
            while self.running:
                # Read MBAP header
                header = client_socket.recv(7)
                if not header or len(header) < 7:
                    break
                
                trans_id, proto_id, length, unit_id = struct.unpack('>HHHB', header)
                
                # Read PDU
                pdu = client_socket.recv(length - 1)
                if not pdu:
                    break
                
                # Process only if unit_id matches
                if unit_id == self.slave_id or unit_id == 0:
                    response_pdu = self._process_request(pdu)
                    
                    # Send response
                    response_length = len(response_pdu) + 1
                    mbap = struct.pack('>HHHB', trans_id, proto_id, response_length, unit_id)
                    client_socket.send(mbap + response_pdu)
        
        except Exception as e:
            print(f"[SLAVE] Client error: {e}")
        finally:
            client_socket.close()
    
    def start(self):
        """Start slave server"""
        self.running = True
        
        if self.transport_type == 'tcp':
            self._run_tcp_server()
        elif self.transport_type == 'rtu':
            self._run_rtu_server()
    
    def _run_tcp_server(self):
        """Run TCP server"""
        while self.running:
            try:
                self.server_socket.settimeout(1.0)
                client_socket, addr = self.server_socket.accept()
                print(f"[SLAVE] Client connected: {addr}")
                
                client_thread = threading.Thread(
                    target=self._handle_tcp_client, 
                    args=(client_socket,),
                    daemon=True
                )
                client_thread.start()
            
            except socket.timeout:
                continue
            except Exception as e:
                if self.running:
                    print(f"[SLAVE] Accept error: {e}")
    
    def _run_rtu_server(self):
        """Run RTU server"""
        while self.running:
            try:
                # Wait for first byte
                first_byte = self.serial.read(1)
                if not first_byte:
                    continue
                
                slave_id = first_byte[0]
                
                # Only process if slave_id matches
                if slave_id != self.slave_id and slave_id != 0:
                    continue
                
                # Read function code
                func_code = self.serial.read(1)
                if not func_code:
                    continue
                
                # Read rest of frame (simplified - read fixed size for now)
                remaining = self.serial.read(100)
                
                frame = first_byte + func_code + remaining
                
                # Find actual frame end by looking for valid CRC
                for i in range(4, len(frame)):
                    test_frame = frame[:i]
                    if ModbusCRC.verify(test_frame):
                        # Valid frame found
                        pdu = test_frame[1:-2]
                        response_pdu = self._process_request(pdu)
                        
                        # Send response
                        response_frame = bytes([self.slave_id]) + response_pdu
                        crc = ModbusCRC.calculate(response_frame)
                        response_frame += struct.pack('<H', crc)
                        
                        time.sleep(0.01)  # Small delay before response
                        self.serial.write(response_frame)
                        break
            
            except Exception as e:
                if self.running:
                    print(f"[SLAVE] RTU error: {e}")
    
    def stop(self):
        """Stop slave server"""
        self.running = False
        if self.transport_type == 'tcp':
            self.server_socket.close()
        elif self.transport_type == 'rtu':
            self.serial.close()


# ============================================================================
# CLI Interface
# ============================================================================

def main():
    """Main CLI interface"""
    import sys
    
    if len(sys.argv) < 2:
        print("""
Modbus Tools - RTU/TCP Master/Slave Implementation

Usage:
  Master (Client) Mode:
    TCP:  python modbus_tools.py master tcp <host> <port> <slave_id> <function> <address> [count/value]
    RTU:  python modbus_tools.py master rtu <port> <baudrate> <slave_id> <function> <address> [count/value]
  
  Slave (Server) Mode:
    TCP:  python modbus_tools.py slave tcp <slave_id> [host] [port]
    RTU:  python modbus_tools.py slave rtu <slave_id> <port> [baudrate]

Functions (Master):
  read_coils <addr> <count>
  read_discrete <addr> <count>
  read_holding <addr> <count>
  read_input <addr> <count>
  write_coil <addr> <value>
  write_register <addr> <value>
  write_coils <addr> <value1,value2,...>
  write_registers <addr> <value1,value2,...>

Examples:
  # TCP Master - Read 10 holding registers from address 0
  python modbus_tools.py master tcp 192.168.1.100 502 1 read_holding 0 10
  
  # RTU Master - Write register
  python modbus_tools.py master rtu /dev/ttyUSB0 9600 1 write_register 100 12345
  
  # TCP Slave - Start server on port 502
  python modbus_tools.py slave tcp 1 0.0.0.0 502
  
  # RTU Slave - Start server on COM3
  python modbus_tools.py slave rtu 1 COM3 9600
        """)
        return
    
    mode = sys.argv[1]
    transport = sys.argv[2]
    
    if mode == 'master':
        # Master mode
        if transport == 'tcp':
            host = sys.argv[3]
            port = int(sys.argv[4])
            slave_id = int(sys.argv[5])
            function = sys.argv[6]
            address = int(sys.argv[7])
            
            trans = ModbusTCPTransport(host, port)
            master = ModbusMaster(trans)
            
            try:
                if function == 'read_coils':
                    count = int(sys.argv[8])
                    result = master.read_coils(slave_id, address, count)
                    print(f"Coils: {result}")
                
                elif function == 'read_discrete':
                    count = int(sys.argv[8])
                    result = master.read_discrete_inputs(slave_id, address, count)
                    print(f"Discrete Inputs: {result}")
                
                elif function == 'read_holding':
                    count = int(sys.argv[8])
                    result = master.read_holding_registers(slave_id, address, count)
                    print(f"Holding Registers: {result}")
                
                elif function == 'read_input':
                    count = int(sys.argv[8])
                    result = master.read_input_registers(slave_id, address, count)
                    print(f"Input Registers: {result}")
                
                elif function == 'write_coil':
                    value = bool(int(sys.argv[8]))
                    master.write_single_coil(slave_id, address, value)
                    print(f"Coil written: {value}")
                
                elif function == 'write_register':
                    value = int(sys.argv[8])
                    master.write_single_register(slave_id, address, value)
                    print(f"Register written: {value}")
                
                elif function == 'write_coils':
                    values = [bool(int(v)) for v in sys.argv[8].split(',')]
                    master.write_multiple_coils(slave_id, address, values)
                    print(f"Coils written: {values}")
                
                elif function == 'write_registers':
                    values = [int(v) for v in sys.argv[8].split(',')]
                    master.write_multiple_registers(slave_id, address, values)
                    print(f"Registers written: {values}")
            
            finally:
                master.close()
        
        elif transport == 'rtu':
            port = sys.argv[3]
            baudrate = int(sys.argv[4])
            slave_id = int(sys.argv[5])
            function = sys.argv[6]
            address = int(sys.argv[7])
            
            trans = ModbusRTUTransport(port, baudrate)
            master = ModbusMaster(trans)
            
            try:
                if function == 'read_holding':
                    count = int(sys.argv[8])
                    result = master.read_holding_registers(slave_id, address, count)
                    print(f"Holding Registers: {result}")
                
                elif function == 'write_register':
                    value = int(sys.argv[8])
                    master.write_single_register(slave_id, address, value)
                    print(f"Register written: {value}")
                
                # Add other functions as needed
            
            finally:
                master.close()
    
    elif mode == 'slave':
        # Slave mode
        slave_id = int(sys.argv[3])
        datastore = ModbusDatastore()
        
        # Initialize some test data
        datastore.holding_registers[0:10] = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
        datastore.input_registers[0:5] = [11, 22, 33, 44, 55]
        datastore.coils[0:10] = [True, False, True, False, True, False, True, False, True, False]
        
        if transport == 'tcp':
            host = sys.argv[4] if len(sys.argv) > 4 else '0.0.0.0'
            port = int(sys.argv[5]) if len(sys.argv) > 5 else 502
            
            slave = ModbusSlave(slave_id, datastore, 'tcp', host=host, port=port)
        
        elif transport == 'rtu':
            port = sys.argv[4] if len(sys.argv) > 4 else '/dev/ttyUSB0'
            baudrate = int(sys.argv[5]) if len(sys.argv) > 5 else 9600
            
            slave = ModbusSlave(slave_id, datastore, 'rtu', port=port, baudrate=baudrate)
        
        try:
            print("[SLAVE] Starting server... (Ctrl+C to stop)")
            slave.start()
        except KeyboardInterrupt:
            print("\n[SLAVE] Stopping server...")
            slave.stop()


if __name__ == '__main__':
    main()
