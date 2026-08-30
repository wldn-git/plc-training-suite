import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Sun, Moon, Bell, User } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/titles';
import { UserProfileModal } from './UserProfileModal';
import { NavbarSearch } from './NavbarSearch';

export const Navbar: React.FC = () => {
  const { settings, toggleTheme } = useUserStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1f1f1f] border-b border-[#333333] select-none">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Functional Global Search */}
        <NavbarSearch />

        {/* Brand for Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0078d4] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <span>P</span>
          </div>
          <span className="font-sans font-bold text-sm text-white">PLC Suite</span>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-1.5 lg:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] transition-colors border border-transparent hover:border-[#3f3f46]"
            title="Toggle Theme"
          >
            {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="relative p-2 text-[#cccccc] hover:text-white hover:bg-[#2a2d2e] transition-colors border border-transparent hover:border-[#3f3f46]">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#0078d4] rounded-full shadow-sm" />
          </button>

          <div className="h-6 w-[1px] bg-[#333333] mx-1" />

          {/* User Button */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            title="Lihat Profil & Status Expire Login"
            className="flex items-center gap-2.5 px-2 py-1 hover:bg-[#2a2d2e] transition-colors group cursor-pointer border border-transparent hover:border-[#3f3f46]"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-semibold text-white leading-none group-hover:text-[#0078d4] transition-colors">
                {settings.userName}
              </span>
              <span className="text-[10px] text-[#858585] mt-0.5 font-mono uppercase tracking-tight">
                {getLevelLabel(settings.maxLevel || 1)}
              </span>
            </div>
            <div className="w-8 h-8 bg-[#2d2d2d] border border-[#3f3f46] flex items-center justify-center text-[#0078d4] group-hover:border-[#0078d4] transition-all">
              <User size={16} />
            </div>
          </button>
        </div>
      </div>

      {/* User Profile & Session Expiry Modal */}
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </header>
  );
};
