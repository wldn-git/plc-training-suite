import { useNavigate } from 'react-router-dom';
import { LEARNING_LEVELS } from '@/constants/learningModules';
import { useProgress } from '@/hooks/useProgress';
import { Card, Badge } from '@/components/ui';
import { BookOpen, CheckCircle2, Clock, ArrowRight, FileText, Sparkles, Cpu } from 'lucide-react';

export default function LearningIndex() {
  const navigate = useNavigate();
  const { getModuleStatus, calculateOverallProgress } = useProgress();
  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header & Overall Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-mono font-bold text-text-primary">Kurikulum PLC</h1>
          <p className="text-text-muted text-sm mt-1">Selesaikan semua level untuk mendapatkan sertifikat kompetensi.</p>
        </div>
        
        <Card className="px-6 py-4 flex items-center gap-6 border-accent/20">
          <div className="text-right">
            <p className="text-[10px] text-text-dim uppercase font-bold tracking-widest">Total Progress</p>
            <p className="text-2xl font-mono font-black text-accent">{overallProgress}%</p>
          </div>
          <div className="w-24 h-2 bg-bg-elevated rounded-full overflow-hidden border border-white/5">
             <div 
               className="h-full bg-accent transition-all duration-500 shadow-accent" 
               style={{ width: `${overallProgress}%` }}
             />
          </div>
        </Card>
      </div>

      {/* Featured Article Webinar Banner */}
      <div 
        onClick={() => navigate('/learning/article-basic-plc')}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-r from-bg-surface via-bg-elevated to-accent/10 p-6 shadow-xl transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accent/10"
      >
        <div className="absolute -right-8 -bottom-8 opacity-10 transition-transform duration-500 group-hover:scale-110">
          <Cpu size={180} className="text-accent" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" className="flex items-center gap-1">
                <Sparkles size={10} /> Artikel Terbaru
              </Badge>
              <Badge variant="amber">Modul Webinar</Badge>
              <span className="text-text-dim font-mono text-xs flex items-center gap-1">
                <Clock size={12} /> 15 min. read
              </span>
            </div>
            <h2 className="text-xl font-mono font-bold text-text-primary group-hover:text-accent transition-colors leading-tight">
              BASIC PLC: Fondasi Kontrol Otomasi untuk Mendukung Transformasi Industri 4.0
            </h2>
            <p className="text-xs text-text-muted line-clamp-2">
              Modul artikel interaktif lengkap: Pengenalan PLC, Komponen Hardware, Scan Cycle Simulator, Logika Ladder Diagram, SCADA/IIoT, & 3 Studi Kasus Industri.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-accent group-hover:underline">
              Baca Artikel Lengkap
            </span>
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent group-hover:translate-x-1 transition-transform">
              <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Level Sections */}
      {LEARNING_LEVELS.map((levelDef) => {
        const modulesInLevel = levelDef.modules;
        
        return (
          <div key={levelDef.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={levelDef.color as any} className="text-xs">{levelDef.title}</Badge>
              <div className="h-[1px] flex-1 bg-border/50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {modulesInLevel.map((mod) => {
                const status = getModuleStatus(mod.id);
                const isCompleted = status === 'selesai';

                return (
                  <Card 
                    key={mod.id} 
                    hoverable 
                    className={`group cursor-pointer ${isCompleted ? 'border-success/30' : ''}`}
                    onClick={() => navigate(`/learning/${mod.id}`)}
                  >
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${
                          isCompleted 
                            ? 'bg-success/10 border-success text-success' 
                            : 'bg-bg-elevated border-border text-text-dim group-hover:border-accent group-hover:text-accent'
                        }`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <BookOpen size={20} />}
                        </div>
                        <Badge variant="default" className="flex items-center gap-1">
                          <Clock size={10} /> {mod.estimatedMinutes} min
                        </Badge>
                      </div>

                      <h3 className="font-mono font-bold text-lg text-text-primary group-hover:text-accent transition-colors leading-tight mb-2">
                        {mod.title}
                      </h3>
                      <p className="text-text-muted text-xs line-clamp-2 flex-1">
                        {mod.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isCompleted ? 'text-success' : 'text-text-dim'
                        }`}>
                          {isCompleted ? 'Selesai Dibaca' : 'Belum Selesai'}
                        </span>
                        <ArrowRight size={16} className={`transition-transform group-hover:translate-x-1 ${
                          isCompleted ? 'text-success' : 'text-text-dim'
                        }`} />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
