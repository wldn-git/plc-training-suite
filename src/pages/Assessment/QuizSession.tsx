import React from 'react';
import { motion } from 'framer-motion';
import { Card, Badge } from '@/components/ui';
import { Timer } from 'lucide-react';
import type { QuizQuestion } from '@/types/assessment.types';

interface QuizSessionProps {
  currentQuestion: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  onSubmit: (index: number) => void;
}

export const QuizSession: React.FC<QuizSessionProps> = ({
  currentQuestion,
  currentIndex,
  totalQuestions,
  timeLeft,
  onSubmit,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between px-2">
         <div className="flex flex-col">
           <span className="font-mono text-[10px] text-text-dim uppercase font-bold tracking-widest">Progress Logic</span>
           <span className="font-mono text-sm text-text-primary">Question {currentIndex + 1} of {totalQuestions}</span>
         </div>
         <div className={`flex items-center gap-2 font-mono text-lg font-black ${timeLeft < 60 ? 'text-danger animate-pulse' : 'text-accent'}`}>
           <Timer size={20} /> {formatTime(timeLeft)}
         </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden border border-white/5 p-[2px]">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
           className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" 
         />
      </div>

      {/* Question Card */}
      <Card className="p-8 lg:p-12 border-accent/20 bg-gradient-to-br from-bg-surface to-bg-elevated">
        <Badge variant="accent" className="mb-6 opacity-80 uppercase tracking-tighter italic font-bold">
          PLC Module Level {currentQuestion.category}
        </Badge>
        <h2 className="text-xl lg:text-2xl font-mono font-bold leading-tight mb-10 text-text-primary">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSubmit(idx)}
              className="w-full flex items-center gap-4 p-5 rounded-xl border border-border bg-black/40 hover:border-accent hover:bg-accent/5 transition-all text-left group"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-bg-elevated border border-border flex items-center justify-center font-mono text-sm font-black group-hover:bg-accent group-hover:text-bg transition-colors">
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-text-primary text-sm font-semibold">{option}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      <p className="text-center text-[10px] text-text-dim italic">
        * Jawaban yang sudah diklik akan langsung tersimpan. Gunakan insting industrialmu!
      </p>
    </div>
  );
};
