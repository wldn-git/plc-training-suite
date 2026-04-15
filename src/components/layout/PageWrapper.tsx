import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  Database,
  ClipboardCheck,
  Settings,
} from 'lucide-react';

// ============================================================
// Navigation Config
// ============================================================

const navItems = [
  { path: '/',           label: 'Dashboard',  icon: LayoutDashboard },
  { path: '/learning',   label: 'Materi',     icon: BookOpen },
  { path: '/simulator',  label: 'Simulator',  icon: Cpu },
  { path: '/database',   label: 'Katalog',    icon: Database },
  { path: '/assessment', label: 'Kuis',       icon: ClipboardCheck },
  { path: '/settings',   label: 'Pengaturan', icon: Settings },
];

// ============================================================
// Sidebar Component
// ============================================================

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-bg-surface border-r border-border h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-accent">
          <Cpu className="w-5 h-5 text-bg" />
        </div>
        <div>
          <h1 className="font-mono font-bold text-text-primary text-sm leading-tight">PLC Training</h1>
          <p className="font-mono text-accent text-xs">Suite v1.0</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans transition-all duration-200 group ${
                isActive
                  ? 'bg-accent/10 text-accent border border-border-accent shadow-accent'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-accent' : 'text-text-dim group-hover:text-text-muted'}`} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-text-dim font-mono text-xs">WLDN-Soft © 2025</p>
      </div>
    </aside>
  );
}

// ============================================================
// Mobile Bottom Nav
// ============================================================

function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.slice(0, 5).map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'text-accent' : 'text-text-dim'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
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

      <main className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
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
      </main>

      <MobileNav />
    </div>
  );
}
