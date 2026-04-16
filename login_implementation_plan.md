# Rencana Implementasi Sistem Registrasi/Login (PLC Training Suite)

Dokumen ini berisi instruksi dan potongan kode untuk menerapkan sistem "User Gatekeeper" dari PLTS ke PLC Training Suite.

## 1. Persiapan Komponen
Buat file baru di `src/components/auth/UserRegistration.tsx`.

### Logika Utama:
- Menggunakan `localStorage` dengan key `plc_user_profile`.
- Sinkronisasi data ke Google Sheets (Apps Script).
- Menggunakan backdrop blur premium untuk kesan industrial (Orange/Industrial theme).

## 2. Snippet Komponen (`UserRegistration.tsx`)
```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Settings, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

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
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ ...formData, project: 'PLC_TRAINING', timestamp: new Date().toISOString() }),
      });
      localStorage.setItem('plc_user_profile', JSON.stringify(formData));
      onComplete(formData);
    } catch (error) {
      localStorage.setItem('plc_user_profile', JSON.stringify(formData));
      onComplete(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8 text-white">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-orange-500/20">
            <Settings className="h-8 w-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black tracking-tight underline decoration-orange-500 underline-offset-4 text-center">PLC TRAINING SUITE</h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Industrial Automation LMS</p>
        </div>
        
        <Card className="border-t-4 border-t-orange-600 shadow-2xl bg-white/95">
          <CardHeader>
            <CardTitle>Halo, Selamat Datang!</CardTitle>
            <CardDescription>Lengkapi data untuk mengakses sistem kendali virtual.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input type="tel" required value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
                {loading ? <Loader2 className="animate-spin" /> : 'MASUK KE SISTEM'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## 3. Integrasi ke `App.tsx`
Modifikasi file `src/App.tsx` untuk mengecek status user sebelum merender router utama.

```tsx
function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('plc_user_profile');
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user) {
    return <UserRegistration onComplete={setUser} />;
  }

  return (
    <BrowserRouter>
      {/* Konten aplikasi PLC yang sudah ada */}
    </BrowserRouter>
  );
}
```
