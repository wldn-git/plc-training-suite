// ============================================================
// Assessment / Quiz Types
// ============================================================

export type QuizCategory = 'dasar' | 'io' | 'instruksi' | 'lanjutan';
export type QuizDifficulty = 'mudah' | 'sedang' | 'sulit';

export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation?: string;
  imageUrl?: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeTaken: number;       // detik
}

export interface QuizSession {
  id: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
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
  recipientName: string;
  category: QuizCategory;
  score: number;
  issuedAt: Date;
}
