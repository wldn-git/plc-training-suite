import { useState, useEffect, useCallback, useRef } from 'react';
import { QUIZ_BANK } from '@/constants/quizBank';
import { db } from '@/lib/db/db';
import type { QuizLevel, AnswerRecord, QuizQuestion, QuizSession } from '@/types/assessment.types';
import { sheetService } from '@/services/sheetService';
import { useUserStore } from '@/store/userStore';

// ─── Types Implementation ──────────────────────────────────
// Note: We use the project's assessment.types.ts as truth.
// But we add Phase to manage state machine in Index.

export type AssessmentPhase =
  | 'idle'       // Belum mulai
  | 'session'    // Quiz sedang berjalan
  | 'result';    // Quiz selesai, tampilkan hasil

export interface QuizConfig {
  level: QuizLevel;
  questionCount: number;
  timeLimitSeconds: number;
}

export function useAssessment() {
  const [phase, setPhase] = useState<AssessmentPhase>('idle');
  const [session, setSession] = useState<QuizSession | null>(null);
  
  // Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState(900);
  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((seconds: number) => {
    stopTimer();
    setTimeLeft(seconds);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  const finishQuiz = useCallback(async (finalAnswers: AnswerRecord[], finalQuestions: QuizQuestion[]) => {
    stopTimer();
    
    // Ensure all questions have answers (fill missing with incorrect)
    const allAnswers = [...finalAnswers];
    for (let i = allAnswers.length; i < finalQuestions.length; i++) {
        allAnswers.push({
            questionId: finalQuestions[i].id,
            selectedIndex: -1, // -1 means no answer
            isCorrect: false,
            timeTaken: 0
        });
    }

    const correctCount = allAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctCount / finalQuestions.length) * 100);
    const duration = 900 - timeLeft; // Assuming 15 mins default

    const newSession: QuizSession = {
      id: crypto.randomUUID(),
      level: selectedLevel!,
      score,
      totalQuestions: finalQuestions.length,
      correctCount,
      duration,
      answers: allAnswers,
      certified: score >= 80,
      completedAt: new Date(),
    };

    // Save to Dexie
    await db.quizHistory.add(newSession);
    
    // Sync to Google Sheets
    const { settings, updateSettings } = useUserStore.getState();
    
    // Update max level if certified
    if (newSession.certified && newSession.level >= settings.maxLevel) {
      updateSettings({ maxLevel: Math.min(5, newSession.level + 1) });
    }

    sheetService.send({
      type: 'quiz_result',
      userName: settings.userName || 'Unknown User',
      level: newSession.level,
      score: newSession.score,
      certified: newSession.certified
    });

    setSession(newSession);
    setPhase('result');
  }, [selectedLevel, stopTimer, timeLeft]);

  const startQuiz = useCallback((level: QuizLevel) => {
    const pool = QUIZ_BANK.filter(q => q.category === level);
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    setSelectedLevel(level);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase('session');
    startTimer(900); // 15 mins
  }, [startTimer]);

  const submitAnswer = useCallback((selectedIndex: number) => {
    const question = questions[currentIndex];
    if (!question) return;

    const isCorrect = question.correctIndex === selectedIndex;
    const record: AnswerRecord = {
      questionId: question.id,
      selectedIndex,
      isCorrect,
      timeTaken: 0,
    };

    const newAnswers = [...answers, record];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz(newAnswers, questions);
    }
  }, [answers, currentIndex, finishQuiz, questions]);

  const reset = useCallback(() => {
    stopTimer();
    setPhase('idle');
    setSession(null);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeLeft(900);
  }, [stopTimer]);

  // Derived state
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (phase === 'session' && timeLeft === 0) {
      finishQuiz(answers, questions);
    }
  }, [phase, timeLeft, answers, questions, finishQuiz]);

  return {
    phase,
    session,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    timeLeft,
    startQuiz,
    submitAnswer,
    reset,
    totalQuestions: questions.length,
  };
}
