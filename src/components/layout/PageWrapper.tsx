import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { OfflineBanner } from './OfflineBanner';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Database,
  ClipboardCheck,
  Settings,
  Share2,
} from 'lucide-react';

// ============================================================
// Navigation Config
// ============================================================

const navItems = [
  { path: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/learning',   label: 'Materi',     icon: BookOpen },
  { path: '/protocols',  label: 'Protokol Comm', icon: Share2 },
  { path: '/database',       label: 'Katalog',    icon: Database },
  { path: '/assessment',     label: 'Kuis',       icon: ClipboardCheck },
  { path: '/settings',       label: 'Pengaturan', icon: Settings },
];

// ============================================================
// Sidebar Component
// ============================================================

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-[#f3f3f3] dark:bg-[#1f1f1f] border-r border-[#e5e5e5] dark:border-[#333333] h-screen sticky top-0 shrink-0 select-none transition-colors">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e5e5] dark:border-[#333333]">
        <div className="w-8 h-8 bg-[#0078d4] text-white flex items-center justify-center font-bold text-sm shadow-sm">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="font-sans font-bold text-[#1f1f1f] dark:text-white text-sm leading-tight">PLC Training</h1>
          <p className="font-mono text-[#0078d4] text-xs">Suite v1.0</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-xs font-sans transition-colors group ${
                isActive
                  ? 'bg-[#0078d4] text-white font-semibold shadow-sm'
                  : 'text-[#424242] dark:text-[#cccccc] hover:bg-[#e5e5e5] dark:hover:bg-[#2a2d2e] hover:text-[#000000] dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#666666] dark:text-[#858585] group-hover:text-[#1f1f1f] dark:group-hover:text-[#cccccc]'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#e5e5e5] dark:border-[#333333]">
        <p className="text-[#858585] font-mono text-[11px]">WLDN-Soft © 2025</p>
      </div>
    </aside>
  );
}

// ============================================================
// Mobile Bottom Nav
// ============================================================

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff] dark:bg-[#1f1f1f] border-t border-[#e5e5e5] dark:border-[#333333] transition-colors">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors ${
                isActive ? 'text-[#0078d4] font-bold' : 'text-[#858585]'
              }`
            }
          >
            {() => (
              <>
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-sans">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// Page Wrapper Layout
// ============================================================

export function PageWrapper() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      <Sidebar />

      <main className="flex-1 flex flex-col min-h-screen">
        <OfflineBanner />
        <Navbar />
        
        <div className="flex-1 flex flex-col pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex-1 p-4 lg:p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
