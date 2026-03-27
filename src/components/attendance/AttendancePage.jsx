// src/components/attendance/AttendancePage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSemSubjects, saveSemSubjects } from '../../services/dataService';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const TOTAL_CLASSES_PER_SUBJECT = 60;

export default function AttendancePage() {
  const { user, profile } = useAuth();
  const sem = profile?.currentSemester || 1;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSemSubjects(user.uid, sem).then(s => { setSubjects(s); setLoading(false); });
  }, [user.uid, sem]);

  async function updateAbsent(idx, delta) {
    const updated = subjects.map((s, i) => {
      if (i !== idx) return s;
      const newCount = Math.max(0, (s.absentCount || 0) + delta);
      return { ...s, absentCount: newCount };
    });
    setSubjects(updated);
    await saveSemSubjects(user.uid, sem, updated);
  }

  const totalAbsents = subjects.reduce((a, s) => a + (s.absentCount || 0), 0);
  const totalClasses = subjects.length * TOTAL_CLASSES_PER_SUBJECT;
  const overallPct = totalClasses > 0 ? ((totalClasses - totalAbsents) / totalClasses * 100) : 100;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Attendance Tracker</div>
        <div className="page-subtitle">Semester {sem} — Mark absences per subject</div>
        <div className="gold-rule" />
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 24, marginBottom: 28, background: 'var(--navy)', borderRadius: 14, padding: '22px 26px', alignItems: 'center' }}>
        {/* Radial gauge */}
        <div style={{ width: 120, height: 120, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: overallPct, fill: overallPct < 75 ? '#C62828' : overallPct < 85 ? '#E65100' : 'var(--gold)' }]} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(255,255,255,.08)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: overallPct < 75 ? '#EF9A9A' : 'var(--gold)' }}>
              {overallPct.toFixed(0)}%
            </span>
          </div>
        </div>
        <div>
          <div className="text-xs font-ui" style={{ color: 'rgba(250,246,238,.5)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Overall Attendance</div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <StatChip label="Total Absents" value={totalAbsents} color={totalAbsents > 18 ? '#EF9A9A' : 'var(--gold)'} />
            <StatChip label="Present" value={totalClasses - totalAbsents} color="var(--gold)" />
            <StatChip label="Total Classes" value={totalClasses} color="rgba(250,246,238,.4)" />
          </div>
          {overallPct < 75 && (
            <div style={{ marginTop: 10, background: 'rgba(198,40,40,.2)', border: '1px solid rgba(198,40,40,.4)', borderRadius: 6, padding: '6px 12px', display: 'inline-block' }}>
              <span className="text-xs font-ui" style={{ color: '#EF9A9A' }}>⚠ Below 75% — Risk of detention</span>
            </div>
          )}
        </div>
      </div>

      {/* Per-subject table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Subject-wise Absences</span>
          <span className="text-xs text-soft font-ui">Based on {TOTAL_CLASSES_PER_SUBJECT} classes/subject</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th style={{ textAlign: 'center' }}>Absents</th>
              <th style={{ textAlign: 'center' }}>Present</th>
              <th style={{ width: 160, textAlign: 'center' }}>Attendance %</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, si) => {
              const absent = s.absentCount || 0;
              const present = TOTAL_CLASSES_PER_SUBJECT - absent;
              const pct = (present / TOTAL_CLASSES_PER_SUBJECT * 100);
              const status = pct >= 85 ? 'Good' : pct >= 75 ? 'Low' : 'Critical';
              const statusColor = pct >= 85 ? 'var(--success)' : pct >= 75 ? 'var(--warning)' : 'var(--error)';
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem' }}>{s.name}</div>
                    <div className="text-xs text-soft">{s.code}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="counter-box">
                      <button className="counter-btn" onClick={() => updateAbsent(si, -1)} disabled={absent === 0}>−</button>
                      <span className="counter-val">{absent}</span>
                      <button className="counter-btn" onClick={() => updateAbsent(si, 1)}>+</button>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{present}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: statusColor }} />
                      </div>
                      <span className="text-xs font-ui" style={{ color: statusColor, minWidth: 36 }}>{pct.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="tag" style={{ background: `${statusColor}15`, color: statusColor }}>{status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatChip({ label, value, color }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color }}>{value}</div>
      <div className="text-xs font-ui" style={{ color: 'rgba(250,246,238,.45)', letterSpacing: '.05em' }}>{label}</div>
    </div>
  );
}
