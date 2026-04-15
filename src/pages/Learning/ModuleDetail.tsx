import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { LEARNING_MODULES, LEARNING_LEVELS } from '@/constants/learningModules';
import { useProgress } from '@/hooks/useProgress';
import { Button, Card, Badge } from '@/components/ui';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Clock } from 'lucide-react';

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { updateProgress, getModuleStatus } = useProgress();

  const module = useMemo(() => 
    LEARNING_MODULES.find(m => m.id === moduleId),
  [moduleId]);

  const levelDef = useMemo(() => 
    LEARNING_LEVELS.find(l => l.level === module?.level),
  [module]);

  const currentIndex = LEARNING_MODULES.findIndex(m => m.id === moduleId);
  const prevModule = LEARNING_MODULES[currentIndex - 1];
  const nextModule = LEARNING_MODULES[currentIndex + 1];

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

  const handleComplete = async () => {
    await updateProgress(module.id, 'selesai');
    if (nextModule) {
      navigate(`/learning/${nextModule.id}`);
    } else {
      navigate('/learning');
    }
  };

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
           <Badge variant={levelDef?.color as any}>{levelDef?.title}</Badge>
           <span className="text-text-dim font-mono text-xs">Modul {currentIndex + 1} / {LEARNING_MODULES.length}</span>
        </div>
      </div>

      <Card className="overflow-hidden border-border/50">
        {/* Module Title Section */}
        <div className="p-8 lg:p-12 border-b border-border bg-bg-surface">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-accent/10 border border-border-accent flex items-center justify-center text-accent">
               <BookOpen size={20} />
             </div>
             <div className="flex items-center gap-4 text-text-dim text-xs font-mono">
               <div className="flex items-center gap-1.5"><Clock size={12} /> {module.duration}</div>
               <div className="w-1 h-1 rounded-full bg-border" />
               <div className="flex items-center gap-1.5"><CheckCircle size={12} className={isCompleted ? 'text-success' : ''} /> {isCompleted ? 'Selesai' : 'Belum Selesai'}</div>
             </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-mono font-black text-text-primary leading-tight">
            {module.title}
          </h1>
          <p className="text-text-muted mt-4 text-lg">
            {module.description}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 lg:p-12 prose prose-invert prose-blue max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => <h2 className="text-2xl font-mono font-bold text-accent mt-10 mb-6 border-b border-border pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-mono font-bold text-text-primary mt-8 mb-4" {...props} />,
              p: ({node, ...props}) => <p className="text-text-primary/90 leading-relaxed mb-6" {...props} />,
              li: ({node, ...props}) => <li className="text-text-primary/90 mb-2" {...props} />,
              code: ({node, inline, ...props}: any) => (
                <code className={`${inline ? 'bg-bg-elevated px-1.5 py-0.5 rounded text-accent' : 'block bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-sm mb-6'}`} {...props} />
              )
            }}
          >
            {module.content}
          </ReactMarkdown>
        </div>

        {/* Action Footer */}
        <div className="px-8 py-6 bg-black/20 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex gap-3">
            {prevModule && (
              <Button 
                variant="outline" 
                leftIcon={<ArrowLeft size={18} />}
                onClick={() => navigate(`/learning/${prevModule.id}`)}
              >
                Prev
              </Button>
            )}
             {nextModule && (
              <Button 
                variant="outline" 
                rightIcon={<ArrowRight size={18} />}
                onClick={() => navigate(`/learning/${nextModule.id}`)}
              >
                Next
              </Button>
            )}
          </div>

          <Button 
            variant={isCompleted ? 'ghost' : 'primary'}
            leftIcon={<CheckCircle size={18} />}
            onClick={handleComplete}
            className={isCompleted ? 'text-success hover:bg-success/10' : ''}
          >
            {isCompleted ? 'Materi Selesai (Baca Lagi)' : 'Tandai Selesai & Lanjut'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
