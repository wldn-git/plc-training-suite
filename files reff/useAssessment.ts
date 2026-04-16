// src/hooks/useAssessment.ts
// Core logic hook untuk Assessment System — PLC Training Suite

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  QUIZ_BANK,
  getRandomQuestions,
  QuizCategory,
  QuizQuestion,
  DifficultyLevel,
} from '../constants/quizBank';

// ─── Types ────────────────────────────────────────────────

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number | null; // null = tidak dijawab (timeout)
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizSession {
  id: string;
  category: QuizCategory;
  difficulty: DifficultyLevel | 'semua';
  questions: QuizQuestion[];
  answers: AnswerRecord[];
  score: number;           // 0–100
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number; // total waktu yang dihabiskan
  certified: boolean;      // true jika score >= 80
  completedAt: Date;
}

export type AssessmentPhase =
  | 'idle'       // Belum mulai
  | 'session'    // Quiz sedang berjalan
  | 'result';    // Quiz selesai, tampilkan hasil

export interface QuizConfig {
  category: QuizCategory;
  difficulty: DifficultyLevel | 'semua';
  questionCount: number; // 5, 10, atau 12
  timeLimitSeconds: number; // default 900 (15 menit)
}

// ─── Storage Helpers (Dexie-compatible, fallback to localStorage) ──────────

const HISTORY_KEY = 'plc_quiz_history';

const saveSession = (session: QuizSession) => {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    existing.unshift(session); // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing.slice(0, 50))); // max 50 sessions
  } catch {
    // silently fail if storage full
  }
};

export const loadQuizHistory = (): QuizSession[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

// ─── Hook ─────────────────────────────────────────────────

export function useAssessment() {
  const [phase, setPhase] = useState<AssessmentPhase>('idle');
  const [config, setConfig] = useState<QuizConfig | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900);
  const [sessionResult, setSessionResult] = useState<QuizSession | null>(null);
  const [history, setHistory] = useState<QuizSession[]>(loadQuizHistory);

  // Refs untuk timer dan waktu per soal
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  // ─── Timer ──────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // ─── Auto-submit saat waktu habis ────────────────────────

  useEffect(() => {
    if (phase === 'session' && timeLeft === 0) {
      finishSession(answers, questions);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  // ─── Cleanup ─────────────────────────────────────────────

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ─── Start Quiz ──────────────────────────────────────────

  const startQuiz = useCallback((cfg: QuizConfig) => {
    const pool =
      cfg.difficulty === 'semua'
        ? QUIZ_BANK.filter((q) => q.category === cfg.category)
        : QUIZ_BANK.filter(
            (q) => q.category === cfg.category && q.difficulty === cfg.difficulty
          );

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(cfg.questionCount, shuffled.length));

    setConfig(cfg);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setSessionResult(null);
    setPhase('session');
    questionStartRef.current = Date.now();
    startTimer(cfg.timeLimitSeconds);
  }, [startTimer]);

  // ─── Select & Confirm Answer ─────────────────────────────

  const selectOption = useCallback((index: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
  }, [isAnswerRevealed]);

  const confirmAnswer = useCallback(() => {
    if (selectedOption === null || isAnswerRevealed) return;
    const q = questions[currentIndex];
    const timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);
    const isCorrect = selectedOption === q.correctIndex;

    const record: AnswerRecord = {
      questionId: q.id,
      selectedIndex: selectedOption,
      isCorrect,
      timeSpentSeconds: timeSpent,
    };

    const newAnswers = [...answers, record];
    setAnswers(newAnswers);
    setIsAnswerRevealed(true);

    // Auto-advance setelah 1.5 detik
    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        finishSession(newAnswers, questions);
      } else {
        setCurrentIndex((i) => i + 1);
        setSelectedOption(null);
        setIsAnswerRevealed(false);
        questionStartRef.current = Date.now();
      }
    }, 1500);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, isAnswerRevealed, questions, currentIndex, answers]);

  // ─── Skip Question ────────────────────────────────────────

  const skipQuestion = useCallback(() => {
    if (isAnswerRevealed) return;
    const q = questions[currentIndex];
    const timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);

    const record: AnswerRecord = {
      questionId: q.id,
      selectedIndex: null,
      isCorrect: false,
      timeSpentSeconds: timeSpent,
    };

    const newAnswers = [...answers, record];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= questions.length) {
      finishSession(newAnswers, questions);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      questionStartRef.current = Date.now();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswerRevealed, questions, currentIndex, answers]);

  // ─── Finish Session ───────────────────────────────────────

  const finishSession = useCallback(
    (finalAnswers: AnswerRecord[], finalQuestions: QuizQuestion[]) => {
      stopTimer();

      // Handle soal yang belum dijawab (timeout)
      const allAnswers = [...finalAnswers];
      for (let i = allAnswers.length; i < finalQuestions.length; i++) {
        allAnswers.push({
          questionId: finalQuestions[i].id,
          selectedIndex: null,
          isCorrect: false,
          timeSpentSeconds: 0,
        });
      }

      const correctCount = allAnswers.filter((a) => a.isCorrect).length;
      const score = Math.round((correctCount / finalQuestions.length) * 100);
      const durationSeconds =
        (config?.timeLimitSeconds ?? 900) - timeLeft;

      const session: QuizSession = {
        id: `quiz_${Date.now()}`,
        category: config!.category,
        difficulty: config!.difficulty,
        questions: finalQuestions,
        answers: allAnswers,
        score,
        totalQuestions: finalQuestions.length,
        correctCount,
        durationSeconds,
        certified: score >= 80,
        completedAt: new Date(),
      };

      saveSession(session);
      setSessionResult(session);
      setAnswers(allAnswers);
      setHistory(loadQuizHistory());
      setPhase('result');
    },
    [stopTimer, config, timeLeft]
  );

  // ─── Reset ────────────────────────────────────────────────

  const resetToSelector = useCallback(() => {
    stopTimer();
    setPhase('idle');
    setConfig(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setSessionResult(null);
    setTimeLeft(900);
  }, [stopTimer]);

  // ─── Derived State ────────────────────────────────────────

  const progress =
    questions.length > 0
      ? Math.round(((currentIndex) / questions.length) * 100)
      : 0;

  const currentQuestion = questions[currentIndex] ?? null;

  const timeLeftFormatted = (() => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  })();

  const isTimeCritical = timeLeft <= 60 && phase === 'session';

  return {
    // State
    phase,
    config,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    selectedOption,
    isAnswerRevealed,
    timeLeft,
    timeLeftFormatted,
    isTimeCritical,
    sessionResult,
    history,
    progress,

    // Actions
    startQuiz,
    selectOption,
    confirmAnswer,
    skipQuestion,
    resetToSelector,
  };
}
