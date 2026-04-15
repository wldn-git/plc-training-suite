import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/db';
import type { ProgressRecord, CompletionStatus } from '@/types/common.types';

export function useProgress() {
  const allProgress = useLiveQuery(() => db.learningProgress.toArray()) || [];

  const updateProgress = async (moduleId: string, status: CompletionStatus) => {
    const existing = await db.learningProgress.where('moduleId').equals(moduleId).first();
    
    if (existing) {
      return await db.learningProgress.update(existing.id, {
        status,
        updatedAt: new Date()
      });
    } else {
      return await db.learningProgress.add({
        id: crypto.randomUUID(),
        moduleId,
        status,
        updatedAt: new Date()
      } as ProgressRecord);
    }
  };

  const getModuleStatus = (moduleId: string): CompletionStatus => {
    return allProgress.find(p => p.moduleId === moduleId)?.status || 'belum';
  };

  const calculateOverallProgress = () => {
    const completed = allProgress.filter(p => p.status === 'selesai').length;
    return Math.round((completed / 12) * 100);
  };

  const calculateStreak = () => {
    if (allProgress.length === 0) return 0;
    
    // Ambil tanggal unik (YYYY-MM-DD) dari semua progress
    const dates = allProgress
      .map(p => p.updatedAt.toISOString().split('T')[0])
      .sort((a, b) => b.localeCompare(a)); // Terbaru dulu
    
    const uniqueDates = [...new Set(dates)];
    let streak = 0;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];

    // Cek jika ada aktivitas hari ini atau kemarin sebagai permulaan streak
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      const current = new Date(uniqueDates[i]);
      const nextExpected = new Date();
      nextExpected.setDate(new Date(uniqueDates[0]).getDate() - streak);
      
      if (current.toISOString().split('T')[0] === nextExpected.toISOString().split('T')[0]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getLastOpenedModule = () => {
    return [...allProgress].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];
  };

  return {
    allProgress,
    updateProgress,
    getModuleStatus,
    calculateOverallProgress,
    calculateStreak,
    getLastOpenedModule,
  };
}
