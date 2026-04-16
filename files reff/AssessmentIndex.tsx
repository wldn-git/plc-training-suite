// src/pages/Assessment/index.tsx
// Orchestrator halaman Assessment — mengelola phase: idle → session → result

import { useAssessment } from '../../hooks/useAssessment';
import QuizSelector from './QuizSelector';
import QuizSession from './QuizSession';
import QuizResult from './QuizResult';

export default function AssessmentPage() {
  const assessment = useAssessment();

  const {
    phase,
    currentQuestion,
    currentIndex,
    questions,
    progress,
    answers,
    selectedOption,
    isAnswerRevealed,
    timeLeftFormatted,
    timeLeft,
    isTimeCritical,
    sessionResult,

    startQuiz,
    selectOption,
    confirmAnswer,
    skipQuestion,
    resetToSelector,
  } = assessment;

  // ── Idle: pilih kategori ────────────────────────────────
  if (phase === 'idle') {
    return <QuizSelector onStart={startQuiz} />;
  }

  // ── Session: tampilkan soal aktif ───────────────────────
  if (phase === 'session' && currentQuestion) {
    return (
      <QuizSession
        question={currentQuestion}
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        progress={progress}
        answers={answers}
        selectedOption={selectedOption}
        isAnswerRevealed={isAnswerRevealed}
        timeLeftFormatted={timeLeftFormatted}
        timeLeft={timeLeft}
        isTimeCritical={isTimeCritical}
        onSelectOption={selectOption}
        onConfirmAnswer={confirmAnswer}
        onSkip={skipQuestion}
      />
    );
  }

  // ── Result: tampilkan hasil ─────────────────────────────
  if (phase === 'result' && sessionResult) {
    return (
      <QuizResult
        session={sessionResult}
        onRetry={() => {
          if (assessment.config) startQuiz(assessment.config);
        }}
        onBackToSelector={resetToSelector}
      />
    );
  }

  // Fallback (seharusnya tidak pernah muncul)
  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center">
      <p className="text-slate-500 text-sm">Memuat...</p>
    </div>
  );
}
