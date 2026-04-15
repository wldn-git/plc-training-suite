// ============================================================
// Assessment / Quiz Types — Aligned with Task 19
// ============================================================

export type QuizLevel = 1 | 2 | 3 | 4;

export interface QuizQuestion {
  id: string;
  category: QuizLevel;      // Level 1-4 as requested
  question: string;
  options: string[];        // Array string [4]
  correctIndex: number;     // 0-3
  explanation?: string;
  imageUrl?: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeTaken: number;       // detik
}

export interface QuizSession {
  id: string;
  level: QuizLevel;
  score: number;           // 0–100
  totalQuestions: number;
  correctCount: number;
  duration: number;        // detik
  answers: AnswerRecord[];
  certified: boolean;
  completedAt: Date;
}

export interface Certificate {
  id: string;
  quizSessionId: string;
  userName: string;
  level: QuizLevel;
  score: number;
  issuedAt: Date;
}
