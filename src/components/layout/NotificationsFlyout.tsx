import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  Trash2,
  BookOpen,
  Award,
  Cpu,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  type: 'learning' | 'system' | 'award' | 'simulator';
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Modul Webinar Basic PLC Tersedia!',
    desc: 'Pelajari konsep Scan Cycle, dasar Ladder Diagram, dan arsitektur Industri 4.0 secara interaktif.',
    time: 'Baru saja',
    read: false,
    type: 'learning',
    link: '/learning/article-basic-plc'
  },
  {
    id: 'n2',
    title: 'Digital Twin PLC Simulator Aktif',
    desc: 'Simulasi hardware dan visualisasi alur listrik IEC 61131-3 siap dijalankan di modul materi.',
    time: '10 menit lalu',
    read: false,
    type: 'simulator',
    link: '/learning'
  },
  {
    id: 'n3',
    title: 'Ujian Sertifikasi Tingkat Pemula',
    desc: 'Selesaikan kuis dengan skor minimal 80% untuk membuka sertifikat kompetensi PLC.',
    time: '1 jam lalu',
    read: false,
    type: 'award',
    link: '/assessment'
  },
  {
    id: 'n4',
    title: 'PWA Offline Cache Siap',
    desc: 'Aplikasi PLC Training Suite kini dapat diakses secara offline tanpa koneksi internet.',
    time: 'Hari ini',
    read: true,
    type: 'system'
  }
];

export const NotificationsFlyout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('plc_suite_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('plc_suite_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markOneRead = (id: string, link?: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (link) {
      navigate(link);
      setIsOpen(false);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'learning':
        return <BookOpen size={14} className="text-[#0078d4]" />;
      case 'simulator':
        return <Cpu size={14} className="text-[#107c41]" />;
      case 'award':
        return <Award size={14} className="text-[#ffb900]" />;
      default:
        return <Sparkles size={14} className="text-[#858585]" />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Pusat Pemberitahuan (Action Center)"
        className={`relative p-2 transition-colors border ${
          isOpen
            ? 'bg-[#0078d4] text-white border-[#005a9e]'
            : 'text-text-muted hover:text-text-primary hover:bg-[#f3f3f3] dark:hover:bg-[#2a2d2e] border-transparent hover:border-[#e5e5e5] dark:hover:border-[#3f3f46]'
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-1 bg-[#0078d4] text-white text-[9px] font-bold rounded-none flex items-center justify-center font-mono">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Windows 10 Action Center Flyout */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#ffffff] dark:bg-[#1e1e1e] border border-[#e5e5e5] dark:border-[#3f3f46] shadow-2xl z-50 animate-fade-in font-sans select-none">
          {/* Header */}
          <div className="bg-[#f3f3f3] dark:bg-[#2d2d2d] px-3.5 py-2.5 border-b border-[#e5e5e5] dark:border-[#3f3f46] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-[#0078d4]" />
              <span className="text-xs font-bold text-[#1f1f1f] dark:text-white">
                Pemberitahuan Sistem ({unreadCount} baru)
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#858585] hover:text-[#1f1f1f] dark:hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          </div>

          {/* Action Toolbar */}
          {notifications.length > 0 && (
            <div className="px-3.5 py-1.5 bg-[#f9f9f9] dark:bg-[#252526] border-b border-[#e5e5e5] dark:border-[#333333] flex items-center justify-between text-[11px]">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-[#0078d4] hover:underline disabled:opacity-40 disabled:no-underline flex items-center gap-1 font-medium"
              >
                <Check size={12} /> Tandai semua dibaca
              </button>
              <button
                onClick={clearAll}
                className="text-[#858585] hover:text-[#d13438] flex items-center gap-1 font-medium transition-colors"
              >
                <Trash2 size={12} /> Bersihkan
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#e5e5e5] dark:divide-[#333333]">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markOneRead(item.id, item.link)}
                  className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 ${
                    !item.read
                      ? 'bg-[#0078d4]/5 dark:bg-[#0078d4]/10 hover:bg-[#0078d4]/10 dark:hover:bg-[#0078d4]/15'
                      : 'hover:bg-[#f3f3f3] dark:hover:bg-[#252526]'
                  }`}
                >
                  <div className="p-1.5 bg-[#ffffff] dark:bg-[#2d2d2d] border border-[#e5e5e5] dark:border-[#3f3f46] shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-xs truncate ${
                          !item.read
                            ? 'font-bold text-[#1f1f1f] dark:text-white'
                            : 'font-medium text-[#424242] dark:text-[#cccccc]'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#858585] font-mono shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#666666] dark:text-[#9d9d9d] mt-1 leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                    {item.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#0078d4] font-semibold mt-1.5 hover:underline">
                        Buka Halaman <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[#858585]">
                <p className="font-semibold text-[#1f1f1f] dark:text-white">Tidak ada pemberitahuan baru</p>
                <p className="text-[11px] text-[#858585] mt-1">Anda sudah membaca semua pemberitahuan.</p>
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="bg-[#f3f3f3] dark:bg-[#252526] px-3.5 py-1.5 border-t border-[#e5e5e5] dark:border-[#333333] text-[10px] text-[#858585] font-mono flex items-center justify-between">
            <span>Windows 10 Action Center</span>
            <span>PLC Training Suite</span>
          </div>
        </div>
      )}
    </div>
  );
};
