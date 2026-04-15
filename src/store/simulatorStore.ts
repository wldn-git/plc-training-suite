import { create } from 'zustand';
import type { SimulatorMode, TimerState, CounterState } from '@/types/simulator.types';
import type { IOPoint, Rung, SimulatorProject } from '@/types/plc.types';

// ============================================================
// Simulator Store — Global State untuk Ladder Logic Engine
// ============================================================

interface SimulatorState {
  // Project
  currentProject: SimulatorProject | null;
  rungs: Rung[];

  // I/O State
  ioPoints: IOPoint[];

  // Execution State
  mode: SimulatorMode;
  cycleTime: number;       // ms per scan cycle
  scanCount: number;

  // Timer & Counter State
  timers: TimerState[];
  counters: CounterState[];

  // Active Rung IDs (logika TRUE saat RUN)
  activeRungIds: Set<string>;

  // Actions
  setMode: (mode: SimulatorMode) => void;
  setProject: (project: SimulatorProject) => void;
  setRungs: (rungs: Rung[]) => void;
  toggleIO: (address: string) => void;
  forceIO: (address: string, value: boolean) => void;
  updateTimers: (timers: TimerState[]) => void;
  updateCounters: (counters: CounterState[]) => void;
  setActiveRungs: (ids: string[]) => void;
  incrementScanCount: () => void;
  addElementToRung: (rungId: string, instruction: string) => void;
  addRung: () => void;
  reset: () => void;
}

const initialState = {
  currentProject: null,
  rungs: [],
  ioPoints: [],
  mode: 'STOP' as SimulatorMode,
  cycleTime: 100,
  scanCount: 0,
  timers: [],
  counters: [],
  activeRungIds: new Set<string>(),
};

export const useSimulatorStore = create<SimulatorState>((set) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  setProject: (project) =>
    set({
      currentProject: project,
      rungs: project.rungs,
      ioPoints: project.ioPoints,
      scanCount: 0,
      timers: [],
      counters: [],
      activeRungIds: new Set(),
    }),

  setRungs: (rungs) => set({ rungs }),

  toggleIO: (address) =>
    set((state) => ({
      ioPoints: state.ioPoints.map((io) =>
        io.address === address
          ? { ...io, value: typeof io.value === 'boolean' ? !io.value : io.value }
          : io
      ),
    })),

  forceIO: (address, value) =>
    set((state) => ({
      ioPoints: state.ioPoints.map((io) =>
        io.address === address ? { ...io, value, forced: true } : io
      ),
    })),

  updateTimers: (timers) => set({ timers }),
  updateCounters: (counters) => set({ counters }),
  setActiveRungs: (ids) => set({ activeRungIds: new Set(ids) }),
  incrementScanCount: () => set((state) => ({ scanCount: state.scanCount + 1 })),

  addElementToRung: (rungId: string, instruction: string) =>
    set((state) => ({
      rungs: state.rungs.map((r) =>
        r.id === rungId
          ? {
              ...r,
              elements: [
                ...r.elements,
                {
                  id: crypto.randomUUID(),
                  instruction: instruction as any,
                  operand: instruction.startsWith('T') ? 'T0' : instruction.startsWith('C') ? 'C0' : 'X0',
                  position: { row: 0, col: r.elements.length },
                },
              ],
            }
          : r
      ),
    })),

  addRung: () =>
    set((state) => ({
      rungs: [
        ...state.rungs,
        {
          id: crypto.randomUUID(),
          comment: '',
          elements: [],
        },
      ],
    })),

  reset: () => set({ ...initialState, activeRungIds: new Set<string>() }),
}));
