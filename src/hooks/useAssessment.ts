import { useEffect, useCallback, useMemo } from 'react';
import { useAssessmentStore } from '@/store/assessmentStore';
import { QUIZ_BANK } from '@/constants/quizBank';
import { db } from '@/lib/db/db';
import type { QuizLevel, AnswerRecord } from '@/types/assessment.types';

export function useAssessment() {
  const store = useAssessmentStore();

  // Timer Tick
  useEffect(() => {
    let timer: number;
    if (store.isRunning && store.timeRemaining > 0) {
      timer = window.setInterval(() => {
        store.setTimeRemaining(store.timeRemaining - 1);
      }, 1000);
    } else if (store.timeRemaining === 0 && store.isRunning) {
      // Auto-submit when time up
      finishQuiz();
    }
    return () => clearInterval(timer);
  }, [store.isRunning, store.timeRemaining]);

  const startQuiz = useCallback((level: QuizLevel) => {
    // Pick 10 random questions from the level
    const levelQuestions = QUIZ_BANK.filter(q => q.category === level);
    const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    // Aligned set questions to store
    // QuizQuestion is already formatted with id, options, etc.
    store.startSession(level, 0, shuffled as any); // Type cast if necessary, but should match
  }, [store]);

  const submitAnswer = useCallback((selectedIndex: number) => {
    const question = store.questions[store.currentQuestionIndex];
    if (!question) return;

    const isCorrect = question.correctIndex === selectedIndex;
    
    const record: AnswerRecord = {
      questionId: question.id,
      selectedIndex,
      isCorrect,
      timeTaken: 0, // Simplified for now
    };

    store.submitAnswer(record);

    if (store.currentQuestionIndex < store.questions.length - 1) {
      store.nextQuestion();
    } else {
      finishQuiz();
    }
  }, [store]);

  const finishQuiz = useCallback(async () => {
    const correctCount = store.answers.filter(a => a.isCorrect).length;
    // Calculate including the current one if it was just submitted 
    // (but submitAnswer already adds it)
    const score = Math.round((correctCount / store.questions.length) * 100);

    // Save to Dexie
    await db.quizHistory.add({
      id: crypto.randomUUID(),
      level: store.selectedCategory as any,
      score,
      totalQuestions: store.questions.length,
      correctCount: correctCount,
      duration: 15 * 60 - store.timeRemaining,
      answers: store.answers,
      certified: score >= 80,
      completedAt: new Date(),
    });

    store.endSession(score);
  }, [store]);

  const currentQuestion = useMemo(() => {
    return store.questions[store.currentQuestionIndex];
  }, [store.questions, store.currentQuestionIndex]);

  return {
    isRunning: store.isRunning,
    currentQuestion,
    currentIndex: store.currentQuestionIndex,
    totalQuestions: store.questions.length,
    timeRemaining: store.timeRemaining,
    answers: store.answers,
    lastSession: store.lastSession,
    startQuiz,
    submitAnswer,
    reset: store.resetAssessment,
  };
}
