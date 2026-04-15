
export interface LearningModule {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  duration: string;         // Estimasi waktu baca
  slug: string;
  content: string;          // Markdown or Rich Text placeholder
}

export const LEARNING_LEVELS = [
  { level: 1, title: 'Level 1: Dasar & Konsep', color: 'accent' },
  { level: 2, title: 'Level 2: Hardware & I/O', color: 'success' },
  { level: 3, title: 'Level 3: Instruksi Dasar', color: 'warning' },
  { level: 4, title: 'Level 4: Lanjutan & Analog', color: 'danger' },
];

export const LEARNING_MODULES: LearningModule[] = [
  // LEVEL 1 — DASAR
  {
    id: 'm1-1',
    level: 1,
    title: 'Apa itu PLC?',
    description: 'Pengenalan Programmable Logic Controller dan perannya di industri.',
    duration: '10 min',
    slug: 'pengenalan-plc',
    content: `
      ## Definisi PLC
      PLC (Programmable Logic Controller) adalah komputer digital industri yang dirancang khusus untuk mengontrol proses manufaktur, seperti jalur perakitan, perangkat robotik, atau aktivitas apa pun yang memerlukan keandalan tinggi dan kemudahan pemrograman.

      ### Mengapa Menggunakan PLC?
      1. **Fleksibel**: Mudah diubah logikanya tanpa merubah kabel.
      2. **Handal**: Tahan terhadap gangguan lingkungan industri (debu, panas, getaran).
      3. **Troubleshooting Mudah**: Indikator LED dan diagnostic software mempermudah pelacakan error.
    `,
  },
  {
    id: 'm1-2',
    level: 1,
    title: 'Sejarah & Evolusi',
    description: 'Dari Relay logic yang rumit menuju sistem kontrol cerdas.',
    duration: '5 min',
    slug: 'sejarah-plc',
    content: `## Era Sebelum PLC...`,
  },
  {
    id: 'm1-3',
    level: 1,
    title: 'Arsitektur Hardware',
    description: 'CPU, Memory, Power Supply, dan Rack system.',
    duration: '15 min',
    slug: 'arsitektur-hardware',
    content: `## Komponen Utama PLC...`,
  },

  // LEVEL 2 — HARDWARE & I/O
  {
    id: 'm2-1',
    level: 2,
    title: 'Digital Input & Output',
    description: 'Memahami sinyal ON/OFF (Sink vs Source).',
    duration: '15 min',
    slug: 'digital-io',
    content: `## Sinyal Digital...`,
  },
  {
    id: 'm2-2',
    level: 2,
    title: 'Analog I/O (Sinyal Kontinu)',
    description: 'Standar 4-20mA dan 0-10V pada sistem industri.',
    duration: '20 min',
    slug: 'analog-io',
    content: `## Sinyal Analog...`,
  },
  {
    id: 'm2-3',
    level: 2,
    title: 'Wiring Dasar & Safety',
    description: 'Cara menyambung sensor dan aktuator dengan benar.',
    duration: '15 min',
    slug: 'wiring-basic',
    content: `## Standar Wiring...`,
  },

  // LEVEL 3 — INSTRUKSI LADDER
  {
    id: 'm3-1',
    level: 3,
    title: 'Kontak Dasar (LD, LDI, OUT)',
    description: 'Membangun logika gerbang sederhana via Ladder Diagram.',
    duration: '15 min',
    slug: 'instruksi-dasar',
    content: `## Logika Ladder...`,
  },
  {
    id: 'm3-2',
    level: 3,
    title: 'Timer (TON, TOF)',
    description: 'Mengontrol urutan waktu dalam proses otomatisasi.',
    duration: '20 min',
    slug: 'timer-logic',
    content: `## Menggunakan Timer...`,
  },
  {
    id: 'm3-3',
    level: 3,
    title: 'Counter & Latching',
    description: 'Menghitung produk dan menjaga status output.',
    duration: '15 min',
    slug: 'counter-logic',
    content: `## Menggunakan Counter...`,
  },

  // LEVEL 4 — LANJUTAN
  {
    id: 'm4-1',
    level: 4,
    title: 'Analog Scaling',
    description: 'Konversi data RAW ke nilai industri (Suhu, Tekanan, Level).',
    duration: '25 min',
    slug: 'analog-scaling',
    content: `## Rumus Scaling...`,
  },
  {
    id: 'm4-2',
    level: 4,
    title: 'Data Move (MOV)',
    description: 'Manipulasi register dan transfer data antar memory.',
    duration: '15 min',
    slug: 'data-move',
    content: `## Instruksi MOV...`,
  },
  {
    id: 'm4-3',
    level: 4,
    title: 'Komparasi & Aritmatika',
    description: 'Logika matematika untuk kontrol yang lebih cerdas.',
    duration: '20 min',
    slug: 'math-logic',
    content: `## Logika Perbandingan...`,
  },
];
