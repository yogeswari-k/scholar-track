// src/App.jsx
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/auth/AuthPage';
import Sidebar from './components/shared/Sidebar';
import Dashboard from './components/dashboard/Dashboard';
import SubjectsPage from './components/subjects/SubjectsPage';
import GradesPage from './components/grades/GradesPage';
import AttendancePage from './components/attendance/AttendancePage';
import GoalsPage from './components/goals/GoalsPage';
import './index.css';

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <AuthPage />;

  const pages = {
    dashboard:  <Dashboard onNav={setPage} />,
    subjects:   <SubjectsPage />,
    grades:     <GradesPage />,
    attendance: <AttendancePage />,
    goals:      <GoalsPage />,
  };

  return (
    <div className="app-shell">
      <Sidebar active={page} onNav={setPage} />
      <main className="main-content">
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem',
            background: 'var(--navy)',
            color: 'var(--gold-light)',
            border: '1px solid rgba(201,168,76,.3)',
          },
          success: { iconTheme: { primary: 'var(--gold)', secondary: 'var(--navy)' } },
        }}
      />
    </AuthProvider>
  );
}
