import { useEffect, useRef, useCallback } from 'react';
import { useSimulatorStore } from '@/store/simulatorStore';
import { runScanCycle } from '@/lib/simulators/scanCycle';
import { db } from '@/lib/db/db';

export function useSimulator() {
  const store = useSimulatorStore();
  const scanIntervalRef = useRef<number | null>(null);
  const lastScanTimeRef = useRef<number>(Date.now());
  const prevPowerStatesRef = useRef<Map<string, boolean>>(new Map());

  const stopScan = useCallback(() => {
    if (scanIntervalRef.current) {
      window.clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, []);

  const runScan = useCallback(() => {
    if (store.mode !== 'RUN') return;
    
    const now = Date.now();
    const deltaTime = now - lastScanTimeRef.current;
    lastScanTimeRef.current = now;

    // Guard: hentikan jika scan terlalu berat (>1000ms)
    // Biasanya ini terjadi jika tab backgrounded atau CPU overload
    if (deltaTime > 1000) {
      console.warn('⚠️ Scan cycle exceeds 1000ms, emergency stop!');
      store.setMode('STOP');
      return;
    }

    const result = runScanCycle(
      store.rungs,
      store.ioPoints,
      store.timers,
      store.counters,
      prevPowerStatesRef.current,
      deltaTime
    );

    // Update global state
    store.updateTimers(result.timers);
    store.updateCounters(result.counters);
    store.setActiveRungs(result.rungResults.filter(r => r.power).map(r => r.rungId));
    
    // Update Outputs in Store (Side Effect of Evaluation)
    Object.entries(result.outputs).forEach(([addr, val]) => {
      // Find current value in store
      const currentIO = store.ioPoints.find(p => p.address === addr);
      if (currentIO && currentIO.value !== val && !currentIO.forced) {
        // Otomatis update output jika tidak sedang dipicu manual oleh user
        store.forceIO(addr, val as boolean);
      }
    });

    // Save current power states for next scan (edge detection)
    const newPowerStates = new Map();
    result.rungResults.forEach(r => {
      r.elementResults.forEach(el => {
        newPowerStates.set(el.elementId, el.value);
      });
    });
    // Juga simpan power per operand/address jika perlu (tapi elementId lebih akurat untuk dnd)
    // Untuk counter kita biasanya pakai address counter itu sendiri
    result.counters.forEach(() => {
       // logic edge detection di counterEngine menggunakan power ke instruksi, 
       // jadi kita harus simpan power state elemen instruksi tersebut.
    });
    // Optimization: simpan semua elemen power state
    prevPowerStatesRef.current = newPowerStates;

    store.incrementScanCount();
  }, [store]);

  // Handle Mode Changes (RUN, STOP, PAUSE)
  useEffect(() => {
    if (store.mode === 'RUN') {
      lastScanTimeRef.current = Date.now();
      scanIntervalRef.current = window.setInterval(runScan, store.cycleTime);
    } else {
      stopScan();
    }

    return () => stopScan();
  }, [store.mode, store.cycleTime, runScan, stopScan]);

  const saveToDatabase = async (name: string) => {
    return await db.projects.add({
      id: crypto.randomUUID(),
      name,
      rungs: store.rungs,
      ioPoints: store.ioPoints,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return {
    mode: store.mode,
    setMode: store.setMode,
    saveProject: saveToDatabase,
    clearAll: store.reset,
    // Helper untuk force input manual oleh user (Physical Simulation)
    toggleInput: (address: string) => store.toggleIO(address),
    forceIO: store.forceIO,
  };
}
