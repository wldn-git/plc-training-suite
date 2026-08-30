import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ALL_MODULES, LEARNING_LEVELS } from '@/constants/learningModules';
import type { ContentBlock } from '@/constants/learningModules';
import { useProgress } from '@/hooks/useProgress';
import { QUIZ_BANK } from '@/constants/quizBank';
import { Button, Badge } from '@/components/ui';
import { 
  ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock, 
  AlertTriangle, Lightbulb, HelpCircle, RefreshCcw, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlockRenderer = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return (
        <p className="text-[#242424] dark:text-[#e0e0e0] leading-relaxed mb-6 text-sm lg:text-base font-sans">
          {block.body}
        </p>
      );
    
    case 'code':
      return (
        <div className="mb-6 border border-[#e5e5e5] dark:border-[#333333] shadow-sm font-mono text-xs">
          <div className="bg-[#f3f3f3] dark:bg-[#2d2d2d] px-4 py-2 border-b border-[#e5e5e5] dark:border-[#333333] text-[#666666] dark:text-[#cccccc] flex items-center justify-between">
            <span className="font-bold text-[11px]">KODE / SINTAKS PLC</span>
            <span className="text-[10px] text-[#858585]">IEC 61131-3</span>
          </div>
          <pre className="bg-[#181818] p-4 overflow-x-auto text-[#4ade80] leading-relaxed">
            <code>{block.body}</code>
          </pre>
          {block.caption && (
            <div className="bg-[#f9f9f9] dark:bg-[#252526] px-4 py-2 text-xs text-[#666666] dark:text-[#9d9d9d] border-t border-[#e5e5e5] dark:border-[#333333]">
              {block.caption}
            </div>
          )}
        </div>
      );

    case 'warning':
      return (
        <div className="mb-6 bg-[#fffbeb] dark:bg-[#ffb900]/10 border-l-4 border-[#ffb900] p-4 flex gap-3 items-start shadow-sm">
          <AlertTriangle className="text-[#b45309] dark:text-[#ffb900] shrink-0 mt-0.5" size={18} />
          <div className="text-xs lg:text-sm text-[#78350f] dark:text-[#fde047] leading-relaxed font-medium">
            <span className="font-bold block mb-0.5">PERHATIAN:</span>
            {block.body}
          </div>
        </div>
      );

    case 'tip':
      return (
        <div className="mb-6 bg-[#eff6ff] dark:bg-[#0078d4]/10 border-l-4 border-[#0078d4] p-4 flex gap-3 items-start shadow-sm">
          <Lightbulb className="text-[#0078d4] dark:text-[#38bdf8] shrink-0 mt-0.5" size={18} />
          <div className="text-xs lg:text-sm text-[#1e40af] dark:text-[#93c5fd] leading-relaxed font-medium">
            <span className="font-bold block mb-0.5">TIPS & PETUNJUK:</span>
            {block.body}
          </div>
        </div>
      );

    case 'table':
      if (!block.rows || block.rows.length === 0) return null;
      return (
        <div className="mb-6 border border-[#e5e5e5] dark:border-[#333333] shadow-sm mt-4 font-sans text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#f3f3f3] dark:bg-[#2d2d2d] text-[#1f1f1f] dark:text-white font-bold border-b border-[#e5e5e5] dark:border-[#333333]">
                <tr>
                  {block.rows[0].map((header, i) => (
                    <th key={i} className="px-4 py-3">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#333333]">
                {block.rows.slice(1).map((row, i) => (
                  <tr key={i} className="bg-[#ffffff] dark:bg-[#1e1e1e] hover:bg-[#f9f9f9] dark:hover:bg-[#252526] transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-[#242424] dark:text-[#cccccc]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <div className="bg-[#f9f9f9] dark:bg-[#252526] px-4 py-2 text-[11px] text-[#666666] dark:text-[#9d9d9d] border-t border-[#e5e5e5] dark:border-[#333333]">
              {block.caption}
            </div>
          )}
        </div>
      );
      
    case 'formula':
      return (
        <div className="mb-6 border-l-4 border-[#0078d4] bg-[#f3f3f3] dark:bg-[#252526] p-4 shadow-sm">
          <div className="font-mono text-sm lg:text-base font-bold text-[#0078d4] dark:text-[#38bdf8] text-center tracking-wider">
            {block.body}
          </div>
          {block.caption && (
            <div className="mt-2 text-xs text-[#666666] dark:text-[#9d9d9d] text-center">
              {block.caption}
            </div>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="mb-6 border border-[#e5e5e5] dark:border-[#333333] overflow-hidden shadow-sm">
          <img src={block.body} alt={block.caption || 'Module image'} className="w-full h-auto object-cover max-h-96" />
          {block.caption && (
            <div className="bg-[#f9f9f9] dark:bg-[#252526] px-4 py-2 text-xs text-[#666666] dark:text-[#9d9d9d] text-center border-t border-[#e5e5e5] dark:border-[#333333]">
              {block.caption}
            </div>
          )}
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h2 className="text-xl font-bold text-[#1f1f1f] dark:text-white">Modul Tidak Ditemukan</h2>
        <Button variant="primary" onClick={() => navigate('/learning')} className="mt-4">
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
    <div className="max-w-5xl mx-auto pb-16 font-sans select-none">
      {/* Top Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <button 
          onClick={() => navigate('/learning')}
          className="px-3 py-1.5 bg-[#f3f3f3] dark:bg-[#252526] hover:bg-[#e5e5e5] dark:hover:bg-[#2a2d2e] text-[#1f1f1f] dark:text-[#cccccc] text-xs font-semibold border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali ke Kurikulum
        </button>

        <div className="flex items-center gap-2">
          {levelDef && <Badge variant={levelDef.color as any}>{levelDef.title}</Badge>}
          <span className="text-[#666666] dark:text-[#858585] font-mono text-xs px-2 py-0.5 bg-[#f3f3f3] dark:bg-[#252526] border border-[#e5e5e5] dark:border-[#3f3f46]">
            Modul {moduleIndex + 1} / {ALL_MODULES.length}
          </span>
        </div>
      </div>

      {/* Windows 10 Document Card */}
      <div className="border border-[#e5e5e5] dark:border-[#3f3f46] bg-[#ffffff] dark:bg-[#1e1e1e] shadow-md overflow-hidden">
        {/* Progress Bar Line */}
        <div className="w-full h-1 bg-[#e5e5e5] dark:bg-[#333333]">
          <div 
            className="h-full bg-[#0078d4] transition-all duration-300" 
            style={{ width: `${showKnowledgeCheck ? 100 : ((safePageIndex + 1) / module.pages.length) * 100}%` }}
          />
        </div>

        {/* Module Title Section */}
        <div className="p-6 lg:p-8 border-b border-[#e5e5e5] dark:border-[#333333] bg-[#f9f9f9] dark:bg-[#252526]">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-xs font-mono text-[#666666] dark:text-[#858585]">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#0078d4]" /> {module.estimatedMinutes} min. read
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle size={13} className={isCompleted ? 'text-[#107c41]' : 'text-[#858585]'} />
              <span className={isCompleted ? 'text-[#107c41]' : 'text-[#666666] dark:text-[#858585]'}>
                {isCompleted ? 'Selesai' : 'Belum Selesai'}
              </span>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#1f1f1f] dark:text-white leading-tight">
            {module.title}
          </h1>
          <p className="text-xs lg:text-sm text-[#555555] dark:text-[#cccccc] mt-2 leading-relaxed">
            {module.description}
          </p>
        </div>

        {/* Page Content Section */}
        <div className="p-6 lg:p-10 min-h-[350px]">
          <AnimatePresence mode="wait">
            {!showKnowledgeCheck ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#e5e5e5] dark:border-[#333333]">
                  <h2 className="text-lg lg:text-xl font-bold text-[#0078d4] dark:text-[#38bdf8] flex items-center gap-2">
                    <FileText size={18} />
                    <span>{currentPage.title}</span>
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#666666] dark:text-[#cccccc] bg-[#f3f3f3] dark:bg-[#2d2d2d] px-2.5 py-1 border border-[#e5e5e5] dark:border-[#3f3f46]">
                    Halaman {safePageIndex + 1} / {module.pages.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {currentPage.content.map((block, index) => (
                    <BlockRenderer key={index} block={block} />
                  ))}
                </div>
              </motion.div>
            ) : !quizState.isFinished ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 bg-[#0078d4] text-white">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1f1f1f] dark:text-white">Uji Pemahaman Singkat</h2>
                    <p className="text-[#666666] dark:text-[#858585] text-xs font-mono">
                      Pertanyaan {quizState.currentQuestionIndex + 1} dari {moduleQuestions.length}
                    </p>
                  </div>
                </div>

                <div className="bg-[#f9f9f9] dark:bg-[#252526] p-6 border border-[#e5e5e5] dark:border-[#333333]">
                  <h3 className="text-sm lg:text-base font-bold text-[#1f1f1f] dark:text-white mb-6 leading-relaxed">
                    {moduleQuestions[quizState.currentQuestionIndex].question}
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {moduleQuestions[quizState.currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(idx)}
                        className="flex items-center gap-3 p-3.5 border border-[#e5e5e5] dark:border-[#3f3f46] bg-[#ffffff] dark:bg-[#1e1e1e] hover:border-[#0078d4] hover:bg-[#0078d4]/5 transition-all text-left group"
                      >
                        <div className="w-7 h-7 shrink-0 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center justify-center font-mono text-xs font-bold text-[#1f1f1f] dark:text-white group-hover:bg-[#0078d4] group-hover:text-white group-hover:border-[#0078d4] transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className="text-[#242424] dark:text-[#cccccc] text-xs lg:text-sm font-medium leading-relaxed">
                          {option}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className={`w-16 h-16 flex items-center justify-center mx-auto mb-4 ${
                  quizScore >= 80 ? 'bg-[#107c41] text-white' : 'bg-[#ffb900] text-black'
                }`}>
                  {quizScore >= 80 ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#1f1f1f] dark:text-white">
                  {quizScore >= 80 ? 'Pemahaman Sangat Baik!' : 'Perlu Ditinjau Kembali'}
                </h3>
                <p className="text-xs lg:text-sm text-[#666666] dark:text-[#858585] mb-6 max-w-md mx-auto">
                  Anda menjawab {quizState.answers.filter((ans, idx) => ans === moduleQuestions[idx].correctIndex).length} dari {moduleQuestions.length} pertanyaan dengan tepat.
                </p>

                <div className="flex flex-col items-center gap-3">
                  <div className="text-4xl font-mono font-black text-[#0078d4]">{quizScore}%</div>
                  {quizScore < 80 && (
                    <button
                      onClick={() => setQuizState({ currentQuestionIndex: 0, answers: [], isFinished: false })}
                      className="px-3 py-1.5 bg-[#333333] hover:bg-[#3e3e42] text-white text-xs font-semibold flex items-center gap-1.5 border border-[#474747]"
                    >
                      <RefreshCcw size={12} /> Ulangi Kuis
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Windows 10 Action Footer */}
        <div className="px-6 py-4 bg-[#f3f3f3] dark:bg-[#252526] border-t border-[#e5e5e5] dark:border-[#333333] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            {showKnowledgeCheck ? (
              <button
                onClick={handlePrevPage}
                className="px-3 py-2 bg-[#ffffff] dark:bg-[#1e1e1e] hover:bg-[#eaeaea] dark:hover:bg-[#2d2d2d] text-[#1f1f1f] dark:text-white font-medium border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Kembali ke Materi
              </button>
            ) : safePageIndex > 0 ? (
              <button
                onClick={handlePrevPage}
                className="px-3 py-2 bg-[#ffffff] dark:bg-[#1e1e1e] hover:bg-[#eaeaea] dark:hover:bg-[#2d2d2d] text-[#1f1f1f] dark:text-white font-medium border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Halaman Sebelumnya
              </button>
            ) : prevModule ? (
              <button
                onClick={() => navigate(`/learning/${prevModule.id}`)}
                className="px-3 py-2 bg-[#ffffff] dark:bg-[#1e1e1e] hover:bg-[#eaeaea] dark:hover:bg-[#2d2d2d] text-[#666666] dark:text-[#cccccc] font-medium border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} /> Modul Sebelumnya
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {!showKnowledgeCheck && !isLastPage ? (
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-[#0078d4] hover:bg-[#0063b1] text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Halaman Selanjutnya</span>
                <ArrowRight size={14} />
              </button>
            ) : !showKnowledgeCheck && isLastPage && moduleQuestions.length > 0 ? (
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-[#0078d4] hover:bg-[#0063b1] text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <HelpCircle size={14} />
                <span>Mulai Kuis Modul</span>
              </button>
            ) : (isLastPage || showKnowledgeCheck) && (
              <button
                onClick={handleComplete}
                disabled={showKnowledgeCheck && !quizState.isFinished}
                className={`px-4 py-2 font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
                  isCompleted
                    ? 'bg-[#107c41] text-white'
                    : 'bg-[#0078d4] hover:bg-[#0063b1] text-white disabled:opacity-50'
                }`}
              >
                <CheckCircle size={14} />
                <span>{isCompleted ? 'Materi Selesai (Lanjut)' : 'Tandai Selesai & Lanjut'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
