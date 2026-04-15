// ============================================================
// PLC Device & Hardware Types
// ============================================================

export interface PLCDevice {
  id: string;
  brand: string;           // e.g. Siemens, Mitsubishi, Schneider, Omron
  series: string;          // e.g. S7-1200, FX3U, M221, CP1E
  digitalInput: number;
  digitalOutput: number;
  analogInput: number;
  analogOutput: number;
  supplyVoltage: string;   // '24VDC' | '220VAC'
  communication: string[]; // ['Ethernet', 'RS485', 'Profibus']
  programming: string[];   // ['Ladder', 'FBD', 'ST']
  notes?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IOPoint {
  address: string;         // e.g. 'X0', 'Y0', 'I0.0', 'Q0.0'
  label: string;
  type: 'DI' | 'DO' | 'AI' | 'AO';
  value: boolean | number;
  forced?: boolean;
}

// ============================================================
// Ladder Logic Rung Types
// ============================================================

export type InstructionType =
  | 'LD' | 'LDI'
  | 'AND' | 'ANI'
  | 'OR' | 'ORI'
  | 'OUT' | 'SET' | 'RST'
  | 'TON' | 'TOF' | 'TP'
  | 'CTU' | 'CTD' | 'CTUD'
  | 'MOV' | 'CMP' | 'ADD' | 'SUB'
  | 'NOP';

export interface RungElement {
  id: string;
  instruction: InstructionType;
  operand: string;         // e.g. 'X0', 'T0', 'C0'
  preset?: number;         // Timer/Counter preset value
  position: { row: number; col: number };
}

export interface Rung {
  id: string;
  elements: RungElement[];
  comment?: string;
}

export interface SimulatorProject {
  id: string;
  name: string;
  description?: string;
  rungs: Rung[];
  ioPoints: IOPoint[];
  createdAt: Date;
  updatedAt: Date;
}
