// src/pages/Assessment/QuizSelector.tsx
// Halaman pemilihan kategori, kesulitan, dan jumlah soal

import { useState } from 'react';
import { QuizCategory, DifficultyLevel } from '../../constants/quizBank';
import { QuizConfig } from '../../hooks/useAssessment';
import { Cpu, Plug, GitBranch, Zap, ChevronRight, Clock, BookOpen, Trophy } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────

const CATEGORIES: {
  id: QuizCategory;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  badgeColor: string;
  totalQuestions: number;
}[] = [
  {
    id: 'level-1',
    label: 'Dasar PLC',
    subtitle: 'Pengenalan, hardware, dan scan cycle',
    icon: <Cpu size={22} />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400/70',
    badgeColor: 'bg-cyan-500/15 text-cyan-300',
    totalQuestions: 12,
  },
  {
    id: 'level-2',
    label: 'Tipe I/O',
    subtitle: 'Digital, analog, wiring, addressing',
    icon: <Plug size={22} />,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400/70',
    badgeColor: 'bg-emerald-500/15 text-emerald-300',
    totalQuestions: 12,
  },
  {
    id: 'level-3',
    label: 'Instruksi Dasar',
    subtitle: 'Kontak, koil, timer, counter',
    icon: <GitBranch size={22} />,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400/70',
    badgeColor: 'bg-amber-500/15 text-amber-300',
    totalQuestions: 12,
  },
  {
    id: 'level-4',
    label: 'Lanjutan',
    subtitle: 'Scaling, data, troubleshooting',
    icon: <Zap size={22} />,
    color: 'text-violet-400',
    borderColor: 'border-violet-500/40 hover:border-violet-400/70',
    badgeColor: 'bg-violet-500/15 text-violet-300',
    totalQuestions: 12,
  },
];

const DIFFICULTIES: { id: DifficultyLevel | 'semua'; label: string; desc: string }[] = [
  { id: 'semua', label: 'Semua Level', desc: 'Mudah + Sedang + Sulit' },
  { id: 'mudah', label: 'Mudah', desc: 'Konsep dasar dan definisi' },
  { id: 'sedang', label: 'Sedang', desc: 'Aplikasi dan analisa' },
  { id: 'sulit', label: 'Sulit', desc: 'Perhitungan dan troubleshooting' },
];

const QUESTION_COUNTS = [5, 10, 12];

// ─── Component ────────────────────────────────────────────

interface QuizSelectorProps {
  onStart: (config: QuizConfig) => void;
}

export default function QuizSelector({ onStart }: QuizSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'semua'>('semua');
  const [questionCount, setQuestionCount] = useState(10);

  const selectedCat = CATEGORIES.find((c) => c.id === selectedCategory);
  const canStart = selectedCategory !== null;

  const handleStart = () => {
    if (!selectedCategory) return;
    onStart({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      questionCount,
      timeLimitSeconds: 900, // 15 menit
    });
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 px-4 py-10 md:py-16">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <Trophy size={13} className="text-cyan-400" />
            <span className="text-xs text-cyan-300 font-mono tracking-widest uppercase">Assessment</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Pilih Quiz
          </h1>
          <p className="text-slate-400 text-sm">
            Uji pemahaman materi PLC dengan batas waktu 15 menit
          </p>
        </div>

        {/* Step 1: Pilih Kategori */}
        <section className="mb-8">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
            01 — Pilih Kategori
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  relative p-4 rounded-xl border text-left transition-all duration-200
                  bg-[#1A1D2E]
                  ${selectedCategory === cat.id
                    ? `border-opacity-100 ${cat.borderColor} ring-1 ring-current`
                    : `border-white/10 ${cat.borderColor}`
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`mt-0.5 ${cat.color}`}>{cat.icon}</div>
                  {selectedCategory === cat.id && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${cat.badgeColor}`}>
                      Dipilih
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className={`font-semibold text-sm ${cat.color}`}>{cat.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.subtitle}</p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-slate-500">
                  <BookOpen size={11} />
                  <span className="text-[11px] font-mono">{cat.totalQuestions} soal tersedia</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Tingkat Kesulitan */}
        <section className="mb-8">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
            02 — Tingkat Kesulitan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`
                  p-3 rounded-xl border text-left transition-all duration-200
                  ${selectedDifficulty === diff.id
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                    : 'border-white/10 bg-[#1A1D2E] text-slate-400 hover:border-white/20'
                  }
                `}
              >
                <p className="text-xs font-semibold">{diff.label}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{diff.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Step 3: Jumlah Soal */}
        <section className="mb-10">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">
            03 — Jumlah Soal
          </p>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`
                  flex-1 py-3 rounded-xl border text-sm font-mono font-semibold
                  transition-all duration-200
                  ${questionCount === count
                    ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-300'
                    : 'border-white/10 bg-[#1A1D2E] text-slate-400 hover:border-white/20'
                  }
                `}
              >
                {count} Soal
              </button>
            ))}
          </div>
        </section>

        {/* Summary & Start */}
        <div className={`
          rounded-2xl border p-5 mb-5 transition-all duration-300
          ${canStart
            ? 'border-white/15 bg-[#1A1D2E]'
            : 'border-white/5 bg-[#1A1D2E]/50 opacity-50'
          }
        `}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-slate-400">
                <BookOpen size={14} />
                <span className="text-sm">
                  {canStart ? (
                    <span className="text-white font-semibold">{questionCount} soal</span>
                  ) : (
                    '— soal'
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock size={14} />
                <span className="text-sm text-white font-semibold">15 menit</span>
              </div>
              {canStart && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCat?.badgeColor}`}>
                    {selectedCat?.label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Sertifikat diberikan jika skor ≥ 80%. Lulus = {Math.ceil(questionCount * 0.8)} dari {questionCount} soal benar.
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!canStart}
          className={`
            w-full py-4 rounded-2xl font-semibold text-sm
            flex items-center justify-center gap-2
            transition-all duration-200
            ${canStart
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/20 active:scale-[0.98]'
              : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }
          `}
        >
          Mulai Quiz
          <ChevronRight size={16} />
        </button>

        {!canStart && (
          <p className="text-center text-xs text-slate-600 mt-3">
            Pilih kategori terlebih dahulu
          </p>
        )}
      </div>
    </div>
  );
}
