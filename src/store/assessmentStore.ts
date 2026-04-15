import { create } from 'zustand';
import type { Question, QuizSession, QuizCategory, QuizDifficulty, AnswerRecord } from '@/types/assessment.types';

// ============================================================
// Assessment Store — State Quiz Aktif
// ============================================================

interface AssessmentState {
  // Config
  selectedCategory: QuizCategory | null;
  selectedDifficulty: QuizDifficulty | null;

  // Active Session
  activeSession: Partial<QuizSession> | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  timeRemaining: number;   // detik
  isRunning: boolean;

  // Last Completed
  lastSession: QuizSession | null;

  // Actions
  startSession: (category: QuizCategory, difficulty: QuizDifficulty, questions: Question[]) => void;
  submitAnswer: (answer: AnswerRecord) => void;
  nextQuestion: () => void;
  endSession: (score: number) => void;
  setTimeRemaining: (time: number) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  selectedCategory: null,
  selectedDifficulty: null,
  activeSession: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 15 * 60, // 15 menit
  isRunning: false,
  lastSession: null,

  startSession: (category, difficulty, questions) =>
    set({
      selectedCategory: category,
      selectedDifficulty: difficulty,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 15 * 60,
      isRunning: true,
      activeSession: {
        category,
        difficulty,
        totalQuestions: questions.length,
      },
    }),

  submitAnswer: (answer) =>
    set((state) => ({ answers: [...state.answers, answer] })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    })),

  endSession: (score) => {
    const state = get();
    const session: QuizSession = {
      id: crypto.randomUUID(),
      category: state.selectedCategory!,
      difficulty: state.selectedDifficulty!,
      score,
      totalQuestions: state.questions.length,
      correctCount: state.answers.filter((a) => a.isCorrect).length,
      duration: 15 * 60 - state.timeRemaining,
      answers: state.answers,
      certified: score >= 80,
      completedAt: new Date(),
    };
    set({ isRunning: false, activeSession: null, lastSession: session });
  },

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  resetAssessment: () =>
    set({
      selectedCategory: null,
      selectedDifficulty: null,
      activeSession: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 15 * 60,
      isRunning: false,
    }),
}));
