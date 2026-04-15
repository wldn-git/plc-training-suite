import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db/db';
import { useProgress } from '@/hooks/useProgress';
import { Card, Badge, Button } from '@/components/ui';
import { BookOpen, Award, Cpu, Zap, ArrowRight, History, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_MODULES } from '@/constants/learningModules';

export default function Dashboard() {
  const navigate = useNavigate();
  const { calculateOverallProgress, calculateStreak, getLastOpenedModule } = useProgress();

  const quizCount = useLiveQuery(() => db.quizHistory.count()) || 0;
  const projectCount = useLiveQuery(() => db.projects.count()) || 0;
  
  // Calculate Average Quiz Score
  const avgQuizScore = useLiveQuery(async () => {
    const history = await db.quizHistory.toArray();
    if (history.length === 0) return 0;
    const total = history.reduce((acc, curr) => acc + curr.score, 0);
    return Math.round(total / history.length);
  }) || 0;

  const lastActivity = useLiveQuery(() => db.quizHistory.orderBy('completedAt').reverse().limit(3).toArray()) || [];
  
  const overallProgress = calculateOverallProgress();
  const streak = calculateStreak();
  const lastModuleRecord = getLastOpenedModule();
  const lastModule = lastModuleRecord 
    ? ALL_MODULES.find(m => m.id === lastModuleRecord.moduleId)
    : ALL_MODULES[0];

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-7xl mx-auto">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-mono font-black text-text-primary tracking-tighter uppercase italic">
            PLC <span className="text-accent">DASHBOARD</span> 🚀
          </h1>
          <p className="text-text-muted mt-1 font-medium text-sm">Industrial Control & Automation Learning Suite</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="accent" className="px-5 py-2.5 text-xs flex items-center gap-2 shadow-accent/20">
            <Zap size={16} fill="currentColor" /> {streak} Day Streak
          </Badge>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-accent/20 bg-accent/5 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Curriculum Progress</span>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <h2 className="text-5xl font-mono font-black text-text-primary tracking-tighter">{overallProgress}%</h2>
            <p className="text-[10px] font-bold text-accent mb-1 uppercase tracking-widest">Automation Ready</p>
          </div>
          <div className="mt-5 h-1.5 w-full bg-bg-elevated rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-accent shadow-accent" style={{ width: `${overallProgress}%` }} />
          </div>
          <BookOpen size={100} className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity" />
        </Card>

        <Card className="p-6 border-success/20 bg-success/5 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center text-success">
              <Award size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Average Score</span>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <h2 className="text-5xl font-mono font-black text-text-primary tracking-tighter">{avgQuizScore}%</h2>
            <p className="text-[10px] font-bold text-success mb-1 uppercase tracking-widest">{quizCount} Sessions</p>
          </div>
          <Award size={100} className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity" />
        </Card>

        <Card className="p-6 border-warning/20 bg-warning/5 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center text-warning">
              <Cpu size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-dim">Logic Projects</span>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <h2 className="text-5xl font-mono font-black text-text-primary tracking-tighter">{projectCount}</h2>
            <p className="text-[10px] font-bold text-warning mb-1 uppercase tracking-widest">Saved Rungs</p>
          </div>
          <Cpu size={100} className="absolute -bottom-6 -right-6 opacity-[0.03] rotate-12 group-hover:opacity-[0.06] transition-opacity" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted">Last Module Accessed</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>View All Modules</Button>
          </div>
          {lastModule && (
            <Card hoverable className="p-6 group cursor-pointer border-border/40" onClick={() => navigate(`/learning/${lastModule.id}`)}>
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                   <History size={32} />
                 </div>
                 <div className="flex-1">
                   <h4 className="font-mono text-lg font-bold text-text-primary group-hover:text-accent transition-colors">
                     {lastModule.title}
                   </h4>
                   <p className="text-xs text-text-muted mt-1">{lastModule.levelId.replace('level-', 'Level ')} • {lastModule.estimatedMinutes} min estimated read</p>
                 </div>
                 <ArrowRight size={20} className="text-text-dim group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          )}
        </section>

        {/* Global Activity */}
        <section className="space-y-4">
           <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-text-muted">Recent Certifications</h3>
           <Card className="divide-y divide-border/20 overflow-hidden bg-bg-surface/50 border-border/40">
             {lastActivity.length > 0 ? lastActivity.map((quiz) => (
                <div key={quiz.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Star size={14} className={quiz.score >= 80 ? "text-warning fill-warning" : "text-text-dim"} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary">{quiz.score >= 80 ? 'Certified' : 'Attempted'}: Level {quiz.level}</span>
                      <span className="text-[10px] text-text-dim">Score: {quiz.score}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-text-dim">{new Date(quiz.completedAt).toLocaleDateString()}</span>
                </div>
             )) : (
               <div className="p-10 text-center text-text-dim text-xs font-mono italic">
                 Belum ada riwayat ujian.
               </div>
             )}
           </Card>
        </section>
      </div>
    </div>
  );
}
