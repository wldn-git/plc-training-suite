import React from 'react';
import { useUserStore } from '@/store/userStore';
import { Sun, Moon, Bell, Search, User } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/titles';

export const Navbar: React.FC = () => {
  const { settings, toggleTheme } = useUserStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Search Placeholder */}
        <div className="hidden md:flex relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4" />
          <input
            type="text"
            placeholder="Cari materi atau katalog PLC..."
            className="w-full bg-bg-elevated/50 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>

        {/* Brand for Mobile */}
        <div className="lg:hidden flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-accent">
            <span className="font-mono font-black text-bg text-sm">P</span>
          </div>
          <span className="font-mono font-bold text-sm">PLC Suite</span>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors border border-transparent hover:border-border"
            title="Toggle Theme"
          >
            {settings.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors border border-transparent hover:border-border">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-bg shadow-accent" />
          </button>

          <div className="h-8 w-[1px] bg-border mx-1" />

          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-bg-elevated transition-colors group">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-bold text-text-primary leading-none group-hover:text-accent transition-colors">
                {settings.userName}
              </span>
              <span className="text-[9px] text-text-dim mt-0.5 font-mono uppercase tracking-tighter">
                {getLevelLabel(settings.maxLevel || 1)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-accent group-hover:shadow-accent transition-all">
              <User size={20} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
