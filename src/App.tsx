import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import OnboardingWizard from './components/OnboardingWizard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivacySettings from './pages/PrivacySettings';
import Community from './pages/Community';
import LearningPaths from './pages/LearningPaths';
import Pricing from './pages/Pricing';
import Corpo from './pages/Corpo';
import Mente from './pages/Mente';
import Postura from './pages/Postura';
import VidaAfetiva from './pages/VidaAfetiva';
import Sexualidade from './pages/Sexualidade';
import Disciplina from './pages/Disciplina';
import Carreira from './pages/Carreira';
import Desafios from './pages/Desafios';
import Tools from './pages/Tools';
import { Toaster } from 'sonner';

// Authentication temporarily disabled - direct access to all areas
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/app/dashboard" />} />
        <Route path="/register" element={<Navigate to="/app/dashboard" />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />

        <Route path="/app" element={<Layout />}>
          <Route index element={<Navigate to="/app/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="corpo" element={<Corpo />} />
          <Route path="mente" element={<Mente />} />
          <Route path="postura" element={<Postura />} />
          <Route path="vida-afetiva" element={<VidaAfetiva />} />
          <Route path="sexualidade" element={<Sexualidade />} />
          <Route path="disciplina" element={<Disciplina />} />
          <Route path="carreira" element={<Carreira />} />
          <Route path="challenges" element={<Desafios />} />
          <Route path="content" element={<LearningPaths />} />
          <Route path="community" element={<Community />} />
          <Route path="tools" element={<Tools />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="settings" element={<PrivacySettings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="general-settings" element={<Settings />} />
        </Route>
      </Routes>

      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        duration={4000}
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#e5e5e5',
          },
        }}
      />
    </>
  );
}

export default App;