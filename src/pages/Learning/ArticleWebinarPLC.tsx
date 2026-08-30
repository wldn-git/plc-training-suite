import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  Activity,
  ExternalLink,
  RotateCcw,
  ChevronRight,
  Workflow,
  Printer,
  Copy,
  Check,
  Folder,
  Layers,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

// ============================================================
// Windows 10 Theme Tokens
// ============================================================
// Accent: #0078d4 (Windows 10 Blue)
// Dark BG: #1f1f1f
// Window Titlebar: #2b2b2b
// Surface: #252526
// Border: #3f3f46
// Text: #f3f3f3

// ============================================================
// Interactive Component 1: Windows 10 Scan Cycle Diagnostics
// ============================================================
const ScanCycleWidgetWin10 = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const steps = [
    {
      id: '01',
      title: '1. Read Inputs (Baca Status Sensor)',
      tag: 'INPUT_IMAGE_SCAN',
      desc: 'PLC membaca status semua sinyal listrik di terminal input fisik (push button, proximity, limit switch) dan menyimpannya ke memori Input Image Table (I0.0 - I1.7).',
      status: 'INPUT_READY',
      accent: '#0078d4'
    },
    {
      id: '02',
      title: '2. Execute Program (Eksekusi Logika)',
      tag: 'LADDER_LOGIC_EXEC',
      desc: 'CPU mengeksekusi instruksi Ladder Diagram baris demi baris (dari Rung 0001 ke bawah) menggunakan data snapshot yang telah dibaca dari Input Image.',
      status: 'CPU_ACTIVE',
      accent: '#ffb900'
    },
    {
      id: '03',
      title: '3. Write Outputs (Perbarui Aktuator)',
      tag: 'OUTPUT_IMAGE_UPDATE',
      desc: 'Hasil akhir logika ditulis ke Output Image Table, lalu disalurkan secara serentak ke modul output fisik (kontaktor motor, selenoid valve, lampu indikator).',
      status: 'OUTPUT_UPDATED',
      accent: '#107c41'
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
    <div className="my-6 border border-[#3f3f46] bg-[#252526] rounded-none shadow-md font-sans">
      {/* Mini Window Titlebar */}
      <div className="bg-[#2d2d2d] px-3 py-1.5 border-b border-[#3f3f46] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#0078d4]" />
          <span className="text-xs font-semibold text-[#cccccc]">Diagnostic Tool — PLC Scan Cycle Monitor</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono text-[#858585]">
          <span>Scan Time: 5.2 ms</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1e1e1e] p-3 border border-[#333333]">
          <div>
            <p className="text-xs font-bold text-[#ffffff]">Siklus Kerja Berulang (Cyclic Execution)</p>
            <p className="text-[11px] text-[#9d9d9d] mt-0.5">
              PLC tidak mengeksekusi program sekali jalan, melainkan mengulang 3 tahap ini terus-menerus dalam hitungan milidetik.
            </p>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 text-xs font-medium border transition-colors shrink-0 ${
              isPlaying
                ? 'bg-[#0078d4] text-white border-[#005a9e]'
                : 'bg-[#333333] hover:bg-[#3e3e42] text-white border-[#474747]'
            }`}
          >
            {isPlaying ? '⏸ Jeda Siklus' : '▶ Jalankan Otomatis'}
          </button>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveStep(idx);
                  setIsPlaying(false);
                }}
                className={`cursor-pointer p-3 border transition-all ${
                  isActive
                    ? 'bg-[#1f2430] border-[#0078d4] shadow-sm ring-1 ring-[#0078d4]'
                    : 'bg-[#1e1e1e] border-[#333333] hover:border-[#4d4d4d]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 font-bold text-white"
                    style={{ backgroundColor: step.accent }}
                  >
                    STEP {step.id}
                  </span>
                  <span className="text-[10px] font-mono text-[#858585]">
                    {isActive ? '● RUNNING' : '○ IDLE'}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1.5">{step.title}</h5>
                <p className="text-[11px] text-[#cccccc] leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Status Bar */}
        <div className="bg-[#1e1e1e] px-3 py-2 border border-[#333333] flex items-center justify-between text-[11px] text-[#9d9d9d] font-mono">
          <span>Status Sistem: NORMAL (Cyclic Mode)</span>
          <span className="text-[#0078d4] font-semibold">Tahap Terpilih: Step 0{activeStep + 1}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Interactive Component 2: Windows 10 Ladder Simulator (TIA Portal Look)
// ============================================================
const StartStopLadderWin10 = () => {
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

  const wireStartHot = true;
  const wireTopStartOutHot = startPressed;
  const wireBottomLatchOutHot = motorOn;
  const wireAfterParallelHot = startPressed || motorOn;
  const wireAfterStopHot = wireAfterParallelHot && !stopPressed;
  const wireCoilHot = wireAfterStopHot;

  return (
    <div className="my-6 border border-[#3f3f46] bg-[#252526] shadow-md font-sans">
      {/* Window Titlebar */}
      <div className="bg-[#2d2d2d] px-3 py-1.5 border-b border-[#3f3f46] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow size={14} className="text-[#0078d4]" />
          <span className="text-xs font-semibold text-[#cccccc]">Ladder Logic Editor — [Main_OB1 : Rung 0001]</span>
        </div>
        <button
          onClick={() => {
            setStartPressed(false);
            setStopPressed(false);
            setMotorOn(false);
          }}
          className="flex items-center gap-1 px-2 py-0.5 text-[11px] bg-[#333333] hover:bg-[#3e3e42] text-[#cccccc] border border-[#474747]"
        >
          <RotateCcw size={10} /> Reset Rangkaian
        </button>
      </div>

      {/* Editor Canvas */}
      <div className="p-4 space-y-4">
        <div className="bg-[#1e1e1e] p-3 border border-[#333333] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white">Rangkaian Kontrol Motor Start-Stop (Self-Holding Latch)</span>
            <p className="text-[11px] text-[#9d9d9d] mt-0.5">
              Gunakan tombol di bawah untuk menyimulasikan push-button fisik di panel kontrol.
            </p>
          </div>
          <div className="text-right font-mono text-[11px]">
            <span className="text-[#858585]">Motor Status: </span>
            <span className={`font-bold ${motorOn ? 'text-[#107c41]' : 'text-[#d13438]'}`}>
              {motorOn ? 'RUNNING (Q0.0 = 1)' : 'STOPPED (Q0.0 = 0)'}
            </span>
          </div>
        </div>

        {/* SVG Ladder Schematic */}
        <div className="w-full overflow-x-auto bg-[#181818] border border-[#333333] p-4">
          <svg
            viewBox="0 0 760 210"
            className="w-full min-w-[680px] h-auto select-none"
            style={{ fontFamily: 'Segoe UI, monospace' }}
          >
            <defs>
              <style>{`
                @keyframes powerFlowWin {
                  from { stroke-dashoffset: 20; }
                  to { stroke-dashoffset: 0; }
                }
                .power-flow-win {
                  stroke-dasharray: 6 4;
                  animation: powerFlowWin 0.6s linear infinite;
                }
              `}</style>
            </defs>

            {/* Left Power Rail (L+ 24V) */}
            <line x1="30" y1="20" x2="30" y2="190" stroke="#0078d4" strokeWidth="6" />
            <text x="30" y="14" fill="#0078d4" fontSize="11" fontWeight="bold" textAnchor="middle">L+ (24V)</text>

            {/* Right Power Rail (M 0V) */}
            <line x1="730" y1="20" x2="730" y2="190" stroke="#767676" strokeWidth="6" />
            <text x="730" y="14" fill="#9d9d9d" fontSize="11" fontWeight="bold" textAnchor="middle">M (0V)</text>

            <text x="42" y="55" fill="#767676" fontSize="10" fontWeight="bold">Network 1: Motor Control</text>

            {/* Wire 1: Left Rail to Branch 1 */}
            <line
              x1="30" y1="65" x2="100" y2="65"
              stroke={wireStartHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireStartHot ? 'power-flow-win' : ''}
            />
            <circle cx="100" cy="65" r="4" fill={wireStartHot ? '#107c41' : '#4d4d4d'} />

            {/* Top Branch to Start Contact */}
            <line
              x1="100" y1="65" x2="160" y2="65"
              stroke={wireStartHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireStartHot ? 'power-flow-win' : ''}
            />

            {/* CONTACT 1: START (NO) */}
            <g transform="translate(160, 65)">
              <line x1="0" y1="0" x2="18" y2="0" stroke={wireStartHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" />
              <line x1="18" y1="-20" x2="18" y2="20" stroke={startPressed ? '#107c41' : '#cccccc'} strokeWidth="3.5" />

              {startPressed && (
                <line x1="18" y1="0" x2="42" y2="0" stroke="#107c41" strokeWidth="4" />
              )}

              <line x1="42" y1="-20" x2="42" y2="20" stroke={startPressed ? '#107c41' : '#cccccc'} strokeWidth="3.5" />
              <line x1="42" y1="0" x2="60" y2="0" stroke={wireTopStartOutHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" className={wireTopStartOutHot ? 'power-flow-win' : ''} />

              <text x="30" y="-26" fill={startPressed ? '#107c41' : '#ffffff'} fontSize="11" fontWeight="bold" textAnchor="middle">
                "Start_Btn"
              </text>
              <text x="30" y="34" fill={startPressed ? '#107c41' : '#9d9d9d'} fontSize="10" textAnchor="middle">
                %I0.0 (NO)
              </text>
              <rect
                x="10" y="40" width="40" height="15"
                fill={startPressed ? '#107c41' : '#2d2d2d'}
                stroke={startPressed ? '#107c41' : '#4d4d4d'}
                strokeWidth="1"
              />
              <text x="30" y="51" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {startPressed ? 'TRUE' : 'FALSE'}
              </text>
            </g>

            {/* Wire from Start to Node 2 */}
            <line
              x1="220" y1="65" x2="280" y2="65"
              stroke={wireTopStartOutHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireTopStartOutHot ? 'power-flow-win' : ''}
            />

            {/* PARALLEL BOTTOM BRANCH (MOTOR LATCH) */}
            <line
              x1="100" y1="65" x2="100" y2="145"
              stroke={wireStartHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
            />
            <line
              x1="100" y1="145" x2="160" y2="145"
              stroke={wireStartHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireStartHot ? 'power-flow-win' : ''}
            />

            {/* CONTACT 2: MOTOR LATCH (NO) */}
            <g transform="translate(160, 145)">
              <line x1="0" y1="0" x2="18" y2="0" stroke={wireStartHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" />
              <line x1="18" y1="-18" x2="18" y2="18" stroke={motorOn ? '#0078d4' : '#cccccc'} strokeWidth="3.5" />

              {motorOn && (
                <line x1="18" y1="0" x2="42" y2="0" stroke="#0078d4" strokeWidth="4" />
              )}

              <line x1="42" y1="-18" x2="42" y2="18" stroke={motorOn ? '#0078d4' : '#cccccc'} strokeWidth="3.5" />
              <line x1="42" y1="0" x2="60" y2="0" stroke={wireBottomLatchOutHot ? '#0078d4' : '#4d4d4d'} strokeWidth="3" className={wireBottomLatchOutHot ? 'power-flow-win' : ''} />

              <text x="30" y="-24" fill={motorOn ? '#0078d4' : '#ffffff'} fontSize="11" fontWeight="bold" textAnchor="middle">
                "Motor_M1"
              </text>
              <text x="30" y="32" fill={motorOn ? '#0078d4' : '#9d9d9d'} fontSize="10" textAnchor="middle">
                %Q0.0 (Latch)
              </text>
              <rect
                x="10" y="37" width="40" height="15"
                fill={motorOn ? '#0078d4' : '#2d2d2d'}
                stroke={motorOn ? '#0078d4' : '#4d4d4d'}
                strokeWidth="1"
              />
              <text x="30" y="48" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {motorOn ? 'TRUE' : 'FALSE'}
              </text>
            </g>

            {/* Recombine bottom branch */}
            <line
              x1="220" y1="145" x2="280" y2="145"
              stroke={wireBottomLatchOutHot ? '#0078d4' : '#4d4d4d'}
              strokeWidth="3"
              className={wireBottomLatchOutHot ? 'power-flow-win' : ''}
            />
            <line
              x1="280" y1="145" x2="280" y2="65"
              stroke={wireBottomLatchOutHot ? '#0078d4' : '#4d4d4d'}
              strokeWidth="3"
            />
            <circle cx="280" cy="65" r="4" fill={wireAfterParallelHot ? '#107c41' : '#4d4d4d'} />

            {/* Wire to Stop Contact */}
            <line
              x1="280" y1="65" x2="360" y2="65"
              stroke={wireAfterParallelHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireAfterParallelHot ? 'power-flow-win' : ''}
            />

            {/* CONTACT 3: STOP (NC) */}
            <g transform="translate(360, 65)">
              <line x1="0" y1="0" x2="18" y2="0" stroke={wireAfterParallelHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" />
              <line x1="18" y1="-20" x2="18" y2="20" stroke={stopPressed ? '#d13438' : '#cccccc'} strokeWidth="3.5" />

              <line
                x1="12" y1="22" x2="48" y2="-22"
                stroke={stopPressed ? '#d13438' : wireAfterParallelHot ? '#107c41' : '#cccccc'}
                strokeWidth="3"
                transform={stopPressed ? 'rotate(-25 30 0)' : ''}
              />

              <line x1="42" y1="-20" x2="42" y2="20" stroke={stopPressed ? '#d13438' : '#cccccc'} strokeWidth="3.5" />
              <line x1="42" y1="0" x2="60" y2="0" stroke={wireAfterStopHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" className={wireAfterStopHot ? 'power-flow-win' : ''} />

              <text x="30" y="-26" fill={stopPressed ? '#d13438' : '#ffffff'} fontSize="11" fontWeight="bold" textAnchor="middle">
                "Stop_Btn"
              </text>
              <text x="30" y="34" fill={stopPressed ? '#d13438' : '#9d9d9d'} fontSize="10" textAnchor="middle">
                %I0.1 (NC)
              </text>
              <rect
                x="5" y="40" width="50" height="15"
                fill={stopPressed ? '#d13438' : '#107c41'}
                stroke={stopPressed ? '#d13438' : '#107c41'}
                strokeWidth="1"
              />
              <text x="30" y="51" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {stopPressed ? 'OPEN (0)' : 'CLOSED (1)'}
              </text>
            </g>

            {/* Wire from Stop to Coil */}
            <line
              x1="420" y1="65" x2="540" y2="65"
              stroke={wireAfterStopHot ? '#107c41' : '#4d4d4d'}
              strokeWidth="3"
              className={wireAfterStopHot ? 'power-flow-win' : ''}
            />

            {/* COIL OUTPUT: MOTOR (Q0.0) */}
            <g transform="translate(540, 65)">
              <line x1="0" y1="0" x2="20" y2="0" stroke={wireCoilHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" />

              <path
                d="M 22 -22 A 25 25 0 0 0 22 22"
                fill="none"
                stroke={motorOn ? '#107c41' : '#cccccc'}
                strokeWidth="3.5"
              />
              <path
                d="M 58 -22 A 25 25 0 0 1 58 22"
                fill="none"
                stroke={motorOn ? '#107c41' : '#cccccc'}
                strokeWidth="3.5"
              />

              <circle
                cx="40" cy="0" r="13"
                fill={motorOn ? '#107c41' : '#2d2d2d'}
                stroke={motorOn ? '#107c41' : '#4d4d4d'}
                strokeWidth="1.5"
              />
              <text x="40" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                M1
              </text>

              <line x1="60" y1="0" x2="190" y2="0" stroke={wireCoilHot ? '#107c41' : '#4d4d4d'} strokeWidth="3" />

              <text x="40" y="-26" fill={motorOn ? '#107c41' : '#ffffff'} fontSize="11" fontWeight="bold" textAnchor="middle">
                "Motor_M1"
              </text>
              <text x="40" y="34" fill={motorOn ? '#107c41' : '#9d9d9d'} fontSize="10" textAnchor="middle">
                %Q0.0 (Coil)
              </text>
              <rect
                x="12" y="40" width="56" height="15"
                fill={motorOn ? '#107c41' : '#2d2d2d'}
                stroke={motorOn ? '#107c41' : '#4d4d4d'}
                strokeWidth="1"
              />
              <text x="40" y="51" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                {motorOn ? 'ACTIVE (1)' : 'OFF (0)'}
              </text>
            </g>
          </svg>
        </div>

        {/* Windows 10 Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onMouseDown={() => setStartPressed(true)}
            onMouseUp={() => setStartPressed(false)}
            onTouchStart={() => setStartPressed(true)}
            onTouchEnd={() => setStartPressed(false)}
            className={`p-3 text-xs font-semibold border flex items-center justify-center gap-2 select-none transition-colors ${
              startPressed
                ? 'bg-[#107c41] text-white border-[#0e6b37]'
                : 'bg-[#1b4332] hover:bg-[#2d6a4f] text-[#95d5b2] border-[#2d6a4f]'
            }`}
          >
            <span>{startPressed ? '● [HOLDING] START AKTIF (I0.0 = 1)' : '▶ TEKAN TOMBOL START (NO)'}</span>
          </button>

          <button
            onMouseDown={() => setStopPressed(true)}
            onMouseUp={() => setStopPressed(false)}
            onTouchStart={() => setStopPressed(true)}
            onTouchEnd={() => setStopPressed(false)}
            className={`p-3 text-xs font-semibold border flex items-center justify-center gap-2 select-none transition-colors ${
              stopPressed
                ? 'bg-[#d13438] text-white border-[#a80000]'
                : 'bg-[#4a151b] hover:bg-[#721c24] text-[#f8d7da] border-[#721c24]'
            }`}
          >
            <span>{stopPressed ? '■ [HOLDING] STOP MEMUTUS (I0.1 = 0)' : '⏹ TEKAN TOMBOL STOP (NC)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Main Windows 10 Article Window Component
// ============================================================
export default function ArticleWebinarPLC() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const sections = [
    { id: 'sec-1', label: '1. Pengantar Relevansi PLC' },
    { id: 'sec-2', label: '2. Tujuan Pembelajaran' },
    { id: 'sec-3', label: '3. Dasar-Dasar PLC' },
    { id: 'sec-4', label: '4. Logika Dasar Ladder Diagram' },
    { id: 'sec-5', label: '5. PLC sebagai Pilar Industri 4.0' },
    { id: 'sec-6', label: '6. Tiga Studi Kasus Industri' },
    { id: 'sec-7', label: '7. Rangkuman & Key Takeaways' },
    { id: 'sec-8', label: '8. Daftar Pustaka Lengkap' }
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
    <div className="max-w-7xl mx-auto pb-16 font-sans text-[#f3f3f3]">
      {/* Windows 10 Desktop Application Window Frame */}
      <div className="border border-[#454545] bg-[#1e1e1e] shadow-2xl overflow-hidden lg:h-[calc(100vh-5.5rem)] flex flex-col">
        {/* ============================================================ */}
        {/* 1. Windows 10 Title Bar */}
        {/* ============================================================ */}
        <div className="bg-[#2d2d2d] h-9 border-b border-[#3e3e42] flex items-center justify-between select-none px-3 shrink-0">
          {/* Left: Window Icon & Title */}
          <div className="flex items-center gap-2 text-xs text-[#cccccc] font-medium">
            <div className="w-4 h-4 bg-[#0078d4] text-white flex items-center justify-center font-bold text-[10px]">
              W
            </div>
            <span>Modul_Webinar_Basic_PLC_Industri_4.0.pdf — PLC Training Suite Reader</span>
          </div>

          {/* Right: Clean Document Info */}
          <div className="text-[11px] font-mono text-[#858585] hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#107c41]" />
            <span>Dokumen Aktif (Online)</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. Windows 10 Ribbon / Toolbar Menu */}
        {/* ============================================================ */}
        <div className="bg-[#252526] border-b border-[#333333] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 shadow-sm">
          {/* File Menu Tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/learning')}
              className="px-3 py-1 bg-[#0078d4] text-white font-semibold flex items-center gap-1.5 hover:bg-[#0063b1] transition-colors"
            >
              <ArrowLeft size={12} /> Kembali ke Kurikulum
            </button>
            <button className="px-3 py-1 text-[#cccccc] hover:bg-[#333333]">Beranda</button>
            <button className="px-3 py-1 text-[#cccccc] hover:bg-[#333333]">Tampilan</button>
            <button className="px-3 py-1 text-[#cccccc] hover:bg-[#333333]">Referensi</button>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`px-2.5 py-1 flex items-center gap-1 border text-xs transition-colors ${
                bookmarked
                  ? 'bg-[#0078d4] text-white border-[#005a9e]'
                  : 'bg-[#333333] hover:bg-[#3e3e42] text-[#cccccc] border-[#474747]'
              }`}
            >
              <Bookmark size={12} /> {bookmarked ? 'Tersimpan' : 'Bookmark'}
            </button>
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1 bg-[#333333] hover:bg-[#3e3e42] text-[#cccccc] border border-[#474747] flex items-center gap-1"
            >
              {copied ? <Check size={12} className="text-[#107c41]" /> : <Copy size={12} />}
              {copied ? 'Tersalin' : 'Salin URL'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-2.5 py-1 bg-[#333333] hover:bg-[#3e3e42] text-[#cccccc] border border-[#474747] flex items-center gap-1"
            >
              <Printer size={12} /> Cetak
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. Main Body Split: Stationary Sidebar (Left) + Scrolling Document (Right) */}
        {/* ============================================================ */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Navigation Pane (Fixed & Stationary / Diam) */}
          <div className="lg:col-span-3 bg-[#1e1e1e] border-r border-[#333333] p-3 space-y-4 h-full overflow-y-auto select-none flex flex-col justify-between shrink-0">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#858585] uppercase tracking-wider px-2">
                <Folder size={13} className="text-[#0078d4]" />
                <span>Daftar Isi Bab</span>
              </div>

              <nav className="space-y-0.5 font-sans text-xs">
                {sections.map((sec, idx) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-2.5 py-2 flex items-center justify-between border transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#0078d4] text-white font-medium border-[#005a9e] shadow-sm'
                        : 'text-[#cccccc] hover:bg-[#2a2d2e] border-transparent'
                    }`}
                  >
                    <span className="truncate">
                      {idx + 1}. {sec.label.replace(/^\d+\.\s*/, '')}
                    </span>
                    {activeSection === sec.id && <ChevronRight size={12} />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Windows 10 Info Tile */}
            <div className="bg-[#252526] p-3 border border-[#333333] space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#0078d4]">
                <Layers size={13} />
                <span>Ringkasan Dokumen</span>
              </div>
              <div className="text-[11px] text-[#9d9d9d] space-y-1">
                <p>• 11 Halaman Materi Resmi</p>
                <p>• Standar IEC 61131-3</p>
                <p>• 3 Kasus Smart Factory</p>
                <p>• Estimasi Baca: 15 Menit</p>
              </div>
            </div>
          </div>

          {/* Right Document Reading Pane (Independently Scrolling) */}
          <div className="lg:col-span-9 bg-[#1e1e1e] p-6 lg:p-10 space-y-10 h-full overflow-y-auto scrollbar-thin">
            {/* Header Document Banner */}
            <div className="bg-[#252526] border border-[#333333] p-6 border-l-4 border-l-[#0078d4]">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#0078d4] text-white text-[10px] font-bold px-2 py-0.5 font-mono">
                  MODUL WEBINAR
                </span>
                <span className="bg-[#333333] text-[#cccccc] text-[10px] font-bold px-2 py-0.5 font-mono">
                  INDUSTRI 4.0
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                BASIC PLC: Fondasi Kontrol Otomasi untuk Mendukung Transformasi Industri 4.0
              </h1>
              <p className="text-xs lg:text-sm text-[#cccccc] mt-2 italic">
                "Dari relay ke smart factory: memahami PLC sebagai jembatan antara mesin dan data."
              </p>
            </div>

            {/* SECTION 1 */}
            <section id="sec-1" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">01</span>
                <h2 className="text-lg font-bold text-white">
                  Pengantar — Kenapa PLC Masih Relevan di Era Industri 4.0
                </h2>
              </div>

              <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                Ketika orang mendengar istilah <strong>"Industri 4.0"</strong>, bayangan yang muncul biasanya adalah kecerdasan buatan (AI), big data, atau robot yang bekerja otonom penuh. Tapi di balik semua istilah yang terdengar futuristik itu, ada satu komponen yang justru sudah eksis sejak akhir 1960-an dan sampai sekarang tetap jadi tulang punggung lantai produksi: <strong>Programmable Logic Controller (PLC)</strong>.
              </p>

              <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                PLC pertama kali dikembangkan sebagai pengganti sistem relay elektromekanis yang rumit dan mahal untuk diubah — dulu, kalau proses produksi berubah, teknisi harus mengganti pengkabelan fisik satu per satu. Dengan hadirnya download program dari komputer atau perangkat pemrograman, perubahan logika kontrol bisa dilakukan dalam hitungan detik tanpa membongkar panel.
              </p>

              {/* Windows 10 Callout Box */}
              <div className="bg-[#1f2430] border-l-4 border-[#0078d4] p-4 text-xs space-y-1">
                <p className="font-bold text-[#0078d4]">📌 INTINYA:</p>
                <p className="text-[#cccccc] leading-relaxed">
                  PLC bukan teknologi lama yang akan digantikan Industri 4.0 — ia justru komponen yang memungkinkan Industri 4.0 terjadi di lapangan. Tanpa PLC yang bisa membaca sensor dan mengeksekusi logika secara deterministik dan real-time, seluruh lapisan analitik dan AI di atasnya tidak punya "tangan" untuk bertindak di dunia fisik.
                </p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="sec-2" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">02</span>
                <h2 className="text-lg font-bold text-white">Tujuan Pembelajaran</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Menjelaskan apa itu PLC, komponen utamanya, dan bagaimana ia bekerja secara siklik (scan cycle).',
                  'Membaca logika dasar ladder diagram — termasuk konsep kontak, coil, timer, dan counter — pada level pengantar.',
                  'Memahami posisi dan peran PLC dalam arsitektur otomasi modern, termasuk kaitannya dengan SCADA dan Industrial IoT (IIoT).',
                  'Mengidentifikasi bagaimana PLC mendukung inisiatif Industri 4.0 seperti predictive maintenance, efisiensi energi, dan smart factory.',
                  'Mengenali contoh penerapan nyata PLC di berbagai sektor industri sebagai bekal untuk eksplorasi lebih lanjut.'
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#252526] p-3 border border-[#333333] flex items-start gap-2.5">
                    <span className="text-[#0078d4] font-bold text-xs">{idx + 1}.</span>
                    <p className="text-xs text-[#cccccc] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="sec-3" className="space-y-6">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">03</span>
                <h2 className="text-lg font-bold text-white">Dasar-Dasar PLC</h2>
              </div>

              {/* 3.1 Apa itu PLC */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0078d4]">3.1 Apa itu PLC?</h3>
                <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                  Secara definisi teknis, PLC adalah controller berbasis mikroprosesor yang menggunakan programmable memory untuk menyimpan instruksi dan menjalankan fungsi logika, sequencing, timing, counting, dan aritmatika guna mengendalikan mesin dan proses.
                </p>
                <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                  Dengan kata lain: <strong>PLC adalah "komputer versi tahan banting"</strong> yang bertugas membaca input (sensor), mengevaluasi program kontrol, lalu mengatur output (motor, solenoid valve, lampu).
                </p>

                <div className="bg-[#252526] border-l-4 border-[#ffb900] p-3 text-xs space-y-1">
                  <p className="font-bold text-[#ffb900]">📖 DEFINISI — PLC vs Komputer Biasa:</p>
                  <p className="text-[#cccccc] leading-relaxed">
                    Bedanya bukan di seberapa "pintar", melainkan pada <strong>keandalan fisik dan determinisme</strong>. PLC dirancang bekerja non-stop 24/7 di area bersuhu ekstrem, debu tebal, getaran tinggi, dan gangguan noise listrik tanpa crash.
                  </p>
                </div>
              </div>

              {/* 3.2 Komponen Utama PLC */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0078d4]">3.2 Komponen Utama PLC</h3>
                <div className="border border-[#333333] overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#2d2d2d] text-[#ffffff] font-bold">
                      <tr>
                        <th className="p-2.5 border-b border-[#333333]">Komponen</th>
                        <th className="p-2.5 border-b border-[#333333]">Fungsi Utama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333333] text-[#cccccc]">
                      <tr className="bg-[#1e1e1e]">
                        <td className="p-2.5 font-bold text-white">Power Supply (PSU)</td>
                        <td className="p-2.5">Mengonversi listrik AC (220V) menjadi DC 24V untuk operasional komponen internal PLC.</td>
                      </tr>
                      <tr className="bg-[#252526]">
                        <td className="p-2.5 font-bold text-white">CPU (Central Processing Unit)</td>
                        <td className="p-2.5">"Otak" PLC — mengeksekusi program, memproses sinyal I/O, dan mengelola komunikasi.</td>
                      </tr>
                      <tr className="bg-[#1e1e1e]">
                        <td className="p-2.5 font-bold text-white">Memory (RAM/ROM)</td>
                        <td className="p-2.5">Menyimpan program logika kontrol dan tabel alamat variabel sistem.</td>
                      </tr>
                      <tr className="bg-[#252526]">
                        <td className="p-2.5 font-bold text-white">Modul Input/Output (I/O)</td>
                        <td className="p-2.5">Antarmuka fisik untuk membaca sensor (Input) dan menyalakan aktuator/motor (Output).</td>
                      </tr>
                      <tr className="bg-[#1e1e1e]">
                        <td className="p-2.5 font-bold text-white">Communication Interface</td>
                        <td className="p-2.5">Port komunikasi jaringan (Ethernet, Profinet, Modbus) ke SCADA, HMI, atau Cloud.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3.3 Scan Cycle Diagnostics */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0078d4]">3.3 Siklus Kerja (Scan Cycle)</h3>
                <p className="text-xs text-[#cccccc]">
                  Uji alur kerja siklis PLC secara interaktif pada simulator diagnostik berikut:
                </p>
                <ScanCycleWidgetWin10 />
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="sec-4" className="space-y-6">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">04</span>
                <h2 className="text-lg font-bold text-white">Logika Dasar: Ladder Diagram</h2>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#0078d4]">4.1 Kontak, Koil, dan Penguncian (Self-Holding)</h3>
                <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                  Ladder Diagram meniru skema wiring listrik konvensional. Daya diasumsikan mengalir dari rel kiri (L+) menuju rel kanan (M) saat kondisi kontak terpenuhi.
                </p>

                {/* Ladder Diagram Simulator */}
                <StartStopLadderWin10 />
              </div>

              {/* 4.2 Timer & Counter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#252526] p-4 border border-[#333333] space-y-1.5">
                  <h4 className="text-xs font-bold text-white">Timer On-Delay (TON)</h4>
                  <p className="text-xs text-[#cccccc] leading-relaxed">
                    Menunda pengaktifan output selama durasi preset (misal 5 detik). Begitu waktu tercapai, kontak output timer menjadi TRUE hingga di-reset.
                  </p>
                </div>
                <div className="bg-[#252526] p-4 border border-[#333333] space-y-1.5">
                  <h4 className="text-xs font-bold text-white">Counter Up (CTU)</h4>
                  <p className="text-xs text-[#cccccc] leading-relaxed">
                    Menghitung jumlah pulsa benda yang lewat dari sensor. Saat akumulasi mencapai target (misal 12 pcs), output counter aktif memicu batch pengemasan.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="sec-5" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">05</span>
                <h2 className="text-lg font-bold text-white">PLC sebagai Pilar Industri 4.0</h2>
              </div>

              <p className="text-xs lg:text-sm text-[#cccccc] leading-relaxed">
                Di era smart manufacturing, PLC berevolusi dari sekadar pengontrol saklar lokal menjadi <strong>Edge Gateway</strong> yang mengalirkan data operasional mesin ke lapisan SCADA, MES, dan analitik Cloud/AI.
              </p>

              <div className="border border-[#333333] overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#2d2d2d] text-white font-bold">
                    <tr>
                      <th className="p-2.5 border-b border-[#333333]">Lapisan Otomasi</th>
                      <th className="p-2.5 border-b border-[#333333]">Peran Utama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333333] text-[#cccccc]">
                    <tr className="bg-[#1e1e1e]">
                      <td className="p-2.5 font-bold text-[#0078d4]">1. PLC (Machine Level)</td>
                      <td className="p-2.5">Eksekusi deterministik real-time di lantai pabrik (&lt;10 ms).</td>
                    </tr>
                    <tr className="bg-[#252526]">
                      <td className="p-2.5 font-bold text-[#ffb900]">2. SCADA (Supervisory Level)</td>
                      <td className="p-2.5">Supervisi visual multi-mesin, logging alarm, dan intervensi operator.</td>
                    </tr>
                    <tr className="bg-[#1e1e1e]">
                      <td className="p-2.5 font-bold text-[#107c41]">3. IIoT / Cloud Analytics</td>
                      <td className="p-2.5">Model machine learning untuk predictive maintenance dan efisiensi energi.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 6: Windows 10 Live Tiles Case Studies */}
            <section id="sec-6" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">06</span>
                <h2 className="text-lg font-bold text-white">Studi Kasus Industri Nyata</h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#0078d4] p-4 text-white shadow-md">
                  <p className="text-[11px] font-semibold opacity-90 uppercase">Konsumsi Energi</p>
                  <p className="text-3xl font-bold font-mono mt-1">-28%</p>
                  <p className="text-[10px] mt-2 opacity-80">Pabrik Otomotif (12 Bulan)</p>
                </div>
                <div className="bg-[#ffb900] p-4 text-black shadow-md">
                  <p className="text-[11px] font-semibold opacity-90 uppercase">Peak Demand Listrik</p>
                  <p className="text-3xl font-bold font-mono mt-1">-28%</p>
                  <p className="text-[10px] mt-2 opacity-80">Integrasi S7-1500 + WinCC</p>
                </div>
                <div className="bg-[#107c41] p-4 text-white shadow-md">
                  <p className="text-[11px] font-semibold opacity-90 uppercase">Jejak Karbon</p>
                  <p className="text-3xl font-bold font-mono mt-1">-35.1%</p>
                  <p className="text-[10px] mt-2 opacity-80">8.760 Titik Data / Jam</p>
                </div>
                <div className="bg-[#005a9e] p-4 text-white shadow-md">
                  <p className="text-[11px] font-semibold opacity-90 uppercase">Downtime Mesin</p>
                  <p className="text-3xl font-bold font-mono mt-1">-32%</p>
                  <p className="text-[10px] mt-2 opacity-80">Predictive Maintenance</p>
                </div>
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="sec-7" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">07</span>
                <h2 className="text-lg font-bold text-white">Rangkuman & Key Takeaways</h2>
              </div>

              <div className="bg-[#252526] p-4 border border-[#333333] space-y-2 text-xs text-[#cccccc]">
                <p>• PLC adalah mikrokontroler industri tangguh berbasis siklus kerja siklis (Scan Cycle).</p>
                <p>• Ladder Diagram tetap menjadi bahasa pemrograman paling umum karena kemudahan visualnya.</p>
                <p>• Integrasi PLC + SCADA + IIoT adalah tulang punggung dari Smart Factory Industri 4.0.</p>
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="sec-8" className="space-y-4">
              <div className="border-b border-[#333333] pb-2 flex items-center gap-2">
                <span className="bg-[#0078d4] text-white px-2 py-0.5 text-xs font-bold font-mono">08</span>
                <h2 className="text-lg font-bold text-white">Daftar Pustaka & Referensi</h2>
              </div>

              <div className="space-y-2 text-xs divide-y divide-[#333333]">
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
                  <div key={idx} className="pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[#858585] font-mono">{idx + 1}.</span>
                      <span className="text-[#cccccc] leading-relaxed">{item.title}</span>
                    </div>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0078d4] hover:underline flex items-center gap-1 shrink-0 ml-5 sm:ml-0 font-medium"
                      >
                        Buka Link <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. Windows 10 Status Bar */}
        {/* ============================================================ */}
        <div className="bg-[#0078d4] text-white px-3 py-1 text-[11px] font-sans flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <span>READY</span>
            <span>|</span>
            <span>Dokumen: Modul Webinar PLC</span>
            <span>|</span>
            <span>8 Bab Selesai Dimuat</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><ZoomOut size={11} /> 100% <ZoomIn size={11} /></span>
            <span>Windows 10 Fluent Reader</span>
          </div>
        </div>
      </div>
    </div>
  );
}
