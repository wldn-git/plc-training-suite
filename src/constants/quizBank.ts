import type { QuizQuestion } from '@/types/assessment.types';

// ============================================================
// Bank Soal Quiz — PLC Training Suite
// Struktur: 4 Level (Kategori), 12 soal per level, 48 soal total
// ============================================================

export const QUIZ_BANK: QuizQuestion[] = [
  // ============================================================
  // LEVEL 1 — DASAR PLC (12 Soal)
  // ============================================================
  {
    id: 'L1-Q01',
    category: 1,
    difficulty: 'mudah',
    question: 'Kepanjangan dari PLC adalah...',
    options: [
      'Programmable Logic Controller',
      'Programmable Line Computer',
      'Process Logic Control',
      'Programmable Load Controller',
    ],
    correctIndex: 0,
    explanation:
      'PLC adalah singkatan dari Programmable Logic Controller — komputer industri yang dirancang untuk mengontrol proses otomasi. Dikembangkan pertama kali tahun 1968 oleh Dick Morley dari Modicon.',
    moduleRef: 'L1-M1',
  },
  {
    id: 'L1-Q02',
    category: 1,
    difficulty: 'mudah',
    question: 'Apa keunggulan utama PLC dibandingkan sistem relay konvensional?',
    options: [
      'PLC lebih murah untuk instalasi awal',
      'Logika kontrol dapat diubah cukup dengan modifikasi program software tanpa rewiring',
      'PLC tidak membutuhkan sumber daya listrik',
      'Relay konvensional tidak bisa digunakan untuk sistem ON/OFF',
    ],
    correctIndex: 1,
    explanation:
      'Keunggulan terbesar PLC adalah fleksibilitas: mengubah logika kontrol cukup dengan memodifikasi program di software, tanpa perlu rewiring fisik seperti pada panel relay konvensional. Ini menghemat waktu dan biaya saat ada perubahan proses.',
    moduleRef: 'L1-M1',
  },
  {
    id: 'L1-Q03',
    category: 1,
    difficulty: 'mudah',
    question: 'Komponen PLC yang berfungsi sebagai "otak" — memproses program dan menjalankan scan cycle — adalah...',
    options: [
      'Modul Input Digital',
      'Power Supply Unit (PSU)',
      'CPU (Central Processing Unit)',
      'Modul Komunikasi',
    ],
    correctIndex: 2,
    explanation:
      'CPU adalah komponen terpenting PLC. CPU menyimpan program di memori non-volatile, menjalankan scan cycle secara berulang, dan mengkoordinasikan semua modul lainnya. Tanpa CPU, PLC tidak bisa berfungsi.',
    moduleRef: 'L1-M2',
  },
  {
    id: 'L1-Q04',
    category: 1,
    difficulty: 'mudah',
    question: 'Urutan tahap dalam satu Scan Cycle PLC yang benar adalah...',
    options: [
      'Execute Program → Read Inputs → Write Outputs',
      'Write Outputs → Read Inputs → Execute Program',
      'Read Inputs → Execute Program → Write Outputs',
      'Read Inputs → Write Outputs → Execute Program',
    ],
    correctIndex: 2,
    explanation:
      'Scan cycle PLC selalu berurutan: (1) Read Inputs — membaca semua status input ke memori image, (2) Execute Program — memproses ladder dari atas ke bawah menggunakan nilai input image, (3) Write Outputs — menulis hasil ke modul output fisik. Urutan ini berulang terus selama PLC dalam mode RUN.',
    moduleRef: 'L1-M3',
  },
  {
    id: 'L1-Q05',
    category: 1,
    difficulty: 'mudah',
    question: 'Modul apa yang digunakan untuk membaca sinyal ON/OFF dari tombol push button dan limit switch?',
    options: [
      'Modul Output Analog (AO)',
      'Modul Input Digital (DI)',
      'Modul Input Analog (AI)',
      'Modul Komunikasi Profibus',
    ],
    correctIndex: 1,
    explanation:
      'Tombol push button dan limit switch menghasilkan sinyal diskrit ON/OFF (digital). Sinyal ini dibaca oleh Modul Input Digital (DI). Modul DI mengkonversi level tegangan (misalnya 0V/24VDC) menjadi bit 0 atau 1 di memori PLC.',
    moduleRef: 'L1-M2',
  },
  {
    id: 'L1-Q06',
    category: 1,
    difficulty: 'sedang',
    question: 'Scan time PLC adalah 10ms. Sebuah sinyal input berubah dari OFF ke ON selama 6ms, lalu kembali OFF. Apa yang terjadi?',
    options: [
      'PLC pasti mendeteksi perubahan sinyal tersebut',
      'PLC tidak akan mendeteksi sinyal tersebut jika perubahan terjadi di tengah fase Execute atau Write',
      'PLC akan crash karena sinyal terlalu cepat',
      'PLC otomatis memperpendek scan time menjadi 6ms',
    ],
    correctIndex: 1,
    explanation:
      'PLC hanya membaca input di fase "Read Inputs" setiap scan cycle. Jika sinyal 6ms muncul dan hilang di luar jendela Read Inputs (saat fase Execute atau Write berlangsung), PLC tidak akan mendeteksinya. Untuk sinyal singkat, gunakan hardware interrupt atau pastikan durasi sinyal minimal 2× scan time.',
    moduleRef: 'L1-M3',
  },
  {
    id: 'L1-Q07',
    category: 1,
    difficulty: 'sedang',
    question: 'Mengapa relay masih tetap digunakan sebagai safety interlock (Emergency Stop) meskipun PLC sudah tersedia?',
    options: [
      'Karena relay lebih murah dari PLC',
      'Karena relay bersifat fail-safe — kabel putus berarti sirkuit terbuka dan mesin berhenti',
      'Karena PLC tidak bisa memproses sinyal Emergency Stop',
      'Karena relay lebih cepat dari PLC',
    ],
    correctIndex: 1,
    explanation:
      'Relay NC (Normally Closed) dirangkai seri pada sirkuit E-Stop bersifat fail-safe: jika kabel putus atau relay rusak, sirkuit terbuka dan mesin berhenti otomatis (kondisi aman). Keamanan fisik tidak boleh bergantung 100% pada software PLC karena software bisa bug atau CPU bisa fault.',
    moduleRef: 'L1-M1',
  },
  {
    id: 'L1-Q08',
    category: 1,
    difficulty: 'sedang',
    question: 'Software pemrograman mana yang digunakan untuk PLC Siemens seri S7-1200?',
    options: [
      'GX Works',
      'CX-Programmer',
      'TIA Portal',
      'EcoStruxure Machine Expert',
    ],
    correctIndex: 2,
    explanation:
      'TIA Portal (Totally Integrated Automation Portal) adalah software resmi Siemens untuk memprogram PLC S7-1200 and S7-1500. GX Works untuk Mitsubishi, CX-Programmer untuk Omron, dan EcoStruxure Machine Expert untuk Schneider Electric.',
    moduleRef: 'L1-M2',
  },
  {
    id: 'L1-Q09',
    category: 1,
    difficulty: 'sedang',
    question: 'Standar internasional yang mendefinisikan 5 bahasa pemrograman PLC (termasuk Ladder Diagram) adalah...',
    options: [
      'IEC 60204-1',
      'IEC 61131-3',
      'NEMA ICS 2',
      'ISO 13849',
    ],
    correctIndex: 1,
    explanation:
      'IEC 61131-3 adalah standar internasional yang mendefinisikan 5 bahasa pemrograman PLC: Ladder Diagram (LD), Function Block Diagram (FBD), Structured Text (ST), Instruction List (IL), dan Sequential Function Chart (SFC). Standar ini memastikan konsistensi antar merk PLC.',
    moduleRef: 'L1-M1',
  },
  {
    id: 'L1-Q10',
    category: 1,
    difficulty: 'sulit',
    question: 'Sebuah PLC memiliki scan time 5ms dan program terdiri dari 2000 instruksi. Jika ditambah 1000 instruksi lagi, apa dampak yang paling mungkin terjadi?',
    options: [
      'PLC langsung error dan berhenti beroperasi',
      'Scan time meningkat, sehingga respons terhadap perubahan input menjadi lebih lambat',
      'PLC otomatis meningkatkan kecepatan processor untuk mengkompensasi',
      'Tidak ada dampak karena PLC modern punya clock speed tetap',
    ],
    correctIndex: 1,
    explanation:
      'Semakin banyak instruksi yang dieksekusi per scan cycle, semakin lama scan time. Scan time yang lebih panjang berarti PLC lebih lambat merespons perubahan input. Untuk aplikasi time-critical (high-speed counting, motion control), scan time harus dijaga serendah mungkin dengan mengoptimalkan program.',
    moduleRef: 'L1-M3',
  },
  {
    id: 'L1-Q11',
    category: 1,
    difficulty: 'sulit',
    question: 'Komponen mana yang TIDAK termasuk dalam kategori modul PLC yang terpasang di rack?',
    options: [
      'Modul Input Analog (AI)',
      'HMI (Human Machine Interface) touchscreen',
      'Modul Komunikasi Profibus DP',
      'Power Supply Unit (PSU) PLC',
    ],
    correctIndex: 1,
    explanation:
      'HMI (touchscreen operator panel) adalah perangkat terpisah yang terhubung ke PLC via komunikasi (Ethernet, RS-232, dll), bukan modul yang terpasang di rack PLC. Modul AI, komunikasi Profibus, dan PSU semuanya terpasang langsung di rack/chassis PLC.',
    moduleRef: 'L1-M2',
  },
  {
    id: 'L1-Q12',
    category: 1,
    difficulty: 'sulit',
    question: 'Apa yang dimaksud dengan "memori non-volatile" pada CPU PLC?',
    options: [
      'Memori yang hanya bisa dibaca, tidak bisa ditulis',
      'Memori yang sangat cepat diakses untuk eksekusi real-time',
      'Memori yang mempertahankan isinya (program) meskipun PLC kehilangan daya listrik',
      'Memori sementara yang digunakan selama scan cycle berlangsung',
    ],
    correctIndex: 2,
    explanation:
      'Non-volatile memory (flash, EEPROM) menyimpan program pengguna secara permanen — tidak hilang saat PLC dimatikan atau kehilangan power. Ini penting agar mesin langsung bisa beroperasi lagi setelah power dihidupkan tanpa perlu download ulang program dari laptop.',
    moduleRef: 'L1-M2',
  },

  // ============================================================
  // LEVEL 2 — TIPE I/O (12 Soal)
  // ============================================================
  {
    id: 'L2-Q01',
    category: 2,
    difficulty: 'mudah',
    question: 'Rentang sinyal arus standar yang paling umum digunakan untuk transmisi sinyal analog di industri proses adalah...',
    options: [
      '0 – 10 mA',
      '4 – 20 mA',
      '0 – 5 V',
      '0 – 24 VDC',
    ],
    correctIndex: 1,
    explanation:
      'Standar 4–20mA adalah yang paling umum di industri proses karena beberapa keunggulan: tahan noise elektromagnetik, bisa dikirim via kabel panjang (>100m), dan 4mA minimum memungkinkan deteksi kabel putus (wire break = 0mA, bukan nilai minimum 4mA).',
    moduleRef: 'L2-M2',
  },
  {
    id: 'L2-Q02',
    category: 2,
    difficulty: 'mudah',
    question: 'Sensor proximity induktif digunakan untuk mendeteksi...',
    options: [
      'Level cairan di dalam tangki',
      'Objek metal tanpa kontak fisik langsung',
      'Temperatur permukaan objek',
      'Tekanan gas dalam pipa',
    ],
    correctIndex: 1,
    explanation:
      'Proximity sensor induktif bekerja dengan medan elektromagnetik untuk mendeteksi objek logam (besi, aluminium, tembaga) tanpa kontak fisik. Tidak bisa mendeteksi material non-logam seperti plastik, kayu, atau cairan. Digunakan untuk penghitung part logam, deteksi posisi silinder, dll.',
    moduleRef: 'L2-M1',
  },
  {
    id: 'L2-Q03',
    category: 2,
    difficulty: 'mudah',
    question: 'Tipe output PLC mana yang PALING COCOK untuk mengontrol inverter (Variable Speed Drive) yang membutuhkan sinyal switching cepat?',
    options: [
      'Output Relay',
      'Output Transistor (NPN/PNP)',
      'Output Triac',
      'Semua tipe sama saja untuk inverter',
    ],
    correctIndex: 1,
    explanation:
      'Output transistor memiliki waktu switching < 1ms dan mendukung frekuensi tinggi, cocok untuk sinyal ke inverter. Output relay terlalu lambat (~10ms switching) dan kontak mekaniknya akan cepat aus jika digunakan untuk sinyal frekuensi tinggi. Output triac hanya untuk beban AC.',
    moduleRef: 'L2-M1',
  },
  {
    id: 'L2-Q04',
    category: 2,
    difficulty: 'mudah',
    question: 'Dalam sistem pengalamatan Siemens S7, alamat "Q0.3" merujuk pada...',
    options: [
      'Input Bit 3 pada Byte 0',
      'Output Bit 3 pada Byte 0',
      'Memory Bit 3 pada Byte 0',
      'Counter nomor 3',
    ],
    correctIndex: 1,
    explanation:
      'Dalam notasi Siemens: Q = Output Image (Ausgang dalam bahasa Jerman). Angka sebelum titik (0) adalah nomor byte, angka setelah titik (3) adalah nomor bit dalam byte tersebut. Jadi Q0.3 = Output Image, Byte 0, Bit 3. I = Input, M = Memory/Merker.',
    moduleRef: 'L2-M3',
  },
  {
    id: 'L2-Q05',
    category: 2,
    difficulty: 'mudah',
    question: 'Mengapa standar 4–20mA menggunakan 4mA sebagai nilai minimum, bukan 0mA?',
    options: [
      'Karena peralatan elektronik tidak bisa menghasilkan arus 0mA',
      'Untuk membedakan kondisi "nilai minimum" (4mA) dari kondisi "kabel putus" (0mA)',
      'Karena standar 0–20mA lebih mahal diproduksi',
      'Karena regulator internasional mewajibkan arus minimal 4mA',
    ],
    correctIndex: 1,
    explanation:
      'Filosofi 4mA minimum: nilai 0% direpresentasikan 4mA, bukan 0mA. Jika kabel putus atau sensor mati, arus menjadi 0mA. PLC bisa membedakan "sensor membaca nilai 0%" (4mA) dari "ada masalah kabel/sensor" (0mA). Ini sangat penting untuk deteksi fault otomatis (wire break alarm).',
    moduleRef: 'L2-M2',
  },
  {
    id: 'L2-Q06',
    category: 2,
    difficulty: 'sedang',
    question: 'Sensor suhu Pt100 (RTD) menghasilkan sinyal berupa perubahan...',
    options: [
      'Arus (4–20mA)',
      'Tegangan (0–10V)',
      'Resistansi (Ohm)',
      'Frekuensi (Hz)',
    ],
    correctIndex: 2,
    explanation:
      'RTD (Resistance Temperature Detector) seperti Pt100 mengubah suhu menjadi perubahan resistansi. Pt100 memiliki resistansi 100Ω pada 0°C dan naik sekitar 0.385Ω per °C. Membaca RTD membutuhkan modul AI khusus yang bisa mengukur resistansi, bukan modul 4–20mA biasa.',
    moduleRef: 'L2-M2',
  },
  {
    id: 'L2-Q07',
    category: 2,
    difficulty: 'sedang',
    question: 'Sensor proximity bertipe NPN dihubungkan ke modul input PLC. Apa konfigurasi modul yang tepat?',
    options: [
      'Modul harus dikonfigurasi sebagai Sink Input (common 0V)',
      'Modul harus dikonfigurasi sebagai Source Input (common +24V)',
      'Sensor NPN hanya bisa digunakan dengan relay adapter',
      'Tidak ada perbedaan, semua modul bisa membaca sensor NPN',
    ],
    correctIndex: 1,
    explanation:
      'Sensor NPN (current sinking) menarik arus ke GND saat aktif — outputnya terhubung ke 0V saat ON. Untuk membaca ini, modul DI harus dikonfigurasi sebagai Source Input (common +24V) agar arus dapat mengalir dari +24V melalui input PLC ke output NPN sensor ke GND. Jika salah, sinyal tidak terbaca.',
    moduleRef: 'L2-M1',
  },
  {
    id: 'L2-Q08',
    category: 2,
    difficulty: 'sedang',
    question: 'Modul AI Siemens S7-1200 membaca sinyal 4–20mA dengan range raw count 0–27648. Sensor tekanan 0–10 bar terbaca 13824. Berapa tekanan aktual dalam bar?',
    options: [
      '2.5 bar',
      '5.0 bar',
      '6.9 bar',
      '7.5 bar',
    ],
    correctIndex: 1,
    explanation:
      'Gunakan rumus scaling: EU = EU_min + (Raw - Raw_min) × (EU_max - EU_min) / (Raw_max - Raw_min). Tekanan = 0 + (13824 - 0) × (10 - 0) / (27648 - 0) = 13824 × 10 / 27648 = 5.0 bar. Raw count 13824 adalah tepat setengah dari 27648, sehingga hasilnya tepat setengah dari range (5 bar).',
    moduleRef: 'L2-M2',
  },
  {
    id: 'L2-Q09',
    category: 2,
    difficulty: 'sedang',
    question: 'Dalam notasi Siemens, "IW0" merujuk pada...',
    options: [
      'Input Bit 0 pada area I',
      'Input Word (16 bit) mulai dari Byte 0 — mencakup I0.0 hingga I1.7',
      'Internal Word register nomor 0',
      'Input dari channel Analog Word 0',
    ],
    correctIndex: 1,
    explanation:
      'IW0 = Input Word dimulai dari Byte 0. Satu Word = 16 bit = 2 Byte. IW0 mencakup Byte IB0 (bit I0.0–I0.7) and Byte IB1 (bit I1.0–I1.7) dalam satu akses 16-bit. Ini berguna untuk membaca nilai raw analog (I/O analog sering dimapping ke area IW dalam format tertentu).',
    moduleRef: 'L2-M3',
  },
  {
    id: 'L2-Q10',
    category: 2,
    difficulty: 'sulit',
    question: 'Sensor 4–20mA terhubung ke modul AI. Program PLC mendeteksi nilai raw count = 0. Apa interpretasi yang PALING tepat dan tindakan yang harus dilakukan?',
    options: [
      'Nilai proses sedang di titik minimum (0%), proses normal',
      'Kemungkinan besar terjadi wire break atau sensor mati — aktifkan alarm fault dan blokir output kontrol',
      'Modul AI perlu dikalibrasi ulang karena pembacaan tidak akurat',
      'PLC harus di-restart untuk mereset pembacaan yang salah',
    ],
    correctIndex: 1,
    explanation:
      'Dengan standar 4–20mA, nilai minimum yang valid adalah 4mA (raw count ~0 pada beberapa merk, tapi bukan karena nilai proses 0%). Raw count = 0 berarti arus 0mA — di bawah minimum valid. Ini hampir pasti menandakan kabel putus atau sensor mati. Tindakan yang benar: aktifkan wire break alarm, blokir output kontrol untuk mencegah kerusakan proses akibat pembacaan tidak valid.',
    moduleRef: 'L2-M2',
  },
  {
    id: 'L2-Q11',
    category: 2,
    difficulty: 'sulit',
    question: 'Sebuah modul Output Relay PLC memiliki rating 2A per channel dan waktu switching 10ms. Apakah modul ini cocok untuk mengontrol motor 3-phase 380V/5kW secara langsung?',
    options: [
      'Ya, karena tegangan 380V di bawah rating maksimum relay industri',
      'Tidak — motor 5kW pada 380V menarik arus ~13A (jauh di atas 2A). Gunakan kontaktor eksternal yang dikontrol relay output PLC',
      'Ya, tetapi hanya jika menggunakan mode bypass saat motor starting',
      'Tidak masalah selama scan time PLC lebih pendek dari 10ms',
    ],
    correctIndex: 1,
    explanation:
      'Motor 5kW / 380V / 3-phase menarik arus ~I = P/(√3 × V × cosφ) ≈ 5000/(1.73 × 380 × 0.85) ≈ 8.9A running, and arus starting bisa 6–7× lebih tinggi (~54A). Ini jauh melampaui rating 2A relay output PLC. Solusi standar: output PLC mengontrol coil kontaktor (arus kecil ~0.5A), kontaktor yang memutus/menghubungkan daya motor.',
    moduleRef: 'L2-M1',
  },
  {
    id: 'L2-Q12',
    category: 2,
    difficulty: 'sulit',
    question: 'Perbedaan utama antara modul Input Analog yang mendukung sinyal "4–20mA 2-wire" dan "4–20mA 4-wire" adalah...',
    options: [
      'Tidak ada perbedaan, keduanya menghasilkan pembacaan yang sama',
      '2-wire: PLC menyuplai daya ke sensor via loop arus yang sama; 4-wire: sensor punya suplai daya terpisah',
      '4-wire memiliki akurasi 2× lebih tinggi dari 2-wire',
      '2-wire hanya bisa digunakan untuk jarak kabel di bawah 10 meter',
    ],
    correctIndex: 1,
    explanation:
      'Sensor 2-wire (loop-powered): hanya punya 2 kabel, PLC menyuplai tegangan (~24VDC) melalui loop arus yang sama yang membawa sinyal 4–20mA. Sensor "mengambil" daya dari selisih tegangan loop. Sensor 4-wire: punya suplai daya terpisah (2 kabel power, 2 kabel sinyal). Sensor 4-wire umumnya lebih akurat dan bisa digunakan untuk sensor berdaya tinggi.',
    moduleRef: 'L2-M2',
  },

  // ============================================================
  // LEVEL 3 — INSTRUKSI LADDER (12 Soal)
  // ============================================================
  {
    id: 'L3-Q01',
    category: 3,
    difficulty: 'mudah',
    question: 'Simbol —[ ]— pada Ladder Diagram mewakili instruksi...',
    options: [
      'Output Coil (OUT) — mengaktifkan bit',
      'Normally Closed Contact (LDI) — TRUE saat bit = 0',
      'Normally Open Contact (LD) — TRUE saat bit = 1',
      'Set Coil (SET) — mengunci bit ON',
    ],
    correctIndex: 2,
    explanation:
      'Simbol —[ ]— adalah Normally Open Contact, instruksi LD (Load). Kontaknya TRUE (mengalirkan "daya" logika) hanya ketika nilai bit yang direferensikan = 1 (ON). Saat bit = 0, kontak terbuka dan tidak ada aliran logika ke sebelah kanannya.',
    moduleRef: 'L3-M1',
  },
  {
    id: 'L3-Q02',
    category: 3,
    difficulty: 'mudah',
    question: 'Apa perbedaan antara instruksi OUT dan SET pada koil output?',
    options: [
      'Tidak ada perbedaan, keduanya menghasilkan efek yang sama',
      'OUT hanya aktif selama kondisi rung TRUE; SET mengunci output ON hingga di-RESET secara eksplisit',
      'SET lebih cepat dari OUT karena tidak memerlukan evaluasi rung',
      'OUT digunakan untuk output fisik (Q), SET hanya untuk memori internal (M)',
    ],
    correctIndex: 1,
    explanation:
      'OUT: output hanya ON selama kondisi rung TRUE. Saat kondisi menjadi FALSE, output langsung OFF. SET (latch): setelah diaktifkan, output TETAP ON meskipun kondisi rung kembali FALSE. Hanya bisa dimatikan oleh instruksi RST (Reset). Pasangan SET/RST digunakan untuk membuat "memori" kondisi.',
    moduleRef: 'L3-M1',
  },
  {
    id: 'L3-Q03',
    category: 3,
    difficulty: 'mudah',
    question: 'Pada program kontrol motor START-STOP, mengapa digunakan "self-holding contact" (kontak dari output motor dihubungkan paralel dengan tombol START)?',
    options: [
      'Untuk meningkatkan kecepatan motor',
      'Agar motor tetap ON setelah tombol START dilepas, tanpa perlu menekan tombol terus-menerus',
      'Untuk melindungi motor dari overload',
      'Karena tombol START tidak cukup kuat untuk mengaktifkan output langsung',
    ],
    correctIndex: 1,
    explanation:
      'Self-holding (latch) diperlukan karena tombol START bersifat momentary (hanya ON selama ditekan). Tanpa self-holding, motor akan mati begitu tombol dilepas. Dengan menghubungkan kontak NO dari output motor (Q) secara paralel dengan START, motor "mengunci" kondisinya sendiri — tetap ON hingga tombol STOP ditekan.',
    moduleRef: 'L3-M1',
  },
  {
    id: 'L3-Q04',
    category: 3,
    difficulty: 'mudah',
    question: 'Timer TON (On-Delay) dengan preset 5 detik. Input diberi sinyal ON selama 3 detik lalu OFF. Apa yang terjadi pada output timer?',
    options: [
      'Output timer ON selama 3 detik kemudian OFF',
      'Output timer ON setelah 5 detik dihitung dari awal sinyal',
      'Output timer tidak pernah ON karena input OFF sebelum mencapai preset',
      'Output timer ON 2 detik setelah input OFF',
    ],
    correctIndex: 2,
    explanation:
      'TON hanya mengaktifkan output (.Q) jika input terus-menerus ON selama minimal waktu preset (PT). Jika input OFF sebelum elapsed time mencapai PT, timer mereset ke 0 and output tidak pernah ON. Input harus ON selama minimal 5 detik penuh agar output TON aktif.',
    moduleRef: 'L3-M2',
  },
  {
    id: 'L3-Q05',
    category: 3,
    difficulty: 'mudah',
    question: 'Counter CTU (Count Up) dengan preset 50. Berapa kali sinyal CU harus rising edge agar output Q menjadi TRUE?',
    options: [
      '49 kali',
      '50 kali',
      '51 kali',
      'Tergantung dari nilai awal counter',
    ],
    correctIndex: 1,
    explanation:
      'CTU menghitung rising edge (transisi OFF→ON) pada input CU. Output Q menjadi TRUE saat nilai current value (CV) ≥ preset value (PV). Dengan PV = 50, output Q aktif saat CV = 50, artinya setelah tepat 50 kali rising edge. Counter terus menghitung setelah PV tercapai, Q tetap TRUE.',
    moduleRef: 'L3-M3',
  },
  {
    id: 'L3-Q06',
    category: 3,
    difficulty: 'sedang',
    question: 'Logika berikut diimplementasikan di Ladder: (A AND B) OR (C AND NOT D) → OUT Y. Dalam kondisi apa output Y aktif?',
    options: [
      'Hanya saat A dan B dan C semua ON',
      'Saat (A ON dan B ON) ATAU saat (C ON dan D OFF)',
      'Saat A atau B atau C atau D salah satunya ON',
      'Saat semua input (A, B, C, D) OFF',
    ],
    correctIndex: 1,
    explanation:
      'Evaluasi Boolean: (A AND B) = TRUE hanya jika A=1 dan B=1. (C AND NOT D) = TRUE jika C=1 dan D=0. Keduanya dihubungkan OR, sehingga Y aktif jika SALAH SATU branch bernilai TRUE: branch pertama (A=1 dan B=1) ATAU branch kedua (C=1 dan D=0). Kedua kondisi terpenuhi = juga aktif.',
    moduleRef: 'L3-M1',
  },
  {
    id: 'L3-Q07',
    category: 3,
    difficulty: 'sedang',
    question: 'Perbedaan utama antara Timer TOF (Off-Delay) and Timer TON (On-Delay) adalah...',
    options: [
      'TOF lebih presisi waktunya dibanding TON',
      'TON: output ON setelah delay dari input ON; TOF: output tetap ON selama delay setelah input OFF',
      'TOF bisa digunakan untuk interval yang lebih panjang dari TON',
      'Tidak ada perbedaan fungsional, hanya perbedaan nama di merk berbeda',
    ],
    correctIndex: 1,
    explanation:
      'TON (On-Delay): output ON setelah input ON selama waktu PT. Bila input OFF, timer and output langsung reset. TOF (Off-Delay): output langsung ON saat input ON, lalu saat input OFF timer mulai. Output baru OFF setelah PT berlalu dari saat input OFF. Contoh TOF: kipas pendingin tetap jalan 60 detik setelah motor berhenti.',
    moduleRef: 'L3-M2',
  },
  {
    id: 'L3-Q08',
    category: 3,
    difficulty: 'sedang',
    question: 'Counter CTU direset menggunakan instruksi RST. Kapan waktu yang TEPAT untuk mereset counter dalam program kontrol batch produksi?',
    options: [
      'Counter direset otomatis setiap awal scan cycle baru',
      'Counter harus direset secara eksplisit — misalnya saat operator menekan tombol RESET atau saat palet baru dipasang',
      'Counter direset sendiri setelah output Q aktif selama 1 detik',
      'Counter tidak perlu direset, cukup matikan PLC lalu hidupkan kembali',
    ],
    correctIndex: 1,
    explanation:
      'Counter tidak memiliki auto-reset — nilainya dipertahankan bahkan setelah output Q aktif and bahkan setelah PLC di-restart (jika retentive). Reset harus dilakukan secara eksplisit oleh logika program, misalnya: saat tombol RESET ditekan operator, saat sensor mendeteksi palet baru dipasang, atau saat awal sekuens baru dimulai.',
    moduleRef: 'L3-M3',
  },
  {
    id: 'L3-Q09',
    category: 3,
    difficulty: 'sedang',
    question: 'Timer TP (Pulse) diaktifkan. Input kemudian dimatikan sebelum preset time habis. Apa yang terjadi pada output?',
    options: [
      'Output langsung OFF mengikuti input yang dimatikan',
      'Output tetap ON hingga preset time habis, tidak terpengaruh oleh perubahan input',
      'Output OFF 50% dari sisa waktu yang tersisa',
      'Timer mereset dan mulai menghitung ulang dari 0',
    ],
    correctIndex: 1,
    explanation:
      'TP (Pulse Timer) adalah one-shot: begitu diaktifkan, output ON selama tepat PT and tidak bisa diinterupsi. Perubahan input saat timer berjalan diabaikan. Ini bergeda dari TON yang akan reset jika input OFF. TP digunakan untuk menghasilkan pulsa dengan durasi yang presisi dan konsisten.',
    moduleRef: 'L3-M2',
  },
  {
    id: 'L3-Q10',
    category: 3,
    difficulty: 'sulit',
    question: 'Mengapa dalam satu program Ladder, satu alamat koil output (misal Q0.0) sebaiknya hanya digunakan sebagai OUT satu kali?',
    options: [
      'Karena PLC tidak mendukung penggunaan alamat yang sama lebih dari sekali',
      'Karena rung terakhir yang menggunakan alamat tersebut sebagai OUT akan menimpa semua rung sebelumnya — menyebabkan logika tidak terduga',
      'Karena menggunakan alamat yang sama dua kali menyebabkan scan time dua kali lebih panjang',
      'Karena standar IEC 61131-3 melarang penggunaan alamat ganda',
    ],
    correctIndex: 1,
    explanation:
      'Dalam satu scan cycle, PLC memproses rung dari atas ke bawah. Jika Q0.0 digunakan sebagai OUT di rung 5 and rung 50, hasil dari rung 50 akan MENIMPA hasil rung 5 di output image. Jika rung 50 kondisinya FALSE, Q0.0 akan OFF meskipun rung 5 TRUE. Ini "double coil problem" — bug yang sulit ditemukan. Solusi: gunakan M (memori) untuk logika intermediate, gabungkan kondisi dalam satu rung.',
    moduleRef: 'L3-M1',
  },
  {
    id: 'L3-Q11',
    category: 3,
    difficulty: 'sulit',
    question: 'Sebuah mesin membutuhkan urutan: Silinder A maju → tunggu 2 detik → Silinder B maju → tunggu 3 detik → keduanya mundur. Jenis timer apa yang paling tepat untuk kontrol delay ini?',
    options: [
      'TOF (Off-Delay Timer) untuk setiap step',
      'TP (Pulse Timer) untuk setiap step',
      'TON (On-Delay Timer) untuk setiap step delay',
      'CTU (Counter Up) untuk menghitung langkah',
    ],
    correctIndex: 2,
    explanation:
      'TON paling tepat untuk delay sekuensial: "tunggu X detik setelah kondisi terpenuhi sebelum lanjut ke step berikutnya". Step 1: saat A maju (output ON), aktifkan TON 2 detik. Saat TON.Q = TRUE, aktifkan B maju. Step 2: aktifkan TON 3 detik lagi. Saat TON.Q = TRUE, semua mundur. Pola ini adalah dasar dari Sequential Function Chart (SFC).',
    moduleRef: 'L3-M2',
  },
  {
    id: 'L3-Q12',
    category: 3,
    difficulty: 'sulit',
    question: 'Counter CTUD (Up-Down Counter) dengan preset 10, nilai awal 0. Menerima 7 sinyal CU (count up) lalu 3 sinyal CD (count down). Berapa nilai CV akhir dan apakah output QU aktif?',
    options: [
      'CV = 10, QU = TRUE',
      'CV = 4, QU = FALSE',
      'CV = 7, QU = FALSE',
      'CV = 0, QU = FALSE karena CD mereset counter',
    ],
    correctIndex: 1,
    explanation:
      'CTUD menghitung naik pada CU and turun pada CD. Nilai CV = 0 + 7 (naik) - 3 (turun) = 4. Output QU aktif saat CV ≥ PV (10). Karena CV = 4 < 10, maka QU = FALSE. Output QD (count down) aktif saat CV ≤ 0, juga FALSE. Jika ingin QU = TRUE, perlu setidaknya 10 sinyal CU tanpa ada pengurangan.',
    moduleRef: 'L3-M3',
  },

  // ============================================================
  // LEVEL 4 — LANJUTAN (12 Soal)
  // ============================================================
  {
    id: 'L4-Q01',
    category: 4,
    difficulty: 'mudah',
    question: 'Instruksi MOVE pada PLC digunakan untuk...',
    options: [
      'Memindahkan PLC dari satu lokasi ke lokasi lain',
      'Menyalin nilai dari satu lokasi memori ke lokasi memori lain',
      'Menggerakkan aktuator dari posisi A ke posisi B',
      'Memindahkan program dari satu PLC ke PLC lain via jaringan',
    ],
    correctIndex: 1,
    explanation:
      'Instruksi MOVE (atau MOV) menyalin nilai dari sumber (konstanta atau alamat memori) ke alamat tujuan. Nilai di sumber tidak berubah. Contoh: MOVE IN:=100 OUT=>MW50 menyalin nilai 100 ke register MW50. Digunakan untuk inisialisasi, transfer setpoint, and pengolahan data.',
    moduleRef: 'L4-M2',
  },
  {
    id: 'L4-Q02',
    category: 4,
    difficulty: 'mudah',
    question: 'Instruksi komparasi "GT" pada PLC berarti...',
    options: [
      'Go To — lompat ke alamat program tertentu',
      'Get Trigger — ambil nilai trigger input',
      'Greater Than — kondisi TRUE jika nilai pertama lebih besar dari nilai kedua',
      'Gate Toggle — membalik kondisi bit',
    ],
    correctIndex: 2,
    explanation:
      'GT (Greater Than) adalah instruksi komparasi yang menghasilkan kondisi TRUE jika nilai A > nilai B. Digunakan sebagai kontak dalam rung ladder. Contoh: GT MD_TEMP, 80.0 → TRUE jika suhu > 80°C, digunakan untuk memicu alarm suhu tinggi.',
    moduleRef: 'L4-M2',
  },
  {
    id: 'L4-Q03',
    category: 4,
    difficulty: 'mudah',
    question: 'Apa tujuan dari "wire break detection" pada sistem input analog 4–20mA?',
    options: [
      'Mendeteksi apakah kabel terlalu panjang and perlu diperpendek',
      'Mendeteksi kondisi kabel putus atau sensor mati agar sistem dapat mengeluarkan alarm and mengambil tindakan aman',
      'Mengukur resistansi kabel untuk kalibrasi',
      'Mencegah interferensi elektromagnetik pada kabel sinyal',
    ],
    correctIndex: 1,
    explanation:
      'Wire break detection memanfaatkan fakta bahwa sinyal valid 4–20mA tidak pernah turun di bawah 4mA. Jika arus < 4mA (biasanya 0mA), ini menandakan kabel putus atau sensor mati. Program PLC harus mendeteksi ini, mengaktifkan alarm "SENSOR FAULT", and memblokir output kontrol agar tidak bereaksi berdasarkan pembacaan yang tidak valid.',
    moduleRef: 'L4-M1',
  },
  {
    id: 'L4-Q04',
    category: 4,
    difficulty: 'sedang',
    question: 'Rumus scaling analog: sensor level 0–5 meter (output 4–20mA), modul AI Mitsubishi FX3U (raw 0–4000 pada 4–20mA). Raw count terbaca 2000. Berapa nilai level aktual?',
    options: [
      '1.5 meter',
      '2.0 meter',
      '2.5 meter',
      '3.0 meter',
    ],
    correctIndex: 2,
    explanation:
      'Gunakan rumus scaling: EU = EU_min + (Raw - Raw_min) × (EU_max - EU_min) / (Raw_max - Raw_min). Level = 0 + (2000 - 0) × (5 - 0) / (4000 - 0) = 2000 × 5 / 4000 = 10000 / 4000 = 2.5 meter. Raw 2000 adalah tepat setengah dari 4000, sehingga nilai = setengah dari range = 2.5m.',
    moduleRef: 'L4-M1',
  },
  {
    id: 'L4-Q05',
    category: 4,
    difficulty: 'sedang',
    question: 'Mengapa instruksi DIV (pembagian) pada PLC HARUS selalu dilindungi dengan pengecekan bahwa pembagi tidak sama dengan nol?',
    options: [
      'Karena hasil pembagian akan selalu salah tanpa pengecekan ini',
      'Karena pembagian dengan nol menyebabkan CPU fault and PLC bisa berhenti beroperasi (masuk mode STOP)',
      'Karena pembagian dengan nol menghasilkan nilai negatif yang merusak aktuator',
      'Karena instruksi DIV membutuhkan waktu proses lebih lama dari instruksi lainnya',
    ],
    correctIndex: 1,
    explanation:
      'Pembagian dengan nol adalah operasi yang tidak terdefinisi secara matematis. Pada PLC, ini memicu CPU fault (division by zero error) yang dapat menyebabkan PLC masuk mode STOP and menghentikan seluruh proses. Selalu tambahkan rung: cek apakah pembagi ≠ 0 sebelum instruksi DIV. Jika pembagi = 0, skip perhitungan atau set nilai output ke 0/default.',
    moduleRef: 'L4-M2',
  },
  {
    id: 'L4-Q06',
    category: 4,
    difficulty: 'sedang',
    question: 'Hysteresis (dead band) pada kontrol ON/OFF digunakan untuk...',
    options: [
      'Meningkatkan akurasi pembacaan sensor analog',
      'Mencegah chattering (switching ON/OFF berulang cepat) saat nilai proses berada di sekitar setpoint',
      'Mempercepat respons kontrol terhadap perubahan setpoint',
      'Mengkalibrasi offset sensor secara otomatis',
    ],
    correctIndex: 1,
    explanation:
      'Tanpa hysteresis, jika nilai proses "bergetar" di sekitar setpoint karena noise, output akan switching ON/OFF ratusan kali per menit (chattering) — merusak relay and aktuator. Hysteresis membuat dua threshold: ON threshold and OFF threshold dengan selisih (dead band) di antaranya. Output hanya berubah saat nilai proses melewati threshold yang relevan, tidak di selisih kecil.',
    moduleRef: 'L4-M1',
  },
  {
    id: 'L4-Q07',
    category: 4,
    difficulty: 'sedang',
    question: 'Standar penamaan alamat PLC yang baik adalah menggunakan symbolic name, bukan raw address. Mana penamaan yang PALING BENAR secara profesional?',
    options: [
      'I00, I01, I02 untuk semua input',
      'X, Y, Z untuk sensor utama',
      'DI_SENSOR_LEVEL_HIGH, DO_PUMP_1_FWD, M_SYSTEM_RUN',
      'INPUT1, INPUT2, OUTPUT1',
    ],
    correctIndex: 2,
    explanation:
      'Symbolic name yang baik menggunakan konvensi PREFIX_NAMA_DESKRIPTIF: DI_ untuk Digital Input, DO_ untuk Digital Output, AI_ untuk Analog Input, M_ untuk Memory/Flag. Nama harus cukup deskriptif agar teknisi lain (atau diri sendiri 2 tahun kemudian) langsung paham fungsinya tanpa membuka dokumentasi tambahan.',
    moduleRef: 'L4-M3',
  },
  {
    id: 'L4-Q08',
    category: 4,
    difficulty: 'sedang',
    question: 'Fungsi NORM_X pada Siemens TIA Portal digunakan untuk...',
    options: [
      'Menormalkan tegangan jaringan dari 220V ke 24V',
      'Mengkonversi nilai integer raw count ke nilai real antara 0.0 – 1.0',
      'Mengkalibrasi modul analog ke standar pabrik',
      'Mendeteksi nilai normal vs nilai abnormal pada sensor',
    ],
    correctIndex: 1,
    explanation:
      'NORM_X (Normalize) mengkonversi nilai input (VALUE) dari range [MIN, MAX] ke nilai real antara 0.0 and 1.0. Contoh: raw count 0–27648 dari modul AI dikonversi ke 0.0–1.0. Hasilnya kemudian dimasukkan ke SCALE_X yang mengkonversi 0.0–1.0 ke engineering unit yang diinginkan (misal 0.0–100.0°C).',
    moduleRef: 'L4-M1',
  },
  {
    id: 'L4-Q09',
    category: 4,
    difficulty: 'sulit',
    question: 'Sebuah program menghitung efisiensi mesin: Efisiensi = (Produk_Aktual / Target_Harian) × 100. Target_Harian bisa diubah oleh operator via HMI. Apa risiko yang HARUS diantisipasi?',
    options: [
      'Nilai efisiensi bisa melebihi 100%, yang menyebabkan overflow register',
      'Operator bisa memasukkan nilai 0 sebagai target, menyebabkan division by zero and CPU fault',
      'Perhitungan floating point terlalu lambat untuk PLC entry-level',
      'Data dari HMI bisa terlambat satu scan cycle sehingga nilai efisiensi tertinggal',
    ],
    correctIndex: 1,
    explanation:
      'Kapanpun ada pembagi yang berasal dari input operator atau HMI, selalu ada risiko operator memasukkan nilai 0 (disengaja atau tidak). Ini harus diantisipasi: tambahkan rung sebelum DIV yang memvalidasi bahwa Target_Harian > 0. Jika 0, tampilkan pesan error di HMI and skip perhitungan atau tampilkan nilai default 0%. Ini adalah praktik defensive programming.',
    moduleRef: 'L4-M2',
  },
  {
    id: 'L4-Q10',
    category: 4,
    difficulty: 'sulit',
    question: 'Saat troubleshooting PLC and menemukan output fisik tidak aktif meskipun rung logika sudah TRUE di software, apa langkah pertama yang PALING TEPAT?',
    options: [
      'Langsung ganti modul output karena pasti rusak',
      'Restart PLC and coba lagi',
      'Ukur tegangan di terminal output fisik menggunakan multimeter untuk memastikan apakah masalah ada di modul output PLC atau di sirkuit eksternal (kabel, kontaktor, beban)',
      'Periksa program dari awal untuk mencari bug logika',
    ],
    correctIndex: 2,
    explanation:
      'Pendekatan sistematis: jika rung TRUE di software tetapi output fisik tidak aktif, gunakan multimeter untuk mengukur tegangan di terminal output. Jika tegangan ada (misal 24VDC) berarti modul output OK — masalah ada di sirkuit eksternal (kabel putus, kontaktor coil rusak, beban short circuit). Jika tegangan tidak ada — modul output mungkin rusak atau ada masalah dengan common power supply modul.',
    moduleRef: 'L4-M3',
  },
  {
    id: 'L4-Q11',
    category: 4,
    difficulty: 'sulit',
    question: 'Prinsip "de-energize to trip" pada safety interlock berarti...',
    options: [
      'Sistem harus mengkonsumsi lebih banyak energi saat kondisi trip terjadi',
      'Kondisi aman dicapai dengan menghilangkan energi (de-energize) — kegagalan komponen atau kabel putus otomatis menghentikan mesin',
      'Trip hanya terjadi saat energi mesin mencapai batas maksimum',
      'Sistem trip diaktifkan secara manual oleh operator dengan menekan tombol de-energize',
    ],
    correctIndex: 1,
    explanation:
      'De-energize to trip adalah filosofi safety fundamental: dalam kondisi normal, komponen safety (E-Stop NC, safety relay, dll) terenergized/tertutup. Jika terjadi kegagalan apapun (kabel putus, komponen rusak, kehilangan power), komponen de-energize and mesin BERHENTI secara otomatis ke kondisi aman. Kebalikannya, "energize to trip" berbahaya karena kegagalan berarti mesin tidak bisa dihentikan.',
    moduleRef: 'L4-M3',
  },
  {
    id: 'L4-Q12',
    category: 4,
    difficulty: 'sulit',
    question: 'Protokol komunikasi industri yang menggunakan prinsip Master-Slave and sangat populer untuk koneksi antar device lapangan (seperti Inverter atau Metering) via RS-485 adalah...',
    options: [
      'TCP/IP',
      'Modbus RTU',
      'HTTP',
      'MQTT',
    ],
    correctIndex: 1,
    explanation:
      'Modbus RTU adalah protokol komunikasi industri paling dasar and populer yang bekerja di atas fisik RS-485. Menggunakan arsitektur Master-Slave (sekarang disebut Client-Server) di mana satu Master dapat menarik data dari hingga 247 Slave device.',
    moduleRef: 'L4-M2',
  },
];
