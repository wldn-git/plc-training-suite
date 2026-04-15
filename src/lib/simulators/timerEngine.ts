import type { TimerState } from '@/types/simulator.types';

// ============================================================
// Timer Engine — TON & TOF Logic
// ============================================================

export function processTimers(
  timers: TimerState[],
  activeTimerAddresses: Map<string, { power: boolean; type: string; preset: number }>,
  deltaTime: number // Waktu sejak scan terakhir (misal 100ms)
): TimerState[] {
  const updatedTimers: TimerState[] = [...timers];

  activeTimerAddresses.forEach((config, address) => {
    let timer = updatedTimers.find(t => t.address === address);
    
    if (!timer) {
      timer = {
        address,
        preset: config.preset,
        accumulated: 0,
        running: false,
        done: false,
      };
      updatedTimers.push(timer);
    }

    if (config.type === 'TON') {
      if (config.power) {
        timer.running = true;
        if (timer.accumulated < timer.preset) {
          timer.accumulated += deltaTime;
        }
        if (timer.accumulated >= timer.preset) {
          timer.done = true;
        }
      } else {
        // Reset TON jika power hilang
        timer.accumulated = 0;
        timer.running = false;
        timer.done = false;
      }
    }
    
    if (config.type === 'TOF') {
      if (config.power) {
        timer.running = false;
        timer.accumulated = 0;
        timer.done = true;
      } else {
        // Mulai menghitung saat power hilang
        timer.running = true;
        if (timer.accumulated < timer.preset) {
          timer.accumulated += deltaTime;
        }
        if (timer.accumulated >= timer.preset) {
          timer.done = false;
        }
      }
    }

    if (config.type === 'TP') {
      if (config.power && !timer.done && !timer.running) {
        // Start pulse
        timer.running = true;
        timer.accumulated = 0;
        timer.done = true; // Output is high during pulse
      }

      if (timer.running) {
        timer.accumulated += deltaTime;
        if (timer.accumulated >= timer.preset) {
          timer.running = false;
          timer.done = false; // Pulse ended
        }
      }

      if (!config.power && !timer.running) {
        // Ready for next pulse
        timer.accumulated = 0;
        timer.done = false;
      }
    }
  });

  return updatedTimers;
}
