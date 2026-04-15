# PLC Training Suite (PLTS) - v1.0.0

![PLC Banner](https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000)

**PLC Training Suite (PLTS)** adalah platform edukasi progresif (PWA) yang dirancang untuk membantu teknisi dan pelajar menguasai sistem otomasi industri. Platform ini menggabungkan kurikulum tersertifikasi dengan simulator ladder logic real-time yang dapat diakses sepenuhnya secara offline.

## 🚀 Fitur Utama

- **Real-time Simulator Engine**: Eksekusi logika ladder (LD, TON, CTU, SET/RST) dengan visualisasi aliran daya yang interaktif.
- **Visual Ladder Editor**: Interface drag-and-drop untuk membangun logika PLC tanpa perlu hardware fisik.
- **LMS (Learning Management System)**: Kurikulum 4 level dari dasar hingga industrial avançado.
- **Sertifikasi Digital**: Uji kompetensi dan dapatkan sertifikat PDF resmi setelah lulus ujian minimal skor 80%.
- **Hardware Database**: Katalog perangkat PLC industri (Siemens, Mitsubishi, Allen Bradley, dll) yang dapat dikelola sendiri.
- **Offline First (PWA)**: Berjalan mulus tanpa internet. Simpan progres belajar dan desain simulator di database lokal (Dexie.js).

## 🛠️ Stack Teknologi

- **Core**: React 18, TypeScript, Vite
- **Styling**: Vanilla CSS (Premium Industrial Dark Theme)
- **State**: Zustand (Store Management)
- **Database**: Dexie.js (IndexedDB wrapper for production reliability)
- **Animations**: Framer Motion
- **PWA**: vite-plugin-pwa (Workbox caching strategies)
- **PDF**: jsPDF

## 📦 Instalasi & Pengembangan

1. Clone repository:
   ```bash
   git clone [repository-url]
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Build untuk produksi:
   ```bash
   npm run build
   ```

## 🏗️ Struktur Proyek

- `/src/lib/simulators`: Logika inti scan cycle dan instruksi PLC.
- `/src/store`: State global untuk UI, simulator, dan assessment.
- `/src/pages`: Implementasi view (Dashboard, Learning, Simulator, Assessment).
- `/src/components/plc-visuals`: Komponen UI khusus simulasi industrial.

---
Developed by **WLDN-SOFT-PRO**. 
*Advancing Industrial Automation Education in Indonesia.*
