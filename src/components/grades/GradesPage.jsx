// src/components/grades/GradesPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSemSubjects, saveSemSubjects } from '../../services/dataService';
import { calcSGPA, GRADE_POINTS, GRADE_COLORS, CSE_SUBJECTS } from '../../utils/cseData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const GRADES = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F'];

export default function GradesPage() {
  const { user, profile } = useAuth();
  const [activeSem, setActiveSem] = useState(profile?.currentSemester || 1);
  const [subjectsBySem, setSubjectsBySem] = useState({});
  const [loadedSems, setLoadedSems] = useState({});

  async function loadSem(sem) {
    if (loadedSems[sem]) return;
    const subs = await getSemSubjects(user.uid, sem);
    setSubjectsBySem(prev => ({ ...prev, [sem]: subs }));
    setLoadedSems(prev => ({ ...prev, [sem]: true }));
  }

  useEffect(() => { loadSem(activeSem); }, [activeSem]);

  async function setGrade(sem, subIdx, grade) {
    const subs = [...(subjectsBySem[sem] || [])];
    subs[subIdx] = { ...subs[subIdx], grade, gradePoints: GRADE_POINTS[grade] };
    setSubjectsBySem(prev => ({ ...prev, [sem]: subs }));
    await saveSemSubjects(user.uid, sem, subs);
    toast.success(`Grade saved: ${grade}`);
  }

  const subjects = subjectsBySem[activeSem] || [];
  const sgpa = calcSGPA(subjects);

  // All SGPA data for bar chart
  const sgpaData = Object.entries(subjectsBySem).map(([sem, subs]) => ({
    sem: `S${sem}`, sgpa: calcSGPA(subs), fill: +sem === activeSem ? 'var(--gold)' : 'var(--navy)'
  }));

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Grade Book</div>
        <div className="page-subtitle">All 8 Semesters — B.Tech CSE</div>
        <div className="gold-rule" />
      </div>

      {/* Semester Tabs */}
      <div className="tab-bar">
        {[1,2,3,4,5,6,7,8].map(s => (
          <button key={s} className={`tab-btn${activeSem === s ? ' active' : ''}`} onClick={() => setActiveSem(s)}>
            Sem {s}
            {subjectsBySem[s] && calcSGPA(subjectsBySem[s]) > 0 && (
              <span style={{ marginLeft: 6, fontSize: '.65rem', color: 'var(--gold)' }}>
                {calcSGPA(subjectsBySem[s]).toFixed(1)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SGPA Banner */}
      <div style={{ background: 'var(--navy)', borderRadius: 12, padding: '18px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div>
          <div className="text-xs font-ui" style={{ color: 'rgba(250,246,238,.5)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Semester {activeSem} SGPA</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: sgpa > 0 ? 'var(--gold)' : 'rgba(250,246,238,.3)' }}>
            {sgpa > 0 ? sgpa.toFixed(2) : '—'}
          </div>
        </div>
        {sgpaData.length > 1 && (
          <div style={{ flex: 1, height: 70 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sgpaData} barSize={18}>
                <XAxis dataKey="sem" tick={{ fill: 'rgba(250,246,238,.4)', fontSize: 10, fontFamily: 'var(--font-ui)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} hide />
                <Tooltip
                  contentStyle={{ fontFamily: 'var(--font-ui)', fontSize: 11, background: 'var(--navy-deep)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 6, color: 'var(--gold-light)' }}
                  formatter={v => [v.toFixed(2), 'SGPA']}
                />
                <Bar dataKey="sgpa" radius={[3, 3, 0, 0]}>
                  {sgpaData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div style={{ display: 'flex', gap: 16 }}>
          {['O', 'A+', 'A'].map(g => {
            const count = subjects.filter(s => s.grade === g).length;
            return count > 0 ? (
              <div key={g} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--gold)' }}>{count}</div>
                <div className="text-xs" style={{ color: 'rgba(250,246,238,.5)' }}>{g}</div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Grade Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Subjects — Semester {activeSem}</span>
          <span className="text-xs text-soft font-ui">Click grade to change</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject</th>
                <th style={{ textAlign: 'center' }}>Credits</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center' }}>Grade Points</th>
                <th style={{ textAlign: 'center' }}>Points Earned</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, si) => (
                <tr key={s.id}>
                  <td><span className="text-xs font-ui" style={{ color: 'var(--text-soft)' }}>{s.code}</span></td>
                  <td style={{ maxWidth: 240 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '.88rem' }}>{s.name}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{s.credits}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <GradePicker value={s.grade} onChange={g => setGrade(activeSem, si, g)} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: s.gradePoints != null ? GRADE_COLORS[s.grade] : 'var(--text-soft)' }}>
                      {s.gradePoints != null ? s.gradePoints : '—'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--navy)' }}>
                      {s.gradePoints != null ? (s.gradePoints * s.credits).toFixed(0) : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {subjects.some(s => s.gradePoints != null) && (
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--navy)', padding: '12px 14px' }}>
                    SGPA
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 700, color: 'var(--text-soft)' }}>
                    {subjects.filter(s => s.gradePoints != null).reduce((a, s) => a + s.credits, 0)}
                  </td>
                  <td colSpan={2} />
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>{sgpa.toFixed(2)}</span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

function GradePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: 'pointer', minWidth: 44,
          padding: '5px 10px', borderRadius: 6,
          border: `1.5px solid ${value ? GRADE_COLORS[value] : 'var(--divider)'}`,
          background: value ? `${GRADE_COLORS[value]}15` : 'var(--parchment)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
        }}
      >
        <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '.85rem', color: value ? GRADE_COLORS[value] : 'var(--text-soft)' }}>
          {value || 'Set'}
        </span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--white)', border: '1px solid var(--divider)', borderRadius: 8,
          boxShadow: 'var(--shadow-md)', zIndex: 50, marginTop: 4,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, padding: 8, minWidth: 160
        }}>
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => { onChange(g); setOpen(false); }}
              style={{
                padding: '6px 4px', border: `1.5px solid ${GRADE_COLORS[g]}`,
                borderRadius: 5, background: value === g ? `${GRADE_COLORS[g]}20` : 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 700,
                fontSize: '.8rem', color: GRADE_COLORS[g]
              }}
            >
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
