// src/pages/Assessment/QuizResult.tsx
// Halaman hasil quiz: skor, review jawaban, dan ekspor sertifikat PDF

import { useState, useRef } from 'react';
import {
  Trophy, RotateCcw, CheckCircle, XCircle,
  FileText, ChevronDown, ChevronUp, Award, Clock,
  Target, BookOpen, Download
} from 'lucide-react';
import { QuizSession } from '../../hooks/useAssessment';

// ─── PDF Generator ────────────────────────────────────────
// Menggunakan canvas + window.print() tanpa dependency eksternal

function generateCertificatePDF(session: QuizSession) {
  const categoryLabels: Record<string, string> = {
    'level-1': 'Dasar PLC',
    'level-2': 'Tipe I/O',
    'level-3': 'Instruksi Dasar',
    'level-4': 'Lanjutan',
  };

  const dateStr = new Date(session.completedAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const certWindow = window.open('', '_blank');
  if (!certWindow) return;

  const categoryLabel = categoryLabels[session.category] ?? session.category;

  certWindow.document.write(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat PLC Training Suite</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 210mm; min-height: 148mm;
      background: #0a0c12;
      display: flex; align-items: center; justify-content: center;
      padding: 0;
    }
    .cert {
      width: 210mm; height: 148mm;
      background: linear-gradient(135deg, #0d1020 0%, #141829 50%, #0d1020 100%);
      border: 1.5px solid #1e2a4a;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      position: relative; overflow: hidden;
      padding: 16mm 20mm;
      font-family: 'DM Sans', sans-serif;
    }
    .corner {
      position: absolute;
      width: 40mm; height: 40mm;
      border-color: #00d4ff33;
      border-style: solid;
    }
    .corner-tl { top: 6mm; left: 6mm; border-width: 0.5mm 0 0 0.5mm; }
    .corner-tr { top: 6mm; right: 6mm; border-width: 0.5mm 0.5mm 0 0; }
    .corner-bl { bottom: 6mm; left: 6mm; border-width: 0 0 0.5mm 0.5mm; }
    .corner-br { bottom: 6mm; right: 6mm; border-width: 0 0.5mm 0.5mm 0; }
    .badge-row {
      display: flex; align-items: center; gap: 6px; margin-bottom: 6mm;
    }
    .badge-line { width: 15mm; height: 0.3px; background: #00d4ff55; }
    .badge-text {
      font-family: 'DM Sans', monospace;
      font-size: 7pt; letter-spacing: 0.2em;
      color: #00d4ff; text-transform: uppercase;
    }
    .cert-title {
      font-family: 'Playfair Display', serif;
      font-size: 26pt; font-weight: 700;
      color: #e8f4f8; text-align: center;
      line-height: 1.1; margin-bottom: 5mm;
    }
    .cert-subtitle {
      font-size: 9pt; color: #7a9bb5;
      text-align: center; margin-bottom: 8mm; letter-spacing: 0.05em;
    }
    .category-label {
      font-size: 11pt; font-weight: 500; color: #00d4ff;
      border: 0.5px solid #00d4ff44;
      padding: 2mm 8mm; border-radius: 20mm;
      background: #00d4ff10;
      margin-bottom: 8mm; text-align: center;
    }
    .score-row {
      display: flex; gap: 12mm; margin-bottom: 8mm;
    }
    .score-item { text-align: center; }
    .score-num {
      font-family: 'Playfair Display', serif;
      font-size: 22pt; font-weight: 700;
      color: #ffffff; line-height: 1;
    }
    .score-unit { font-size: 11pt; color: #00d4ff; }
    .score-label { font-size: 7pt; color: #5a7a99; margin-top: 1mm; letter-spacing: 0.1em; text-transform: uppercase; }
    .divider { width: 30mm; height: 0.3px; background: #1e2a4a; margin: 0 6mm; align-self: center; }
    .footer-row {
      display: flex; align-items: flex-end; gap: 20mm;
      border-top: 0.3px solid #1e2a4a; padding-top: 5mm; width: 100%;
    }
    .footer-col { flex: 1; }
    .footer-label { font-size: 6.5pt; color: #4a6a80; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 1mm; }
    .footer-val { font-size: 8.5pt; color: #8ab0c8; }
    .footer-brand { font-size: 7pt; color: #2a4a60; text-align: right; }
    .cert-id { font-family: 'DM Sans', monospace; font-size: 6pt; color: #2a4060; }
    @media print {
      body { background: white; }
      .cert { border: none; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="cert">
  <div class="corner corner-tl"></div>
  <div class="corner corner-tr"></div>
  <div class="corner corner-bl"></div>
  <div class="corner corner-br"></div>

  <div class="badge-row">
    <div class="badge-line"></div>
    <div class="badge-text">Sertifikat Kompetensi</div>
    <div class="badge-line"></div>
  </div>

  <div class="cert-title">PLC Training Suite</div>
  <div class="cert-subtitle">Telah menyelesaikan penilaian dengan hasil memuaskan</div>

  <div class="category-label">${categoryLabel}</div>

  <div class="score-row">
    <div class="score-item">
      <div class="score-num">${session.score}<span class="score-unit">%</span></div>
      <div class="score-label">Skor Akhir</div>
    </div>
    <div class="divider"></div>
    <div class="score-item">
      <div class="score-num">${session.correctCount}<span style="font-size:14pt">/${session.totalQuestions}</span></div>
      <div class="score-label">Jawaban Benar</div>
    </div>
  </div>

  <div class="footer-row">
    <div class="footer-col">
      <div class="footer-label">Diterbitkan</div>
      <div class="footer-val">${dateStr}</div>
    </div>
    <div class="footer-col">
      <div class="footer-label">Tingkat</div>
      <div class="footer-val">${session.difficulty === 'semua' ? 'Semua Level' : session.difficulty.charAt(0).toUpperCase() + session.difficulty.slice(1)}</div>
    </div>
    <div class="footer-col" style="text-align:right">
      <div class="footer-brand">WLDN-Soft · PLC Training Suite</div>
      <div class="cert-id">${session.id}</div>
    </div>
  </div>
</div>
<script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`);
  certWindow.document.close();
}

// ─── Review Item ──────────────────────────────────────────

function ReviewItem({
  index,
  question,
  selectedIndex,
  isCorrect,
}: {
  index: number;
  question: { question: string; options: readonly string[]; correctIndex: number; explanation: string; moduleRef?: string };
  selectedIndex: number | null;
  isCorrect: boolean;
}) {
  const [open, setOpen] = useState(false);
  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div className={`
      rounded-xl border transition-all duration-200
      ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}
    `}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5
          ${isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'}
        `}>
          {isCorrect
            ? <CheckCircle size={13} className="text-emerald-400" />
            : <XCircle size={13} className="text-red-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-slate-500">Soal {index + 1}</span>
            {selectedIndex === null && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">Dilewati</span>
            )}
          </div>
          <p className="text-sm text-slate-200 leading-snug line-clamp-2">{question.question}</p>
        </div>

        <div className="flex-shrink-0 text-slate-500 mt-0.5">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          <div className="space-y-1.5 mt-3">
            {question.options.map((opt, i) => {
              const isThisCorrect = i === question.correctIndex;
              const isThisSelected = i === selectedIndex;
              let cls = 'text-slate-500 bg-transparent';
              if (isThisCorrect) cls = 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/25';
              else if (isThisSelected && !isCorrect) cls = 'text-red-300 bg-red-500/10 border border-red-500/25';
              return (
                <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${cls}`}>
                  <span className="font-mono font-bold flex-shrink-0">{LABELS[i]}.</span>
                  <span className="leading-relaxed">{opt}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-white/4 border border-white/8">
            <p className="text-xs text-slate-300 leading-relaxed">{question.explanation}</p>
            {question.moduleRef && (
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">Ref: Modul {question.moduleRef}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────

interface QuizResultProps {
  session: QuizSession;
  onRetry: () => void;
  onBackToSelector: () => void;
}

export default function QuizResult({ session, onRetry, onBackToSelector }: QuizResultProps) {
  const { score, correctCount, totalQuestions, certified, durationSeconds, category, answers, questions } = session;

  const categoryLabels: Record<string, string> = {
    'level-1': 'Dasar PLC',
    'level-2': 'Tipe I/O',
    'level-3': 'Instruksi Dasar',
    'level-4': 'Lanjutan',
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const scoreColor =
    score >= 80 ? 'text-emerald-400' :
    score >= 60 ? 'text-amber-400' :
    'text-red-400';

  const scoreRingColor =
    score >= 80 ? 'stroke-emerald-500' :
    score >= 60 ? 'stroke-amber-500' :
    'stroke-red-500';

  // SVG circle progress
  const R = 52;
  const C = 2 * Math.PI * R;
  const offset = C - (score / 100) * C;

  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-100 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* ── Score Card ─────────────────────────── */}
        <div className={`
          rounded-2xl border p-8 mb-6 text-center relative overflow-hidden
          ${certified
            ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-500/8 to-transparent'
            : score >= 60
            ? 'border-amber-500/25 bg-gradient-to-b from-amber-500/5 to-transparent'
            : 'border-red-500/25 bg-gradient-to-b from-red-500/5 to-transparent'}
        `}>

          {/* Score Ring */}
          <div className="flex justify-center mb-5">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={R} fill="none" stroke="#ffffff0d" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r={R} fill="none"
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={offset}
                  className={`${scoreRingColor} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold font-mono tabular-nums ${scoreColor}`}>{score}</span>
                <span className="text-xs text-slate-500 font-mono">/ 100</span>
              </div>
            </div>
          </div>

          {/* Status label */}
          <div className="mb-2">
            {certified ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Award size={14} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-300">Lulus — Sertifikat Tersedia</span>
              </div>
            ) : score >= 60 ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/12 border border-amber-500/25">
                <Target size={14} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">Hampir Lulus — Coba Lagi</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/12 border border-red-500/25">
                <BookOpen size={14} className="text-red-400" />
                <span className="text-sm font-semibold text-red-300">Perlu Belajar Lebih — Pelajari Materi</span>
              </div>
            )}
          </div>

          <p className="text-slate-400 text-sm mb-6">
            {categoryLabels[category]} · {certified ? 'Skor ≥ 80%' : `Butuh ${80 - score}% lagi untuk sertifikat`}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/8">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle size={13} className="text-emerald-400" />
                <span className="text-lg font-bold text-white tabular-nums">{correctCount}</span>
                <span className="text-slate-500 text-sm">/ {totalQuestions}</span>
              </div>
              <p className="text-[11px] text-slate-500">Jawaban Benar</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle size={13} className="text-red-400" />
                <span className="text-lg font-bold text-white tabular-nums">{totalQuestions - correctCount}</span>
              </div>
              <p className="text-[11px] text-slate-500">Jawaban Salah</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock size={13} className="text-slate-400" />
                <span className="text-lg font-bold text-white tabular-nums font-mono">{formatDuration(durationSeconds)}</span>
              </div>
              <p className="text-[11px] text-slate-500">Waktu Terpakai</p>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ──────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
          {certified && (
            <button
              onClick={() => generateCertificatePDF(session)}
              className="
                col-span-1 sm:col-span-3
                flex items-center justify-center gap-2
                py-3.5 rounded-xl
                bg-emerald-500 hover:bg-emerald-400
                text-slate-900 font-semibold text-sm
                shadow-lg shadow-emerald-500/20
                transition-all duration-200 active:scale-[0.98]
              "
            >
              <Download size={15} />
              Unduh Sertifikat PDF
            </button>
          )}
          <button
            onClick={onRetry}
            className="
              flex items-center justify-center gap-1.5
              py-3 rounded-xl border border-white/10
              bg-white/5 hover:bg-white/8
              text-slate-300 text-sm font-medium
              transition-all duration-200
            "
          >
            <RotateCcw size={14} />
            Coba Lagi
          </button>
          <button
            onClick={onBackToSelector}
            className="
              col-span-2 flex items-center justify-center gap-1.5
              py-3 rounded-xl border border-white/10
              bg-white/5 hover:bg-white/8
              text-slate-300 text-sm font-medium
              transition-all duration-200
            "
          >
            <FileText size={14} />
            Pilih Quiz Lain
          </button>
        </div>

        {/* ── Review Jawaban ──────────────────────── */}
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
            Review Jawaban
          </p>
          <div className="space-y-2">
            {answers.map((answer, i) => {
              const q = questions[i];
              if (!q) return null;
              return (
                <ReviewItem
                  key={q.id}
                  index={i}
                  question={q}
                  selectedIndex={answer.selectedIndex}
                  isCorrect={answer.isCorrect}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
