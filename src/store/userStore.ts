import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '@/types/common.types';

// ============================================================
// User Store — Profil & Preferensi User (persisted)
// ============================================================

interface UserState {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  toggleTheme: () => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  key: 'user-settings',
  theme: 'dark',
  language: 'id',
  userName: 'Teknisi',
  soundEnabled: false,
  animationsEnabled: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),

      toggleTheme: () => {
        const current = get().settings.theme;
        set((state) => ({
          settings: { ...state.settings, theme: current === 'dark' ? 'light' : 'dark' },
        }));
      },

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'plc-user-settings',
    }
  )
);
