import { useState } from 'react';
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
import { Settings, Loader2 } from 'lucide-react';

import { Toaster, toast } from 'sonner';
import { useUserStore } from '@/store/userStore';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzVUSR1zaSNI8XdmAZsS-2oYxuTQqMH2Xowr8A9aZfqUPe4AlICdSnkJVmCIyItozMMuA/exec';

interface UserRegistrationProps {
  onComplete: (user: { name: string; email: string; whatsapp: string }) => void;
}

export function UserRegistration({ onComplete }: UserRegistrationProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sinkronisasi data ke cloud...');
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ ...formData, project: 'PLC_TRAINING', timestamp: new Date().toISOString() }),
      });
      
      toast.success('Pendaftaran berhasil! Selamat datang di sistem.', { id: toastId });
      
      setTimeout(() => {
        // Update global store
        const { updateSettings } = useUserStore.getState();
        updateSettings({ userName: formData.name });
        
        localStorage.setItem('plc_user_profile', JSON.stringify(formData));
        onComplete(formData);
      }, 1500);
      
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Gagal sinkronisasi, namun Anda tetap bisa masuk mode offline.', { id: toastId });
      
      setTimeout(() => {
        const { updateSettings } = useUserStore.getState();
        updateSettings({ userName: formData.name });
        localStorage.setItem('plc_user_profile', JSON.stringify(formData));
        onComplete(formData);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/95 backdrop-blur-xl transition-colors duration-500">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-text-primary">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-500/20">
            <Settings className="h-8 w-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black tracking-tight underline decoration-orange-500 underline-offset-4 text-center">PLC TRAINING SUITE</h1>
          <p className="text-text-muted text-sm mt-1 uppercase tracking-widest font-bold">Industrial Automation LMS</p>
        </div>
        
        <Card className="border-t-4 border-t-orange-600 shadow-2xl bg-bg-surface/90">
          <CardHeader>
            <CardTitle className="text-text-primary">Halo, Selamat Datang!</CardTitle>
            <CardDescription className="text-text-muted">Lengkapi data untuk mengakses sistem kendali virtual.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-text-primary">Nama Lengkap</Label>
                <Input 
                  id="name"
                  required 
                  className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-primary">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  required 
                  className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-text-primary">WhatsApp</Label>
                <Input 
                  id="whatsapp"
                  type="tel" 
                  required 
                  className="bg-bg-elevated border-border text-text-primary focus:border-orange-500 focus:ring-orange-500/20"
                  value={formData.whatsapp} 
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none h-12">
                {loading ? <Loader2 className="animate-spin" /> : 'MASUK KE SISTEM'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
