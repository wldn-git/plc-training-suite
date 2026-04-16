import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_MODULES, LEARNING_LEVELS } from '@/constants/learningModules';
import type { ContentBlock } from '@/constants/learningModules';
import { useProgress } from '@/hooks/useProgress';
import { QUIZ_BANK } from '@/constants/quizBank';
import { Button, Card, Badge } from '@/components/ui';
import { 
  ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock, 
  AlertTriangle, Lightbulb, HelpCircle, RefreshCcw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlockRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return <p className="text-text-primary/90 leading-relaxed mb-6">{block.body}</p>;
    
    case 'code':
      return (
        <div className="mb-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <div className="bg-bg-elevated px-4 py-2 border-b border-white/5 text-xs font-mono text-text-muted flex gap-2">
            <span className="w-3 h-3 rounded-full bg-danger/50" />
            <span className="w-3 h-3 rounded-full bg-warning/50" />
            <span className="w-3 h-3 rounded-full bg-success/50" />
          </div>
          <pre className="bg-black/80 p-5 overflow-x-auto">
            <code className="text-sm font-mono text-accent whitespace-pre">{block.body}</code>
          </pre>
          {block.caption && <div className="bg-bg-elevated px-4 py-2 text-xs text-text-dim text-center border-t border-white/5">{block.caption}</div>}
        </div>
      );

    case 'warning':
      return (
        <div className="mb-6 bg-warning/10 border border-warning/30 rounded-xl p-4 flex gap-4 items-start shadow-sm">
          <AlertTriangle className="text-warning shrink-0 mt-0.5" size={20} />
          <p className="text-warning-light text-sm leading-relaxed">{block.body}</p>
        </div>
      );

    case 'tip':
      return (
        <div className="mb-6 bg-accent/10 border border-accent/30 rounded-xl p-4 flex gap-4 items-start shadow-sm">
          <Lightbulb className="text-accent shrink-0 mt-0.5" size={20} />
          <p className="text-blue-100 text-sm leading-relaxed">{block.body}</p>
        </div>
      );

    case 'table':
      if (!block.rows || block.rows.length === 0) return null;
      return (
        <div className="mb-6 overflow-hidden rounded-xl border border-white/10 shadow-sm mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-dim uppercase bg-bg-elevated/50 font-mono">
                <tr>
                  {block.rows[0].map((header, i) => (
                    <th key={i} className="px-6 py-4">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.slice(1).map((row, i) => (
                  <tr key={i} className="bg-bg-surface border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-6 py-4 font-medium text-text-primary/90">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && <div className="bg-bg-elevated px-4 py-2 text-xs text-text-dim text-center border-t border-white/5">{block.caption}</div>}
        </div>
      );
      
    case 'formula':
      return (
        <div className="mb-6 border-l-4 border-accent bg-accent/5 p-5 rounded-r-xl">
          <div className="font-mono text-lg text-accent text-center tracking-wider">{block.body}</div>
          {block.caption && <div className="mt-3 text-xs text-text-dim text-center">{block.caption}</div>}
        </div>
      );

    case 'image':
      return (
        <div className="mb-6 rounded-xl overflow-hidden border border-white/10">
          <img src={block.body} alt={block.caption || 'Module image'} className="w-full h-auto object-cover max-h-96" />
          {block.caption && <div className="bg-bg-elevated px-4 py-2 text-xs text-text-dim text-center border-t border-white/5">{block.caption}</div>}
        </div>
      );

    default:
      return null;
  }
};

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateProgress, getModuleStatus } = useProgress();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);
  const [quizState, setQuizState] = useState<{
    currentQuestionIndex: number;
    answers: number[];
    isFinished: boolean;
  }>({
    currentQuestionIndex: 0,
    answers: [],
    isFinished: false
  });

  // Reset page index when module changes
  useEffect(() => {
    setCurrentPageIndex(0);
    setShowKnowledgeCheck(false);
    setQuizState({ currentQuestionIndex: 0, answers: [], isFinished: false });
  }, [moduleId]);

  const module = useMemo(() => 
    ALL_MODULES.find(m => m.id === moduleId),
  [moduleId]);

  const levelDef = useMemo(() => 
    LEARNING_LEVELS.find(l => l.id === module?.levelId),
  [module]);

  const moduleQuestions = useMemo(() => 
    QUIZ_BANK.filter(q => q.moduleRef === moduleId),
  [moduleId]);

  const moduleIndex = ALL_MODULES.findIndex(m => m.id === moduleId);
  const prevModule = ALL_MODULES[moduleIndex - 1];
  const nextModule = ALL_MODULES[moduleIndex + 1];

  const status = getModuleStatus(moduleId || '');
  const isCompleted = status === 'selesai';

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-mono font-bold">Modul tidak ditemukan</h2>
        <Button variant="ghost" onClick={() => navigate('/learning')} className="mt-4">
          Kembali ke Kurikulum
        </Button>
      </div>
    );
  }

  // Prevent React race condition where currentPageIndex hasn't been reset by useEffect yet
  const safePageIndex = Math.min(currentPageIndex, module.pages.length - 1);
  const currentPage = module.pages[safePageIndex];
  const isLastPage = safePageIndex === module.pages.length - 1;

  const handleNextPage = () => {
    if (!isLastPage) {
      setCurrentPageIndex(c => c + 1);
    } else if (moduleQuestions.length > 0 && !showKnowledgeCheck) {
      setShowKnowledgeCheck(true);
      setQuizState({ currentQuestionIndex: 0, answers: [], isFinished: false });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (showKnowledgeCheck) {
      setShowKnowledgeCheck(false);
      setCurrentPageIndex(module.pages.length - 1);
    } else if (currentPageIndex > 0) {
      setCurrentPageIndex(c => c - 1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizState.answers, answerIndex];
    
    if (quizState.currentQuestionIndex < moduleQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        answers: newAnswers
      }));
    } else {
      setQuizState(prev => ({
        ...prev,
        answers: newAnswers,
        isFinished: true
      }));
    }
  };

  const handleComplete = async () => {
    await updateProgress(module.id, 'selesai');
    if (nextModule) {
      navigate(`/learning/${nextModule.id}`);
    } else {
      navigate('/learning');
    }
  };

  const quizScore = useMemo(() => {
    if (!quizState.isFinished) return 0;
    const correct = quizState.answers.filter((ans, idx) => ans === moduleQuestions[idx].correctIndex).length;
    return Math.round((correct / moduleQuestions.length) * 100);
  }, [quizState.isFinished, quizState.answers, moduleQuestions]);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8 group">
        <Button 
          variant="ghost" 
          size="sm" 
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/learning')}
        >
          Kembali ke Kurikulum
        </Button>
        <div className="flex items-center gap-2">
           {levelDef && <Badge variant={levelDef.color as any}>{levelDef.title}</Badge>}
           <span className="text-text-dim font-mono text-xs">Modul {moduleIndex + 1} / {ALL_MODULES.length}</span>
        </div>
      </div>

      <Card className="overflow-hidden border-border/50 shadow-2xl relative">
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-border/30">
          <div 
             className="h-full bg-accent transition-all duration-300" 
             style={{ width: `${showKnowledgeCheck ? 100 : ((safePageIndex + 1) / module.pages.length) * 100}%` }}
          />
        </div>

        {/* Module Title Section */}
        <div className="p-8 lg:p-12 border-b border-white/5 bg-gradient-to-b from-bg-surface to-bg-base relative overflow-hidden">
          <BookOpen size={150} className="absolute -right-10 -bottom-10 text-white/[0.02] rotate-12" />
          
          <div className="flex items-center gap-3 mb-4 relative z-10">
             <div className="flex items-center gap-4 text-text-dim text-xs font-mono">
               <div className="flex items-center gap-1.5"><Clock size={12} /> {module.estimatedMinutes} min. read</div>
               <div className="w-1 h-1 rounded-full bg-border" />
               <div className="flex items-center gap-1.5 font-bold"><CheckCircle size={12} className={isCompleted ? 'text-success' : 'text-text-dim'} /> {isCompleted ? 'Selesai' : 'Belum Selesai'}</div>
             </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-mono font-black text-text-primary leading-tight relative z-10">
            {module.title}
          </h1>
          <p className="text-text-muted mt-4 text-lg relative z-10">
            {module.description}
          </p>
        </div>

        {/* Page Content Section */}
        <div className="p-8 lg:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!showKnowledgeCheck ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-mono font-bold text-accent mb-8 pb-3 border-b border-white/10 flex justify-between items-end">
                  <span>{currentPage.title}</span>
                  <span className="text-xs text-text-dim font-mono bg-bg-elevated px-2 py-1 rounded">Page {safePageIndex + 1} of {module.pages.length}</span>
                </h2>

                <div className="space-y-6">
                  {currentPage.content.map((block, index) => (
                    <BlockRenderer key={index} block={block} />
                  ))}
                </div>
              </motion.div>
            ) : !quizState.isFinished ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-accent/20 text-accent">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-mono font-bold text-text-primary">Knowledge Check</h2>
                    <p className="text-text-muted text-xs uppercase tracking-widest font-bold">Question {quizState.currentQuestionIndex + 1} of {moduleQuestions.length}</p>
                  </div>
                </div>

                <div className="bg-bg-elevated rounded-2xl p-8 border border-white/5 shadow-inner">
                  <h3 className="text-xl font-bold text-text-primary mb-8 leading-relaxed">
                    {moduleQuestions[quizState.currentQuestionIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {moduleQuestions[quizState.currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-black/20 hover:border-accent hover:bg-accent/5 transition-all text-left group"
                      >
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-bg-elevated border border-border flex items-center justify-center font-mono text-xs font-bold group-hover:bg-accent group-hover:text-bg transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-text-primary text-sm font-medium">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${quizScore >= 80 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                  {quizScore >= 80 ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
                </div>
                <h3 className="text-3xl font-mono font-black mb-2 italic tracking-tighter uppercase">
                  {quizScore >= 80 ? 'Pemahaman Kuat!' : 'Perlu Review'}
                </h3>
                <p className="text-text-muted mb-8 max-w-md mx-auto">
                  Kamu menjawab {quizState.answers.filter((ans, idx) => ans === moduleQuestions[idx].correctIndex).length} dari {moduleQuestions.length} soal dengan benar.
                </p>

                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl font-mono font-black text-accent">{quizScore}%</div>
                  {quizScore < 80 && (
                    <Button variant="ghost" size="sm" leftIcon={<RefreshCcw size={14} />} onClick={() => setQuizState({ currentQuestionIndex: 0, answers: [], isFinished: false })}>
                      Ulangi Kuis
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Footer */}
        <div className="px-8 py-6 bg-bg-elevated/50 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-3 w-full sm:w-auto overflow-x-auto scrollbar-hide shrink-0">
            {showKnowledgeCheck ? (
              <Button variant="outline" leftIcon={<ArrowLeft size={18} />} onClick={handlePrevPage}>Kembali ke Materi</Button>
            ) : safePageIndex > 0 ? (
              <Button variant="outline" leftIcon={<ArrowLeft size={18} />} onClick={handlePrevPage}>Halaman Seb.</Button>
            ) : prevModule ? (
              <Button variant="ghost" leftIcon={<ArrowLeft size={18} />} onClick={() => navigate(`/learning/${prevModule.id}`)}>Modul Seb.</Button>
            ) : <div />}

            {!showKnowledgeCheck && !isLastPage ? (
              <Button variant="primary" rightIcon={<ArrowRight size={18} />} onClick={handleNextPage}>Selanjutnya</Button>
            ) : !showKnowledgeCheck && isLastPage && moduleQuestions.length > 0 ? (
               <Button variant="primary" rightIcon={<HelpCircle size={18} />} onClick={handleNextPage}>Mulai Kuis Modul</Button>
            ) : (isLastPage || showKnowledgeCheck) && (
              <Button 
                variant={isCompleted ? 'ghost' : 'primary'}
                leftIcon={<CheckCircle size={18} />}
                onClick={handleComplete}
                disabled={showKnowledgeCheck && !quizState.isFinished}
                className={isCompleted ? 'text-success hover:bg-success/10' : 'shadow-lg shadow-success/20 animate-pulse-glow'}
              >
                {isCompleted ? 'Materi Selesai' : 'Tandai Selesai & Lanjut'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
