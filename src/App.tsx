import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import Dashboard from '@/pages/Dashboard/index';
import LearningIndex from '@/pages/Learning/LearningIndex';
import ModuleDetail from '@/pages/Learning/ModuleDetail';
import SimulatorCanvas from '@/pages/Simulator/SimulatorCanvas';
import PLCList from '@/pages/Database/PLCList';
import QuizSelector from '@/pages/Assessment/QuizSelector';
import SettingsPage from '@/pages/Settings/index';

// ============================================================
// App — Root Router & Provider Wrapper
// ============================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageWrapper />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Learning */}
          <Route path="learning" element={<LearningIndex />} />
          <Route path="learning/:moduleId" element={<ModuleDetail />} />

          {/* Simulator */}
          <Route path="simulator" element={<SimulatorCanvas />} />
          <Route path="simulator/:projectId" element={<SimulatorCanvas />} />

          {/* Database */}
          <Route path="database" element={<PLCList />} />

          {/* Assessment */}
          <Route path="assessment" element={<QuizSelector />} />

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
