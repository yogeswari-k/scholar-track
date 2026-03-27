// src/components/subjects/SubjectsPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getSemSubjects, saveSemSubjects } from '../../services/dataService';
import { Check, ChevronDown, ChevronUp, Edit2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubjectsPage() {
  const { user, profile } = useAuth();
  const sem = profile?.currentSemester || 1;
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getSemSubjects(user.uid, sem).then(s => { setSubjects(s); setLoading(false); });
  }, [user.uid, sem]);

  async function save(updated) {
    setSubjects(updated);
    await saveSemSubjects(user.uid, sem, updated);
  }

  async function toggleUnit(subIdx, unitIdx) {
    const updated = subjects.map((s, si) => {
      if (si !== subIdx) return s;
      const unitProgress = s.unitProgress.map((u, ui) =>
        ui === unitIdx ? { ...u, completed: !u.completed } : u
      );
      return { ...s, unitProgress };
    });
    await save(updated);
  }

  async function saveMarks(subIdx, marks) {
    const updated = subjects.map((s, si) => si === subIdx ? { ...s, ...marks } : s);
    await save(updated);
    toast.success('Marks saved');
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Semester {sem} — Subjects</div>
        <div className="page-subtitle">Unit-wise coverage • Internal marks • Assignments</div>
        <div className="gold-rule" />
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {subjects.filter(s => s.units > 0).map((s, si) => {
          const done = (s.unitProgress || []).filter(u => u.completed).length;
          const pct = s.units ? done / s.units : 0;
          return (
            <div key={s.id} style={{ background: 'var(--white)', border: '1px solid var(--divider)', borderRadius: 10, padding: '10px 14px', minWidth: 140 }}>
              <div className="text-xs text-soft font-ui" style={{ marginBottom: 4 }}>{s.code}</div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct * 100}%`, background: pct === 1 ? 'var(--success)' : 'var(--navy)' }} />
              </div>
              <div className="text-xs text-soft mt-1">{done}/{s.units} units</div>
            </div>
          );
        })}
      </div>

      {/* Subject Cards */}
      {subjects.map((subject, si) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isOpen={expanded === si}
          onToggle={() => setExpanded(expanded === si ? null : si)}
          onToggleUnit={(ui) => toggleUnit(si, ui)}
          onSaveMarks={(marks) => saveMarks(si, marks)}
        />
      ))}
    </div>
  );
}

function SubjectCard({ subject: s, isOpen, onToggle, onToggleUnit, onSaveMarks }) {
  const done = (s.unitProgress || []).filter(u => u.completed).length;
  const pct = s.units > 0 ? done / s.units : 0;
  const [editMarks, setEditMarks] = useState(false);
  const [m1, setM1] = useState(s.internalMark1 || 0);
  const [m2, setM2] = useState(s.internalMark2 || 0);
  const [assign, setAssign] = useState(s.assignmentMark || 0);

  function handleSave() {
    onSaveMarks({ internalMark1: +m1, internalMark2: +m2, assignmentMark: +assign });
    setEditMarks(false);
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* Header */}
      <div
        style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
        onClick={onToggle}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: 'rgba(13,27,62,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '.7rem', fontWeight: 700, color: 'var(--navy)', textAlign: 'center', lineHeight: 1.2 }}>
            {s.code.slice(0, 4)}
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-primary)', fontSize: '.9rem' }}>{s.name}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, alignItems: 'center' }}>
            <span className="text-xs text-soft font-ui">{s.code} · {s.credits} Cr</span>
            {s.units > 0 && (
              <>
                <div style={{ width: 80 }} className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct * 100}%`, background: pct === 1 ? 'var(--success)' : 'var(--navy)' }} />
                </div>
                <span className="text-xs text-soft">{done}/{s.units} units</span>
              </>
            )}
          </div>
        </div>
        <div style={{ color: 'var(--text-soft)' }}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {/* Expanded */}
      {isOpen && (
        <div style={{ borderTop: '1px solid var(--divider)', padding: '18px' }}>
          <div className="two-col" style={{ gap: 24 }}>
            {/* Internal Marks */}
            <div>
              <div className="section-header">
                <div className="section-bar" />
                <span className="section-title">Internal Marks</span>
                <button className="btn-icon" onClick={() => editMarks ? handleSave() : setEditMarks(true)}>
                  {editMarks ? <Save size={15} /> : <Edit2 size={15} />}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Internal 1', val: m1, set: setM1, max: 30 },
                  { label: 'Internal 2', val: m2, set: setM2, max: 30 },
                  { label: 'Assignment', val: assign, set: setAssign, max: 10 },
                ].map(({ label, val, set, max }) => (
                  <div key={label} style={{ background: 'var(--parchment)', borderRadius: 8, padding: '10px 12px', border: '1px solid var(--divider)' }}>
                    <div className="text-xs text-soft font-ui" style={{ marginBottom: 4 }}>{label}</div>
                    {editMarks ? (
                      <input
                        type="number" min={0} max={max}
                        value={val}
                        onChange={e => set(Math.min(max, Math.max(0, +e.target.value)))}
                        style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)', outline: 'none' }}
                      />
                    ) : (
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>{val}</div>
                    )}
                    <div className="text-xs text-soft">/ {max}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, background: 'var(--navy)', borderRadius: 8, padding: '8px 14px', display: 'inline-block' }}>
                <span className="text-xs font-ui" style={{ color: 'var(--gold-light)', letterSpacing: '.05em' }}>TOTAL: </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--gold)' }}>{+m1 + +m2 + +assign}</span>
                <span className="text-xs" style={{ color: 'rgba(250,246,238,.5)' }}> / 70</span>
              </div>
            </div>

            {/* Unit Checklist */}
            {s.units > 0 ? (
              <div>
                <div className="section-header">
                  <div className="section-bar" />
                  <span className="section-title">Unit Coverage</span>
                </div>
                {(s.unitProgress || []).map((unit, ui) => (
                  <div
                    key={ui}
                    className={`unit-item${unit.completed ? ' done' : ''}`}
                    onClick={() => onToggleUnit(ui)}
                  >
                    <div className="unit-check">
                      {unit.completed && <Check size={12} color="#fff" />}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-ui)', fontSize: '.82rem',
                      color: unit.completed ? 'var(--success)' : 'var(--text-primary)',
                      textDecoration: unit.completed ? 'line-through' : 'none',
                    }}>
                      {unit.title}
                    </span>
                    {unit.completed && (
                      <span className="tag" style={{ marginLeft: 'auto', background: 'rgba(46,125,50,.1)', color: 'var(--success)' }}>Done</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Project / Seminar subject — no units</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
