import React from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { ClipboardCheck, ArrowRight, CheckCircle, Timer } from 'lucide-react';
import { LEARNING_LEVELS } from '@/constants/learningModules';
import type { QuizLevel } from '@/types/assessment.types';

interface QuizSelectorProps {
  onStart: (level: QuizLevel) => void;
}

export const QuizSelector: React.FC<QuizSelectorProps> = ({ onStart }) => {
  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <header>
        <h1 className="text-3xl font-mono font-black text-text-primary italic uppercase tracking-tighter">
          Sertifikasi <span className="text-accent">Kompetensi</span>
        </h1>
        <p className="text-text-muted text-sm mt-2 max-w-2xl">
          Tunjukkan keahlianmu. Selesaikan kuis dengan skor minimal 80% untuk mendapatkan sertifikat digital 
          yang dapat kamu lampirkan di portofolio industri.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEARNING_LEVELS.map((lvl) => {
          const levelNum = parseInt(lvl.id.replace('level-', '')) as QuizLevel;
          return (
            <Card key={lvl.id} hoverable className="p-6 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <ClipboardCheck size={24} />
                </div>
                <Badge variant={lvl.color as any}>{lvl.title.split(':')[0]}</Badge>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-mono text-xl font-bold mb-2 group-hover:text-accent transition-colors">{lvl.title}</h3>
                <p className="text-text-muted text-xs mb-6 line-clamp-2">
                  Ujian mencakup teori arsitektur PLC, pemrograman ladder, dan troubleshooting {lvl.title.split(':')[0]}.
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4 relative z-10">
                <div className="flex gap-4 text-[10px] font-mono text-text-dim uppercase tracking-widest font-bold">
                   <span className="flex items-center gap-1"><CheckCircle size={10} /> 10 Soal</span>
                   <span className="flex items-center gap-1"><Timer size={10} /> 15 Min</span>
                </div>
                <Button 
                   size="sm" 
                   rightIcon={<ArrowRight size={14} />}
                   onClick={() => onStart(levelNum)}
                >
                  Mulai Ujian
                </Button>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-opacity">
                 <ClipboardCheck size={120} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
