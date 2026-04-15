import Dexie, { type EntityTable } from 'dexie';
import type { PLCDevice, SimulatorProject } from '@/types/plc.types';
import type { QuizSession } from '@/types/assessment.types';
import type { ProgressRecord, UserSettings } from '@/types/common.types';

// ============================================================
// Database Definition
// ============================================================

const db = new Dexie('PLCTrainingDB') as Dexie & {
  plcCatalog: EntityTable<PLCDevice, 'id'>;
  projects: EntityTable<SimulatorProject, 'id'>;
  quizHistory: EntityTable<QuizSession, 'id'>;
  learningProgress: EntityTable<ProgressRecord, 'id'>;
  userSettings: EntityTable<UserSettings, 'key'>;
};

db.version(1).stores({
  plcCatalog:       '++id, brand, series, createdAt',
  projects:         '++id, name, updatedAt',
  quizHistory:      '++id, category, score, completedAt',
  learningProgress: '++id, moduleId, status, updatedAt',
  userSettings:     'key',
});

export { db };
