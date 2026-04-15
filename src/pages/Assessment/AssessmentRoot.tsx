
import { useAssessment } from '@/hooks/useAssessment';
import { Button, Card, Badge } from '@/components/ui';
import { 
  ClipboardCheck, ArrowRight, Award, Timer, 
  CheckCircle, AlertCircle, Download, RefreshCcw 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { LEARNING_LEVELS } from '@/constants/learningModules';
import { motion } from 'framer-motion';

// ============================================================
// Assessment Module — Task 20
// ============================================================

export default function AssessmentRoot() {
  const { 
    isRunning, currentQuestion, currentIndex, 
    totalQuestions, timeRemaining, startQuiz, submitAnswer, 
    lastSession, reset 
  } = useAssessment();

  // Helper Format Waktu
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 1. SELECTOR VIEW
  if (!isRunning && !lastSession) {
    return (
      <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
        <header>
          <h1 className="text-3xl font-mono font-black text-text-primary italic uppercase tracking-tighter">
            Sertifikasi <span className="text-accent">Kompetensi</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 max-w-2xl">
            Tunjukkan keahlianmu. Selesaikan kuis dengan skor minimal 80% untuk mendapatkan sertifikat digital 
            yang dapat kamu lampirkan di portofolio industri.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEARNING_LEVELS.map((lvl) => (
            <Card key={lvl.id} hoverable className="p-6 group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <ClipboardCheck size={24} />
                </div>
                <Badge variant={lvl.color as any}>{lvl.title.split(':')[0]}</Badge>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-mono text-xl font-bold mb-2 group-hover:text-accent transition-colors">{lvl.title}</h3>
                <p className="text-text-muted text-xs mb-6 line-clamp-2">
                  Ujian mencakup teori arsitektur PLC, pemrograman ladder, dan troubleshooting {lvl.title.split(':')[0]}.
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-border pt-4 relative z-10">
                <div className="flex gap-4 text-[10px] font-mono text-text-dim uppercase tracking-widest font-bold">
                   <span className="flex items-center gap-1"><CheckCircle size={10} /> 10 Soal</span>
                   <span className="flex items-center gap-1"><Timer size={10} /> 15 Min</span>
                </div>
                <Button 
                   size="sm" 
                   rightIcon={<ArrowRight size={14} />}
                   onClick={() => startQuiz(parseInt(lvl.id.replace('level-', '')) as any)}
                >
                  Mulai Ujian
                </Button>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 group-hover:opacity-[0.08] transition-opacity">
                 <ClipboardCheck size={120} />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 2. QUIZ SESSION VIEW
  if (isRunning && currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-4">
        {/* Header Stats */}
        <div className="flex items-center justify-between px-2">
           <div className="flex flex-col">
             <span className="font-mono text-[10px] text-text-dim uppercase font-bold tracking-widest">Progress Logic</span>
             <span className="font-mono text-sm text-text-primary">Question {currentIndex + 1} of {totalQuestions}</span>
           </div>
           <div className={`flex items-center gap-2 font-mono text-lg font-black ${timeRemaining < 60 ? 'text-danger animate-pulse' : 'text-accent'}`}>
             <Timer size={20} /> {formatTime(timeRemaining)}
           </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden border border-white/5 p-[2px]">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
             className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(0,212,255,0.5)]" 
           />
        </div>

        {/* Question Card */}
        <Card className="p-8 lg:p-12 border-accent/20 bg-gradient-to-br from-bg-surface to-bg-elevated">
          <Badge variant="accent" className="mb-6 opacity-80 uppercase tracking-tighter italic">PLC Module Level {currentQuestion.category}</Badge>
          <h2 className="text-xl lg:text-2xl font-mono font-bold leading-tight mb-10 text-text-primary">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => submitAnswer(idx)}
                className="w-full flex items-center gap-4 p-5 rounded-xl border border-border bg-black/40 hover:border-accent hover:bg-accent/5 transition-all text-left group"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-bg-elevated border border-border flex items-center justify-center font-mono text-sm font-black group-hover:bg-accent group-hover:text-bg transition-colors">
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="text-text-primary text-sm font-semibold">{option}</span>
              </motion.button>
            ))}
          </div>
        </Card>

        <p className="text-center text-[10px] text-text-dim italic">
          * Jawaban yang sudah diklik akan langsung tersimpan. Gunakan insting industrialmu!
        </p>
      </div>
    );
  }

  // 3. RESULT VIEW
  if (lastSession) {
    const isPassed = lastSession.score >= 80;

    const downloadCertificate = () => {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const { score, level, id } = lastSession;
      
      // Industrial Style Background
      doc.setFillColor(10, 12, 18); 
      doc.rect(0, 0, 297, 210, 'F');
      
      // Accents
      doc.setDrawColor(0, 212, 255);
      doc.setLineWidth(1);
      doc.rect(5, 5, 287, 200);
      doc.setLineWidth(0.2);
      doc.rect(7, 7, 283, 196);
      
      // Text
      doc.setTextColor(0, 212, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 55, { align: 'center' });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text('This is to certify that you have successfully validated your expertise in', 148.5, 80, { align: 'center' });
      
      doc.setTextColor(0, 212, 255);
      doc.setFontSize(28);
      doc.text(`PLC AUTOMATION SPECIALIST - LEVEL ${level}`, 148.5, 100, { align: 'center' });
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text(`WITH A FINAL SCORE OF ${score}%`, 148.5, 120, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Verification ID: ${id.substring(0, 18).toUpperCase()}`, 148.5, 175, { align: 'center' });
      doc.text(`Issued by PLC Training Suite Digital Academy on ${new Date().toLocaleDateString()}`, 148.5, 182, { align: 'center' });
      
      // Foolproof PDF Download (Prevents browser from downloading blob UUID as filename due to PWA SW interception)
      const filename = `PLC_Sertifikat_Lvl${level}.pdf`;
      const dataUri = doc.output('datauristring', { filename });
      
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
      }, 500);
    };

    return (
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <Card className="overflow-hidden shadow-2xl border-accent/20">
          <div className={`p-12 text-center relative ${isPassed ? 'bg-success/5' : 'bg-danger/5'}`}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-4 shadow-xl ${
                isPassed ? 'bg-success/20 border-success text-success' : 'bg-danger/20 border-danger text-danger'
              }`}
            >
              {isPassed ? <Award size={48} /> : <AlertCircle size={48} />}
            </motion.div>
            <h2 className={`text-4xl font-mono font-black mb-4 italic uppercase tracking-tighter ${isPassed ? 'text-success' : 'text-danger'}`}>
              {isPassed ? 'COMPETENCE VERIFIED' : 'LOW VOLTAGE LOGIC'}
            </h2>
            <p className="text-text-muted text-sm px-4 leading-relaxed">
              {isPassed 
                ? 'Selamat! Kamu telah mendemonstrasikan keahlian tingkat tinggi dalam sistem PLC. Sertifikat resmi sudah tersedia untuk kamu unduh.'
                : 'Maaf, skor kamu belum mencapai batas minimal 80%. PLC butuh presisi tinggi, jangan menyerah dan coba pelajari lagi modulnya.'
              }
            </p>
          </div>

          <div className="p-12 bg-black/40 border-t border-border flex flex-col items-center gap-10">
            <div className="grid grid-cols-2 gap-12 w-full text-center">
               <div className="flex flex-col">
                 <span className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Final Score</span>
                 <span className={`text-6xl font-mono font-black ${isPassed ? 'text-success' : 'text-danger'}`}>{lastSession.score}%</span>
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-text-dim uppercase font-bold tracking-widest mb-1">Duration</span>
                 <span className="text-6xl font-mono font-black text-text-primary">{formatTime(lastSession.duration)}</span>
               </div>
            </div>

            <div className="flex gap-4 w-full">
               <Button 
                 variant="outline" 
                 fullWidth 
                 leftIcon={<RefreshCcw size={16} />}
                 onClick={reset}
               >
                 Tutup Hasil
               </Button>
               {isPassed && (
                 <Button 
                   fullWidth 
                   className="shadow-accent"
                   leftIcon={<Download size={18} />} 
                   onClick={downloadCertificate}
                 >
                   Unduh Sertifikat
                 </Button>
               )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
