#!/usr/bin/env python3
"""
Modbus Studio Backend Server
Connects web UI with Modbus Tools via Flask + WebSocket
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import threading
import json
import time
from datetime import datetime
import sys
import os

# Import modbus tools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from modbus_tools import (
    ModbusTCPTransport,
    ModbusRTUTransport,
    ModbusMaster,
    ModbusSlave,
    ModbusDatastore
)

app = Flask(__name__)
CORS(app)

# Global state
state = {
    'master': None,
    'slave': None,
    'slave_thread': None,
    'datastore': None,
    'connected': False,
    'mode': None,
    'transport_type': None,
    'config': {}
}


@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_file('modbus_studio.html')


@app.route('/api/connect', methods=['POST'])
def connect():
    """Connect to Modbus device or start server"""
    try:
        data = request.json
        mode = data.get('mode', 'master')
        transport_type = data.get('transport', 'tcp')
        config = data.get('config', {})
        
        state['mode'] = mode
        state['transport_type'] = transport_type
        state['config'] = config
        
        if mode == 'master':
            return connect_master(transport_type, config)
        else:
            return connect_slave(transport_type, config)
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def connect_master(transport_type, config):
    """Connect as Modbus Master"""
    try:
        if transport_type == 'tcp':
            host = config.get('host', '127.0.0.1')
            port = int(config.get('port', 502))
            transport = ModbusTCPTransport(host, port)
        else:
            port = config.get('port', '/dev/ttyUSB0')
            baudrate = int(config.get('baudrate', 9600))
            transport = ModbusRTUTransport(port, baudrate)
        
        master = ModbusMaster(transport)
        state['master'] = master
        state['connected'] = True
        
        return jsonify({
            'success': True,
            'message': f'Connected to {transport_type.upper()} Master',
            'mode': 'master',
            'transport': transport_type
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


def connect_slave(transport_type, config):
    """Start Modbus Slave Server"""
    try:
        # Create datastore
        datastore = ModbusDatastore()
        
        # Initialize with sample data
        datastore.holding_registers[0:16] = [100, 200, 300, 400, 500, 600, 700, 800, 
                                             900, 1000, 1100, 1200, 1300, 1400, 1500, 1600]
        datastore.input_registers[0:16] = [11, 22, 33, 44, 55, 66, 77, 88, 
                                           99, 110, 121, 132, 143, 154, 165, 176]
        datastore.coils[0:16] = [True, False, True, False, True, False, True, False,
                                 True, False, True, False, True, False, True, False]
        datastore.discrete_inputs[0:16] = [False, True, False, True, False, True, False, True,
                                           False, True, False, True, False, True, False, True]
        
        slave_id = int(config.get('slave_id', 1))
        
        if transport_type == 'tcp':
            host = config.get('host', '0.0.0.0')
            port = int(config.get('port', 502))
            slave = ModbusSlave(slave_id, datastore, 'tcp', host=host, port=port)
        else:
            port = config.get('port', '/dev/ttyUSB0')
            baudrate = int(config.get('baudrate', 9600))
            slave = ModbusSlave(slave_id, datastore, 'rtu', port=port, baudrate=baudrate)
        
        # Start slave in background thread
        slave_thread = threading.Thread(target=slave.start, daemon=True)
        slave_thread.start()
        
        state['slave'] = slave
        state['slave_thread'] = slave_thread
        state['datastore'] = datastore
        state['connected'] = True
        
        return jsonify({
            'success': True,
            'message': f'Slave server started on {transport_type.upper()}',
            'mode': 'slave',
            'transport': transport_type
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/disconnect', methods=['POST'])
def disconnect():
    """Disconnect from device or stop server"""
    try:
        if state['master']:
            state['master'].close()
            state['master'] = None
        
        if state['slave']:
            state['slave'].stop()
            state['slave'] = None
            state['slave_thread'] = None
            state['datastore'] = None
        
        state['connected'] = False
        
        return jsonify({
            'success': True,
            'message': 'Disconnected successfully'
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/execute', methods=['POST'])
def execute_function():
    """Execute Modbus function"""
    try:
        if not state['connected'] or not state['master']:
            return jsonify({
                'success': False,
                'error': 'Not connected'
            }), 400
        
        data = request.json
        function = data.get('function')
        slave_id = int(data.get('slave_id', 1))
        address = int(data.get('address', 0))
        count = int(data.get('count', 1))
        values = data.get('values', [])
        
        master = state['master']
        result = None
        
        # Execute function
        if function == 'read_coils':
            result = master.read_coils(slave_id, address, count)
        
        elif function == 'read_discrete':
            result = master.read_discrete_inputs(slave_id, address, count)
        
        elif function == 'read_holding':
            result = master.read_holding_registers(slave_id, address, count)
        
        elif function == 'read_input':
            result = master.read_input_registers(slave_id, address, count)
        
        elif function == 'write_coil':
            value = bool(int(values[0]))
            master.write_single_coil(slave_id, address, value)
            result = [int(value)]
        
        elif function == 'write_register':
            value = int(values[0])
            master.write_single_register(slave_id, address, value)
            result = [value]
        
        elif function == 'write_coils':
            coil_values = [bool(int(v)) for v in values]
            master.write_multiple_coils(slave_id, address, coil_values)
            result = [int(v) for v in coil_values]
        
        elif function == 'write_registers':
            reg_values = [int(v) for v in values]
            master.write_multiple_registers(slave_id, address, reg_values)
            result = reg_values
        
        else:
            return jsonify({
                'success': False,
                'error': f'Unknown function: {function}'
            }), 400
        
        # Convert boolean results to integers for JSON
        if result and isinstance(result[0], bool):
            result = [int(v) for v in result]
        
        return jsonify({
            'success': True,
            'function': function,
            'address': address,
            'count': len(result) if result else 0,
            'values': result,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/datastore', methods=['GET'])
def get_datastore():
    """Get current slave datastore state"""
    try:
        if not state['connected'] or not state['datastore']:
            return jsonify({
                'success': False,
                'error': 'Slave not running'
            }), 400
        
        ds = state['datastore']
        
        return jsonify({
            'success': True,
            'data': {
                'coils': [int(v) for v in ds.coils[0:16]],
                'discrete_inputs': [int(v) for v in ds.discrete_inputs[0:16]],
                'holding_registers': ds.holding_registers[0:16],
                'input_registers': ds.input_registers[0:16]
            },
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get connection status"""
    return jsonify({
        'connected': state['connected'],
        'mode': state['mode'],
        'transport': state['transport_type'],
        'config': state['config']
    })


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Modbus Studio Backend Server")
    print("=" * 60)
    print("\n📡 Server starting on http://127.0.0.1:5000")
    print("🌐 Open http://127.0.0.1:5000 in your browser")
    print("\nPress Ctrl+C to stop\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
