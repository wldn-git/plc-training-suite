import { create } from 'zustand';
import type { QuizLevel, QuizQuestion, QuizSession, AnswerRecord } from '@/types/assessment.types';

// ============================================================
// Assessment Store — Integrated with QuizLevel (Task 19/20)
// ============================================================

interface AssessmentState {
  // Config
  selectedCategory: QuizLevel | null;

  // Active Session
  activeSession: Partial<QuizSession> | null;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  timeRemaining: number;   // detik
  isRunning: boolean;

  // Last Completed
  lastSession: QuizSession | null;

  // Actions
  startSession: (level: QuizLevel, currentProject: any, questions: QuizQuestion[]) => void;
  submitAnswer: (answer: AnswerRecord) => void;
  nextQuestion: () => void;
  endSession: (score: number) => void;
  setTimeRemaining: (time: number) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  selectedCategory: null,
  activeSession: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 15 * 60, // 15 menit
  isRunning: false,
  lastSession: null,

  startSession: (level, _, questions) =>
    set({
      selectedCategory: level,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 15 * 60,
      isRunning: true,
      activeSession: {
        level,
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
      level: state.selectedCategory!,
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
      activeSession: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      timeRemaining: 15 * 60,
      isRunning: false,
      lastSession: null,
    }),
}));
