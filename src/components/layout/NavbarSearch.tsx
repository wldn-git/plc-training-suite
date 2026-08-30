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
      const notesStr = plc.notes || '';
      const notes = notesStr.toLowerCase();
      const comms = plc.communication ? plc.communication.join(' ').toLowerCase() : '';

      if (name.includes(q) || notes.includes(q) || comms.includes(q)) {
        results.push({
          id: `plc-${plc.brand}-${plc.series}`,
          category: 'katalog',
          title: `PLC ${plc.brand} ${plc.series}`,
          subtitle: `${notesStr ? notesStr + ' ' : ''}(${plc.digitalInput}DI / ${plc.digitalOutput}DO)`,
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
        className="w-full bg-[#f3f3f3] dark:bg-[#252526] border border-[#e1dfdd] dark:border-[#3f3f46] pl-9 pr-8 py-1.5 text-xs text-[#1f1f1f] dark:text-[#f3f3f3] placeholder:text-text-dim focus:outline-none focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4] transition-all font-sans"
      />

      {query.length > 0 && (
        <button
          onClick={() => {
            setQuery('');
            setIsOpen(false);
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-primary p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Results Dropdown Overlay */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#ffffff] dark:bg-[#1e1e1e] border border-[#e5e5e5] dark:border-[#3f3f46] shadow-2xl overflow-hidden z-50 animate-fade-in max-h-96 overflow-y-auto font-sans">
          {results.length > 0 ? (
            <div className="p-1 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-text-dim border-b border-[#e5e5e5] dark:border-[#333333] flex justify-between items-center bg-[#f9f9f9] dark:bg-[#252526]">
                <span>Hasil Pencarian ({results.length})</span>
                <span className="text-[9px] lowercase font-sans text-text-muted">Esc untuk tutup</span>
              </div>

              {results.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-start gap-2.5 p-2 hover:bg-[#f3f3f3] dark:hover:bg-[#2a2d2e] text-left transition-colors group cursor-pointer border border-transparent hover:border-[#e5e5e5] dark:hover:border-[#3f3f46]"
                >
                  <div className="mt-0.5 p-1 bg-[#ffffff] dark:bg-[#2d2d2d] border border-[#e5e5e5] dark:border-[#3f3f46]">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-[#1f1f1f] dark:text-white group-hover:text-[#0078d4] transition-colors truncate flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[#0078d4] transition-all transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-[11px] text-[#666666] dark:text-[#9d9d9d] truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              ))}

              {results.length > 8 && (
                <div className="px-3 py-1.5 text-center text-[11px] text-text-muted border-t border-[#e5e5e5] dark:border-[#333333]">
                  Menampilkan 8 dari {results.length} hasil
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 text-center text-text-muted text-xs">
              <p className="font-semibold text-text-primary">Tidak ditemukan hasil</p>
              <p className="mt-1 text-[11px]">Coba kata kunci lain seperti <span className="text-[#0078d4] font-mono">"Siemens"</span>, <span className="text-[#0078d4] font-mono">"Ladder"</span>, atau <span className="text-[#0078d4] font-mono">"Modbus"</span>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
