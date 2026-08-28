import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { getLevelLabel } from '@/lib/utils/titles';
import { 
  User, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  Mail, 
  Phone, 
  X, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfileData {
  name: string;
  email: string;
  whatsapp: string;
  loginTime?: number;
  expiresAt?: number;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useUserStore();
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedUser = localStorage.getItem('plc_user_profile');
      if (savedUser) {
        try {
          setProfile(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user profile', e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const now = Date.now();
  const expiresAt = profile?.expiresAt || (profile?.loginTime ? profile.loginTime + 3 * 24 * 60 * 60 * 1000 : now + 3 * 24 * 60 * 60 * 1000);
  const remainingMs = Math.max(0, expiresAt - now);
  
  // Calculate remaining time formatted
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const percentRemaining = Math.round((remainingMs / THREE_DAYS_MS) * 100);

  // Date formatting
  const formattedExpiryDate = new Date(expiresAt).toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sesi ini? Anda perlu login OTP kembali.')) {
      localStorage.removeItem('plc_user_profile');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 sm:pr-8 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-bg-surface/95 border border-border shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-transparent p-5 border-b border-border">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-600/30">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-bold text-text-primary text-base leading-tight">
                {profile?.name || settings.userName}
              </h3>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-[10px] font-mono font-semibold text-orange-400 uppercase">
                <Sparkles size={10} />
                <span>{getLevelLabel(settings.maxLevel || 1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          {/* Detail Akun */}
          <div className="space-y-2 bg-bg-elevated/40 p-3 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Mail size={14} className="text-orange-500 shrink-0" />
              <span className="truncate">{profile?.email || 'Email tidak tercatat'}</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-xs">
              <Phone size={14} className="text-orange-500 shrink-0" />
              <span>{profile?.whatsapp || 'WhatsApp tidak tercatat'}</span>
            </div>
          </div>

          {/* Card Info Expire Sesi */}
          <div className="p-4 rounded-xl bg-bg-elevated border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500 animate-pulse" />
                <span className="font-bold text-xs uppercase tracking-wider text-text-primary">
                  Status Sesi Login
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck size={10} /> AKTIF
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="bg-bg/60 p-3 rounded-lg border border-border/60">
              <div className="text-[11px] text-text-muted">Sisa Waktu Sesi (OTP 3 Hari):</div>
              <div className="text-lg font-black text-orange-500 mt-0.5 tracking-tight">
                {days > 0 ? `${days} Hari ${hours} Jam ${minutes} Menit` : `${hours} Jam ${minutes} Menit`}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden mt-2 border border-border/40">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentRemaining}%` }}
                />
              </div>
            </div>

            {/* Waktu Expire Detail */}
            <div className="flex items-start gap-2 text-xs text-text-muted">
              <Calendar size={14} className="text-orange-500 mt-0.5 shrink-0" />
              <div>
                <span>Kedaluwarsa Pada:</span>
                <div className="font-semibold text-text-primary text-[11px] mt-0.5">
                  {formattedExpiryDate} WIB
                </div>
              </div>
            </div>
          </div>

          {/* Action Button Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all hover:shadow-lg hover:shadow-red-500/10"
          >
            <LogOut size={16} />
            <span>Keluar Sesi (Logout OTP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
