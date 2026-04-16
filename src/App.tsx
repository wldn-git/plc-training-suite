import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { UserRegistration } from '@/components/auth/UserRegistration';
import Dashboard from '@/pages/Dashboard/index';
import LearningIndex from '@/pages/Learning/LearningIndex';
import ModuleDetail from '@/pages/Learning/ModuleDetail';
import PLCList from '@/pages/Database/PLCList';
import AssessmentRoot from './pages/Assessment/AssessmentRoot';
import SettingsPage from '@/pages/Settings/index';
import PlantSandbox from '@/pages/PlantSandbox/index';
import { useUserStore } from '@/store/userStore';

// ============================================================
// App — Root Router & Provider Wrapper
// ============================================================

function App() {
  const { settings, updateSettings } = useUserStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Theme Sync
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('plc_user_profile');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        // Sync to Zustand if different
        if (parsed.name && settings.userName !== parsed.name) {
          updateSettings({ userName: parsed.name });
        }
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user) {
    return <UserRegistration onComplete={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageWrapper />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Learning */}
          <Route path="learning" element={<LearningIndex />} />
          <Route path="learning/:moduleId" element={<ModuleDetail />} />

          {/* Simulator & Sandbox */}
          <Route path="plant-sandbox" element={<PlantSandbox />} />

          {/* Database */}
          <Route path="database" element={<PLCList />} />

          {/* Assessment */}
          <Route path="assessment" element={<AssessmentRoot />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
