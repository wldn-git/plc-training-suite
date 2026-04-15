import type { Rung, IOPoint } from '@/types/plc.types';
import type { TimerState, CounterState } from '@/types/simulator.types';

// ============================================================
// Ladder Evaluation Engine
// ============================================================

export function evaluateRung(
  rung: Rung,
  ioPoints: IOPoint[],
  timers: TimerState[],
  counters: CounterState[]
): { power: boolean; elementStatus: Record<string, boolean> } {
  let power = true; // Jalur utama dimulai dengan TRUE
  const elementStatus: Record<string, boolean> = {};

  // Traversal elemen dalam rung (asumsi v1.0 adalah serial sederhana per rung)
  for (const element of rung.elements) {
    const value = getOperandValue(element.operand, ioPoints, timers, counters);
    let result = false;

    switch (element.instruction) {
      case 'LD':
        result = Boolean(value);
        break;
      case 'LDI':
        result = !Boolean(value);
        break;
      case 'OUT':
        // OUT hanya meneruskan power yang ada ke operand
        result = power;
        break;
      case 'SET':
        result = power; // Logic SET ditangani di scan cycle
        break;
      case 'RST':
        result = power; // Logic RST ditangani di scan cycle
        break;
      case 'TON':
      case 'TOF':
        result = power; // Timer aktif jika power masuk
        break;
      default:
        result = power;
    }

    // Untuk kontak seri (LD, LDI), power diperbarui dengan operasi AND
    if (['LD', 'LDI'].includes(element.instruction)) {
      power = power && result;
    }

    elementStatus[element.id] = result;
  }

  return { power, elementStatus };
}

function getOperandValue(
  address: string,
  ioPoints: IOPoint[],
  timers: TimerState[],
  counters: CounterState[]
): boolean | number {
  // Check Inputs / Outputs
  const io = ioPoints.find(p => p.address === address);
  if (io) return io.value;

  // Check Timers
  if (address.startsWith('T')) {
    return timers.find(t => t.address === address)?.done || false;
  }

  // Check Counters
  if (address.startsWith('C')) {
    return counters.find(c => c.address === address)?.done || false;
  }

  return false;
}
