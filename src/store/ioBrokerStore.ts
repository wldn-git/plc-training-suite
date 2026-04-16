import { create } from 'zustand';

// ============================================================
// I/O Broker Store — State Management untuk Simulasi Hardware
// ============================================================

export interface IOPoint {
  address: string;
  label: string;
  type: 'DI' | 'DO' | 'AI' | 'AO';
  value: boolean | number;
}

export interface BrokerSettings {
  url: string; // e.g., wss://broker.emqx.io:8084/mqtt
  baseTopic: string; // e.g., plts/io
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
}

interface IOBrokerState {
  settings: BrokerSettings;
  inputs: Record<string, IOPoint>;  // Diterima dari PLC (PLC Outputs -> Simulator Inputs)
  outputs: Record<string, IOPoint>; // Dikirim ke PLC (Simulator UI -> PLC Inputs)
  
  updateSettings: (partial: Partial<BrokerSettings>) => void;
  setInputValue: (address: string, value: boolean | number) => void;
  setOutputValue: (address: string, value: boolean | number) => void;
  resetIO: () => void;
}

export const useIOBrokerStore = create<IOBrokerState>((set) => ({
  settings: {
    url: 'wss://broker.emqx.io:8084/mqtt',
    baseTopic: 'plts/lab-01',
    status: 'disconnected',
  },
  
  inputs: {},
  outputs: {},

  updateSettings: (partial) => set((state) => ({
    settings: { ...state.settings, ...partial }
  })),

  setInputValue: (address, value) => set((state) => ({
    inputs: {
      ...state.inputs,
      [address]: { ...state.inputs[address], address, value }
    }
  })),

  setOutputValue: (address, value) => set((state) => ({
    outputs: {
      ...state.outputs,
      [address]: { ...state.outputs[address], address, value }
    }
  })),

  resetIO: () => set({ inputs: {}, outputs: {} }),
}));
