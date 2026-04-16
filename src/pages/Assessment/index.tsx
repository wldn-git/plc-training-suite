import { useAssessment } from '@/hooks/useAssessment';
import { QuizSelector } from './QuizSelector';
import { QuizSession } from './QuizSession';
import { QuizResult } from './QuizResult';
import { AnimatePresence, motion } from 'framer-motion';

export default function AssessmentModule() {
  const {
    phase,
    session,
    questions,
    currentIndex,
    currentQuestion,
    timeLeft,
    startQuiz,
    submitAnswer,
    reset,
  } = useAssessment();

  return (
    <div className="container-custom py-8 min-h-[calc(100vh-80px)]">
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <QuizSelector onStart={startQuiz} />
          </motion.div>
        )}

        {phase === 'session' && currentQuestion && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <QuizSession
              currentQuestion={currentQuestion}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
              timeLeft={timeLeft}
              onSubmit={submitAnswer}
            />
          </motion.div>
        )}

        {phase === 'result' && session && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <QuizResult
              session={session}
              questions={questions}
              onRetry={() => startQuiz(session.level)}
              onBackToSelector={reset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
