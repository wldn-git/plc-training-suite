import React, { useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Sun, Moon, User } from 'lucide-react';
import { getLevelLabel } from '@/lib/utils/titles';
import { UserProfileModal } from './UserProfileModal';
import { NavbarSearch } from './NavbarSearch';
import { NotificationsFlyout } from './NotificationsFlyout';

export const Navbar: React.FC = () => {
  const { settings, toggleTheme } = useUserStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#ffffff] dark:bg-[#1f1f1f] border-b border-[#e5e5e5] dark:border-[#333333] transition-colors select-none">
      <div className="flex h-14 items-center justify-between px-4 lg:px-6">
        {/* Functional Global Search */}
        <NavbarSearch />

        {/* Brand for Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0078d4] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            <span>P</span>
          </div>
          <span className="font-sans font-bold text-sm text-[#1f1f1f] dark:text-white">PLC Suite</span>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-1.5 lg:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 text-[#424242] dark:text-[#cccccc] hover:text-[#000000] dark:hover:text-white hover:bg-[#f3f3f3] dark:hover:bg-[#2a2d2e] transition-colors border border-transparent hover:border-[#e5e5e5] dark:hover:border-[#3f3f46]"
            title={settings.theme === 'dark' ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
          >
            {settings.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Interactive Notifications Action Center */}
          <NotificationsFlyout />

          <div className="h-6 w-[1px] bg-[#e5e5e5] dark:bg-[#333333] mx-1" />

          {/* User Button */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            title="Lihat Profil & Status Expire Login"
            className="flex items-center gap-2.5 px-2 py-1 hover:bg-[#f3f3f3] dark:hover:bg-[#2a2d2e] transition-colors group cursor-pointer border border-transparent hover:border-[#e5e5e5] dark:hover:border-[#3f3f46]"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-xs font-semibold text-[#1f1f1f] dark:text-white leading-none group-hover:text-[#0078d4] transition-colors">
                {settings.userName}
              </span>
              <span className="text-[10px] text-[#666666] dark:text-[#858585] mt-0.5 font-mono uppercase tracking-tight">
                {getLevelLabel(settings.maxLevel || 1)}
              </span>
            </div>
            <div className="w-8 h-8 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e5e5e5] dark:border-[#3f3f46] flex items-center justify-center text-[#0078d4] group-hover:border-[#0078d4] transition-all">
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
