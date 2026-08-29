import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '@/components/ui';
import {
  ArrowLeft,
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
  Server,
  Workflow
} from 'lucide-react';

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
// Interactive Component 2: Start-Stop Ladder Diagram Simulator (SVG Edition)
// ============================================================
const StartStopLadderWidget = () => {
  const [startPressed, setStartPressed] = useState(false);
  const [stopPressed, setStopPressed] = useState(false);
  const [motorOn, setMotorOn] = useState(false);

  // Electrical logic
  const isPowerFlowing = (startPressed || motorOn) && !stopPressed;

  useEffect(() => {
    if (isPowerFlowing) {
      setMotorOn(true);
    } else if (stopPressed) {
      setMotorOn(false);
    }
  }, [startPressed, stopPressed, isPowerFlowing]);

  // Wire segments status
  const wireStartHot = true; // left rail to start contact branch
  const wireTopStartOutHot = startPressed;
  const wireBottomLatchOutHot = motorOn;
  const wireAfterParallelHot = startPressed || motorOn;
  const wireAfterStopHot = wireAfterParallelHot && !stopPressed;
  const wireCoilHot = wireAfterStopHot;

  // Real-time Explanation text
  let statusExplanation = {
    title: 'Standby / Motor Berhenti',
    badge: 'OFF',
    badgeColor: 'bg-gray-800 text-gray-400 border-gray-700',
    desc: 'Daya dari rel kiri tertahan di kontak Start (I0.0) dan Kontak Latch (Q0.0) karena keduanya masih terbuka (FALSE). Tekan tombol START di bawah untuk menyalakan motor.'
  };

  if (stopPressed) {
    statusExplanation = {
      title: 'Tombol STOP Ditekan (Sirkuit Terputus)',
      badge: 'STOPPED',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      desc: 'Kontak NC Stop (I0.1) terbuka memutus seluruh aliran daya ke Koil Motor (Q0.0). Motor langsung berhenti dan kontak pengunci (latch) terlepas.'
    };
  } else if (startPressed) {
    statusExplanation = {
      title: 'Tombol START Ditekan (Pemicu Awal)',
      badge: 'START PULSE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      desc: 'Kontak Start (I0.0) menutup (TRUE). Arus daya mengalir melalui Start -> Stop (I0.1) -> mengaktifkan Koil Motor (Q0.0). Kontak sekunder Q0.0 di cabang bawah otomatis ikut menutup!'
    };
  } else if (motorOn) {
    statusExplanation = {
      title: 'Motor Berjalan via Self-Holding (Terkunci)',
      badge: 'LATCHED (ON)',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      desc: 'Tombol Start sudah dilepas (terbuka), TETAPI daya tetap mengalir lewat cabang bawah (Kontak Latch Q0.0). Inilah prinsip dasar Self-Holding (Seal-In Circuit) di industri!'
    };
  }

  return (
    <div className="my-8 p-6 rounded-2xl bg-[#0b0f19] border border-accent/20 shadow-2xl overflow-hidden">
      {/* Header & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles size={16} /> Skema Ladder Diagram Interaktif (IEC 61131-3)
          </div>
          <h4 className="text-lg font-mono font-bold text-text-primary mt-0.5">
            Rangkaian Start-Stop dengan Self-Holding (Seal-In)
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
          Reset Simulasi
        </Button>
      </div>

      {/* SVG Ladder Diagram Canvas */}
      <div className="w-full overflow-x-auto bg-[#070a11] rounded-xl border border-white/10 p-2 sm:p-4 my-4">
        <svg
          viewBox="0 0 760 210"
          className="w-full min-w-[680px] h-auto select-none"
          style={{ fontFamily: 'monospace' }}
        >
          {/* CSS Definition for Flow Animation */}
          <defs>
            <style>{`
              @keyframes powerFlow {
                from { stroke-dashoffset: 20; }
                to { stroke-dashoffset: 0; }
              }
              .power-flow-anim {
                stroke-dasharray: 6 4;
                animation: powerFlow 0.6s linear infinite;
              }
            `}</style>
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Power Rail (L+ 24V) */}
          <line x1="30" y1="20" x2="30" y2="190" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
          <text x="30" y="14" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">L+ (24V)</text>

          {/* Right Power Rail (M 0V) */}
          <line x1="730" y1="20" x2="730" y2="190" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
          <text x="730" y="14" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">M (0V)</text>

          {/* Rung Number Label */}
          <text x="42" y="55" fill="#64748b" fontSize="10">Rung 0001</text>

          {/* --- MAIN LINE WIRES --- */}
          {/* Wire 1: Left Rail to Branch 1 */}
          <line
            x1="30" y1="65" x2="100" y2="65"
            stroke={wireStartHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireStartHot ? 'power-flow-anim' : ''}
          />
          {/* Node Point 1 */}
          <circle cx="100" cy="65" r="4" fill={wireStartHot ? '#10b981' : '#334155'} />

          {/* Top Branch to Start Contact */}
          <line
            x1="100" y1="65" x2="160" y2="65"
            stroke={wireStartHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireStartHot ? 'power-flow-anim' : ''}
          />

          {/* --- CONTACT 1: START (NO) --- */}
          <g transform="translate(160, 65)">
            {/* Terminal Left */}
            <line x1="0" y1="0" x2="18" y2="0" stroke={wireStartHot ? '#10b981' : '#334155'} strokeWidth="3" />
            <line x1="18" y1="-20" x2="18" y2="20" stroke={startPressed ? '#10b981' : '#94a3b8'} strokeWidth="3.5" />

            {/* Bridge when pressed */}
            {startPressed && (
              <line x1="18" y1="0" x2="42" y2="0" stroke="#10b981" strokeWidth="4" filter="url(#glow-green)" />
            )}

            {/* Terminal Right */}
            <line x1="42" y1="-20" x2="42" y2="20" stroke={startPressed ? '#10b981' : '#94a3b8'} strokeWidth="3.5" />
            <line x1="42" y1="0" x2="60" y2="0" stroke={wireTopStartOutHot ? '#10b981' : '#334155'} strokeWidth="3" className={wireTopStartOutHot ? 'power-flow-anim' : ''} />

            {/* Labels */}
            <text x="30" y="-26" fill={startPressed ? '#10b981' : '#e2e8f0'} fontSize="11" fontWeight="bold" textAnchor="middle">
              START_BTN
            </text>
            <text x="30" y="34" fill={startPressed ? '#10b981' : '#94a3b8'} fontSize="10" textAnchor="middle">
              I0.0 (NO)
            </text>
            <rect
              x="10" y="40" width="40" height="15" rx="3"
              fill={startPressed ? '#065f46' : '#1e293b'}
              stroke={startPressed ? '#10b981' : '#475569'}
              strokeWidth="1"
            />
            <text x="30" y="51" fill={startPressed ? '#34d399' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {startPressed ? 'TRUE' : 'FALSE'}
            </text>
          </g>

          {/* Wire from Start to Node 2 */}
          <line
            x1="220" y1="65" x2="280" y2="65"
            stroke={wireTopStartOutHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireTopStartOutHot ? 'power-flow-anim' : ''}
          />

          {/* --- PARALLEL BOTTOM BRANCH (MOTOR_M1 SELF-HOLD) --- */}
          {/* Drop line */}
          <line
            x1="100" y1="65" x2="100" y2="145"
            stroke={wireStartHot ? '#10b981' : '#334155'}
            strokeWidth="3"
          />
          <line
            x1="100" y1="145" x2="160" y2="145"
            stroke={wireStartHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireStartHot ? 'power-flow-anim' : ''}
          />

          {/* CONTACT 2: MOTOR_M1 LATCH (NO) */}
          <g transform="translate(160, 145)">
            {/* Terminal Left */}
            <line x1="0" y1="0" x2="18" y2="0" stroke={wireStartHot ? '#10b981' : '#334155'} strokeWidth="3" />
            <line x1="18" y1="-18" x2="18" y2="18" stroke={motorOn ? '#06b6d4' : '#94a3b8'} strokeWidth="3.5" />

            {/* Bridge when latched */}
            {motorOn && (
              <line x1="18" y1="0" x2="42" y2="0" stroke="#06b6d4" strokeWidth="4" filter="url(#glow-cyan)" />
            )}

            {/* Terminal Right */}
            <line x1="42" y1="-18" x2="42" y2="18" stroke={motorOn ? '#06b6d4' : '#94a3b8'} strokeWidth="3.5" />
            <line x1="42" y1="0" x2="60" y2="0" stroke={wireBottomLatchOutHot ? '#06b6d4' : '#334155'} strokeWidth="3" className={wireBottomLatchOutHot ? 'power-flow-anim' : ''} />

            {/* Labels */}
            <text x="30" y="-24" fill={motorOn ? '#06b6d4' : '#e2e8f0'} fontSize="11" fontWeight="bold" textAnchor="middle">
              MOTOR_M1
            </text>
            <text x="30" y="32" fill={motorOn ? '#06b6d4' : '#94a3b8'} fontSize="10" textAnchor="middle">
              Q0.0 (Latch)
            </text>
            <rect
              x="10" y="37" width="40" height="15" rx="3"
              fill={motorOn ? '#164e63' : '#1e293b'}
              stroke={motorOn ? '#06b6d4' : '#475569'}
              strokeWidth="1"
            />
            <text x="30" y="48" fill={motorOn ? '#67e8f9' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {motorOn ? 'TRUE' : 'FALSE'}
            </text>
          </g>

          {/* Recombine bottom branch to Node 2 */}
          <line
            x1="220" y1="145" x2="280" y2="145"
            stroke={wireBottomLatchOutHot ? '#06b6d4' : '#334155'}
            strokeWidth="3"
            className={wireBottomLatchOutHot ? 'power-flow-anim' : ''}
          />
          <line
            x1="280" y1="145" x2="280" y2="65"
            stroke={wireBottomLatchOutHot ? '#06b6d4' : '#334155'}
            strokeWidth="3"
          />
          {/* Node Point 2 */}
          <circle cx="280" cy="65" r="4" fill={wireAfterParallelHot ? '#10b981' : '#334155'} />

          {/* Wire from Node 2 to STOP Contact */}
          <line
            x1="280" y1="65" x2="360" y2="65"
            stroke={wireAfterParallelHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireAfterParallelHot ? 'power-flow-anim' : ''}
          />

          {/* --- CONTACT 3: STOP (NC) --- */}
          <g transform="translate(360, 65)">
            {/* Terminal Left */}
            <line x1="0" y1="0" x2="18" y2="0" stroke={wireAfterParallelHot ? '#10b981' : '#334155'} strokeWidth="3" />
            <line x1="18" y1="-20" x2="18" y2="20" stroke={stopPressed ? '#ef4444' : '#94a3b8'} strokeWidth="3.5" />

            {/* Diagonal Slash for Normally Closed Contact */}
            <line
              x1="12"
              y1="22"
              x2="48"
              y2="-22"
              stroke={stopPressed ? '#ef4444' : wireAfterParallelHot ? '#10b981' : '#94a3b8'}
              strokeWidth="3"
              transform={stopPressed ? 'rotate(-25 30 0)' : ''}
              className={stopPressed ? 'transition-all duration-200' : ''}
            />

            {/* Terminal Right */}
            <line x1="42" y1="-20" x2="42" y2="20" stroke={stopPressed ? '#ef4444' : '#94a3b8'} strokeWidth="3.5" />
            <line x1="42" y1="0" x2="60" y2="0" stroke={wireAfterStopHot ? '#10b981' : '#334155'} strokeWidth="3" className={wireAfterStopHot ? 'power-flow-anim' : ''} />

            {/* Labels */}
            <text x="30" y="-26" fill={stopPressed ? '#ef4444' : '#e2e8f0'} fontSize="11" fontWeight="bold" textAnchor="middle">
              STOP_BTN
            </text>
            <text x="30" y="34" fill={stopPressed ? '#ef4444' : '#94a3b8'} fontSize="10" textAnchor="middle">
              I0.1 (NC)
            </text>
            <rect
              x="5" y="40" width="50" height="15" rx="3"
              fill={stopPressed ? '#7f1d1d' : '#065f46'}
              stroke={stopPressed ? '#ef4444' : '#10b981'}
              strokeWidth="1"
            />
            <text x="30" y="51" fill={stopPressed ? '#fca5a5' : '#6ee7b7'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {stopPressed ? 'OPEN (0)' : 'CLOSED (1)'}
            </text>
          </g>

          {/* Wire from Stop to Coil */}
          <line
            x1="420" y1="65" x2="540" y2="65"
            stroke={wireAfterStopHot ? '#10b981' : '#334155'}
            strokeWidth="3"
            className={wireAfterStopHot ? 'power-flow-anim' : ''}
          />

          {/* --- COIL OUTPUT: MOTOR_M1 (Q0.0) --- */}
          <g transform="translate(540, 65)">
            {/* Lead wire */}
            <line x1="0" y1="0" x2="20" y2="0" stroke={wireCoilHot ? '#10b981' : '#334155'} strokeWidth="3" />

            {/* Coil Arcs */}
            <path
              d="M 22 -22 A 25 25 0 0 0 22 22"
              fill="none"
              stroke={motorOn ? '#10b981' : '#94a3b8'}
              strokeWidth="3.5"
            />
            <path
              d="M 58 -22 A 25 25 0 0 1 58 22"
              fill="none"
              stroke={motorOn ? '#10b981' : '#94a3b8'}
              strokeWidth="3.5"
            />

            {/* Center energized bulb / glow */}
            <circle
              cx="40" cy="0" r="14"
              fill={motorOn ? '#10b981' : '#1e293b'}
              stroke={motorOn ? '#34d399' : '#475569'}
              strokeWidth="1.5"
              filter={motorOn ? 'url(#glow-green)' : ''}
            />
            <text x="40" y="4" fill={motorOn ? '#022c22' : '#94a3b8'} fontSize="10" fontWeight="bold" textAnchor="middle">
              M1
            </text>

            {/* Lead out to right rail */}
            <line x1="60" y1="0" x2="190" y2="0" stroke={wireCoilHot ? '#10b981' : '#334155'} strokeWidth="3" />

            {/* Labels */}
            <text x="40" y="-26" fill={motorOn ? '#10b981' : '#e2e8f0'} fontSize="11" fontWeight="bold" textAnchor="middle">
              MOTOR_M1
            </text>
            <text x="40" y="34" fill={motorOn ? '#10b981' : '#94a3b8'} fontSize="10" textAnchor="middle">
              Q0.0 (Coil)
            </text>
            <rect
              x="12" y="40" width="56" height="15" rx="3"
              fill={motorOn ? '#065f46' : '#1e293b'}
              stroke={motorOn ? '#10b981' : '#475569'}
              strokeWidth="1"
            />
            <text x="40" y="51" fill={motorOn ? '#a7f3d0' : '#94a3b8'} fontSize="9" fontWeight="bold" textAnchor="middle">
              {motorOn ? 'ACTIVE (1)' : 'OFF (0)'}
            </text>
          </g>
        </svg>
      </div>

      {/* Control Push Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        <button
          onMouseDown={() => setStartPressed(true)}
          onMouseUp={() => setStartPressed(false)}
          onTouchStart={() => setStartPressed(true)}
          onTouchEnd={() => setStartPressed(false)}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl font-mono text-sm font-bold transition-all shadow-lg select-none cursor-pointer border ${
            startPressed
              ? 'bg-emerald-500 text-black border-emerald-300 shadow-emerald-500/50 scale-[0.98]'
              : 'bg-gradient-to-r from-emerald-950/80 to-emerald-900/60 text-emerald-300 border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/80'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full ${startPressed ? 'bg-black animate-ping' : 'bg-emerald-400'}`} />
          <span>{startPressed ? '▶ [HOLDING] START AKTIF (I0.0 = 1)' : '▶ TEKAN TOMBOL START (NO)'}</span>
        </button>

        <button
          onMouseDown={() => setStopPressed(true)}
          onMouseUp={() => setStopPressed(false)}
          onTouchStart={() => setStopPressed(true)}
          onTouchEnd={() => setStopPressed(false)}
          className={`flex items-center justify-center gap-3 p-4 rounded-xl font-mono text-sm font-bold transition-all shadow-lg select-none cursor-pointer border ${
            stopPressed
              ? 'bg-red-500 text-white border-red-300 shadow-red-500/50 scale-[0.98]'
              : 'bg-gradient-to-r from-red-950/80 to-red-900/60 text-red-300 border-red-500/40 hover:border-red-400 hover:bg-red-900/80'
          }`}
        >
          <div className={`w-3.5 h-3.5 rounded-full ${stopPressed ? 'bg-white animate-ping' : 'bg-red-400'}`} />
          <span>{stopPressed ? '⏹ [HOLDING] STOP MEMUTUS (I0.1 = 0)' : '⏹ TEKAN TOMBOL STOP (NC)'}</span>
        </button>
      </div>

      {/* Real-time Electrical Explanation Card */}
      <div className="p-4 rounded-xl bg-bg-surface border border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-text-dim font-bold">Penjelasan Alur Daya:</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusExplanation.badgeColor}`}>
              {statusExplanation.badge}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-dim">Motor Fisik:</span>
            <span className={`text-xs font-mono font-bold flex items-center gap-1 ${motorOn ? 'text-emerald-400 animate-pulse' : 'text-text-muted'}`}>
              <Activity size={14} className={motorOn ? 'animate-spin' : ''} />
              {motorOn ? 'RUNNING (1500 RPM)' : 'STOPPED (0 RPM)'}
            </span>
          </div>
        </div>

        <h5 className="font-mono font-bold text-sm text-text-primary">
          {statusExplanation.title}
        </h5>
        <p className="text-xs text-text-muted leading-relaxed">
          {statusExplanation.desc}
        </p>
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
            <Badge variant="accent">Modul Webinar Eksklusif</Badge>
            <Badge variant="warning">Industri 4.0</Badge>
            <Badge variant="success">Dasar PLC</Badge>
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
                <Badge variant="accent">Bagian 1</Badge>
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
                <Badge variant="warning">Bagian 2</Badge>
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
                <Badge variant="success">Bagian 3</Badge>
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
                <Badge variant="accent">Bagian 4</Badge>
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
                <Badge variant="warning">Bagian 5</Badge>
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
                <Badge variant="success">Bagian 6</Badge>
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
                  Manufaktur global melatih model machine learning dengan 5 tahun riwayat kegagalan mesin untuk 200+ aset produksi. Hasilnya: **penurunan downtime tak terjadwal sebesar 32%** dan menghemat **lebih dari 200 jam produksi per tahun**.
                </p>
              </div>
            </Card>
          </section>

          {/* SECTION 7 */}
          <section id="sec-7" className="scroll-mt-24">
            <Card className="p-8 lg:p-10 border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <Badge variant="accent">Bagian 7</Badge>
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
                <Badge variant="warning">Bagian 8</Badge>
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
                    title: 'Distrelec KnowHow Hub. (2024). The Role of PLCs in Industrial IoT.',
                    url: 'https://knowhow.distrelec.com/automation/the-role-of-plcs-in-industrial-iot/'
                  },
                  {
                    title: 'Electrical4U. Programmable Logic Controllers (PLCs): Basics, Types & Applications.',
                    url: 'https://www.electrical4u.com/programmable-logic-controllers/'
                  },
                  {
                    title: 'HTE Technologies (A Tavoron Company). (2026). The Role of Modern PLCs in Smart Factory Integration.',
                    url: 'https://htetechnologies.com/news/the-role-of-modern-plcs-in-smart-factory-integration/'
                  },
                  {
                    title: 'Industrial Monitor Direct. (2026). Designing a Basic Conveyor System with PLC Ladder Logic: A Tutorial for Mitsubishi FX Series.',
                    url: 'https://industrialmonitordirect.com/blogs/knowledgebase/designing-a-basic-conveyor-system-with-plc-ladder-logic-a-tutorial-for-mitsubishi-fx-series'
                  },
                  {
                    title: 'Mutually Human. (2025). Predictive Maintenance with Microsoft Fabric: A Manufacturing Case Study.',
                    url: 'https://www.mutuallyhuman.com/predictive-maintenance-with-microsoft-fabric-a-manufacturing-case-study/'
                  },
                  {
                    title: 'NCBI/PMC. (2025). Integration of Machine Vision and PLC-Based Control for Scalable Quality Inspection in Industry 4.0.',
                    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12568163/'
                  },
                  {
                    title: 'PLC Blog. (2025). PLC (Programmable Logic Controller) – Basics, Types, and Applications.',
                    url: 'https://plcblog.in/plc/basic/plc-programmable-logic-controller-basics.php'
                  },
                  {
                    title: 'ResearchGate. (2025). Convergence of IoT and PLC in Industrial Automation: A Systematic Review of Emerging Trends, Technical Challenges, and Prospects.'
                  },
                  {
                    title: 'ResearchGate. (2025). Smart Energy Management in Manufacturing Plants Using PLC and SCADA.'
                  },
                  {
                    title: 'ScienceDirect Topics. Programmable Logic Controller — an overview.',
                    url: 'https://www.sciencedirect.com/topics/computer-science/programmable-logic-controller'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-text-dim shrink-0">{idx + 1}.</span>
                      <span className="text-text-primary/90 leading-relaxed">{item.title}</span>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-1 shrink-0 ml-5 sm:ml-0"
                      >
                        Buka Link <ExternalLink size={12} />
                      </a>
                    )}
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
