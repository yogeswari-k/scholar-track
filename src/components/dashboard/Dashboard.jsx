// src/components/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllSubjects, getGoals } from '../../services/dataService';
import { calcCGPA, calcSGPA, GRADE_COLORS } from '../../utils/cseData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { Bell, TrendingUp, BookCheck, CalendarX, Target } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard({ onNav }) {
  const { profile, user } = useAuth();
  const [allSubjects, setAllSubjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [subs, g] = await Promise.all([
        getAllSubjects(user.uid),
        getGoals(user.uid),
      ]);
      setAllSubjects(subs);
      setGoals(g);
      setLoading(false);
    }
    load();
  }, [user.uid]);

  const cgpa = calcCGPA(allSubjects);
  const totalAbsents = allSubjects.reduce((a, s) => a + (s.absentCount || 0), 0);

  // SGPA by semester
  const sgpaData = [];
  for (let sem = 1; sem <= 8; sem++) {
    const semSubs = allSubjects.filter(s => s.id?.startsWith(`${sem}_`));
    const sgpa = calcSGPA(semSubs);
    if (sgpa > 0) sgpaData.push({ sem: `S${sem}`, sgpa });
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayGoals = goals.filter(g => g.type === 'daily' && g.createdAt?.startsWith(today));
  const hasTodayGoals = todayGoals.length > 0;

  // Current sem subjects
  const sem = profile?.currentSemester || 1;
  const currSubs = allSubjects.filter(s => s.id?.startsWith(`${sem}_`));
  const gradedCount = currSubs.filter(s => s.grade).length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="text-sm text-soft font-ui" style={{ letterSpacing: '.08em', textTransform: 'uppercase' }}>
          {format(new Date(), 'EEEE, d MMMM yyyy')}
        </div>
        <div className="page-title">
          Good {getGreeting()}, {profile?.name?.split(' ')[0]}
        </div>
        <div className="page-subtitle">{profile?.collegeName} · {profile?.department} · {profile?.batch}</div>
        <div className="gold-rule" />
      </div>

      {/* Reminder Banner */}
      {!hasTodayGoals && (
        <div className="reminder-banner">
          <Bell size={22} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy)', fontSize: '.95rem' }}>
              No goals set for today!
            </div>
            <div className="text-sm text-soft">Track your daily work and learning progress.</div>
          </div>
          <button className="btn btn-gold btn-sm" onClick={() => onNav('goals')}>Add Goals</button>
        </div>
      )}

      {/* KPI Row */}
      <div className="kpi-grid">
        <KpiCard label="CGPA" value={cgpa > 0 ? cgpa : '—'} sub="Cumulative" icon={<TrendingUp size={18} color="var(--gold)" />} />
        <KpiCard label="Current Sem" value={`Sem ${sem}`} sub={profile?.department} icon={<BookCheck size={18} color="var(--gold)" />} />
        <KpiCard label="Total Absents" value={totalAbsents} sub="This semester" icon={<CalendarX size={18} color={totalAbsents > 18 ? 'var(--error)' : 'var(--gold)'} />} accent={totalAbsents > 18 ? 'var(--error)' : undefined} />
        <KpiCard label="Goals Done" value={goals.filter(g => g.status === 'done').length} sub={`of ${goals.length} total`} icon={<Target size={18} color="var(--gold)" />} />
      </div>

      {/* Charts + Quick Stats */}
      <div className="two-col" style={{ marginBottom: 28 }}>
        {/* SGPA Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">SGPA Progression</span>
            <span className="text-xs text-soft font-ui">All Semesters</span>
          </div>
          <div className="card-body">
            {sgpaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={sgpaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
                  <XAxis dataKey="sem" tick={{ fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--text-soft)' }} />
                  <YAxis domain={[0, 10]} tick={{ fontFamily: 'var(--font-ui)', fontSize: 11, fill: 'var(--text-soft)' }} />
                  <Tooltip
                    contentStyle={{ fontFamily: 'var(--font-ui)', fontSize: 12, border: '1px solid var(--divider)', borderRadius: 6, background: 'var(--cream)' }}
                    formatter={(v) => [v.toFixed(2), 'SGPA']}
                  />
                  <Line type="monotone" dataKey="sgpa" stroke="var(--navy)" strokeWidth={2.5} dot={{ fill: 'var(--gold)', stroke: 'var(--navy)', strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: 'var(--gold)' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">
                <TrendingUp size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: .3 }} />
                Enter grades in Grade Book to see progression
              </div>
            )}
          </div>
        </div>

        {/* Current Sem Unit Coverage */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Sem {sem} — Unit Coverage</span>
            <span className="text-xs text-soft font-ui" style={{ cursor: 'pointer', color: 'var(--gold)' }} onClick={() => onNav('subjects')}>View All →</span>
          </div>
          <div className="card-body" style={{ maxHeight: 240, overflowY: 'auto' }}>
            {currSubs.filter(s => s.units > 0).map(s => {
              const done = (s.unitProgress || []).filter(u => u.completed).length;
              const pct = s.units ? done / s.units : 0;
              return (
                <div key={s.id} style={{ marginBottom: 12 }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{s.name}</span>
                    <span className="text-xs text-soft">{done}/{s.units}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${pct * 100}%`, background: pct === 1 ? 'var(--success)' : 'var(--navy)' }} />
                  </div>
                </div>
              );
            })}
            {currSubs.filter(s => s.units > 0).length === 0 && (
              <div className="empty-state" style={{ padding: '20px 0' }}>No subjects loaded</div>
            )}
          </div>
        </div>
      </div>

      {/* Grade Distribution + Today Goals */}
      <div className="two-col">
        {/* Grade Distribution */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Grade Distribution</span>
          </div>
          <div className="card-body">
            <GradeDistribution subjects={allSubjects} />
          </div>
        </div>

        {/* Today's Goals */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Today's Goals</span>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav('goals')}>+ Add</button>
          </div>
          <div className="card-body" style={{ maxHeight: 240, overflowY: 'auto' }}>
            {todayGoals.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <Target size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: .3 }} />
                No goals added for today
              </div>
            ) : (
              todayGoals.map(g => (
                <div key={g.id} className={`goal-item${g.status === 'done' ? ' done' : ''}`}>
                  <div className="goal-circle">
                    {g.status === 'done' && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: g.status === 'done' ? 'var(--text-soft)' : 'var(--text-primary)', textDecoration: g.status === 'done' ? 'line-through' : 'none' }}>{g.title}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon, accent }) {
  return (
    <div className="kpi-card" style={accent ? { '--accent': accent } : {}}>
      <div className="flex justify-between items-center mb-2">
        <span className="kpi-label">{label}</span>
        {icon}
      </div>
      <div className="kpi-value" style={accent ? { color: accent } : {}}>{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function GradeDistribution({ subjects }) {
  const graded = subjects.filter(s => s.grade);
  if (!graded.length) return <div className="empty-state" style={{ padding: '20px 0' }}>No grades entered yet</div>;

  const counts = {};
  graded.forEach(s => { counts[s.grade] = (counts[s.grade] || 0) + 1; });

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([grade, count]) => (
        <div key={grade} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--parchment)', borderRadius: 8,
          padding: '8px 14px', border: '1px solid var(--divider)'
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: GRADE_COLORS[grade] || 'var(--navy)' }}>{grade}</span>
          <span className="text-sm text-soft">{count} subject{count > 1 ? 's' : ''}</span>
        </div>
      ))}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
