import type { QuizQuestion } from '@/types/assessment.types';

// ============================================================
// PLC Training Suite — Quiz Question Bank
// ============================================================

export const QUIZ_BANK: QuizQuestion[] = [
  // LEVEL 1: DASAR SENSOR & LOGIKA
  {
    id: 'l1-q1',
    category: 1,
    question: 'Apa fungsi utama dari Central Processing Unit (CPU) pada sebuah PLC?',
    options: [
      'Menghubungkan kabel power ke sensor',
      'Membaca input, mengeksekusi program, dan memperbarui output',
      'Mengubah tegangan AC menjadi DC',
      'Media penyimpanan fisik untuk hardware'
    ],
    correctIndex: 1,
    explanation: 'CPU adalah otak PLC yang bertugas melakukan siklus scan: membaca status input, memproses logika ladder, dan menulis hasilnya ke output.'
  },
  {
    id: 'l1-q2',
    category: 1,
    question: 'Instruksi "Normally Open" (NO) pada ladder logic akan bernilai TRUE jika...',
    options: [
      'Arus tidak mengalir ke input',
      'Input fisik dalam keadaan tidak aktif',
      'Input fisik mendapatkan sinyal tegangan (aktif)',
      'PLC dalam mode STOP'
    ],
    correctIndex: 2,
    explanation: 'Kontak NO (Normally Open) akan menutup (menghantarkan daya) hanya ketika alamat operand-nya bernilai TRUE atau aktif.'
  },
  {
    id: 'l1-q3',
    category: 1,
    question: 'Alamat I/O "X0" biasanya merujuk pada komponen...',
    options: ['Output Relay', 'Internal Memory', 'Input Fisik', 'Timer'],
    correctIndex: 2,
    explanation: 'Dalam standar penamaan (seperti Mitsubishi), awalan X digunakan untuk Input fisik dan Y untuk Output fisik.'
  },
  {
    id: 'l1-q4',
    category: 1,
    question: 'Manakah dari berikut ini yang merupakan perangkat output pada sistem PLC?',
    options: ['Limit Switch', 'Push Button', 'Solenoid Valve', 'Proximity Sensor'],
    correctIndex: 2,
    explanation: 'Solenoid valve digerakkan oleh output PLC, sedangkan switch dan sensor memberikan masukan (input) ke PLC.'
  },
  {
    id: 'l1-q5',
    category: 1,
    question: 'Apa yang dimaksud dengan "Fixed PLC"?',
    options: [
      'PLC yang tidak bisa rusak',
      'PLC dengan jumlah I/O yang terintegrasi (tidak bisa ditambah modul)',
      'PLC yang dipasang permanen di dinding',
      'PLC yang hanya memiliki satu instruksi'
    ],
    correctIndex: 1,
    explanation: 'Fixed PLC (atau Compact PLC) memiliki jumlah terminal I/O yang tetap dan tidak dapat diperluas dengan modul tambahan.'
  },
  {
    id: 'l1-q6',
    category: 1,
    question: 'Berapa besar tegangan standar I/O digital yang paling umum digunakan di industri?',
    options: ['5V DC', '12V DC', '24V DC', '220V AC'],
    correctIndex: 2,
    explanation: '24V DC adalah standar industri yang paling umum karena aman dan tahan terhadap noise dibanding tegangan rendah.'
  },
  {
    id: 'l1-q7',
    category: 1,
    question: 'Instruksi LDI (Load Inverse) berfungsi sebagai...',
    options: ['Kontak NO', 'Kontak NC', 'Coil Output', 'Reset'],
    correctIndex: 1,
    explanation: 'LDI adalah Load Inverse, yang secara visual direpresentasikan sebagai kontak Normally Closed (NC).'
  },
  {
    id: 'l1-q8',
    category: 1,
    question: 'Jika dua kontak NO dipasang secara paralel, maka ini membentuk logika...',
    options: ['AND', 'OR', 'NOT', 'NAND'],
    correctIndex: 1,
    explanation: 'Pemasangan paralel berarti jika salah satu ATAU kedua kontak aktif, maka daya akan mengalir (Logika OR).'
  },
  {
    id: 'l1-q9',
    category: 1,
    question: 'Apa arti dari istilah PWA dalam konteks aplikasi PLC Suite kita?',
    options: ['Power Wiring Area', 'Progressive Web App', 'PLC Wireless Access', 'Primary Work Array'],
    correctIndex: 1,
    explanation: 'PWA memungkinkan aplikasi web diinstal seperti aplikasi native dan bekerja secara offline.'
  },
  {
    id: 'l1-q10',
    category: 1,
    question: 'Apa komponen dasar yang digunakan untuk menyimpan program di dalam PLC?',
    options: ['RAM', 'EEPROM / Flash Memory', 'Harddisk', 'Floppy Disk'],
    correctIndex: 1,
    explanation: 'Program PLC disimpan di memori non-volatile seperti EEPROM agar tidak hilang saat listrik mati.'
  },

  // LEVEL 2: TIMING & COUNTING
  {
    id: 'l2-q1',
    category: 2,
    question: 'Apa perbedaan utama antara TON (Timer On Delay) dan TOF (Timer Off Delay)?',
    options: [
      'TON menunda waktu aktif, TOF menunda waktu mati',
      'TON hanya untuk input AC, TOF untuk DC',
      'TON tidak butuh alamat, TOF butuh',
      'Tidak ada perbedaan'
    ],
    correctIndex: 0,
    explanation: 'TON mulai menghitung saat input aktif, sedangkan TOF mulai menghitung saat input berubah dari aktif ke mati.'
  },
  {
    id: 'l2-q2',
    category: 2,
    question: 'Sebuah Timer TON memiliki preset K50 (dengan basis waktu 100ms). Berapa lama delay-nya?',
    options: ['5 detik', '50 detik', '0.5 detik', '5 menit'],
    correctIndex: 0,
    explanation: '50 * 100ms = 5000ms = 5 detik.'
  },
  {
    id: 'l2-q3',
    category: 2,
    question: 'Instruksi CTU (Count Up) akan menambah nilai akumulasi pada saat...',
    options: [
      'Input bernilai TRUE terus menerus',
      'Terjadi transisi input dari FALSE ke TRUE (Rising Edge)',
      'Input dimatikan',
      'Reset diaktifkan'
    ],
    correctIndex: 1,
    explanation: 'Counter bekerja berdasarkan pulsa/transisi (edge), bukan berdasarkan durasi aktifnya input.'
  },
  {
    id: 'l2-q4',
    category: 2,
    question: 'Logika "Self-Holding" (Latching) digunakan agar...',
    options: [
      'Output tetap menyala meskipun tombol Start sudah dilepas',
      'PLC tidak cepat panas',
      'Membatasi arus yang masuk',
      'Menghitung jumlah botol'
    ],
    correctIndex: 0,
    explanation: 'Latching mengunci status output menggunakan kontak bantu dari output itu sendiri yang dipasang paralel dengan tombol start.'
  },
  {
    id: 'l2-q5',
    category: 2,
    question: 'Apa yang terjadi pada nilai akumulasi Timer TON jika inputnya terputus sebelum mencapai preset?',
    options: [
      'Nilai berhenti di angka terakhir (Pause)',
      'Nilai langsung reset ke 0',
      'Nilai terus bertambah',
      'Output langsung menyala'
    ],
    correctIndex: 1,
    explanation: 'Timer standar (non-retentive) akan langsung kembali ke 0 jika kondisi inputnya tidak terpenuhi.'
  },
  {
    id: 'l2-q6',
    category: 2,
    question: 'Manakah instruksi yang benar untuk mematikan instruksi SET?',
    options: ['OFF', 'CLR', 'RST (Reset)', 'END'],
    correctIndex: 2,
    explanation: 'Pasangan dari instruksi SET adalah RST. SET mengunci status ON, RST mengunci status OFF.'
  },
  {
    id: 'l2-q7',
    category: 2,
    question: 'Berapa banyak alamat Timer yang biasanya bisa digunakan pada PLC kecil?',
    options: ['Hanya 1', 'Maksimal 10', 'Antara 64 hingga 256', 'Tidak terbatas'],
    correctIndex: 2,
    explanation: 'PLC modern bahkan yang compact biasanya menyediakan ratusan alamat area memori untuk Timer (T0-T255).'
  },
  {
    id: 'l2-q8',
    category: 2,
    question: 'Apa fungsi dari instruksi "M" (Internal Relay) pada PLC?',
    options: [
      'Menggerakkan motor secara langsung',
      'Sebagai kontak bantu internal (virtual relay) yang tidak memiliki terminal fisik',
      'Menyimpan data analog',
      'Memutus aliran listrik utama'
    ],
    correctIndex: 1,
    explanation: 'Internal Relay (Marker/Bit Memory) digunakan untuk menyimpan status logika di dalam program tanpa memakan terminal hardware.'
  },
  {
    id: 'l2-q9',
    category: 2,
    question: 'Pada instruksi Counter, kaki "R" (Reset) berfungsi untuk...',
    options: [
      'Memulai hitungan',
      'Mengembalikan nilai hitungan ke nol dan mematikan Output Done',
      'Mengubah CTU jadi CTD',
      'Mematikan PLC'
    ],
    correctIndex: 1,
    explanation: 'Input Reset memiliki prioritas tertinggi untuk menolkan nilai akumulasi counter.'
  },
  {
    id: 'l2-q10',
    category: 2,
    question: 'Instruksi TP (Timer Pulse) akan menghasilkan output aktif selama durasi tertentu sejak...',
    options: [
      'Input mati',
      'Trigger input aktif (sekali pulsa)',
      'Reset ditekan',
      'Setiap 1 menit'
    ],
    correctIndex: 1,
    explanation: 'TP akan memberikan pulsa dengan panjang tetap segera setelah trigger input terdeteksi HIGH.'
  },

  // LEVEL 3: ANALOG & MATH
  {
    id: 'l3-q1',
    category: 3,
    question: 'Berapa rentang nilai mentah (raw data) standar untuk input analog 12-bit?',
    options: ['0 - 100', '0 - 1023', '0 - 4095', '0 - 32767'],
    correctIndex: 2,
    explanation: '12-bit berarti 2 pangkat 12 = 4096 kombinasi (0-4095).'
  },
  {
    id: 'l3-q2',
    category: 3,
    question: 'Instruksi MOV (Move) digunakan untuk...',
    options: [
      'Memindahkan posisi fisik PLC',
      'Menyalin data dari satu register ke register lain',
      'Menggerakkan motor servo',
      'Menghapus seluruh program'
    ],
    correctIndex: 1,
    explanation: 'MOV adalah instruksi dasar manipulasi data untuk transfer nilai antar register memori (D).'
  },
  {
    id: 'l3-q3',
    category: 3,
    question: 'Mana tipe data yang digunakan untuk menyimpan bilangan desimal (koma) pada PLC?',
    options: ['Integer', 'Floating Point (Real)', 'Boolean', 'Word'],
    correctIndex: 1,
    explanation: 'Floating Point digunakan untuk perhitungan presisi tinggi yang melibatkan angka di belakang koma.'
  },
  {
    id: 'l3-q4',
    category: 3,
    question: 'Apa tujuan dari penskalaan (Scaling) pada input analog?',
    options: [
      'Agar kabel tidak panas',
      'Mengubah nilai mentah (0-4095) menjadi nilai fisik (misal 0-100 derajat Celcius)',
      'Mempercepat scan cycle',
      'Meningkatkan resolusi sensor'
    ],
    correctIndex: 1,
    explanation: 'Scaling mengubah angka digital mentah menjadi satuan engineering yang bisa dimengerti manusia.'
  },
  {
    id: 'l3-q5',
    category: 3,
    question: 'Sinyal analog industri mana yang paling tahan terhadap gangguan (noise) pada jarak jauh?',
    options: ['0-10V DC', '0-5V DC', '4-20mA', '1-5V DC'],
    correctIndex: 2,
    explanation: 'Sinyal arus (current loop 4-20mA) sangat tahan terhadap drop tegangan dan noise induksi elektromagnetik.'
  },
  {
    id: 'l3-q6',
    category: 3,
    question: 'Instruksi CMP (Compare) membandingkan dua nilai dan biasanya menghasilkan tiga output bit, yaitu...',
    options: [
      'ON, OFF, ERROR',
      'Lesser, Equal, Greater',
      'Start, Stop, Reset',
      'Input, Output, Memory'
    ],
    correctIndex: 1,
    explanation: 'CMP membandingkan S1 dan S2, lalu mengaktifkan bit memori tertentu jika S1 < S2, S1 = S2, atau S1 > S2.'
  },
  {
    id: 'l3-q7',
    category: 3,
    question: 'Apa yang dimaksud dengan Register "D" pada pemrograman PLC?',
    options: ['Device', 'Digital Input', 'Data Register (untuk menyimpan angka)', 'Duration'],
    correctIndex: 2,
    explanation: 'Register D digunakan untuk menyimpan variabel angka (16-bit atau 32-bit).'
  },
  {
    id: 'l3-q8',
    category: 3,
    question: 'Jika nilai D0 = 10 dan terjadi instruksi ADD D0 K5 D10, maka nilai akhir D10 adalah...',
    options: ['5', '10', '15', '50'],
    correctIndex: 2,
    explanation: 'ADD S1 S2 D berarti S1+S2 disimpan di D. Jadi 10 + 5 = 15.'
  },
  {
    id: 'l3-q9',
    category: 3,
    question: 'Berapa jumlah maksimum bit yang bisa ditampung dalam satu Word?',
    options: ['8 bit', '16 bit', '32 bit', '64 bit'],
    correctIndex: 1,
    explanation: 'Satu data word standar pada PLC terdiri dari 16 bit (0-15).'
  },
  {
    id: 'l3-q10',
    category: 3,
    question: 'Instruksi SUB D0 K10 D0 akan mengakibatkan...',
    options: [
      'Nilai D0 bertambah 10',
      'Nilai D0 berkurang 10 setiap kali instruksi aktif',
      'Nilai D0 menjadi nol',
      'Error pada PLC'
    ],
    correctIndex: 1,
    explanation: 'SUB adalah pengurangan. Karena hasilnya disimpan kembali di D0, maka akan terjadi decrement sebesar 10.'
  },

  // LEVEL 4: INDUSTRIAL & FAULT FINDING
  {
    id: 'l4-q1',
    category: 4,
    question: 'Apa kegunaan dari protokol komunikasi Modbus TCP/IP pada PLC?',
    options: [
      'Untuk mengunduh video',
      'Memungkinkan komunikasi antar PLC atau dengan sistem SCADA melalui jaringan Ethernet',
      'Menambah kecepatan scan CPU',
      'Mengunci program agar tidak bisa dibaca'
    ],
    correctIndex: 1,
    explanation: 'Modbus adalah protokol standar terbuka untuk pertukaran data antar perangkat industri.'
  },
  {
    id: 'l4-q2',
    category: 4,
    question: 'Manakah tindakan pertama yang paling benar saat melakukan troubleshooting PLC yang berstatus "FAULT" atau "ERROR"?',
    options: [
      'Ganti PLC dengan yang baru',
      'Matikan listrik pabrik',
      'Hubungkan komputer dan baca Diagnostic Buffer / Error Log',
      'Buka casing PLC untuk melihat komponen terbakar'
    ],
    correctIndex: 2,
    explanation: 'Error log di software PLC akan memberikan kode spesifik tentang letak kesalahan (apakah hardware fault, watchdog timeout, atau math error).'
  },
  {
    id: 'l4-q3',
    category: 4,
    question: 'Apa yang dimaksud dengan "Watchdog Timer" (WDT) pada sebuah PLC?',
    options: [
      'Alarm keamanan di pagar pabrik',
      'Sistem yang mendeteksi jika scan cycle berjalan terlalu lama (hang)',
      'Timer untuk memberi makan mesin',
      'Alat ukur tegangan input'
    ],
    correctIndex: 1,
    explanation: 'WDT memastikan keamanan; jika program terjebak dalam loop abadi, WDT akan mematikan PLC (STOP) untuk mencegah bahaya.'
  },
  {
    id: 'l4-q4',
    category: 4,
    question: 'Dalam standar keamanan mesin, "Master Control Relay" (MCR) berfungsi untuk...',
    options: [
      'Mengontrol kecepatan motor',
      'Memutus daya ke seluruh output dalam zona tertentu saat terjadi kondisi darurat',
      'Menghubungkan PLC ke internet',
      'Menyimpan log produksi'
    ],
    correctIndex: 1,
    explanation: 'MCR digunakan untuk mematikan kelompok output sekaligus demi keselamatan tanpa mematikan CPU PLC.'
  },
  {
    id: 'l4-q5',
    category: 4,
    question: 'Apa fungsi dari fitur "Force" pada software PLC?',
    options: [
      'Memaksa PLC bekerja 24 jam',
      'Memaksa status alamat I/O menjadi ON atau OFF tanpa mempedulikan kondisi fisik atau logika program',
      'Meningkatkan arus kabel',
      'Menghapus proteksi password'
    ],
    correctIndex: 1,
    explanation: 'Fitur Force berguna untuk testing hardware, namun sangat berbahaya jika digunakan saat mesin sedang beroperasi asli.'
  },
  {
    id: 'l4-q6',
    category: 4,
    question: 'Metode komunikasi RS-485 banyak dipilih untuk Modbus RTU karena...',
    options: [
      'Kabelnya sangat mahal',
      'Dapat menjangkau jarak hingga 1.2km dengan konfigurasi multi-drop (banyak device)',
      'Sudah tidak digunakan lagi',
      'Sangat lambat'
    ],
    correctIndex: 1,
    explanation: 'RS-485 menggunakan differential signalling yang sangat tangguh untuk komunikasi lapangan industri.'
  },
  {
    id: 'l4-q7',
    category: 4,
    question: 'Apa perbedaan mendasar antara HMI dan SCADA?',
    options: [
      'HMI biasanya berupa panel lokal di mesin, SCADA adalah sistem pengawasan pusat berbasis PC',
      'HMI lebih mahal dari SCADA',
      'SCADA tidak butuh PLC',
      'HMI hanya bisa untuk PLC kecil'
    ],
    correctIndex: 0,
    explanation: 'HMI (Human Machine Interface) fokus pada operasi satu mesin, SCADA mencakup akuisisi data dan kontrol seluruh area pabrik.'
  },
  {
    id: 'l4-q8',
    category: 4,
    question: 'Istilah "Sinking" dan "Sourcing" pada modul digital output merujuk pada...',
    options: [
      'Arah aliran arus listrik masuk atau keluar dari terminal output',
      'Harga modul PLC',
      'Kecepatan pengiriman data',
      'Jenis memori yang digunakan'
    ],
    correctIndex: 0,
    explanation: 'Sinking (NPN) menghubungkan beban ke gnd, Sourcing (PNP) memberikan tegangan (+) ke beban.'
  },
  {
    id: 'l4-q9',
    category: 4,
    question: 'Algoritma PID pada PLC paling sering digunakan untuk...',
    options: [
      'Menyimpan nama data login pengguna',
      'Kontrol variabel kontinu secara presisi seperti Tekanan, Suhu, atau Flow',
      'Menghitung jumlah total produk',
      'Membuat animasi di layar HMI'
    ],
    correctIndex: 1,
    explanation: 'Proportional-Integral-Derivative (PID) adalah loop tertutup untuk menjaga nilai proses tetap di target yang diinginkan.'
  },
  {
    id: 'l4-q10',
    category: 4,
    question: 'Mana yang BUKAN merupakan penyebab umum kegagalan pada output Relay PLC?',
    options: [
      'Kontak relay aus karena terlalu sering switching',
      'Beban induktif yang terlalu besar tanpa proteksi dioda/snubber',
      'Hubungan singkat pada beban',
      'Program ladder yang terlalu rapi'
    ],
    correctIndex: 3,
    explanation: 'Program yang rapi justru mempermudah maintenance; kegagalan relay biasanya disebabkan masalah fisik beban atau overcurrent.'
  }
];
