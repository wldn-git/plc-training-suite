// src/pages/Assessment/QuizSession.tsx
// Tampilan soal aktif dengan timer countdown dan feedback jawaban

import { useEffect, useState } from 'react';
import { Clock, ChevronRight, SkipForward, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion } from '../../constants/quizBank';
import { AnswerRecord } from '../../hooks/useAssessment';

// ─── Option Button ─────────────────────────────────────────

function OptionButton({
  label,
  text,
  isSelected,
  isRevealed,
  isCorrect,
  isThisCorrect,
  onClick,
  disabled,
}: {
  label: string;
  text: string;
  isSelected: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  isThisCorrect: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  let stateClass = 'border-white/10 bg-[#1A1D2E] text-slate-300 hover:border-white/25 hover:bg-white/5';

  if (isRevealed) {
    if (isThisCorrect) {
      stateClass = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
    } else if (isSelected && !isCorrect) {
      stateClass = 'border-red-500/60 bg-red-500/10 text-red-300';
    } else {
      stateClass = 'border-white/5 bg-[#1A1D2E]/50 text-slate-500 opacity-50';
    }
  } else if (isSelected) {
    stateClass = 'border-cyan-500/60 bg-cyan-500/10 text-cyan-200';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 rounded-xl border text-left
        flex items-start gap-3
        transition-all duration-200 ease-out
        ${stateClass}
        ${disabled && !isRevealed ? 'cursor-default' : ''}
        ${!isRevealed && !disabled ? 'cursor-pointer active:scale-[0.99]' : ''}
      `}
    >
      {/* Label huruf */}
      <span className={`
        flex-shrink-0 w-6 h-6 rounded-md text-[11px] font-mono font-bold
        flex items-center justify-center mt-0.5
        transition-colors duration-200
        ${isRevealed && isThisCorrect ? 'bg-emerald-500/30 text-emerald-300' :
          isRevealed && isSelected && !isCorrect ? 'bg-red-500/30 text-red-300' :
          isSelected ? 'bg-cyan-500/30 text-cyan-300' :
          'bg-white/8 text-slate-400'}
      `}>
        {label}
      </span>

      <span className="text-sm leading-relaxed flex-1">{text}</span>

      {/* Icon feedback */}
      {isRevealed && isThisCorrect && (
        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
      )}
      {isRevealed && isSelected && !isCorrect && !isThisCorrect && (
        <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
      )}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────

interface QuizSessionProps {
  question: QuizQuestion;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  answers: AnswerRecord[];
  selectedOption: number | null;
  isAnswerRevealed: boolean;
  timeLeftFormatted: string;
  timeLeft: number;
  isTimeCritical: boolean;
  onSelectOption: (index: number) => void;
  onConfirmAnswer: () => void;
  onSkip: () => void;
}

export default function QuizSession({
  question,
  currentIndex,
  totalQuestions,
  progress,
  answers,
  selectedOption,
  isAnswerRevealed,
  timeLeftFormatted,
  timeLeft,
  isTimeCritical,
  onSelectOption,
  onConfirmAnswer,
  onSkip,
}: QuizSessionProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animasi masuk saat soal berganti
  useEffect(() => {
    setIsVisible(false);
    const t = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(t);
  }, [question.id]);

  const isCorrect = selectedOption !== null && selectedOption === question.correctIndex;
  const timerWarning = timeLeft <= 60;
  const timerDanger = timeLeft <= 30;

  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 flex flex-col">

      {/* ── Top Bar ─────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-[#0F1117]/95 backdrop-blur-sm border-b border-white/8 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">

          {/* Progress dots */}
          <div className="flex items-center gap-1 flex-1 overflow-hidden">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const answered = answers[i];
              let dotClass = 'bg-white/15'; // belum
              if (answered) {
                dotClass = answered.isCorrect ? 'bg-emerald-500' : 'bg-red-500';
              } else if (i === currentIndex) {
                dotClass = 'bg-cyan-400';
              }
              return (
                <div
                  key={i}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${dotClass}`}
                />
              );
            })}
          </div>

          {/* Counter */}
          <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
            {currentIndex + 1}/{totalQuestions}
          </span>

          {/* Timer */}
          <div className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            font-mono text-sm font-bold tabular-nums
            transition-all duration-300
            ${timerDanger
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : timerWarning
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'bg-white/8 text-slate-300 border border-white/10'}
          `}>
            <Clock size={13} />
            {timeLeftFormatted}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────── */}
      <div className="flex-1 px-4 py-8">
        <div
          className={`
            max-w-2xl mx-auto
            transition-all duration-300 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
          `}
        >
          {/* Metadata soal */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Soal {currentIndex + 1}
            </span>
            <span className="text-slate-700">·</span>
            <span className={`
              text-[10px] font-mono px-2 py-0.5 rounded-full
              ${question.difficulty === 'mudah' ? 'bg-emerald-500/15 text-emerald-400' :
                question.difficulty === 'sedang' ? 'bg-amber-500/15 text-amber-400' :
                'bg-red-500/15 text-red-400'}
            `}>
              {question.difficulty}
            </span>
          </div>

          {/* Pertanyaan */}
          <h2 className="text-base sm:text-lg font-medium text-white leading-relaxed mb-6">
            {question.question}
          </h2>

          {/* Pilihan jawaban */}
          <div className="space-y-2.5 mb-8">
            {question.options.map((opt, i) => (
              <OptionButton
                key={i}
                label={OPTION_LABELS[i]}
                text={opt}
                isSelected={selectedOption === i}
                isRevealed={isAnswerRevealed}
                isCorrect={isCorrect}
                isThisCorrect={i === question.correctIndex}
                onClick={() => onSelectOption(i)}
                disabled={isAnswerRevealed}
              />
            ))}
          </div>

          {/* Penjelasan (muncul setelah jawab) */}
          {isAnswerRevealed && (
            <div className={`
              rounded-xl border p-4 mb-6
              transition-all duration-300
              ${isCorrect
                ? 'border-emerald-500/30 bg-emerald-500/8'
                : 'border-amber-500/30 bg-amber-500/8'}
            `}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect
                  ? <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  : <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                }
                <span className={`text-xs font-semibold ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isCorrect ? 'Jawaban Benar!' : 'Kurang Tepat'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {question.explanation}
              </p>
              {question.moduleRef && (
                <p className="text-[10px] text-slate-500 mt-2 font-mono">
                  Referensi: Modul {question.moduleRef}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!isAnswerRevealed ? (
            <div className="flex gap-2">
              <button
                onClick={onSkip}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-slate-300 hover:border-white/20 text-sm transition-all duration-200"
              >
                <SkipForward size={14} />
                Lewati
              </button>
              <button
                onClick={onConfirmAnswer}
                disabled={selectedOption === null}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${selectedOption !== null
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
                    : 'bg-white/5 text-slate-600 cursor-not-allowed'}
                `}
              >
                Konfirmasi Jawaban
                <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 font-mono animate-pulse">
              Melanjutkan ke soal berikutnya...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
