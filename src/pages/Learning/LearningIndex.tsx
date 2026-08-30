import { useNavigate } from 'react-router-dom';
import { LEARNING_LEVELS } from '@/constants/learningModules';
import { useProgress } from '@/hooks/useProgress';
import { Card, Badge } from '@/components/ui';
import { BookOpen, CheckCircle2, Clock, ArrowRight, Sparkles, Cpu } from 'lucide-react';

export default function LearningIndex() {
  const navigate = useNavigate();
  const { getModuleStatus, calculateOverallProgress } = useProgress();
  const overallProgress = calculateOverallProgress();

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans select-none">
      {/* Header & Overall Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1f1f1f] dark:text-white">Kurikulum PLC</h1>
          <p className="text-xs sm:text-sm text-[#666666] dark:text-[#9d9d9d] mt-0.5">
            Selesaikan seluruh level materi untuk mengklaim sertifikat kompetensi otomatis.
          </p>
        </div>
        
        <div className="bg-[#ffffff] dark:bg-[#1f1f1f] border border-[#e5e5e5] dark:border-[#333333] px-5 py-3 flex items-center gap-4 shadow-sm shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-[#858585] uppercase font-bold tracking-wider font-mono">Total Progres</p>
            <p className="text-xl font-bold text-[#0078d4] font-mono">{overallProgress}%</p>
          </div>
          <div className="w-24 h-2 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e5e5e5] dark:border-[#3f3f46] overflow-hidden">
            <div 
              className="h-full bg-[#0078d4] transition-all duration-500" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Featured Article Webinar Banner (Windows 10 Hero Card) */}
      <div 
        onClick={() => navigate('/learning/article-basic-plc')}
        className="group relative cursor-pointer border border-[#e5e5e5] dark:border-[#3f3f46] border-l-4 border-l-[#0078d4] bg-[#ffffff] dark:bg-[#1f1f1f] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[#0078d4] transition-all duration-200"
      >
        <div className="absolute right-4 bottom-2 opacity-5 dark:opacity-10 pointer-events-none">
          <Cpu size={140} className="text-[#0078d4]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" className="flex items-center gap-1">
                <Sparkles size={10} /> Artikel Baru
              </Badge>
              <Badge variant="warning">Modul Webinar</Badge>
              <span className="text-[#666666] dark:text-[#858585] font-mono text-xs flex items-center gap-1">
                <Clock size={12} className="text-[#0078d4]" /> 15 min. read
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1f1f1f] dark:text-white group-hover:text-[#0078d4] transition-colors leading-snug">
              BASIC PLC: Fondasi Kontrol Otomasi untuk Mendukung Transformasi Industri 4.0
            </h2>
            <p className="text-xs text-[#555555] dark:text-[#cccccc] line-clamp-2 leading-relaxed">
              Modul artikel interaktif lengkap: Pengenalan PLC, Komponen Hardware, Scan Cycle Simulator, Logika Ladder Diagram, SCADA/IIoT, & 3 Studi Kasus Industri.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#0078d4] group-hover:underline">
              Buka Artikel Lengkap
            </span>
            <div className="w-8 h-8 bg-[#0078d4] text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform shadow-sm">
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Level Sections */}
      {LEARNING_LEVELS.map((levelDef) => {
        const modulesInLevel = levelDef.modules;
        
        return (
          <div key={levelDef.id} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Badge variant={levelDef.color as any} className="text-xs font-bold">{levelDef.title}</Badge>
              <div className="h-[1px] flex-1 bg-[#e5e5e5] dark:bg-[#333333]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {modulesInLevel.map((mod) => {
                const status = getModuleStatus(mod.id);
                const isCompleted = status === 'selesai';

                return (
                  <Card 
                    key={mod.id} 
                    hoverable 
                    className={`group cursor-pointer bg-[#ffffff] dark:bg-[#1f1f1f] border-[#e5e5e5] dark:border-[#333333] hover:border-[#0078d4] ${
                      isCompleted ? 'border-l-4 border-l-[#107c41]' : ''
                    }`}
                    onClick={() => navigate(`/learning/${mod.id}`)}
                  >
                    <div className="p-4 flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className={`w-8 h-8 flex items-center justify-center border font-bold text-xs ${
                            isCompleted 
                              ? 'bg-[#107c41]/10 border-[#107c41] text-[#107c41]' 
                              : 'bg-[#f3f3f3] dark:bg-[#2d2d2d] border-[#e5e5e5] dark:border-[#3f3f46] text-[#666666] dark:text-[#858585] group-hover:border-[#0078d4] group-hover:text-[#0078d4]'
                          }`}>
                            {isCompleted ? <CheckCircle2 size={16} /> : <BookOpen size={16} />}
                          </div>
                          <Badge variant="default" className="flex items-center gap-1 font-mono text-[10px]">
                            <Clock size={10} /> {mod.estimatedMinutes} min
                          </Badge>
                        </div>

                        <h3 className="font-bold text-sm text-[#1f1f1f] dark:text-white group-hover:text-[#0078d4] transition-colors leading-snug mb-1.5">
                          {mod.title}
                        </h3>
                        <p className="text-[#666666] dark:text-[#9d9d9d] text-xs line-clamp-2 leading-relaxed">
                          {mod.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#e5e5e5] dark:border-[#333333] pt-3 text-xs">
                        <span className={`text-[11px] font-bold ${
                          isCompleted ? 'text-[#107c41]' : 'text-[#858585]'
                        }`}>
                          {isCompleted ? '✓ Selesai' : 'Belum Selesai'}
                        </span>
                        <div className="flex items-center gap-1 text-[#0078d4] font-medium group-hover:translate-x-0.5 transition-transform">
                          <span>Mulai Baca</span>
                          <ArrowRight size={13} />
                        </div>
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
