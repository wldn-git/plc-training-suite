import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '@/components/ui';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Share2,
  CheckCircle2,
  Bookmark,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  TrendingUp,
  FileText,
  ExternalLink,
  Layers,
  Lightbulb,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  BarChart3,
  Server,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// Interactive Component 1: Scan Cycle Visualizer
// ============================================================
const ScanCycleWidget = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = [
    {
      title: '1. Read Inputs (Bimbing Input)',
      desc: 'PLC membaca sinyal dari semua sensor fisik (tombol, saklar, proximity) dan menyimpannya di memori Input Image.',
      icon: SensorIcon,
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400'
    },
    {
      title: '2. Execute Program (Eksekusi Logika)',
      desc: 'CPU memproses baris program Ladder dari rung teratas ke terbawah menggunakan data Input Image.',
      icon: Cpu,
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-400'
    },
    {
      title: '3. Write Outputs (Perbarui Output)',
      desc: 'Hasil akhir logika ditulis ke Output Image, kemudian dikirim bersamaan ke modul output (motor, solenoid, lampu).',
      icon: Zap,
      color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/40 text-emerald-400'
    }
  ];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 3);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="my-8 p-6 rounded-2xl bg-bg-surface border border-accent/20 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-wider">
            <Activity size={16} /> Interactive Simulator
          </div>
          <h4 className="text-lg font-mono font-bold text-text-primary mt-1">
            Visualisasi Siklus Kerja PLC (Scan Cycle)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isPlaying ? 'outline' : 'primary'}
            onClick={() => setIsPlaying(!isPlaying)}
            leftIcon={isPlaying ? <RotateCcw size={14} /> : <Play size={14} />}
          >
            {isPlaying ? 'Pause Simulasi' : 'Putar Otomatis'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              onClick={() => {
                setActiveStep(idx);
                setIsPlaying(false);
              }}
              className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-b ${step.color} shadow-lg scale-[1.02]`
                  : 'bg-bg-elevated/40 border-border hover:border-white/20'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-accent animate-pulse" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    isActive ? 'bg-black/40' : 'bg-bg-elevated text-text-muted'
                  }`}
                >
                  0{idx + 1}
                </div>
                <h5 className="font-mono font-bold text-sm text-text-primary">
                  {step.title.split(' ')[1]} {step.title.split(' ')[2]}
                </h5>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs text-text-dim font-mono">
        <span>Kecepatan Siklus Lapangan: 1 ms - 20 ms</span>
        <span className="text-accent">Tahap Aktif: {steps[activeStep].title}</span>
      </div>
    </div>
  );
};

function SensorIcon(props: any) {
  return <Workflow {...props} />;
}

// ============================================================
// Interactive Component 2: Start-Stop Ladder Diagram Simulator
// ============================================================
const StartStopLadderWidget = () => {
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [motorOn, setMotorOn] = useState(false);

  // Logic: Motor ON if (Start OR MotorOn) AND NOT Stop
  const isPowerFlowing = (startPressed || motorOn) && !stopPressed;

  useEffect(() => {
    if (isPowerFlowing) {
      setMotorOn(true);
    } else if (stopPressed) {
      setMotorOn(false);
    }
  }, [startPressed, stopPressed, isPowerFlowing]);

  return (
    <div className="my-8 p-6 rounded-2xl bg-bg-surface border border-emerald-500/20 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles size={16} /> Interactive Circuit
          </div>
          <h4 className="text-lg font-mono font-bold text-text-primary mt-1">
            Simulasi Ladder Diagram: Start-Stop Motor Latch
          </h4>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setStartPressed(false);
            setStopPressed(false);
            setMotorOn(false);
          }}
          leftIcon={<RotateCcw size={14} />}
        >
          Reset Rangkaian
        </Button>
      </div>

      <p className="text-xs text-text-muted mb-6">
        Coba tekan tombol **START (NO)** lalu lepas. Perhatikan bagaimana kontak sekunder `Motor_M1` mengunci (self-hold) daya sehingga motor tetap berjalan hingga tombol **STOP (NC)** ditekan.
      </p>

      {/* Control Switches */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onMouseDown={() => setStartPressed(true)}
          onMouseUp={() => setStartPressed(false)}
          onTouchStart={() => setStartPressed(true)}
          onTouchEnd={() => setStartPressed(false)}
          className={`px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 border ${
            startPressed
              ? 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/50'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
          }`}
        >
          {startPressed ? '▶ [HOLDING START]' : '▶ TEKAN START (NO)'}
        </button>

        <button
          onMouseDown={() => setStopPressed(true)}
          onMouseUp={() => setStopPressed(false)}
          onTouchStart={() => setStopPressed(true)}
          onTouchEnd={() => setStopPressed(false)}
          className={`px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-md active:scale-95 border ${
            stopPressed
              ? 'bg-red-500 text-white border-red-400 shadow-red-500/50'
              : 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/40'
          }`}
        >
          {stopPressed ? '⏹ [HOLDING STOP]' : '⏹ TEKAN STOP (NC)'}
        </button>
      </div>

      {/* Visual Ladder Rung */}
      <div className="p-6 rounded-xl bg-black/70 border border-white/10 font-mono text-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] relative">
          {/* Left Power Rail */}
          <div className="w-2 h-24 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" />

          {/* Rung line */}
          <div className="flex-1 flex flex-col justify-between h-20 px-4">
            {/* Top Branch: START button & STOP button & Coil */}
            <div className="flex items-center justify-between relative">
              {/* Wire Left to Start */}
              <div
                className={`h-1 flex-1 transition-colors duration-300 ${
                  isPowerFlowing ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-gray-700'
                }`}
              />

              {/* START contact */}
              <div
                className={`px-3 py-1.5 rounded border text-center font-bold transition-all ${
                  startPressed
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                —| |—
                <div className="text-[10px]">Start (I0.0)</div>
              </div>

              {/* Wire Start to Stop */}
              <div
                className={`h-1 flex-1 transition-colors duration-300 ${
                  isPowerFlowing || (motorOn && !stopPressed)
                    ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                    : 'bg-gray-700'
                }`}
              />

              {/* STOP contact */}
              <div
                className={`px-3 py-1.5 rounded border text-center font-bold transition-all ${
                  stopPressed
                    ? 'bg-red-500/20 border-red-400 text-red-300'
                    : 'bg-gray-800 border-gray-600 text-gray-300'
                }`}
              >
                —|/|—
                <div className="text-[10px]">Stop (I0.1)</div>
              </div>

              {/* Wire Stop to Coil */}
              <div
                className={`h-1 flex-1 transition-colors duration-300 ${
                  motorOn && !stopPressed
                    ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                    : 'bg-gray-700'
                }`}
              />

              {/* Coil Output */}
              <div
                className={`px-4 py-1.5 rounded-full border text-center font-bold transition-all ${
                  motorOn
                    ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                —( )—
                <div className="text-[10px]">Motor_M1 (Q0.0)</div>
              </div>

              <div
                className={`h-1 w-6 transition-colors duration-300 ${
                  motorOn ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
            </div>

            {/* Parallel Latch Branch (Motor_M1 Auxiliary Contact) */}
            <div className="flex items-center pl-[25%] pr-[45%] relative -mt-3">
              <div
                className={`w-0.5 h-6 transition-colors ${
                  motorOn && !stopPressed ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
              <div
                className={`h-1 flex-1 transition-colors ${
                  motorOn && !stopPressed ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
              <div
                className={`px-3 py-1 rounded border text-center font-bold text-[11px] ${
                  motorOn
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                —| |— Motor_M1 (Self-Hold)
              </div>
              <div
                className={`h-1 flex-1 transition-colors ${
                  motorOn && !stopPressed ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
              <div
                className={`w-0.5 h-6 transition-colors ${
                  motorOn && !stopPressed ? 'bg-yellow-400' : 'bg-gray-700'
                }`}
              />
            </div>
          </div>

          {/* Right Power Rail */}
          <div className="w-2 h-24 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs font-mono">
        <span className="text-text-muted">Status Motor Lapangan:</span>
        <span
          className={`font-bold px-3 py-1 rounded-full ${
            motorOn
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-bg-elevated text-text-dim border border-white/5'
          }`}
        >
          {motorOn ? '● MOTOR BERJALAN (ON)' : '○ MOTOR BERHENTI (OFF)'}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// Main Page Component
// ============================================================
export default function ArticleWebinarPLC() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const sections = [
    { id: 'sec-1', label: '1. Pengantar' },
    { id: 'sec-2', label: '2. Tujuan Pembelajaran' },
    { id: 'sec-3', label: '3. Dasar-Dasar PLC' },
    { id: 'sec-4', label: '4. Logika Ladder' },
    { id: 'sec-5', label: '5. Pilar Industri 4.0' },
    { id: 'sec-6', label: '6. Studi Kasus' },
    { id: 'sec-7', label: '7. Key Takeaways' },
    { id: 'sec-8', label: '8. Daftar Pustaka' }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 animate-fade-in">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/learning')}
        >
          Kembali ke Kurikulum
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBookmarked(!bookmarked)}
            leftIcon={
              <Bookmark
                size={14}
                className={bookmarked ? 'fill-accent text-accent' : ''}
              />
            }
          >
            {bookmarked ? 'Tersimpan' : 'Simpan'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            leftIcon={<Share2 size={14} />}
          >
            {copied ? 'Tersalin!' : 'Bagikan'}
          </Button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <Card className="overflow-hidden border-accent/30 shadow-2xl mb-8 relative">
        <div className="bg-gradient-to-br from-bg-surface via-bg-base to-accent/10 p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 opacity-10 pointer-events-none">
            <Cpu size={320} className="text-accent" />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="cyan">Modul Webinar Eksklusif</Badge>
            <Badge variant="amber">Industri 4.0</Badge>
            <Badge variant="green">Dasar PLC</Badge>
            <span className="text-text-dim font-mono text-xs flex items-center gap-1 ml-auto">
              <Clock size={12} /> 15 min. read
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-mono font-black text-text-primary leading-tight max-w-4xl">
            BASIC PLC: Fondasi Kontrol Otomasi untuk Mendukung Transformasi Industri 4.0
          </h1>

          <p className="text-text-muted mt-4 text-base lg:text-xl max-w-3xl leading-relaxed italic">
            "Dari relay ke smart factory: memahami PLC sebagai jembatan antara mesin dan data."
          </p>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-text-dim">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold">
                W
              </div>
              <div>
                <p className="text-text-primary font-bold">WLDN Engineering Series</p>
                <p className="text-[10px]">Dipublikasikan untuk PLC Training Suite</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-accent font-bold">11</span> Halaman PDF
              </div>
              <div>
                <span className="text-accent font-bold">3</span> Studi Kasus Nyata
              </div>
              <div>
                <span className="text-accent font-bold">100%</span> Gratis
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Grid: Sidebar TOC + Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card className="p-4 border-border/60 bg-bg-surface/80 backdrop-blur">
              <h3 className="text-xs font-mono font-bold text-text-dim uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers size={14} className="text-accent" /> Daftar Isi Artikel
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                      activeSection === sec.id
                        ? 'bg-accent/15 text-accent font-bold border-l-2 border-accent'
                        : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    {activeSection === sec.id && <ChevronRight size={12} />}
                  </button>
                ))}
              </nav>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-accent/5 to-cyan-500/5 border-accent/20">
              <h4 className="text-xs font-mono font-bold text-accent mb-1 flex items-center gap-1.5">
                <Sparkles size={14} /> Tahukah Anda?
              </h4>
              <p className="text-[11px] text-text-muted leading-relaxed">
                PLC pertama (Modicon 084) diciptakan tahun 1968 oleh Dick Morley hanya untuk menggantikan kabel ribuan relay pada pabrik otomotif Chevrolet.
              </p>
            </Card>
          </div>
        </div>

        {/* Main Article Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* SECTION 1 */}
          <section id="sec-1" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="cyan">Bagian 1</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  1. Pengantar — Kenapa PLC Masih Relevan di Era Industri 4.0
                </h2>
              </div>

              <p className="text-text-primary/90 leading-relaxed">
                Ketika orang mendengar istilah **"Industri 4.0"**, bayangan yang muncul biasanya adalah kecerdasan buatan (*artificial intelligence*), big data, atau robot yang bekerja otonom penuh. Tapi di balik semua istilah yang terdengar futuristik itu, ada satu komponen yang justru sudah eksis sejak akhir 1960-an dan sampai sekarang tetap jadi tulang punggung lantai produksi: **Programmable Logic Controller (PLC)**.
              </p>

              <p className="text-text-primary/90 leading-relaxed">
                PLC pertama kali dikembangkan sebagai pengganti sistem relay elektromekanis yang rumit dan mahal untuk diubah — dulu, kalau proses produksi berubah, teknisi harus mengganti pengkabelan fisik satu per satu. Dengan hadirnya download program dari komputer atau perangkat pemrograman, perubahan logika kontrol bisa dilakukan dalam hitungan detik tanpa membongkar panel.
              </p>

              <p className="text-text-primary/90 leading-relaxed">
                Yang menarik, alih-alih tergantikan oleh teknologi baru, PLC modern justru berevolusi menjadi jembatan penting yang menghubungkan lantai produksi (*shop floor*) dengan lapisan data dan analitik di atasnya. PLC generasi terbaru dari vendor-vendor besar kini mampu berinteraksi secara real-time dengan sensor IoT yang terhubung ke fasilitas, memungkinkan integrasi mulus antara analisis data dan peralatan otomatis.
              </p>

              {/* INTINYA Callout */}
              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-5 rounded-r-xl space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm">
                  <Lightbulb size={18} /> INTINYA
                </div>
                <p className="text-amber-100/90 text-sm leading-relaxed">
                  PLC bukan teknologi lama yang akan digantikan Industri 4.0 — ia justru komponen yang memungkinkan Industri 4.0 terjadi di lapangan. Tanpa PLC yang bisa membaca sensor dan mengeksekusi logika secara deterministik dan real-time, seluruh lapisan analitik dan AI di atasnya tidak punya "tangan" untuk bertindak di dunia fisik.
                </p>
              </div>

              <p className="text-text-primary/90 leading-relaxed">
                Webinar ini dirancang untuk peserta dari berbagai latar belakang di industri — baik yang benar-benar baru mengenal PLC, teknisi yang ingin memperbarui pemahaman, maupun profesional non-teknis yang perlu tahu *"apa yang sebenarnya terjadi"* di balik istilah otomasi pabrik. Kita akan mulai dari konsep dasar, masuk ke logika pemrograman sederhana, lalu menyambungkannya ke konteks besar Industri 4.0 lewat studi kasus nyata.
              </p>
            </Card>
          </section>

          {/* SECTION 2 */}
          <section id="sec-2" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="amber">Bagian 2</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  2. Tujuan Pembelajaran
                </h2>
              </div>

              <p className="text-text-muted text-sm">
                Setelah membaca modul dan mengikuti materi ini, Anda diharapkan mampu:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Menjelaskan apa itu PLC, komponen utamanya, dan bagaimana ia bekerja secara siklik (scan cycle).',
                  'Membaca logika dasar ladder diagram — termasuk konsep kontak, coil, timer, dan counter — pada level pengantar.',
                  'Memahami posisi dan peran PLC dalam arsitektur otomasi modern, termasuk kaitannya dengan SCADA dan Industrial IoT (IIoT).',
                  'Mengidentifikasi bagaimana PLC mendukung inisiatif Industri 4.0 seperti predictive maintenance, efisiensi energi, dan smart factory.',
                  'Mengenali contoh penerapan nyata PLC di berbagai sektor industri sebagai bekal untuk eksplorasi lebih lanjut.'
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-bg-elevated/40 border border-white/5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-text-primary font-medium leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* SECTION 3 */}
          <section id="sec-3" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <Badge variant="green">Bagian 3</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  3. Dasar-Dasar PLC
                </h2>
              </div>

              {/* 3.1 Apa itu PLC */}
              <div className="space-y-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  3.1 Apa itu PLC?
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Secara definisi teknis, **PLC adalah controller berbasis mikroprosesor** yang menggunakan *programmable memory* untuk menyimpan instruksi dan menjalankan fungsi logika, sequencing, timing, counting, dan aritmatika guna mengendalikan mesin dan proses — dirancang agar bisa dioperasikan oleh engineer yang mungkin tidak punya latar belakang komputer mendalam.
                </p>
                <p className="text-text-primary/90 leading-relaxed">
                  Dengan kata lain lebih sederhana: **PLC adalah "komputer versi tahan banting"** yang tugasnya cuma satu — membaca kondisi input (sensor, saklar, tombol), memprosesnya berdasarkan program yang sudah ditulis, lalu menyalakan atau mematikan output (motor, valve, lampu indikator, solenoid). Siklus ini berulang terus-menerus, biasanya dalam hitungan milidetik.
                </p>

                {/* DEFINISI Callout */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-400 p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
                    <ShieldCheck size={18} /> DEFINISI — PLC vs Komputer Biasa
                  </div>
                  <p className="text-cyan-100/90 text-sm leading-relaxed">
                    Bedanya bukan di seberapa "pintar", tapi di **keandalan dan determinisme**. PLC dirancang untuk bertahan di lingkungan industri yang keras (getaran, suhu ekstrem, debu, noise listrik) dan menjamin waktu respons yang konsisten — sesuatu yang krusial ketika keterlambatan setengah detik bisa berarti produk cacat atau kondisi berbahaya.
                  </p>
                </div>

                <p className="text-text-primary/90 leading-relaxed">
                  Dari sisi praktik di lapangan, transisi dari sistem kontrol tradisional ke PLC sebenarnya cukup mulus secara konseptual: push button, limit switch, dan komponen command lain yang tadinya sudah ada tetap dipakai sebagai perangkat input ke PLC. Begitu juga kontaktor, relay, solenoid, dan lampu indikator tetap menjadi perangkat output yang dikendalikan PLC. Yang berubah bukan perangkat lapangannya, tapi **"otak" yang mengatur logikanya — dari pengkabelan fisik menjadi baris-baris program**.
                </p>
              </div>

              {/* 3.2 Komponen Utama PLC */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  3.2 Komponen Utama PLC
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Terlepas dari merek atau ukurannya, hampir semua PLC punya komponen fungsional yang sama:
                </p>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs font-mono uppercase bg-bg-elevated text-accent">
                      <tr>
                        <th className="px-6 py-3 border-b border-white/10">Komponen</th>
                        <th className="px-6 py-3 border-b border-white/10">Fungsi Utama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">Power Supply (PSU)</td>
                        <td className="px-6 py-3 text-text-muted">Mengonversi listrik AC dari sumber utama menjadi tegangan DC (umumnya 24V DC) yang dibutuhkan komponen internal PLC.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">CPU (Central Processing Unit)</td>
                        <td className="px-6 py-3 text-text-muted">"Otak" PLC — mengeksekusi program kontrol, memproses data input/output, dan mengelola seluruh operasi secara siklik.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">Memory</td>
                        <td className="px-6 py-3 text-text-muted">Menyimpan program kontrol serta data operasional, baik yang volatile (RAM) maupun non-volatile (ROM/EEPROM).</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">Modul Input/Output (I/O)</td>
                        <td className="px-6 py-3 text-text-muted">Antarmuka fisik yang menghubungkan PLC dengan perangkat lapangan — modul input membaca sensor/saklar, modul output mengendalikan aktuator.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">Communication Interface</td>
                        <td className="px-6 py-3 text-text-muted">Memungkinkan PLC bertukar data dengan perangkat lain — HMI, PLC lain, SCADA, atau jaringan pabrik yang lebih luas.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-text-primary">Programming Device</td>
                        <td className="px-6 py-3 text-text-muted">Komputer, laptop, atau perangkat genggam yang dipakai untuk menulis dan mengunggah program ke PLC.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* TIPS PRAKTIS Callout */}
                <div className="bg-emerald-500/10 border-l-4 border-emerald-400 p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-sm">
                    <Sparkles size={18} /> TIPS PRAKTIS — Cara Cepat Kenali Komponen di Panel Nyata
                  </div>
                  <p className="text-emerald-100/90 text-sm leading-relaxed">
                    Kalau Anda pertama kali membuka panel kontrol di lapangan, cari kotak dengan indikator LED berkedip (CPU), rel dengan banyak terminal berkabel (modul I/O), dan power supply biasanya ditandai warna terang dengan output 24V DC tertulis jelas di bodinya. HMI biasanya berupa layar sentuh terpisah yang dipasang di pintu panel atau di dekat operator.
                  </p>
                </div>
              </div>

              {/* 3.3 Siklus Kerja (Scan Cycle) */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  3.3 Siklus Kerja (Scan Cycle)
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  PLC bekerja secara siklik, bukan sekali jalan. Satu putaran siklus ini disebut **scan cycle**, dan secara garis besar terdiri dari tiga tahap yang berulang terus: membaca seluruh status input, mengeksekusi logika program dari atas ke bawah, lalu memperbarui seluruh status output. Setelah itu siklus kembali ke awal — dan ini terjadi berulang kali dalam hitungan milidetik (1 hingga 20 ms).
                </p>

                {/* Scan Cycle Widget */}
                <ScanCycleWidget />

                {/* ANALOGI Callout */}
                <div className="bg-purple-500/10 border-l-4 border-purple-400 p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-sm">
                    <Workflow size={18} /> ANALOGI SEDERHANA — Mandor Pabrik
                  </div>
                  <p className="text-purple-100/90 text-sm leading-relaxed">
                    Bayangkan scan cycle seperti seorang mandor yang berjalan mengelilingi pabrik setiap beberapa milidetik: ia mengecek semua sensor sekali (baca input), memutuskan tindakan berdasarkan aturan yang ia hafal (eksekusi logika), lalu memberi perintah ke semua mesin sekaligus (tulis output) — baru kemudian mulai putaran berikutnya dari awal.
                  </p>
                </div>
              </div>

              {/* 3.4 Bahasa Pemrograman PLC */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  3.4 Bahasa Pemrograman PLC (Standard IEC 61131-3)
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Standar internasional **IEC 61131-3** mendefinisikan beberapa bahasa pemrograman PLC yang diakui industri:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-elevated border border-accent/30">
                    <h5 className="font-mono font-bold text-accent mb-1">Ladder Diagram (LD)</h5>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Representasi grafis yang meniru diagram relay elektrik, paling intuitif bagi orang dengan latar belakang kelistrikan.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-elevated border border-white/10">
                    <h5 className="font-mono font-bold text-text-primary mb-1">Structured Text (ST)</h5>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Bahasa tingkat tinggi mirip Pascal/C, sangat cocok untuk algoritma matematika kompleks dan manipulasi data.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-elevated border border-white/10">
                    <h5 className="font-mono font-bold text-text-primary mb-1">Function Block Diagram (FBD)</h5>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Pemrograman berbasis blok fungsi yang saling terhubung, sangat populer untuk industri proses kontinu.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-elevated border border-white/10">
                    <h5 className="font-mono font-bold text-text-primary mb-1">Sequential Function Chart (SFC)</h5>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Digunakan untuk memodelkan proses berurutan bertahap (*state-based process/batch*).
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* SECTION 4 */}
          <section id="sec-4" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <Badge variant="cyan">Bagian 4</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  4. Logika Dasar: Ladder Diagram
                </h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  4.1 Kontak, Coil, dan Rung
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Ladder diagram (ladder logic) adalah bahasa pemrograman grafis yang dibangun dari kontak, coil, dan fungsi lain yang disusun dalam baris-baris yang disebut **rung** — istilah ini diambil dari analogi "anak tangga" pada gambar tangga (ladder).
                </p>

                {/* Symbols Table */}
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs font-mono uppercase bg-bg-elevated text-accent">
                      <tr>
                        <th className="px-4 py-3 border-b border-white/10">Simbol</th>
                        <th className="px-4 py-3 border-b border-white/10">Arti / Nama</th>
                        <th className="px-4 py-3 border-b border-white/10">Analogi Fisik</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs font-mono">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-accent font-bold">—| |—</td>
                        <td className="px-4 py-3 text-text-primary">Normally Open (NO) contact</td>
                        <td className="px-4 py-3 text-text-muted">Kondisi TRUE saat input aktif, seperti saklar yang tertutup ketika ditekan.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-accent font-bold">—|/|—</td>
                        <td className="px-4 py-3 text-text-primary">Normally Closed (NC) contact</td>
                        <td className="px-4 py-3 text-text-muted">Kondisi TRUE saat input tidak aktif, seperti saklar emergency stop.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-accent font-bold">—( )—</td>
                        <td className="px-4 py-3 text-text-primary">Coil (output)</td>
                        <td className="px-4 py-3 text-text-muted">Mewakili output yang diaktifkan — motor, lampu, solenoid.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-accent font-bold">—[TON]—</td>
                        <td className="px-4 py-3 text-text-primary">Timer On-Delay</td>
                        <td className="px-4 py-3 text-text-muted">Menunda aktivasi output selama waktu tertentu setelah kondisi terpenuhi.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 text-accent font-bold">—[CTU]—</td>
                        <td className="px-4 py-3 text-text-primary">Counter Up</td>
                        <td className="px-4 py-3 text-text-muted">Menambah nilai hitungan setiap kali menerima transisi sinyal (rising edge).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Ladder Circuit Widget */}
                <StartStopLadderWidget />
              </div>

              {/* 4.2 Timer dan Counter */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  4.2 Timer dan Counter
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Dua instruksi yang paling sering dipakai setelah kontak dan coil dasar adalah **timer** dan **counter** — keduanya krusial untuk proses yang melibatkan aspek waktu atau jumlah.
                </p>

                <div className="p-4 rounded-xl bg-bg-elevated border border-white/10 space-y-2">
                  <h4 className="font-mono font-bold text-text-primary">Timer On-Delay (TON)</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Timer On-Delay (TON) adalah jenis timer paling umum: begitu kondisi input terpenuhi, timer mulai menghitung mundur dari nol menuju nilai preset (misalnya 5 detik), dan output timer baru aktif setelah waktu preset tercapai. Kontak timer akan tetap TRUE sampai timer di-reset secara eksplisit.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-bg-elevated border border-white/10 space-y-2">
                  <h4 className="font-mono font-bold text-text-primary">Counter Up (CTU)</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Counter Up (CTU) menambah nilai akumulasi setiap kali menerima transisi sinyal dari OFF ke ON (*rising edge*). Ketika nilai akumulasi mencapai preset (misal 12 barang), output counter aktif untuk membuka pintu sortir atau menyalakan alarm batch.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* SECTION 5 */}
          <section id="sec-5" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <Badge variant="amber">Bagian 5</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  5. PLC sebagai Pilar Industri 4.0
                </h2>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  5.1 Dari Kontrol Lokal ke Sistem Terhubung
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Industri 4.0 ditandai oleh otomasi tingkat lanjut, sistem yang saling terhubung, dan pengambilan keputusan berbasis data. Salah satu contoh sentral adalah **sistem Machine Vision + PLC** untuk inspeksi kualitas real-time di lini manufaktur.
                </p>

                {/* SMART FACTORY Callout */}
                <div className="bg-blue-500/10 border-l-4 border-blue-400 p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-blue-300 font-mono font-bold text-sm">
                    <Server size={18} /> DEFINISI — Smart Factory
                  </div>
                  <p className="text-blue-100/90 text-sm leading-relaxed">
                    Fasilitas manufaktur otomatis yang menggunakan perangkat-perangkat terhubung untuk mengumpulkan, membagikan, dan menganalisis data secara digital dan real-time — data *actionable* ini lantas dipakai untuk mengambil keputusan terkait produksi, jadwal predictive maintenance, kontrol kualitas, dan optimasi proses.
                  </p>
                </div>
              </div>

              {/* 5.2 Hierarchy Pyramid */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-mono font-bold text-accent border-b border-white/10 pb-2">
                  5.2 PLC, SCADA, dan IIoT
                </h3>
                <p className="text-text-primary/90 leading-relaxed">
                  Dalam arsitektur otomasi modern, PLC jarang berdiri sendiri. Ia menjadi bagian dari hierarki yang lebih besar bersama SCADA dan IIoT:
                </p>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs font-mono uppercase bg-bg-elevated text-accent">
                      <tr>
                        <th className="px-6 py-3 border-b border-white/10">Lapisan</th>
                        <th className="px-6 py-3 border-b border-white/10">Peran Utama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-accent">PLC (Machine Level)</td>
                        <td className="px-6 py-3 text-text-muted">Eksekusi kontrol real-time di level mesin — deterministik, cepat, dan andal untuk logika langsung dengan aktuator/sensor.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-cyan-400">SCADA (Supervisory Level)</td>
                        <td className="px-6 py-3 text-text-muted">Supervisi dan visualisasi data dari banyak PLC/RTU sekaligus, memungkinkan operator memantau dari ruang kontrol terpusat.</td>
                      </tr>
                      <tr className="hover:bg-white/[0.02]">
                        <td className="px-6 py-3 font-mono font-bold text-emerald-400">IIoT / Cloud Level</td>
                        <td className="px-6 py-3 text-text-muted">Pengumpulan data skala besar, analitik lanjutan, machine learning, dan dashboard untuk pengambilan keputusan strategis lintas pabrik.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* CATATAN REALISTIS Callout */}
                <div className="bg-red-500/10 border-l-4 border-red-400 p-5 rounded-r-xl space-y-2">
                  <div className="flex items-center gap-2 text-red-300 font-mono font-bold text-sm">
                    <AlertTriangle size={18} /> CATATAN REALISTIS
                  </div>
                  <p className="text-red-100/90 text-sm leading-relaxed">
                    Meski PLC berperan vital dalam kontrol, sifatnya yang cenderung statis dalam prosedur dinamis kadang jadi tantangan — Industri 4.0 menuntut alur kerja yang lebih *context-aware* dan responsif terhadap informasi sensor secara adaptif, bukan sekadar menjalankan logika tetap. Ini alasan integrasi PLC dengan lapisan analitik/AI menjadi fokus riset modern.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* SECTION 6 */}
          <section id="sec-6" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <Badge variant="green">Bagian 6</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  6. Studi Kasus Aplikatif
                </h2>
              </div>

              {/* Case Study 1 */}
              <div className="p-5 rounded-xl bg-bg-elevated/40 border border-white/5 space-y-2">
                <h3 className="font-mono font-bold text-text-primary text-base">
                  Studi Kasus 1 — Inspeksi Kualitas Otomatis (Machine Vision + PLC)
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Kamera vision (Cognex / SICK) diintegrasikan dengan PLC (Allen-Bradley / Siemens) untuk sistem kontrol closed-loop. Saat kamera mendeteksi produk cacat, PLC secara deterministik menyinkronkan penyortiran fisik ke jalur reject dalam waktu hitungan milidetik.
                </p>
              </div>

              {/* Case Study 2 with Key Stats */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-bg-elevated to-bg-surface border border-amber-500/30 space-y-4">
                <h3 className="font-mono font-bold text-amber-300 text-lg">
                  Studi Kasus 2 — Smart Energy Management di Pabrik Otomotif
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Fasilitas manufaktur komponen otomotif menerapkan sistem terintegrasi PLC Siemens S7-1500 + SCADA WinCC selama 12 bulan. Data meter energi dianalisis dari 8.760 titik data per jam dengan algoritma optimasi Structured Text.
                </p>

                {/* Key Metrics Dashboard Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 text-center">
                    <p className="text-[10px] font-mono text-text-dim uppercase font-bold">Konsumsi Energi</p>
                    <p className="text-2xl font-mono font-black text-amber-400 mt-1">-28%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 text-center">
                    <p className="text-[10px] font-mono text-text-dim uppercase font-bold">Peak Demand</p>
                    <p className="text-2xl font-mono font-black text-amber-400 mt-1">-28%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/30 text-center">
                    <p className="text-[10px] font-mono text-text-dim uppercase font-bold">Jejak Karbon</p>
                    <p className="text-2xl font-mono font-black text-emerald-400 mt-1">-35.1%</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 text-center">
                    <p className="text-[10px] font-mono text-text-dim uppercase font-bold">Efisiensi Alat (OEE)</p>
                    <p className="text-2xl font-mono font-black text-cyan-400 mt-1">+24.1%</p>
                  </div>
                </div>
              </div>

              {/* Case Study 3 */}
              <div className="p-5 rounded-xl bg-bg-elevated/40 border border-white/5 space-y-2">
                <h3 className="font-mono font-bold text-text-primary text-base">
                  Studi Kasus 3 — Predictive Maintenance Berbasis Data Multi-Pabrik
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Manufaktur global melatih model machine learning dengan 5 tahun riwayat kegagalan mesin untuk 200+ aset produksi. Hasilnya: **penurunan downtime tak terjadwal sebesar 32%** dan menghemat **>200 jam produksi per tahun**.
                </p>
              </div>
            </Card>
          </section>

          {/* SECTION 7 */}
          <section id="sec-7" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="cyan">Bagian 7</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary">
                  7. Rangkuman dan Key Takeaways
                </h2>
              </div>

              <ul className="space-y-3">
                {[
                  'PLC adalah controller berbasis mikroprosesor yang membaca input, mengeksekusi logika program, dan mengendalikan output secara siklik (scan cycle) — dirancang untuk keandalan di lingkungan keras.',
                  'Komponen inti PLC meliputi power supply, CPU, memory, modul I/O, communication interface, dan programming device — dengan HMI sebagai pendamping visual.',
                  'Ladder Diagram tetap jadi bahasa pemrograman paling populer untuk pemula karena kemiripannya dengan logika relay tradisional.',
                  'PLC modern bukan sekadar pengganti relay — ia adalah jembatan real-time antara lantai produksi dan lapisan data/analitik Industri 4.0.',
                  'Integrasi PLC dengan SCADA dan IIoT memungkinkan pergeseran dari maintenance reaktif ke predictive maintenance serta efisiensi energi terukur.'
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-text-primary/90 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* LANGKAH SELANJUTNYA Callout */}
              <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl space-y-2">
                <h4 className="font-mono font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <TrendingUp size={16} /> LANGKAH SELANJUTNYA
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Bagi Anda yang ingin memperdalam, langkah alami berikutnya adalah mencoba software simulasi ladder logic online untuk mempraktikkan rangkaian start-stop, timer, dan counter sendiri — sebelum melangkah ke platform PLC nyata seperti Siemens TIA Portal atau Allen-Bradley RSLogix/Studio 5000.
                </p>
              </div>
            </Card>
          </section>

          {/* SECTION 8 */}
          <section id="sec-8" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="amber">Bagian 8</Badge>
                <h2 className="text-2xl font-mono font-bold text-text-primary flex items-center gap-2">
                  <FileText size={20} /> 8. Daftar Pustaka & Referensi
                </h2>
              </div>

              <div className="space-y-3 text-xs font-mono text-text-muted divide-y divide-white/5">
                {[
                  {
                    title: 'Blog Crouzet. (2026). Programmable Logic Controller (PLC): Definition and Basics.',
                    url: 'https://blog.crouzet.com/industry/programmable-logic-controller-definition-basics/'
                  },
                  {
                    title: 'Control.com. (2022). What Is a PLC? An Introduction to Programmable Logic Controllers.',
                    url: 'https://control.com/technical-articles/what-is-a-plc-an-introduction-to-programmable-logic-controllers/'
                  },
                  {
                    title: 'ControlSystemGuide. (2026). PLC Ladder Logic Tutorial: Symbols, Examples & How to Read.',
                    url: 'https://controlsystemguide.com/plc-ladder-logic-tutorial/'
                  },
                  {
                    title: 'NCBI/PMC. (2025). Integration of Machine Vision and PLC-Based Control for Scalable Quality Inspection in Industry 4.0.',
                    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12568163/'
                  },
                  {
                    title: 'ResearchGate. (2025). Convergence of IoT and PLC in Industrial Automation: A Systematic Review.',
                    url: 'https://www.researchgate.net/publication/390978482'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>{item.title}</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline flex items-center gap-1 shrink-0"
                    >
                      Buka Link <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
