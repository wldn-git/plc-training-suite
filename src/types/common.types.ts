// ============================================================
// Common / Shared Types
// ============================================================

export type CompletionStatus = 'belum' | 'sedang' | 'selesai';

export interface ProgressRecord {
  id: string;
  moduleId: string;
  userId?: string;
  status: CompletionStatus;
  lastPosition?: number;   // Halaman/scroll position terakhir
  updatedAt: Date;
}

export interface UserSettings {
  key: string;             // Primary key for Dexie
  theme: 'dark' | 'light';
  language: 'id' | 'en';
  userName: string;
  soundEnabled: boolean;
  animationsEnabled: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface StorageEstimate {
  usage: number;           // bytes
  quota: number;           // bytes
  percentUsed: number;
}
