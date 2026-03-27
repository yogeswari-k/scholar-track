// src/components/shared/Sidebar.jsx
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, Award, CalendarX, Target, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const NAV = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  { id: 'subjects',  label: 'SUBJECTS',  icon: BookOpen },
  { id: 'grades',    label: 'GRADE BOOK',icon: Award },
  { id: 'attendance',label: 'ATTENDANCE',icon: CalendarX },
  { id: 'goals',     label: 'GOALS',     icon: Target },
];

export default function Sidebar({ active, onNav }) {
  const { profile, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.success('Signed out');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>Scholar Track</h1>
        <p>B.TECH CSE ACADEMIC TRACKER</p>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`nav-item${active === id ? ' active' : ''}`}
            onClick={() => onNav(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="student-chip">
          <div className="student-avatar">
            {profile?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="student-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.name || 'Student'}
            </div>
            <div className="student-roll">{profile?.rollNumber} · Sem {profile?.currentSemester}</div>
          </div>
          <button className="btn-icon" onClick={handleLogout} title="Sign out" style={{ color: 'rgba(250,246,238,.4)' }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
