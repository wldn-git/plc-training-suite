import type { InstructionType } from '@/types/plc.types';

// ============================================================
// PLC Instruction Set Reference
// ============================================================

export interface InstructionDef {
  mnemonic: InstructionType;
  category: 'contact' | 'output' | 'timer' | 'counter' | 'data';
  label: string;
  description: string;
  operandType: 'bit' | 'word' | 'timer' | 'counter' | 'none';
  hasPreset: boolean;
  icon: string;            // Lucide icon name
}

export const PLC_INSTRUCTIONS: InstructionDef[] = [
  // Contacts
  { mnemonic: 'LD',  category: 'contact', label: 'Load',          description: 'Mulai rung dengan kontak Normally Open (NO)',      operandType: 'bit',     hasPreset: false, icon: 'CircleDot' },
  { mnemonic: 'LDI', category: 'contact', label: 'Load Inverse',  description: 'Mulai rung dengan kontak Normally Closed (NC)',    operandType: 'bit',     hasPreset: false, icon: 'CircleSlash' },
  { mnemonic: 'AND', category: 'contact', label: 'AND',           description: 'Kontak NO dihubungkan seri',                      operandType: 'bit',     hasPreset: false, icon: 'GitMerge' },
  { mnemonic: 'ANI', category: 'contact', label: 'AND NOT',       description: 'Kontak NC dihubungkan seri',                      operandType: 'bit',     hasPreset: false, icon: 'GitMerge' },
  { mnemonic: 'OR',  category: 'contact', label: 'OR',            description: 'Kontak NO dihubungkan paralel',                   operandType: 'bit',     hasPreset: false, icon: 'GitFork' },
  { mnemonic: 'ORI', category: 'contact', label: 'OR NOT',        description: 'Kontak NC dihubungkan paralel',                   operandType: 'bit',     hasPreset: false, icon: 'GitFork' },
  // Outputs
  { mnemonic: 'OUT', category: 'output',  label: 'Output Coil',   description: 'Aktifkan coil output selama logika TRUE',         operandType: 'bit',     hasPreset: false, icon: 'Zap' },
  { mnemonic: 'SET', category: 'output',  label: 'Set (Latch)',   description: 'Set output ON, tetap ON hingga di-RESET',         operandType: 'bit',     hasPreset: false, icon: 'ToggleRight' },
  { mnemonic: 'RST', category: 'output',  label: 'Reset (Unlatch)',description: 'Reset output OFF, atau reset timer/counter',     operandType: 'bit',     hasPreset: false, icon: 'ToggleLeft' },
  // Timers
  { mnemonic: 'TON', category: 'timer',   label: 'Timer ON-Delay',description: 'Output ON setelah delay (T# aktif saat coil ON)', operandType: 'timer',   hasPreset: true,  icon: 'TimerReset' },
  { mnemonic: 'TOF', category: 'timer',   label: 'Timer OFF-Delay',description: 'Output OFF setelah delay (saat coil jadi OFF)',  operandType: 'timer',   hasPreset: true,  icon: 'Timer' },
  { mnemonic: 'TP',  category: 'timer',   label: 'Timer Pulse',   description: 'Output ON selama durasi preset, satu kali',       operandType: 'timer',   hasPreset: true,  icon: 'Activity' },
  // Counters
  { mnemonic: 'CTU', category: 'counter', label: 'Count Up',      description: 'Hitung naik, done (Q) saat count ≥ preset',      operandType: 'counter', hasPreset: true,  icon: 'TrendingUp' },
  { mnemonic: 'CTD', category: 'counter', label: 'Count Down',    description: 'Hitung turun dari preset',                       operandType: 'counter', hasPreset: true,  icon: 'TrendingDown' },
  // Data
  { mnemonic: 'MOV', category: 'data',    label: 'Move Data',     description: 'Salin nilai dari source ke destination',          operandType: 'word',    hasPreset: false, icon: 'ArrowRightLeft' },
];

export const INSTRUCTION_CATEGORIES = {
  contact: 'Kontak (Contact)',
  output: 'Output / Coil',
  timer: 'Timer',
  counter: 'Counter',
  data: 'Data Handling',
} as const;
