import { useEffect, useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { 
  Trash2, HardDrive, ShieldAlert, Monitor, Moon, Sun, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { db } from '@/lib/db/db';
import { useUserStore } from '@/store/userStore';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';

export default function Settings() {
  const { settings, toggleTheme } = useUserStore();
  const [storageUsage, setStorageUsage] = useState<{ usage: number; quota: number }>({ usage: 0, quota: 0 });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  useEffect(() => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((estimate) => {
        setStorageUsage({
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
        });
      });
    }
  }, []);

  const resetAllData = async () => {
    await db.delete();
    localStorage.clear();
    window.location.reload();
  };

  const usageMB = (storageUsage.usage / (1024 * 1024)).toFixed(2);
  const quotaGB = (storageUsage.quota / (1024 * 1024 * 1024)).toFixed(2);
  const usagePercent = ((storageUsage.usage / storageUsage.quota) * 100).toFixed(4);
  const isStorageHeavy = parseFloat(usageMB) > 50;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in pb-20 mx-auto">
      <header className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/20 flex items-center justify-center text-accent">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-mono font-black text-text-primary italic uppercase tracking-tighter">
            System <span className="text-accent">Settings</span>
          </h1>
          <p className="text-text-muted text-sm font-medium">Konfigurasi environment dan manajemen data lokal.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Stats Card */}
        <div className="md:col-span-1 space-y-4">
           <Card className="p-6 text-center border-accent/20 bg-accent/5">
             <div className="w-24 h-24 rounded-full bg-bg-surface border-4 border-accent mx-auto mb-6 flex items-center justify-center shadow-accent/20 relative group">
                <span className="text-4xl font-black text-accent">{settings.userName.charAt(0)}</span>
                <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping opacity-20" />
             </div>
             <h3 className="font-mono text-xl font-bold text-text-primary tracking-tight">{settings.userName}</h3>
             <Badge variant="accent" className="mt-2 text-[10px] uppercase font-bold px-3">Senior Automation Engineer</Badge>
             
             <div className="h-[1px] bg-border my-8" />
             
             <div className="text-left space-y-4">
               <div>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">Status Lisensi</p>
                  <p className="text-xs text-text-primary font-bold">Standard Enterprise - PWA</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest mb-1">Last Sync</p>
                  <p className="text-xs text-text-primary font-bold">Local Storage Only</p>
               </div>
             </div>
           </Card>
        </div>

        {/* Main Settings Section */}
        <div className="md:col-span-2 space-y-8">
           {/* Section: Penampilan */}
           <section className="space-y-4">
             <h3 className="font-mono text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
               <Monitor size={14} className="text-accent" /> Interface Preferences
             </h3>
             <Card className="divide-y divide-border/20 overflow-hidden">
                <div 
                  className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${settings.theme === 'light' ? 'bg-accent/5' : 'hover:bg-white/5'}`}
                  onClick={() => settings.theme === 'light' ? null : toggleTheme()}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-warning shadow-inner">
                      <Sun size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Light Mode</p>
                      <p className="text-[11px] text-text-dim">UI Cerah untuk visibilitas tinggi.</p>
                    </div>
                  </div>
                  {settings.theme === 'light' ? <Badge variant="accent">Current</Badge> : <Button variant="ghost" size="sm">Select</Button>}
                </div>
                
                <div 
                  className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${settings.theme === 'dark' ? 'bg-accent/5' : 'hover:bg-white/5'}`}
                  onClick={() => settings.theme === 'dark' ? null : toggleTheme()}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-accent shadow-inner">
                      <Moon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary">Dark Industrial</p>
                      <p className="text-[11px] text-text-dim italic">Fokus tinggi, hemat energi (OLED).</p>
                    </div>
                  </div>
                  {settings.theme === 'dark' ? <Badge variant="accent">Current</Badge> : <Button variant="ghost" size="sm">Select</Button>}
                </div>
             </Card>
           </section>

           {/* Section: Data & Storage */}
           <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <HardDrive size={14} className="text-accent" /> Local Data Management
                </h3>
                {isStorageHeavy && (
                  <Badge variant="danger" className="animate-pulse">Storage Warning (&gt;50MB)</Badge>
                )}
             </div>
             <Card className="p-6 flex flex-col gap-5 border-border/40">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1">Storage Usage</span>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-mono font-black text-text-primary">{usageMB} MB</h4>
                      <span className="text-xs text-text-dim">of {quotaGB} GB quota</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold text-text-dim uppercase tracking-widest">Status</p>
                    <p className="text-lg font-mono font-black text-success italic uppercase tracking-tighter">Healthy</p>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-bg-elevated rounded-full overflow-hidden p-[2px] border border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${Math.max(1, parseFloat(usagePercent))}%` }}
                     className="h-full bg-accent rounded-full shadow-[0_0_10px_rgba(0,212,255,0.4)]" 
                   />
                </div>

                <div className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-border/50">
                  <ShieldAlert className="text-warning shrink-0" size={20} />
                  <p className="text-[11px] text-text-muted leading-tight font-medium">
                    Seluruh data Anda disimpan secara lokal. PLC Training Suite tidak menggunakan cloud 
                    untuk menjaga privasi dan kecepatan akses offline Anda.
                  </p>
                </div>

                <div className="pt-2">
                  <Button 
                    variant="danger" 
                    className="w-full shadow-danger/10 border-danger/20" 
                    onClick={() => setIsResetModalOpen(true)} 
                    leftIcon={<Trash2 size={16} />}
                  >
                    Reset Environment & Wipe Data
                  </Button>
                </div>
             </Card>
           </section>

           {/* Versi Info */}
           <div className="flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all py-8">
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-dim">Logic Scan Engine</span>
                <span className="text-[10px] font-mono font-black text-text-primary">v1.2.4-STABLE</span>
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-bold uppercase tracking-widest text-text-dim">PWA Manifest</span>
                <span className="text-[10px] font-mono font-black text-text-primary">v1.0.0-PRO</span>
              </div>
           </div>
        </div>
      </div>

      {/* Reset Modal Overlay */}
      <Modal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)}
        title="CRITICAL ACTION: DATA RESET"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={resetAllData}>YES, WIPE EVERYTHING</Button>
          </>
        }
      >
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <ShieldAlert size={32} />
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            Apakah Anda yakin ingin menghapus <span className="text-danger font-bold uppercase underline">Seluruh Data</span>?
          </p>
          <ul className="text-left text-[11px] text-text-muted space-y-2 bg-black/20 p-4 rounded-lg border border-border">
            <li>• Seluruh progres kurikulum (LMS) akan hilang.</li>
            <li>• Seluruh riwayat ujian & sertifikat akan dihapus.</li>
            <li>• Library PLC yang Anda buat akan musnah.</li>
            <li>• Project simulator tidak bisa dikembalikan.</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
}
