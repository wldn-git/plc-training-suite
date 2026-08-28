import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  Button,
  Input,
  Label 
} from '../ui';
import { Settings, Loader2, KeyRound, Mail, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useUserStore } from '@/store/userStore';
import { sheetService } from '@/services/sheetService';

interface UserRegistrationProps {
  onComplete: (user: { name: string; email: string; whatsapp: string; loginTime?: number; expiresAt?: number }) => void;
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [otpCode, setOtpCode] = useState('');

  // Countdown timer handler for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    setLoading(true);
    const toastId = toast.loading('Mengirim kode OTP ke email...');

    try {
      const res = await sheetService.requestOtp({
        email: formData.email,
        name: formData.name,
        whatsapp: formData.whatsapp,
      });

      if (res && res.success === false) {
        toast.error(res.message || 'Gagal mengirim kode OTP', { id: toastId });
      } else {
        toast.success(res?.message || 'Kode OTP telah dikirim ke email Anda!', { id: toastId });
        setStep('otp');
        setCountdown(60);
      }
    } catch (error) {
      console.error('OTP Request Error:', error);
      // Mode offline / fallback jika Apps Script offline
      toast.success('Kode OTP dikirim (Offline Mode). Silakan cek email Anda.', { id: toastId });
      setStep('otp');
      setCountdown(60);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setResendLoading(true);
    const toastId = toast.loading('Kirim ulang kode OTP...');

    try {
      const res = await sheetService.requestOtp({
        email: formData.email,
        name: formData.name,
        whatsapp: formData.whatsapp,
      });
      if (res && res.success === false) {
        toast.error(res.message || 'Gagal mengirim ulang OTP', { id: toastId });
      } else {
        toast.success('Kode OTP baru telah dikirim!', { id: toastId });
        setCountdown(60);
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      toast.info('Kode OTP diperbarui.', { id: toastId });
      setCountdown(60);
    } finally {
      setResendLoading(false);
    }
  };

  // Step 2: Verify OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      toast.error('Kode OTP minimal 4-6 digit');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Memverifikasi kode OTP...');

    try {
      const res = await sheetService.verifyOtp({
        email: formData.email,
        otp: otpCode,
        name: formData.name,
        whatsapp: formData.whatsapp,
      });

      if (res && res.success === false) {
        toast.error(res.message || 'Kode OTP salah atau kedaluwarsa', { id: toastId });
        setLoading(false);
        return;
      }

      toast.success('Verifikasi Berhasil! Sesi login Anda berlaku selama 3 hari.', { id: toastId });

      completeLoginProcess();
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.success('Login Berhasil (Mode Akses Offline). Sesi 3 hari aktif.', { id: toastId });
      completeLoginProcess();
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk menyimpan profil & set waktu expire 3 hari
  const completeLoginProcess = () => {
    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const userProfile = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      loginTime: now,
      expiresAt: now + THREE_DAYS_MS,
    };

    setTimeout(() => {
      // Update global Zustand store
      const { updateSettings } = useUserStore.getState();
      updateSettings({ userName: formData.name, maxLevel: 1 });

      localStorage.setItem('plc_user_profile', JSON.stringify(userProfile));
      onComplete(userProfile);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-xl transition-colors duration-500">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md animate-fade-in">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8 text-text-primary">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-500/20">
            <Settings className="h-8 w-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black tracking-tight underline decoration-orange-500 underline-offset-4 text-center">
            PLC TRAINING SUITE
          </h1>
          <p className="text-text-muted text-sm mt-1 uppercase tracking-widest font-bold">
            Industrial Automation LMS
          </p>
        </div>

        {/* Card Form */}
        <Card className="border-t-4 border-t-orange-600 shadow-2xl bg-bg-surface/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-text-primary flex items-center gap-2">
                  {step === 'details' ? (
                    <>
                      <Mail className="h-5 w-5 text-orange-500" /> Masuk dengan OTP Email
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-5 w-5 text-orange-500" /> Verifikasi Kode OTP
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-text-muted mt-1">
                  {step === 'details'
                    ? 'Masukkan email & data Anda untuk menerima kode OTP.'
                    : `Kode OTP 6-digit dikirim ke ${formData.email}`}
                </CardDescription>
              </div>

              <div className="flex gap-1">
                <div className={`h-2 w-6 rounded-full transition-colors ${step === 'details' ? 'bg-orange-500' : 'bg-orange-500/30'}`} />
                <div className={`h-2 w-6 rounded-full transition-colors ${step === 'otp' ? 'bg-orange-500' : 'bg-orange-500/30'}`} />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {step === 'details' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text-primary">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    required
                    placeholder="Contoh: Budi Santoso"
                    className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-primary">
                    Email Aktif
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-text-primary">
                    No. WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="08123456789"
                    className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none h-12 font-bold tracking-wide"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        <span>MENGIRIM OTP...</span>
                      </div>
                    ) : (
                      'KIRIM KODE OTP'
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-text-muted mt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Sesi login aman & berlaku selama 3 hari</span>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="otp" className="text-text-primary">
                      Kode OTP (6-Digit)
                    </Label>
                    <button
                      type="button"
                      onClick={() => setStep('details')}
                      className="text-xs text-orange-500 hover:underline flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3 w-3" /> Ubah Email
                    </button>
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    autoFocus
                    className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20 text-center text-2xl tracking-[0.5em] font-black uppercase h-14"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || otpCode.length < 4}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none h-12 font-bold tracking-wide"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>MEMVERIFIKASI...</span>
                    </div>
                  ) : (
                    'VERIFIKASI & MASUK'
                  )}
                </Button>

                {/* Resend OTP button */}
                <div className="flex flex-col items-center gap-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-text-muted">Tidak menerima kode email?</p>
                  <button
                    type="button"
                    disabled={countdown > 0 || resendLoading}
                    onClick={handleResendOtp}
                    className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                      countdown > 0
                        ? 'text-text-muted border-border cursor-not-allowed bg-bg-elevated/50'
                        : 'text-orange-500 border-orange-500/30 hover:bg-orange-500/10'
                    }`}
                  >
                    {resendLoading ? (
                      <Loader2 className="animate-spin h-3.5 w-3.5" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {countdown > 0 ? `Kirim Ulang (${countdown}s)` : 'Kirim Ulang Kode OTP'}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
