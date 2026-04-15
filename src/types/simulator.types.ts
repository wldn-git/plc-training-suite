// ============================================================
// Simulator Engine Types
// ============================================================

export type SimulatorMode = 'EDIT' | 'RUN' | 'STOP' | 'PAUSE' | 'STEP';

export interface TimerState {
  address: string;
  preset: number;          // ms
  accumulated: number;     // ms
  running: boolean;
  done: boolean;
}

export interface CounterState {
  address: string;
  preset: number;
  count: number;
  done: boolean;
}

export interface ScanResult {
  cycleTime: number;       // ms
  rungResults: RungResult[];
  outputs: Record<string, boolean | number>;
  timers: TimerState[];
  counters: CounterState[];
}

export interface RungResult {
  rungId: string;
  power: boolean;          // TRUE jika logika rung terpenuhi
  elementResults: ElementResult[];
}

export interface ElementResult {
  elementId: string;
  value: boolean | number;
}
