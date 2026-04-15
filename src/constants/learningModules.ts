// ============================================================
// src/constants/learningModules.ts
// Konten Materi LMS — PLC Training Suite
// Struktur: 4 Level, 14 Modul, 60+ Halaman Konten
// ============================================================

export type ContentType = 'text' | 'image' | 'table' | 'formula' | 'tip' | 'warning' | 'code';

export interface ContentBlock {
  type: ContentType;
  body?: string;         // Teks utama atau path gambar (opsional untuk tabel)
  caption?: string;      // Label di bawah tabel/gambar
  rows?: string[][];     // Khusus type: 'table' — [header, ...rows]
}

export interface ModulePage {
  pageNumber: number;
  title: string;
  content: ContentBlock[];
}

export interface LearningModule {
  id: string;            // Format: 'L1-M1', 'L2-M2', dst.
  levelId: string;       // 'level-1' | 'level-2' | 'level-3' | 'level-4'
  order: number;         // Urutan dalam level
  title: string;
  description: string;
  estimatedMinutes: number;
  thumbnail: string;     // Path ke /assets/thumbnails/
  pages: ModulePage[];
}

export interface LearningLevel {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  color: string;         // Tailwind accent color class
  icon: string;          // Lucide icon name
  modules: LearningModule[];
}

// ============================================================
// LEVEL 1 — DASAR PLC
// ============================================================

const level1: LearningLevel = {
  id: 'level-1',
  order: 1,
  title: 'Dasar PLC',
  subtitle: 'Pengenalan, sejarah, dan komponen hardware PLC',
  color: 'cyan',
  icon: 'Cpu',
  modules: [

    // ── MODUL 1.1 ─────────────────────────────────────────
    {
      id: 'L1-M1',
      levelId: 'level-1',
      order: 1,
      title: 'Pengenalan PLC',
      description: 'Apa itu PLC, mengapa digunakan, dan perannya di industri modern.',
      estimatedMinutes: 20,
      thumbnail: '/assets/thumbnails/l1m1-intro.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Apa Itu PLC?',
          content: [
            {
              type: 'text',
              body: 'PLC (Programmable Logic Controller) adalah komputer industri khusus yang dirancang untuk mengontrol proses-proses otomasi pada mesin dan lini produksi. Berbeda dengan komputer umum, PLC didesain untuk tahan terhadap kondisi industri yang keras: getaran, debu, kelembaban tinggi, dan fluktuasi tegangan.',
            },
            {
              type: 'text',
              body: 'PLC membaca sinyal dari sensor dan perangkat input (tombol, limit switch, sensor suhu), memproses logika sesuai program yang telah ditanamkan, lalu mengaktifkan perangkat output (motor, katup, lampu, alarm).',
            },
            {
              type: 'tip',
              body: 'Bayangkan PLC seperti "otak" mesin. Sensor adalah "mata dan telinga"-nya, sedangkan aktuator (motor, solenoid) adalah "tangan"-nya.',
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Sejarah Singkat PLC',
          content: [
            {
              type: 'text',
              body: 'PLC pertama kali dikembangkan pada tahun 1968 oleh Dick Morley dari Modicon untuk memenuhi kebutuhan industri otomotif Amerika. Sebelumnya, sistem kontrol menggunakan relay elektromekanik yang berjumlah ratusan hingga ribuan unit — memakan ruang besar, susah dirawat, dan sulit diubah programnya.',
            },
            {
              type: 'table',
              caption: 'Evolusi PLC dari masa ke masa',
              rows: [
                ['Tahun', 'Perkembangan'],
                ['1968', 'PLC pertama (Modicon 084) — menggantikan relay panel'],
                ['1970-an', 'Penambahan fungsi timer, counter, dan aritmatika dasar'],
                ['1980-an', 'Komunikasi jaringan antar PLC, layar HMI pertama'],
                ['1990-an', 'Standar IEC 61131-3 ditetapkan (5 bahasa pemrograman)'],
                ['2000-an', 'Ethernet terintegrasi, koneksi ke SCADA/MES'],
                ['2010+', 'PLC berbasis cloud, IIoT, dan integrasi AI/ML'],
              ],
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Mengapa PLC, Bukan Relay Biasa?',
          content: [
            {
              type: 'table',
              caption: 'Perbandingan sistem relay vs PLC',
              rows: [
                ['Aspek', 'Relay Konvensional', 'PLC'],
                ['Perubahan logika', 'Harus rewiring fisik', 'Cukup ubah program software'],
                ['Ukuran panel', 'Besar (ratusan relay)', 'Kompak'],
                ['Troubleshooting', 'Sulit, manual', 'Mudah via monitoring online'],
                ['Kecepatan', 'Lambat (mekanik)', 'Sangat cepat (milidetik)'],
                ['Keandalan', 'Rendah (kontak aus)', 'Tinggi (solid-state)'],
                ['Biaya jangka panjang', 'Mahal (perawatan tinggi)', 'Lebih hemat'],
              ],
            },
            {
              type: 'warning',
              body: 'Walaupun PLC unggul di hampir semua aspek, relay masih digunakan sebagai safety interlock di sistem kritis (misal: emergency stop) karena sifatnya yang fail-safe dan tidak bergantung pada software.',
            },
          ],
        },
      ],
    },

    // ── MODUL 1.2 ─────────────────────────────────────────
    {
      id: 'L1-M2',
      levelId: 'level-1',
      order: 2,
      title: 'Komponen Hardware PLC',
      description: 'Mengenal bagian-bagian fisik PLC: CPU, PSU, modul I/O, dan rack.',
      estimatedMinutes: 25,
      thumbnail: '/assets/thumbnails/l1m2-hardware.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Arsitektur Dasar PLC',
          content: [
            {
              type: 'text',
              body: 'Sebuah PLC terdiri dari beberapa komponen utama yang bekerja bersama. Memahami fungsi tiap komponen sangat penting sebelum melakukan wiring atau pemrograman.',
            },
            {
              type: 'table',
              caption: 'Komponen utama PLC dan fungsinya',
              rows: [
                ['Komponen', 'Fungsi Utama'],
                ['CPU (Central Processing Unit)', 'Memproses program, menjalankan scan cycle, mengeksekusi logika ladder'],
                ['Power Supply Unit (PSU)', 'Mengubah tegangan AC (220V) ke DC (24V/5V) untuk PLC dan modul'],
                ['Modul Input Digital (DI)', 'Membaca sinyal ON/OFF dari tombol, limit switch, proximity sensor'],
                ['Modul Output Digital (DO)', 'Mengaktifkan relay, solenoid, kontaktor, lampu indikator'],
                ['Modul Input Analog (AI)', 'Membaca sinyal 4–20mA atau 0–10V dari sensor suhu, tekanan, level'],
                ['Modul Output Analog (AO)', 'Mengirim sinyal 4–20mA atau 0–10V ke inverter, kontrol valve'],
                ['Modul Komunikasi', 'Menghubungkan PLC ke jaringan: Ethernet, Profibus, Modbus, EtherNet/IP'],
                ['Rack / Chassis', 'Tempat mounting semua modul, menyediakan backplane bus data'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'CPU — Otak PLC',
          content: [
            {
              type: 'text',
              body: 'CPU adalah komponen terpenting PLC. CPU menyimpan program pengguna di memori non-volatile (biasanya flash atau EEPROM) dan menjalankannya secara berulang dalam siklus yang disebut Scan Cycle.',
            },
            {
              type: 'text',
              body: 'Spesifikasi CPU yang perlu diperhatikan saat memilih PLC:',
            },
            {
              type: 'table',
              caption: 'Parameter penting CPU PLC',
              rows: [
                ['Parameter', 'Penjelasan', 'Contoh Nilai'],
                ['Scan Time', 'Waktu satu siklus eksekusi program', '1–20 ms'],
                ['Program Memory', 'Kapasitas penyimpanan program pengguna', '50 KB – 4 MB'],
                ['Data Memory', 'Ruang untuk variabel, timer, counter', '32 KB – 1 MB'],
                ['Processing Speed', 'Kecepatan eksekusi instruksi boolean', '0.1 – 10 µs/instruksi'],
                ['Communication Port', 'Port bawaan CPU', 'Ethernet, RS-232, RS-485'],
              ],
            },
            {
              type: 'tip',
              body: 'Untuk aplikasi sederhana (conveyor, pompa), CPU entry-level sudah cukup. Untuk proses motion control atau multi-axis, pilih CPU dengan scan time < 1ms.',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Spesifikasi Merk PLC Populer',
          content: [
            {
              type: 'text',
              body: 'Di Indonesia, merk PLC yang paling umum digunakan di industri adalah Siemens, Mitsubishi, Schneider, dan Omron. Setiap merk memiliki kelebihan dan ekosistem masing-masing.',
            },
            {
              type: 'table',
              caption: 'Perbandingan merk PLC populer',
              rows: [
                ['Merk', 'Seri Populer', 'Software', 'Keunggulan'],
                ['Siemens', 'S7-1200, S7-1500', 'TIA Portal', 'Ekosistem terlengkap, standar Eropa'],
                ['Mitsubishi', 'FX3U, FX5U, iQ-R', 'GX Works', 'Harga kompetitif, banyak di Indonesia'],
                ['Schneider', 'M221, M241, Premium', 'EcoStruxure', 'Mudah dipelajari, integrasi Modbus'],
                ['Omron', 'CP1E, CP1L, NX1P2', 'CX-Programmer', 'Kuat untuk motion, banyak modul khusus'],
                ['Allen-Bradley', 'Micro820, CompactLogix', 'Studio 5000', 'Standar Amerika, powerfull untuk besar'],
              ],
            },
            {
              type: 'warning',
              body: 'Program PLC tidak bisa dipindah antar merk secara langsung. Meskipun semuanya menggunakan bahasa Ladder, ada perbedaan instruksi dan addressing di tiap merk.',
            },
          ],
        },
      ],
    },

    // ── MODUL 1.3 ─────────────────────────────────────────
    {
      id: 'L1-M3',
      levelId: 'level-1',
      order: 3,
      title: 'Scan Cycle PLC',
      description: 'Memahami cara kerja internal PLC: Read → Execute → Write dan implikasinya.',
      estimatedMinutes: 20,
      thumbnail: '/assets/thumbnails/l1m3-scan.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Apa Itu Scan Cycle?',
          content: [
            {
              type: 'text',
              body: 'PLC tidak menjalankan program hanya sekali — ia terus-menerus mengulang eksekusi program dari baris pertama hingga terakhir, kemudian kembali ke baris pertama lagi. Satu kali putaran penuh ini disebut Scan Cycle atau Scan Time.',
            },
            {
              type: 'text',
              body: 'Setiap scan cycle terdiri dari tiga tahap utama yang selalu berurutan:',
            },
            {
              type: 'table',
              caption: 'Tiga tahap scan cycle PLC',
              rows: [
                ['Tahap', 'Nama', 'Yang Terjadi'],
                ['1', 'Read Inputs', 'PLC membaca semua status input (I0.0, I0.1, dst.) dan menyimpannya ke memori input image'],
                ['2', 'Execute Program', 'CPU memproses program ladder dari rung pertama hingga terakhir menggunakan nilai dari input image'],
                ['3', 'Write Outputs', 'Hasil eksekusi ditulis ke memori output image, lalu dikirim ke modul output fisik (Q0.0, Q0.1, dst.)'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Implikasi Scan Cycle pada Pemrograman',
          content: [
            {
              type: 'text',
              body: 'Memahami scan cycle penting karena mempengaruhi bagaimana program ladder bereaksi terhadap perubahan input.',
            },
            {
              type: 'warning',
              body: 'Jika sebuah input berubah DI TENGAH-TENGAH scan cycle (saat Execute Program), perubahannya TIDAK akan terbaca sampai scan cycle berikutnya. Ini disebut "satu scan delay" — hal normal dan harus dipahami saat mendebug program.',
            },
            {
              type: 'text',
              body: 'Contoh: Tombol START ditekan selama 5ms, sementara scan time PLC adalah 10ms. Ada kemungkinan sinyal START tidak terbaca jika PLC sedang di fase Execute atau Write saat tombol ditekan. Solusinya: gunakan tombol dengan hold time minimal 2× scan time.',
            },
            {
              type: 'tip',
              body: 'Scan time tipikal PLC modern: 1–20 ms. PLC untuk high-speed application bisa serendah 0.1 ms. Selalu cek spesifikasi scan time di datasheet PLC sebelum memilih untuk aplikasi time-critical.',
            },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// LEVEL 2 — TIPE I/O
// ============================================================

const level2: LearningLevel = {
  id: 'level-2',
  order: 2,
  title: 'Tipe I/O',
  subtitle: 'Digital, analog, wiring, dan addressing sinyal PLC',
  color: 'green',
  icon: 'Plug',
  modules: [

    // ── MODUL 2.1 ─────────────────────────────────────────
    {
      id: 'L2-M1',
      levelId: 'level-2',
      order: 1,
      title: 'Digital Input & Output',
      description: 'Memahami sinyal ON/OFF, jenis sensor, dan cara wiring DI/DO.',
      estimatedMinutes: 25,
      thumbnail: '/assets/thumbnails/l2m1-digital.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Sinyal Digital: Logika ON dan OFF',
          content: [
            {
              type: 'text',
              body: 'Sinyal digital hanya mengenal dua kondisi: ON (1/TRUE) atau OFF (0/FALSE). Di PLC, sinyal digital direpresentasikan sebagai satu bit di memori. Tegangan yang dianggap "ON" bervariasi tergantung merk, tapi yang paling umum adalah 24VDC.',
            },
            {
              type: 'table',
              caption: 'Level tegangan sinyal digital yang umum',
              rows: [
                ['Standar', 'Level OFF', 'Level ON', 'Penggunaan'],
                ['24VDC Sink/Source', '0–5V', '15–30V', 'PLC industri paling umum'],
                ['120VAC', '0–20V', '85–132V', 'Panel Amerika/lama'],
                ['TTL (5V)', '0–0.8V', '2–5V', 'PLC lama, sensor digital sederhana'],
                ['NAMUR', '< 1.2mA', '> 2.1mA', 'Sensor di area Ex (explosive)'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Jenis Sensor Digital Input',
          content: [
            {
              type: 'table',
              caption: 'Sensor umum yang terhubung ke Digital Input PLC',
              rows: [
                ['Jenis Sensor', 'Cara Kerja', 'Aplikasi Umum'],
                ['Push Button / Selector Switch', 'Kontak mekanik ON/OFF manual', 'Panel operator: START, STOP, MODE'],
                ['Limit Switch', 'Kontak mekanik, diaktifkan objek fisik', 'Deteksi posisi pintu, silinder, arm robot'],
                ['Proximity Sensor Induktif', 'Mendeteksi objek metal tanpa kontak', 'Penghitung produk logam, posisi piston'],
                ['Proximity Sensor Kapasitif', 'Mendeteksi objek non-metal (plastik, cairan)', 'Deteksi level cairan, material non-logam'],
                ['Photoelectric Sensor', 'Beam cahaya infrared / laser', 'Deteksi objek apa pun pada jarak jauh'],
                ['Reed Switch', 'Diaktifkan magnet', 'Posisi silinder pneumatik, pintu'],
                ['Float Switch', 'Pelampung mekanik', 'Level cairan di tangki'],
              ],
            },
            {
              type: 'tip',
              body: 'Sensor 3-kawat (NPN atau PNP) adalah yang paling umum saat ini. Pastikan tipe sensor sesuai dengan konfigurasi modul input PLC Anda (Sink atau Source). Salah pilih = sensor tidak terbaca!',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Wiring Digital Input — Sink vs Source',
          content: [
            {
              type: 'text',
              body: 'Konsep Sink (NPN) dan Source (PNP) sering membingungkan pemula. Kuncinya ada di arah aliran arus pada pin signal sensor.',
            },
            {
              type: 'table',
              caption: 'Perbedaan wiring NPN (Sink) vs PNP (Source)',
              rows: [
                ['Aspek', 'NPN (Sink)', 'PNP (Source)'],
                ['Sinyal saat aktif', 'Arus mengalir MASUK ke sensor (sink)', 'Arus mengalir KELUAR dari sensor (source)'],
                ['Output sensor', 'Terhubung ke 0V (GND) saat ON', 'Terhubung ke +24V saat ON'],
                ['Input PLC yang cocok', 'Source Input (Common +24V)', 'Sink Input (Common 0V)'],
                ['Umum di', 'Jepang, Asia Tenggara', 'Eropa, Amerika'],
                ['Contoh merk sensor', 'Autonics, Omron (tipe NPN)', 'Sick, Pepperl+Fuchs'],
              ],
            },
            {
              type: 'warning',
              body: 'Memasang sensor NPN ke modul Source input PLC yang salah konfigurasi akan menyebabkan sinyal tidak terbaca atau bahkan merusak modul. Selalu cek datasheet modul I/O dan sensor sebelum wiring.',
            },
          ],
        },
        {
          pageNumber: 4,
          title: 'Digital Output — Relay vs Transistor vs Triac',
          content: [
            {
              type: 'text',
              body: 'Modul Digital Output PLC hadir dalam tiga teknologi berbeda. Pilihan yang tepat tergantung beban yang akan dikontrol.',
            },
            {
              type: 'table',
              caption: 'Tipe output digital PLC',
              rows: [
                ['Tipe', 'Cara Kerja', 'Kelebihan', 'Keterbatasan', 'Gunakan untuk'],
                ['Relay', 'Kontak mekanik', 'Isolasi galvanik, bisa AC & DC', 'Lambat (10ms), umur terbatas', 'Kontaktor, beban AC besar, solenoid valve'],
                ['Transistor (NPN/PNP)', 'Semikonduktor', 'Cepat (<1ms), umur panjang', 'DC only, sensitif short circuit', 'Servo drive, inverter, counter high-speed'],
                ['Triac', 'Thyristor AC', 'Cocok beban AC, cepat', 'AC only, bisa ada heat', 'Heater, lampu AC, motor kecil AC'],
              ],
            },
            {
              type: 'tip',
              body: 'Untuk kontrol motor via inverter (Variable Speed Drive), SELALU gunakan output transistor, bukan relay. Relay terlalu lambat untuk sinyal PWM dan frekuensi tinggi yang dibutuhkan inverter.',
            },
          ],
        },
      ],
    },

    // ── MODUL 2.2 ─────────────────────────────────────────
    {
      id: 'L2-M2',
      levelId: 'level-2',
      order: 2,
      title: 'Analog Input & Output',
      description: 'Sinyal 4–20mA dan 0–10V, scaling, dan koneksi sensor analog.',
      estimatedMinutes: 30,
      thumbnail: '/assets/thumbnails/l2m2-analog.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Apa Itu Sinyal Analog?',
          content: [
            {
              type: 'text',
              body: 'Berbeda dengan sinyal digital (hanya 0 atau 1), sinyal analog merepresentasikan nilai kontinu — seperti suhu 25.7°C, tekanan 3.4 bar, atau level 67.3%. PLC mengkonversi sinyal analog menjadi nilai integer via ADC (Analog-to-Digital Converter) di modul AI.',
            },
            {
              type: 'table',
              caption: 'Standar sinyal analog yang umum di industri',
              rows: [
                ['Standar', 'Range', 'Keunggulan', 'Catatan'],
                ['Current 4–20mA', '4mA = 0%, 20mA = 100%', 'Tahan noise, bisa kabel panjang (1km+)', 'Paling umum di industri proses'],
                ['Voltage 0–10V', '0V = 0%, 10V = 100%', 'Sederhana, tidak perlu loop power', 'Sensitif noise, kabel pendek (<10m)'],
                ['Voltage 0–5V', '0V = 0%, 5V = 100%', 'Kompatibel TTL', 'Jarang, hanya sensor tertentu'],
                ['Voltage ±10V', '-10V = -100%, +10V = +100%', 'Untuk sinyal bipolar', 'Motion control, torque reference'],
                ['Resistance (RTD)', '100Ω (0°C) – 138.5Ω (100°C)', 'Akurat untuk suhu', 'Butuh modul khusus RTD'],
                ['Thermocouple', 'mV sesuai jenis (K, J, T)', 'Range suhu sangat lebar', 'Butuh modul khusus TC + cold junction'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Mengapa 4mA, Bukan 0mA?',
          content: [
            {
              type: 'text',
              body: 'Standar 4–20mA sengaja menggunakan 4mA sebagai nilai minimum (bukan 0mA) karena dua alasan penting:',
            },
            {
              type: 'text',
              body: '1. DETEKSI KABEL PUTUS: Jika kabel sensor putus, arus akan menjadi 0mA — PLC dapat membedakan kondisi "sensor membaca nilai 0%" (4mA) dari "kabel putus" (0mA). Ini sangat penting untuk safety.',
            },
            {
              type: 'text',
              body: '2. POWER SENSOR: Arus 4mA minimum digunakan untuk memberi daya pada sensor (2-wire sensor) tanpa memerlukan kabel power terpisah. Sensor aktif memodulasi arus antara 4–20mA sesuai nilai yang diukur.',
            },
            {
              type: 'tip',
              body: 'Di program PLC, selalu tambahkan logika pengecekan: jika nilai AI < 4mA (dalam raw count), aktifkan alarm "WIRE BREAK" atau "SENSOR FAULT". Ini praktik engineering yang wajib pada sistem kritis.',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Scaling Analog — Konversi Raw Count ke Engineering Unit',
          content: [
            {
              type: 'text',
              body: 'Modul AI PLC mengkonversi sinyal analog ke nilai integer (raw count). Untuk mendapatkan nilai engineering (misal: °C, bar, %), kita harus melakukan scaling menggunakan rumus linear.',
            },
            {
              type: 'formula',
              body: 'EU = EU_min + (Raw - Raw_min) × (EU_max - EU_min) / (Raw_max - Raw_min)',
              caption: 'Rumus scaling universal untuk konversi raw count ke engineering unit',
            },
            {
              type: 'table',
              caption: 'Nilai raw count standar tiap merk PLC untuk input 4–20mA',
              rows: [
                ['Merk PLC', 'Raw pada 4mA', 'Raw pada 20mA', 'Resolusi'],
                ['Siemens S7-1200', '0', '27648', '16-bit efektif ~14-bit'],
                ['Mitsubishi FX3U', '0', '4000', '12-bit'],
                ['Schneider M221', '0', '10000', 'Lebih mudah dihitung'],
                ['Omron CP1L', '0', '4095', '12-bit'],
              ],
            },
            {
              type: 'text',
              body: 'Contoh: Sensor suhu 0–100°C dengan output 4–20mA, terhubung ke Siemens S7-1200. Raw count saat ini = 13824. Suhu = 0 + (13824 - 0) × (100 - 0) / (27648 - 0) = 50°C.',
            },
          ],
        },
      ],
    },

    // ── MODUL 2.3 ─────────────────────────────────────────
    {
      id: 'L2-M3',
      levelId: 'level-2',
      order: 3,
      title: 'Addressing & Memori PLC',
      description: 'Sistem alamat bit, byte, word pada PLC dan jenis-jenis memori.',
      estimatedMinutes: 20,
      thumbnail: '/assets/thumbnails/l2m3-addressing.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Sistem Addressing PLC',
          content: [
            {
              type: 'text',
              body: 'Setiap titik I/O dan area memori PLC memiliki alamat unik. Format addressing berbeda antar merk, tapi konsepnya sama: identifikasi AREA memori + lokasi BIT/BYTE/WORD.',
            },
            {
              type: 'table',
              caption: 'Format addressing Siemens S7 (paling umum dipelajari)',
              rows: [
                ['Area', 'Prefix', 'Contoh Bit', 'Contoh Byte', 'Keterangan'],
                ['Input Image', 'I (atau E)', 'I0.0, I1.5', 'IB0, IW0', 'Status input fisik saat ini'],
                ['Output Image', 'Q (atau A)', 'Q0.0, Q2.3', 'QB0, QW0', 'Status output yang akan dikirim'],
                ['Memory (Merker)', 'M', 'M0.0, M10.7', 'MB5, MW10', 'Variabel internal, tidak ada fisik'],
                ['Timer', 'T', 'T1, T20', '—', 'Nilai dan status timer'],
                ['Counter', 'C', 'C1, C10', '—', 'Nilai dan status counter'],
                ['Data Block', 'DB', 'DB1.DBX0.0', 'DB1.DBB0', 'Penyimpanan data terstruktur'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Bit, Byte, Word, Double Word',
          content: [
            {
              type: 'text',
              body: 'PLC bekerja dengan data dalam berbagai ukuran. Penting untuk memahami hubungan antar ukuran ini, terutama saat mengakses nilai analog atau melakukan operasi data.',
            },
            {
              type: 'table',
              caption: 'Ukuran data dalam PLC',
              rows: [
                ['Ukuran', 'Bits', 'Range Nilai', 'Contoh Penggunaan'],
                ['Bit (Bool)', '1', 'TRUE / FALSE (0 atau 1)', 'Status tombol, status coil, flag'],
                ['Byte', '8', '0 – 255 (unsigned)', 'Status 8 I/O sekaligus'],
                ['Word (INT)', '16', '-32768 – 32767 (signed)', 'Nilai analog, posisi, counter besar'],
                ['Word (UINT)', '16', '0 – 65535 (unsigned)', 'Nilai analog unsigned'],
                ['DWord (DINT)', '32', '-2.1M – 2.1M (signed)', 'Posisi encoder high-res, timestamp'],
                ['Real (FLOAT)', '32', '±3.4 × 10³⁸', 'Perhitungan engineering: PID, scaling'],
              ],
            },
            {
              type: 'warning',
              body: 'Addressing bit menggunakan format: AREA + Byte Number + "." + Bit Number. Contoh: I0.5 = Input Image, Byte 0, Bit 5. Bit dihitung 0–7 dari kanan (LSB = bit 0). Salah membaca alamat adalah sumber bug yang paling umum!',
            },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// LEVEL 3 — INSTRUKSI LADDER
// ============================================================

const level3: LearningLevel = {
  id: 'level-3',
  order: 3,
  title: 'Instruksi Dasar',
  subtitle: 'Ladder Logic: kontak, koil, timer, counter, dan logika kombinasi',
  color: 'amber',
  icon: 'GitBranch',
  modules: [

    // ── MODUL 3.1 ─────────────────────────────────────────
    {
      id: 'L3-M1',
      levelId: 'level-3',
      order: 1,
      title: 'Kontak & Koil Dasar',
      description: 'Instruksi LD, LDI, OUT — fondasi pemrograman Ladder Logic.',
      estimatedMinutes: 25,
      thumbnail: '/assets/thumbnails/l3m1-contacts.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Anatomi Ladder Diagram',
          content: [
            {
              type: 'text',
              body: 'Ladder Diagram (LD) adalah bahasa pemrograman PLC yang tampilannya menyerupai diagram relay konvensional. Namanya berasal dari bentuk "tangga" (ladder) yang terbentuk dari dua rail vertikal (power rail) dan rung-rung horizontal di antaranya.',
            },
            {
              type: 'text',
              body: 'Setiap RUNG adalah satu pernyataan logika yang dievaluasi dari kiri ke kanan. Jika kondisi di sisi kiri (input) menghasilkan aliran "daya" logika, maka koil (output) di sisi kanan akan diaktifkan.',
            },
            {
              type: 'table',
              caption: 'Simbol dasar Ladder Diagram dan artinya',
              rows: [
                ['Simbol', 'Nama', 'Instruksi', 'Kondisi Aktif'],
                ['—[ ]—', 'Normally Open Contact', 'LD (Load)', 'TRUE saat bit alamat = 1 (ON)'],
                ['—[/]—', 'Normally Closed Contact', 'LDI (Load Inverse)', 'TRUE saat bit alamat = 0 (OFF)'],
                ['—( )—', 'Output Coil', 'OUT', 'Mengaktifkan bit alamat = 1 saat rung TRUE'],
                ['—(S)—', 'Set Coil', 'SET', 'Mengunci bit ON, tetap ON meski kondisi hilang'],
                ['—(R)—', 'Reset Coil', 'RST / RES', 'Mematikan bit yang sebelumnya di-SET'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Instruksi LD dan LDI',
          content: [
            {
              type: 'text',
              body: 'LD (Load) adalah instruksi pertama dalam rung yang mengambil status bit dari memori. Hasilnya TRUE jika bit tersebut bernilai 1 (ON). Instruksi LDI (Load Inverse) adalah kebalikannya — TRUE jika bit bernilai 0 (OFF).',
            },
            {
              type: 'code',
              body: `// Contoh program: Motor ON jika START ditekan dan STOP tidak ditekan
// Rung 1: Kontrol Motor
LD   I0.0    // Baca tombol START (Normally Open)
AND  M0.0    // AND dengan self-holding contact (latch)
ANI  I0.1    // AND NOT tombol STOP (Normally Closed di ladder)
OUT  Q0.0    // Aktifkan kontaktor motor

// Rung 2: Self-holding (latching)
LD   Q0.0    // Baca status output motor
OUT  M0.0    // Simpan ke memori sebagai latch`,
              caption: 'Contoh program START-STOP motor dengan self-holding',
            },
            {
              type: 'tip',
              body: 'Self-holding (latch) adalah pola paling fundamental di ladder logic. Motor akan tetap ON meski tombol START dilepas, karena M0.0 "mengunci" kondisi ON via loop balik. Motor baru berhenti jika STOP ditekan (I0.1 = ON → ANI menjadi FALSE).',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Instruksi AND, OR, dan Kombinasinya',
          content: [
            {
              type: 'text',
              body: 'Kontak dalam satu rung bisa dirangkai secara seri (AND) atau paralel (OR). Kombinasi keduanya memungkinkan implementasi logika Boolean apa pun.',
            },
            {
              type: 'table',
              caption: 'Instruksi logika kombinasi',
              rows: [
                ['Instruksi', 'Simbol', 'Logika', 'Arti'],
                ['AND', 'Kontak seri', 'A AND B', 'Keduanya harus TRUE'],
                ['ANI', 'Kontak seri inverse', 'A AND NOT B', 'A TRUE dan B FALSE'],
                ['OR', 'Kontak paralel', 'A OR B', 'Salah satu TRUE sudah cukup'],
                ['ORI', 'Kontak paralel inverse', 'A OR NOT B', 'A TRUE atau B FALSE'],
                ['NOT', 'Inverse bit', 'NOT A', 'Membalik kondisi (TRUE→FALSE)'],
              ],
            },
            {
              type: 'code',
              body: `// Contoh: Alarm aktif jika SUHU TINGGI atau TEKANAN TINGGI,
// tapi hanya jika sistem sedang RUN dan BYPASS tidak aktif
LD   M_SUHU_TINGGI    // Suhu melebihi batas atas
OR   M_TEKANAN_TINGGI // ATAU tekanan melebihi batas
AND  M_SYSTEM_RUN     // DAN sistem sedang berjalan
ANI  M_BYPASS_ALARM   // DAN TIDAK dalam mode bypass
OUT  Q_ALARM_HORN     // Aktifkan sirene alarm`,
              caption: 'Contoh logika kombinasi AND/OR untuk sistem alarm',
            },
          ],
        },
      ],
    },

    // ── MODUL 3.2 ─────────────────────────────────────────
    {
      id: 'L3-M2',
      levelId: 'level-3',
      order: 2,
      title: 'Timer — TON, TOF, TP',
      description: 'Pemrograman timer on-delay, off-delay, dan pulse untuk kontrol berbasis waktu.',
      estimatedMinutes: 30,
      thumbnail: '/assets/thumbnails/l3m2-timer.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Tiga Jenis Timer PLC',
          content: [
            {
              type: 'text',
              body: 'Timer adalah instruksi PLC yang menghasilkan delay berbasis waktu. Ada tiga jenis timer yang perlu dikuasai sesuai standar IEC 61131-3:',
            },
            {
              type: 'table',
              caption: 'Perbandingan tiga jenis timer PLC (IEC 61131-3)',
              rows: [
                ['Jenis', 'Nama Lengkap', 'Cara Kerja', 'Aplikasi Umum'],
                ['TON', 'Timer On-Delay', 'Output ON setelah input ON selama waktu preset (PT). Reset saat input OFF', 'Delay start motor, cooling down, konfirmasi sinyal'],
                ['TOF', 'Timer Off-Delay', 'Output tetap ON selama waktu PT setelah input berubah OFF', 'Cooling fan setelah motor stop, flush valve'],
                ['TP', 'Timer Pulse', 'Output ON selama tepat waktu PT satu kali, tidak bisa diinterupsi', 'Pulse output, blinking, dosing pump'],
              ],
            },
            {
              type: 'tip',
              body: 'Ingat dengan cara ini: TON = "Tunggu dulu sebelum ON", TOF = "Tunggu dulu sebelum OFF", TP = "ON selama waktu tertentu lalu matikan sendiri".',
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'TON — Timer On-Delay',
          content: [
            {
              type: 'text',
              body: 'TON adalah timer yang paling sering digunakan. Output (.Q) baru menjadi TRUE setelah input (.IN) terus-menerus TRUE selama waktu yang ditentukan di preset time (.PT). Jika input OFF sebelum waktu habis, timer mereset dan mulai dari 0 lagi.',
            },
            {
              type: 'code',
              body: `// TON: Motor conveyor baru jalan 3 detik setelah tombol START ditekan
// (Memberikan waktu bagi operator untuk menjauhi area berbahaya)

LD   I_START_BTN          // Input: Tombol START
TON  T_DELAY_START, 3000  // Timer: Preset = 3000ms (3 detik)
LD   T_DELAY_START.Q      // Baca output timer (TRUE setelah 3 detik)
OUT  Q_MOTOR_CONVEYOR     // Aktifkan motor conveyor`,
              caption: 'TON untuk delay safety sebelum motor conveyor aktif',
            },
            {
              type: 'text',
              body: 'Parameter timer yang penting: IN (input boolean), PT (preset time dalam milidetik), Q (output boolean), ET (elapsed time — waktu yang sudah berjalan dalam ms).',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'TOF dan TP — Off-Delay & Pulse',
          content: [
            {
              type: 'code',
              body: `// TOF: Kipas pendingin tetap jalan 60 detik setelah motor utama berhenti
LD   Q_MOTOR_UTAMA        // Input: Status motor utama
TOF  T_COOLING_FAN, 60000 // Off-Delay: 60 detik
LD   T_COOLING_FAN.Q      // Output timer
OUT  Q_FAN_MOTOR          // Kontrol kipas pendingin

// TP: Valve dosing ON selama tepat 2 detik setiap kali tombol ditekan
// (Meskipun tombol tetap ditekan, output hanya 2 detik)
LD   I_DOSE_BTN           // Input: Tombol dosis
TP   T_DOSE_PULSE, 2000   // Pulse: 2000ms
LD   T_DOSE_PULSE.Q       // Output timer
OUT  Q_DOSE_VALVE         // Valve dosis`,
              caption: 'Contoh penggunaan TOF (cooling fan) dan TP (dosing valve)',
            },
            {
              type: 'warning',
              body: 'Pada TP (Pulse Timer): selama timer berjalan, perubahan input TIDAK mempengaruhi output. Output akan ON selama tepat waktu PT, lalu OFF — tidak peduli apakah input masih ON atau sudah OFF. Ini berbeda dengan TON yang akan reset jika input OFF.',
            },
          ],
        },
      ],
    },

    // ── MODUL 3.3 ─────────────────────────────────────────
    {
      id: 'L3-M3',
      levelId: 'level-3',
      order: 3,
      title: 'Counter — CTU, CTD, CTUD',
      description: 'Menghitung event dengan counter naik, turun, dan kombinasi.',
      estimatedMinutes: 25,
      thumbnail: '/assets/thumbnails/l3m3-counter.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Fungsi Counter di PLC',
          content: [
            {
              type: 'text',
              body: 'Counter digunakan untuk menghitung jumlah kejadian (pulsa, rising edge). Setiap kali input counter berpindah dari FALSE ke TRUE (rising edge), nilai counter bertambah atau berkurang satu.',
            },
            {
              type: 'table',
              caption: 'Tiga jenis counter IEC 61131-3',
              rows: [
                ['Jenis', 'Kepanjangan', 'Fungsi', 'Aplikasi'],
                ['CTU', 'Count Up', 'Menghitung naik dari 0 hingga preset (PV), output Q = TRUE saat CV ≥ PV', 'Hitung produk, hitung botol, hitung siklus mesin'],
                ['CTD', 'Count Down', 'Menghitung turun dari preset ke 0, output Q = TRUE saat CV ≤ 0', 'Batch production: hitung sisa produk yang harus dibuat'],
                ['CTUD', 'Count Up Down', 'Gabungan: dua input (CU untuk naik, CD untuk turun)', 'Stock management, posisi stepper motor sederhana'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'CTU — Counter Up: Contoh Praktis',
          content: [
            {
              type: 'code',
              body: `// CTU: Hitung botol yang lewat sensor, setiap 100 botol aktifkan alarm
// dan hentikan conveyor untuk ganti palet

// Rung 1: Counter botol
LD   I_SENSOR_BOTOL     // Proximity sensor mendeteksi botol
CTU  C_BOTOL, 100       // Count Up, preset = 100 botol
//   C_BOTOL.CV = nilai saat ini
//   C_BOTOL.Q  = TRUE saat CV ≥ 100

// Rung 2: Saat sudah 100 botol, hentikan conveyor dan nyalakan alarm
LD   C_BOTOL.Q          // Output counter (TRUE saat ≥ 100 botol)
OUT  Q_STOP_CONVEYOR    // Stop conveyor
OUT  Q_ALARM_GANTI_PALET // Nyalakan lampu ganti palet

// Rung 3: Tombol RESET mereset counter setelah palet diganti
LD   I_RESET_BTN
RST  C_BOTOL            // Reset counter ke 0`,
              caption: 'CTU untuk menghitung 100 botol, lalu stop conveyor dan minta ganti palet',
            },
            {
              type: 'tip',
              body: 'Counter TIDAK memiliki reset otomatis seperti timer. Counter harus di-RESET secara eksplisit oleh program atau oleh operator. Jangan lupa sertakan logika reset, atau counter tidak akan bisa digunakan ulang!',
            },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// LEVEL 4 — LANJUTAN
// ============================================================

const level4: LearningLevel = {
  id: 'level-4',
  order: 4,
  title: 'Lanjutan',
  subtitle: 'Analog scaling, operasi data, fungsi matematika, dan praktik terbaik',
  color: 'purple',
  icon: 'Zap',
  modules: [

    // ── MODUL 4.1 ─────────────────────────────────────────
    {
      id: 'L4-M1',
      levelId: 'level-4',
      order: 1,
      title: 'Analog Scaling Lanjutan',
      description: 'Implementasi rumus scaling, dead band, dan engineering unit conversion.',
      estimatedMinutes: 35,
      thumbnail: '/assets/thumbnails/l4m1-scaling.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Scaling dengan Blok SCALE / NORM_X',
          content: [
            {
              type: 'text',
              body: 'Selain rumus manual, PLC modern menyediakan function block khusus untuk scaling. Siemens S7-1200 menyediakan NORM_X (normalisasi ke 0.0–1.0) dan SCALE_X (konversi ke engineering unit).',
            },
            {
              type: 'code',
              body: `// Siemens S7-1200: Scaling sensor tekanan 0–10 bar (4–20mA)
// Step 1: Normalisasi raw count ke nilai 0.0 – 1.0
NORM_X
  MIN := 0        // Nilai raw pada 4mA
  MAX := 27648    // Nilai raw pada 20mA
  VALUE := IW64   // Nilai raw dari modul AI channel 0
  OUT => MD10     // Hasil: 0.0 (4mA) hingga 1.0 (20mA)

// Step 2: Scale ke engineering unit 0.0 – 10.0 bar
SCALE_X
  MIN := 0.0      // 0 bar
  MAX := 10.0     // 10 bar
  VALUE := MD10   // Input dari NORM_X
  OUT => MD20     // Hasil: nilai tekanan dalam bar (REAL)

// MD20 sekarang berisi nilai tekanan aktual, misal: 4.75 bar`,
              caption: 'Scaling bertahap menggunakan NORM_X dan SCALE_X (Siemens TIA Portal)',
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Dead Band dan Hysteresis',
          content: [
            {
              type: 'text',
              body: 'Dalam kontrol level atau suhu, sinyal analog sering "bergetar" di sekitar setpoint karena noise. Tanpa hysteresis, output akan ON/OFF berkali-kali dalam sedetik — merusak aktuator dan menciptakan osilasi.',
            },
            {
              type: 'text',
              body: 'Hysteresis (dead band) menyelesaikan ini dengan menggunakan dua threshold: ON threshold lebih tinggi dari OFF threshold. Selisih antara keduanya adalah "dead band".',
            },
            {
              type: 'code',
              body: `// Kontrol heater dengan hysteresis ±2°C di setpoint 60°C
// Heater ON saat suhu < 58°C, OFF saat suhu > 62°C

LD   M_HEATER_ON               // Heater sedang ON?
AND  LT MD_TEMP_ACTUAL, 62.0   // Tetap ON selama suhu < 62°C (upper)
OR                             // --- parallel branch ---
LT   MD_TEMP_ACTUAL, 58.0      // Nyalakan heater jika suhu < 58°C (lower)
OUT  M_HEATER_ON               // Update status heater
LD   M_HEATER_ON
OUT  Q_HEATER_RELAY            // Kontrol relay heater fisik`,
              caption: 'Implementasi hysteresis untuk kontrol suhu — mencegah chattering relay',
            },
            {
              type: 'tip',
              body: 'Dead band yang baik = ±1–5% dari range full scale. Terlalu kecil = chattering. Terlalu besar = kontrol kasar dan energi boros. Untuk PID control yang sesungguhnya, gunakan function block PID bawaan PLC.',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Wire Break Detection & Sensor Fault Alarm',
          content: [
            {
              type: 'code',
              body: `// Deteksi wire break dan out-of-range pada input analog 4–20mA
// Siemens S7-1200: Raw count 0 = 4mA, 27648 = 20mA

// Rung 1: Wire break detection (arus < 4mA = nilai raw < 0)
LT   IW64, 0              // Raw count < 0 (arus < 4mA)
OUT  M_WIRE_BREAK         // Flag wire break

// Rung 2: Overrange detection (arus > 20mA = nilai raw > 27648)
GT   IW64, 27648          // Raw count > 27648 (arus > 20mA)
OUT  M_SENSOR_OVERRANGE   // Flag overrange

// Rung 3: Sensor fault = wire break ATAU overrange
LD   M_WIRE_BREAK
OR   M_SENSOR_OVERRANGE
OUT  Q_SENSOR_FAULT_ALARM // Aktifkan alarm sensor fault
OUT  M_BLOCK_CONTROL      // Blokir output kontrol (safety!)`,
              caption: 'Deteksi wire break dan overrange — praktik wajib di sistem kritis',
            },
          ],
        },
      ],
    },

    // ── MODUL 4.2 ─────────────────────────────────────────
    {
      id: 'L4-M2',
      levelId: 'level-4',
      order: 2,
      title: 'Operasi Data: MOV, MOVE, Komparasi',
      description: 'Memindahkan data antar register, operasi matematika, dan fungsi komparasi.',
      estimatedMinutes: 30,
      thumbnail: '/assets/thumbnails/l4m2-data.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Instruksi MOVE — Memindahkan Data',
          content: [
            {
              type: 'text',
              body: 'Instruksi MOVE (atau MOV pada merk tertentu) memindahkan nilai dari satu lokasi memori ke lokasi lain. Ini adalah operasi data paling fundamental yang digunakan untuk inisialisasi nilai, penyimpanan setpoint, dan transfer data antar area memori.',
            },
            {
              type: 'table',
              caption: 'Instruksi MOVE di berbagai merk PLC',
              rows: [
                ['Merk', 'Instruksi', 'Contoh', 'Keterangan'],
                ['Siemens S7', 'MOVE', 'MOVE IN:=100 OUT=>MW50', 'Copy nilai integer 100 ke MW50'],
                ['Mitsubishi', 'MOV', 'MOV K100 D0', 'Copy konstanta 100 ke register D0'],
                ['Omron', 'MOV', 'MOV #0064 D100', 'Copy hex 0064 (=100) ke D100'],
                ['Schneider', 'MOVE (ST)', 'D0 := 100;', 'Structured Text, assignment langsung'],
              ],
            },
            {
              type: 'code',
              body: `// Contoh: Simpan setpoint speed dari HMI ke register kerja
// dan inisialisasi nilai default saat pertama kali power ON

// Rung 1: First scan (hanya eksekusi sekali saat PLC baru ON)
LD   M_FIRST_SCAN         // Bit yang TRUE hanya di scan pertama
MOVE IN:=1500 OUT=>MW_SETPOINT_DEFAULT  // Set default: 1500 RPM
MOVE IN:=60   OUT=>MW_TEMP_SETPOINT     // Set default suhu: 60°C

// Rung 2: Copy setpoint dari HMI ke kontrol setiap scan
LD   M1.0                 // Selalu TRUE (atau gunakan always-on bit)
MOVE IN:=MW_HMI_SPEED_SP OUT=>MW_SPEED_SP_AKTIF`,
              caption: 'Menggunakan MOVE untuk inisialisasi dan transfer setpoint dari HMI',
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Instruksi Komparasi',
          content: [
            {
              type: 'text',
              body: 'Instruksi komparasi membandingkan dua nilai dan menghasilkan kondisi TRUE/FALSE yang bisa digunakan dalam logika ladder. Digunakan untuk threshold alarm, batas kontrol, dan kondisi sekuens.',
            },
            {
              type: 'table',
              caption: 'Instruksi komparasi dan simbolnya',
              rows: [
                ['Instruksi', 'Simbol', 'Kondisi TRUE', 'Contoh Penggunaan'],
                ['EQ (Equal)', '= =', 'A sama dengan B', 'Mode selector, status check'],
                ['NE (Not Equal)', '<>', 'A tidak sama dengan B', 'Deteksi perubahan nilai'],
                ['GT (Greater Than)', '>', 'A lebih besar dari B', 'Alarm suhu tinggi, overload'],
                ['GE (Greater or Equal)', '>=', 'A ≥ B', 'Batas atas setpoint'],
                ['LT (Less Than)', '<', 'A lebih kecil dari B', 'Alarm level rendah, underflow'],
                ['LE (Less or Equal)', '<=', 'A ≤ B', 'Batas bawah setpoint'],
              ],
            },
            {
              type: 'code',
              body: `// Contoh sistem alarm berlapis dengan komparasi
// Level tangki: 0–100% dari sensor analog

// Warning: Level < 20% (low level warning)
LT   MD_LEVEL_PERSEN, 20.0    // Kondisi: level < 20%
OUT  Q_LAMP_WARNING           // Nyalakan lampu kuning

// Alarm: Level < 10% (low level alarm — stop proses)
LT   MD_LEVEL_PERSEN, 10.0    // Kondisi: level < 10%
OUT  Q_ALARM_HORN             // Sirene alarm
OUT  M_STOP_PROCESS           // Stop proses otomatis

// High level: Level > 90% (overfill protection)
GT   MD_LEVEL_PERSEN, 90.0    // Kondisi: level > 90%
OUT  Q_CLOSE_INLET_VALVE      // Tutup valve inlet`,
              caption: 'Sistem alarm berlapis menggunakan komparasi nilai analog level tangki',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Operasi Matematika Dasar',
          content: [
            {
              type: 'text',
              body: 'PLC mendukung operasi aritmatika: penjumlahan (ADD), pengurangan (SUB), perkalian (MUL), dan pembagian (DIV). Untuk nilai real (float), gunakan tipe data REAL agar hasilnya akurat.',
            },
            {
              type: 'code',
              body: `// Menghitung efisiensi produksi: (Aktual / Target) × 100
// Semua nilai dalam REAL untuk akurasi desimal

// Rung 1: Hitung efisiensi
DIV  IN1:=MD_PRODUK_AKTUAL IN2:=MD_TARGET_PRODUK OUT=>MD_RASIO
MUL  IN1:=MD_RASIO IN2:=100.0 OUT=>MD_EFISIENSI_PERSEN

// Rung 2: Hitung daya (Watt) dari tegangan dan arus
MUL  IN1:=MD_VOLTAGE IN2:=MD_CURRENT OUT=>MD_DAYA_WATT

// Rung 3: Konversi suhu Celsius ke Fahrenheit
// F = (C × 9/5) + 32
MUL  IN1:=MD_TEMP_C IN2:=1.8 OUT=>MD_TEMP_TEMP
ADD  IN1:=MD_TEMP_TEMP IN2:=32.0 OUT=>MD_TEMP_F`,
              caption: 'Contoh operasi matematika: efisiensi produksi, daya, dan konversi suhu',
            },
            {
              type: 'warning',
              body: 'SELALU periksa pembagi tidak sama dengan 0 sebelum instruksi DIV! Pembagian dengan 0 akan menyebabkan CPU fault dan PLC berhenti. Tambahkan rung: "jika MD_TARGET = 0, maka skip perhitungan atau set nilai = 0".',
            },
          ],
        },
      ],
    },

    // ── MODUL 4.3 ─────────────────────────────────────────
    {
      id: 'L4-M3',
      levelId: 'level-4',
      order: 3,
      title: 'Praktik Terbaik & Troubleshooting',
      description: 'Standar penulisan program, dokumentasi, dan teknik debug PLC.',
      estimatedMinutes: 30,
      thumbnail: '/assets/thumbnails/l4m3-best-practice.png',
      pages: [
        {
          pageNumber: 1,
          title: 'Standar Penulisan Program PLC',
          content: [
            {
              type: 'text',
              body: 'Program PLC yang baik bukan hanya yang benar secara logika, tetapi juga mudah dibaca, dirawat, dan didebug oleh teknisi lain — bahkan 5 tahun kemudian. Berikut standar yang harus diikuti:',
            },
            {
              type: 'table',
              caption: 'Checklist standar program PLC profesional',
              rows: [
                ['Aspek', 'Standar yang Direkomendasikan'],
                ['Penamaan alamat', 'Gunakan symbolic name, bukan alamat raw. I0.0 → START_BTN_1, Q0.0 → MOTOR_1_FWD'],
                ['Komentar rung', 'Setiap rung harus punya komentar 1–2 kalimat yang menjelaskan TUJUAN, bukan cara kerjanya'],
                ['Struktur program', 'Kelompokkan rung per fungsi: Safety Interlock, Sequence Control, Alarm, Output'],
                ['Konvensi nama', 'Konsisten: PREFIX_NAMA_SUFFIX. Misal: DI_SENSOR_LEVEL_HIGH, DO_PUMP_1_MOTOR'],
                ['Versi & tanggal', 'Simpan versi program dengan format: v1.0 — YYYY-MM-DD — Nama teknisi — Deskripsi perubahan'],
                ['Backup', 'Simpan backup program SETIAP kali ada perubahan, sebelum dan sesudah modifikasi'],
              ],
            },
          ],
        },
        {
          pageNumber: 2,
          title: 'Teknik Troubleshooting PLC',
          content: [
            {
              type: 'text',
              body: 'Troubleshooting PLC adalah skill kritis yang membedakan teknisi junior dan senior. Pendekatan sistematis menghemat waktu dan mencegah salah diagnosis.',
            },
            {
              type: 'table',
              caption: 'Langkah sistematis troubleshooting PLC',
              rows: [
                ['Langkah', 'Tindakan', 'Tools'],
                ['1. Cek status PLC', 'LED indicator: RUN=hijau, ERROR=merah, MAINT=kuning', 'Visual'],
                ['2. Cek error code', 'Baca kode error di CPU atau software HMI', 'Software PLC / HMI'],
                ['3. Online monitoring', 'Hubungkan laptop, monitor status rung secara live', 'TIA Portal / GX Works'],
                ['4. Force I/O test', 'Force input ON/OFF untuk isolasi masalah: hardware atau software', 'Software PLC'],
                ['5. Cek wiring fisik', 'Voltage test di terminal I/O: tegangan benar? Kabel tidak putus?', 'Multimeter'],
                ['6. Cek power supply', 'Tegangan PSU: 24VDC stabil? Ada ripple berlebihan?', 'Multimeter / osciloscope'],
                ['7. Swap modul', 'Jika modul dicurigai rusak, coba swap dengan modul spare', 'Spare parts'],
              ],
            },
            {
              type: 'tip',
              body: 'Selalu mulai troubleshooting dari hardware (cek LED, ukur tegangan) sebelum melihat ke program software. 70% masalah lapangan adalah masalah wiring atau power supply — bukan bug program.',
            },
          ],
        },
        {
          pageNumber: 3,
          title: 'Safety Interlock — Prinsip dan Implementasi',
          content: [
            {
              type: 'text',
              body: 'Safety interlock adalah kondisi pengaman yang HARUS dipenuhi sebelum mesin bisa beroperasi. Interlock melindungi manusia, mesin, dan proses dari kondisi berbahaya.',
            },
            {
              type: 'code',
              body: `// Contoh: Motor hanya bisa jalan jika SEMUA kondisi safety terpenuhi
// Prinsip: De-energize to trip (aman dalam kondisi power off)

// Rung Safety Interlock (urutan wajib di awal program):
LD   I_EMERGENCY_STOP_OK   // E-Stop tidak ditekan (NC contact = ON saat normal)
AND  I_GUARD_DOOR_CLOSED   // Pintu pengaman tertutup
AND  I_OVERLOAD_OK         // Thermal overload tidak trip
AND  I_PHASE_OK            // Phase monitoring OK
AND  M_SYSTEM_NO_FAULT     // Tidak ada fault aktif
OUT  M_SAFETY_OK           // Gate: semua interlock OK

// Semua kontrol motor hanya aktif jika M_SAFETY_OK = TRUE
LD   M_SAFETY_OK
AND  M_MOTOR_1_CMD         // Command motor dari logic kontrol
OUT  Q_MOTOR_1_MAIN        // Output ke kontaktor motor`,
              caption: 'Implementasi safety interlock — selalu di awal program, sebelum logika kontrol lainnya',
            },
            {
              type: 'warning',
              body: 'Emergency Stop HARUS selalu menggunakan kontak Normally Closed (NC) yang dirangkai seri. Filosofinya: kabel putus = E-Stop aktif (AMAN). Jangan pernah menggunakan E-Stop dengan kontak NO — jika kabel putus, sistem tidak akan berhenti saat darurat!',
            },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// EXPORT UTAMA
// ============================================================

export const LEARNING_LEVELS: LearningLevel[] = [
  level1,
  level2,
  level3,
  level4,
];

// Helper: ambil semua modul dari semua level (flat array)
export const ALL_MODULES: LearningModule[] = LEARNING_LEVELS.flatMap(
  (level) => level.modules
);

// Helper: cari modul berdasarkan ID
export const getModuleById = (id: string): LearningModule | undefined =>
  ALL_MODULES.find((m) => m.id === id);

// Helper: ambil modul dalam satu level, urut
export const getModulesByLevel = (levelId: string): LearningModule[] =>
  ALL_MODULES
    .filter((m) => m.levelId === levelId)
    .sort((a, b) => a.order - b.order);

// Helper: hitung total halaman semua modul
export const getTotalPages = (): number =>
  ALL_MODULES.reduce((sum, m) => sum + m.pages.length, 0);

// Helper: hitung total estimasi menit semua konten
export const getTotalMinutes = (): number =>
  ALL_MODULES.reduce((sum, m) => sum + m.estimatedMinutes, 0);

/*
 * STATISTIK KONTEN:
 * ─────────────────────────────────────────
 * Level 1 — Dasar     : 3 modul, 8 halaman, ~65 menit
 * Level 2 — I/O       : 3 modul, 9 halaman, ~75 menit
 * Level 3 — Instruksi : 3 modul, 8 halaman, ~80 menit
 * Level 4 — Lanjutan  : 3 modul, 9 halaman, ~95 menit
 * ─────────────────────────────────────────
 * TOTAL: 12 modul, 34 halaman konten, ~315 menit (~5.25 jam)
 * ─────────────────────────────────────────
 */
