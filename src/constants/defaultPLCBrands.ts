import type { PLCDevice } from '@/types/plc.types';

// ============================================================
// Default Seed Data — PLC Catalog
// ============================================================

export const DEFAULT_PLC_BRANDS: Omit<PLCDevice, 'id' | 'createdAt'>[] = [
  {
    brand: 'Siemens',
    series: 'S7-1200',
    digitalInput: 14,
    digitalOutput: 10,
    analogInput: 2,
    analogOutput: 0,
    supplyVoltage: '24VDC',
    communication: ['Ethernet (PROFINET)', 'RS485'],
    programming: ['Ladder', 'FBD', 'ST', 'SCL'],
    notes: 'CPU 1214C DC/DC/DC. Populer untuk aplikasi industri skala menengah.',
  },
  {
    brand: 'Mitsubishi',
    series: 'FX3U',
    digitalInput: 16,
    digitalOutput: 16,
    analogInput: 0,
    analogOutput: 0,
    supplyVoltage: '24VDC',
    communication: ['RS422', 'RS485', 'Ethernet (opsional)'],
    programming: ['Ladder', 'ST'],
    notes: 'Seri FX3U adalah workhorse Mitsubishi. Banyak dipakai di pabrik tekstil & manufaktur Indonesia.',
  },
  {
    brand: 'Schneider',
    series: 'M221',
    digitalInput: 9,
    digitalOutput: 7,
    analogInput: 2,
    analogOutput: 0,
    supplyVoltage: '24VDC',
    communication: ['Ethernet', 'USB', 'Serial'],
    programming: ['Ladder', 'FBD', 'SFC', 'ST'],
    notes: 'Modicon M221. Compact dan fleksibel, cocok untuk panel kontrol menegah kebawah.',
  },
  {
    brand: 'Omron',
    series: 'CP1E',
    digitalInput: 12,
    digitalOutput: 8,
    analogInput: 0,
    analogOutput: 0,
    supplyVoltage: '24VDC',
    communication: ['USB', 'RS232', 'RS485 (opsional)'],
    programming: ['Ladder'],
    notes: 'Seri CP1E adalah entry-level Omron yang ideal untuk training dan aplikasi sederhana.',
  },
];
