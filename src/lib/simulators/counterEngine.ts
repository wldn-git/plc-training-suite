import type { CounterState } from '@/types/simulator.types';

// ============================================================
// Counter Engine — CTU & CTD Logic
// ============================================================

export function processCounters(
  counters: CounterState[],
  activeCounterAddresses: Map<string, { power: boolean; type: string; preset: number }>,
  prevPowerStates: Map<string, boolean>
): CounterState[] {
  const updatedCounters: CounterState[] = [...counters];

  activeCounterAddresses.forEach((config, address) => {
    let counter = updatedCounters.find(c => c.address === address);
    
    if (!counter) {
      counter = {
        address,
        preset: config.preset,
        count: 0,
        done: false,
      };
      updatedCounters.push(counter);
    }

    const prevPower = prevPowerStates.get(address) || false;
    const isRisingEdge = config.power && !prevPower;

    if (config.type === 'CTU') {
      if (isRisingEdge) {
        counter.count += 1;
      }
      counter.done = counter.count >= counter.preset;
    }
    
    if (config.type === 'CTD') {
      if (isRisingEdge) {
        counter.count -= 1;
      }
      counter.done = counter.count <= 0; // Or whatever logic preferred
    }

    if (config.type === 'RST') {
      if (config.power) {
        counter.count = 0;
        counter.done = false;
      }
    }
  });

  return updatedCounters;
}
