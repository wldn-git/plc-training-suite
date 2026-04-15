import { evaluateRung } from './ladderEngine';
import { processTimers } from './timerEngine';
import { processCounters } from './counterEngine';
import type { Rung, IOPoint } from '@/types/plc.types';
import type { TimerState, CounterState, ScanResult } from '@/types/simulator.types';

// ============================================================
// PLC Scan Cycle Loop — Core Simulator
// ============================================================

export function runScanCycle(
  rungs: Rung[],
  ioPoints: IOPoint[],
  timers: TimerState[],
  counters: CounterState[],
  prevPowerStates: Map<string, boolean>,
  deltaTime: number
): ScanResult {
  const start = performance.now();
  
  const currentOutputs: Record<string, boolean | number> = {};
  const activeTimers = new Map<string, { power: boolean; type: string; preset: number }>();
  const activeCounters = new Map<string, { power: boolean; type: string; preset: number }>();
  const rungResults = [];

  // 1. Eksekusi Ladder (per Rung)
  for (const rung of rungs) {
    const { power, elementStatus } = evaluateRung(rung, ioPoints, timers, counters);
    
    rungResults.push({
      rungId: rung.id,
      power,
      elementResults: Object.entries(elementStatus).map(([id, val]) => ({ elementId: id, value: val }))
    });

    // 2. Identify Outputs, Timers, Counters for Update
    for (const el of rung.elements) {
      if (el.instruction === 'OUT') {
        currentOutputs[el.operand] = power;
      }
      if (['SET', 'RST'].includes(el.instruction) && power) {
        currentOutputs[el.operand] = el.instruction === 'SET';
      }
      if (['TON', 'TOF', 'TP'].includes(el.instruction)) {
        activeTimers.set(el.operand, { power, type: el.instruction, preset: el.preset || 0 });
      }
      if (['CTU', 'CTD'].includes(el.instruction)) {
        activeCounters.set(el.operand, { power, type: el.instruction, preset: el.preset || 0 });
      }
      if (el.instruction === 'RST' && el.operand.startsWith('C')) {
         activeCounters.set(el.operand, { power, type: 'RST', preset: 0 });
      }
    }
  }

  // 3. Process Engines
  const updatedTimers = processTimers(timers, activeTimers, deltaTime);
  const updatedCounters = processCounters(counters, activeCounters, prevPowerStates);



  return {
    cycleTime: performance.now() - start,
    rungResults,
    outputs: currentOutputs,
    timers: updatedTimers,
    counters: updatedCounters,
  };
}
