import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Cpu, Network, LayoutDashboard, ArrowRight, Award, Settings } from 'lucide-react';
import { ALL_MODULES } from '@/constants/learningModules';
import { DEFAULT_PLC_BRANDS } from '@/constants/defaultPLCBrands';

interface SearchResultItem {
  id: string;
  category: 'materi' | 'katalog' | 'protokol' | 'navigasi';
  title: string;
  subtitle: string;
  path: string;
  icon: React.ReactNode;
}

export const NavbarSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const q = query.trim().toLowerCase();

  // Search logic
  const results: SearchResultItem[] = [];

  if (q.length > 0) {
    // 1. Match Learning Modules
    ALL_MODULES.forEach((mod) => {
      const matchTitle = mod.title.toLowerCase().includes(q);
      const matchDesc = mod.description.toLowerCase().includes(q);
      const matchPage = mod.pages.some((p) => p.title.toLowerCase().includes(q));

      if (matchTitle || matchDesc || matchPage) {
        results.push({
          id: `mod-${mod.id}`,
          category: 'materi',
          title: `${mod.id}: ${mod.title}`,
          subtitle: mod.description,
          path: `/learning/${mod.id}`,
          icon: <BookOpen className="w-4 h-4 text-orange-500 shrink-0" />,
        });
      }
    });

    // 2. Match PLC Catalog
    DEFAULT_PLC_BRANDS.forEach((plc) => {
      const name = `${plc.brand} ${plc.series}`.toLowerCase();
      const notes = plc.notes.toLowerCase();
      const comms = plc.communication.join(' ').toLowerCase();

      if (name.includes(q) || notes.includes(q) || comms.includes(q)) {
        results.push({
          id: `plc-${plc.brand}-${plc.series}`,
          category: 'katalog',
          title: `PLC ${plc.brand} ${plc.series}`,
          subtitle: `${plc.notes} (${plc.digitalInput}DI / ${plc.digitalOutput}DO)`,
          path: '/database',
          icon: <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />,
        });
      }
    });

    // 3. Match Protocols
    const protocols = [
      { name: 'Modbus RTU / TCP', desc: 'Simulasi & Monitoring Protokol Seri & Ethernet Modbus', path: '/protocols' },
      { name: 'MQTT Broker', desc: 'Simulasi Pub/Sub IoT Industrial Communication', path: '/protocols' },
      { name: 'PROFINET', desc: 'Standar Komunikasi Real-time Siemens Industrial Ethernet', path: '/protocols' },
      { name: 'EtherNet/IP', desc: 'Industrial Protocol Rockwell Automation / Allen-Bradley', path: '/protocols' },
    ];

    protocols.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || 'protokol'.includes(q) || 'protocol'.includes(q)) {
        results.push({
          id: `proto-${p.name}`,
          category: 'protokol',
          title: p.name,
          subtitle: p.desc,
          path: p.path,
          icon: <Network className="w-4 h-4 text-emerald-400 shrink-0" />,
        });
      }
    });

    // 4. Match App Navigation
    const navItems = [
      { name: 'Dashboard Utama', desc: 'Ringkasan modul, statistik, & progres belajar', path: '/', icon: <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" /> },
      { name: 'Katalog PLC Database', desc: 'Spesifikasi teknis & perbandingan merk PLC', path: '/database', icon: <Cpu className="w-4 h-4 text-cyan-400 shrink-0" /> },
      { name: 'Pusat Ujian / Assessment', desc: 'Kuis interaktif & klaim sertifikasi tingkat PLC', path: '/assessment', icon: <Award className="w-4 h-4 text-amber-400 shrink-0" /> },
      { name: 'Pengaturan / Settings', desc: 'Preferensi tema, reset data, & profil', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-400 shrink-0" /> },
    ];

    navItems.forEach((nav) => {
      if (nav.name.toLowerCase().includes(q) || nav.desc.toLowerCase().includes(q)) {
        results.push({
          id: `nav-${nav.path}`,
          category: 'navigasi',
          title: nav.name,
          subtitle: nav.desc,
          path: nav.path,
          icon: nav.icon,
        });
      }
    });
  }

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className="hidden md:flex relative w-80 lg:w-96">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setIsOpen(true);
        }}
        placeholder="Cari materi, PLC, atau protokol..."
        className="w-full bg-bg-elevated border border-border rounded-xl pl-10 pr-9 py-2 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
      />

      {query.length > 0 && (
        <button
          onClick={() => {
            setQuery('');
            setIsOpen(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary p-0.5 rounded-full hover:bg-bg-surface transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Results Dropdown Overlay (Solid background) */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-text-dim border-b border-border/50 flex justify-between items-center">
                <span>Hasil Pencarian ({results.length})</span>
                <span className="text-[9px] lowercase font-sans text-text-muted">Tekan Esc untuk tutup</span>
              </div>

              {results.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-bg-elevated text-left transition-colors group cursor-pointer"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-bg-elevated group-hover:bg-bg-surface border border-border/40 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-text-primary group-hover:text-orange-500 transition-colors truncate flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-orange-500 transition-all transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-text-muted truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}

              {results.length > 8 && (
                <div className="px-3 py-2 text-center text-xs text-text-muted border-t border-border/50">
                  Menampilkan 8 dari {results.length} hasil
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-text-muted text-xs">
              <p className="font-semibold text-text-primary">Tidak ditemukan hasil</p>
              <p className="mt-1 text-[11px]">Coba kata kunci lain seperti <span className="text-orange-400 font-mono">"Siemens"</span>, <span className="text-orange-400 font-mono">"Ladder"</span>, atau <span className="text-orange-400 font-mono">"Modbus"</span>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
