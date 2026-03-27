// src/components/goals/GoalsPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../../services/dataService';
import { format } from 'date-fns';
import { Plus, Trash2, Check, Flag, BookOpen, Code, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const GOAL_TYPES = [
  { id: 'daily',    label: 'TODAY',    icon: Calendar,  desc: "Today's work" },
  { id: 'learning', label: 'LEARNING', icon: BookOpen,  desc: 'Learning path' },
  { id: 'project',  label: 'PROJECTS', icon: Code,      desc: 'Projects done' },
  { id: 'upcoming', label: 'UPCOMING', icon: Flag,      desc: 'Future goals' },
];

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGoals(user.uid).then(g => { setGoals(g); setLoading(false); });
  }, [user.uid]);

  async function handleAdd(goal) {
    const id = await addGoal(user.uid, goal);
    setGoals(prev => [{ ...goal, id }, ...prev]);
    toast.success('Goal added!');
  }

  async function handleToggle(goal) {
    const status = goal.status === 'done' ? 'pending' : 'done';
    await updateGoal(user.uid, goal.id, { status, completedAt: status === 'done' ? new Date().toISOString() : null });
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, status } : g));
  }

  async function handleDelete(goalId) {
    await deleteGoal(user.uid, goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast.success('Removed');
  }

  const filtered = goals.filter(g => g.type === activeTab);
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayFiltered = activeTab === 'daily' ? filtered.filter(g => g.createdAt?.startsWith(today)) : filtered;
  const done = todayFiltered.filter(g => g.status === 'done').length;

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}><div className="spinner" /></div>;

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title">Goals & Learning Path</div>
          <div className="page-subtitle">Daily goals · Learning path · Projects · Upcoming</div>
          <div className="gold-rule" />
        </div>
        <button className="btn btn-primary" style={{ marginTop: 4 }} onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Goal
        </button>
      </div>

      {/* Type Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {GOAL_TYPES.map(({ id, label, icon: Icon, desc }) => {
          const count = goals.filter(g => g.type === id).length;
          const doneCount = goals.filter(g => g.type === id && g.status === 'done').length;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: activeTab === id ? 'var(--navy)' : 'var(--white)',
                border: activeTab === id ? '1.5px solid var(--gold)' : '1px solid var(--divider)',
                borderRadius: 10, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                transition: 'all .2s'
              }}
            >
              <Icon size={18} color={activeTab === id ? 'var(--gold)' : 'var(--text-soft)'} />
              <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '.72rem', letterSpacing: '.1em', color: activeTab === id ? 'var(--gold-light)' : 'var(--text-soft)', marginTop: 8 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: activeTab === id ? 'var(--gold)' : 'var(--navy)', marginTop: 2 }}>{doneCount}/{count}</div>
              <div className="text-xs" style={{ color: activeTab === id ? 'rgba(250,246,238,.4)' : 'var(--text-soft)' }}>{desc}</div>
            </button>
          );
        })}
      </div>

      {/* List header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <div className="section-bar" />
          <span className="section-title">
            {GOAL_TYPES.find(t => t.id === activeTab)?.desc}
            {activeTab === 'daily' && ` — ${format(new Date(), 'EEE, d MMM')}`}
          </span>
        </div>
        {todayFiltered.length > 0 && (
          <span className="text-xs font-ui" style={{ color: 'var(--text-soft)' }}>
            {done}/{todayFiltered.length} completed
          </span>
        )}
      </div>

      {/* Goal items */}
      {todayFiltered.length === 0 ? (
        <div className="empty-state" style={{ background: 'var(--white)', border: '1px solid var(--divider)', borderRadius: 10, padding: '48px 24px' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>
            {activeTab === 'daily' ? '📅' : activeTab === 'learning' ? '📖' : activeTab === 'project' ? '💻' : '🚩'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--navy)', marginBottom: 4 }}>
            {activeTab === 'daily' ? 'No goals for today' : `No ${activeTab} goals yet`}
          </div>
          <div>Add your first goal using the button above</div>
          <button className="btn btn-gold btn-sm" style={{ marginTop: 16 }} onClick={() => setShowModal(true)}>
            <Plus size={13} /> Add Goal
          </button>
        </div>
      ) : (
        <div>
          {todayFiltered.map(g => (
            <GoalItem key={g.id} goal={g} onToggle={() => handleToggle(g)} onDelete={() => handleDelete(g.id)} />
          ))}
        </div>
      )}

      {showModal && (
        <AddGoalModal
          defaultType={activeTab}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}

function GoalItem({ goal, onToggle, onDelete }) {
  const done = goal.status === 'done';
  const isOverdue = goal.dueDate && new Date(goal.dueDate) < new Date() && !done;
  return (
    <div className={`goal-item${done ? ' done' : ''}`}>
      <div className="goal-circle" onClick={onToggle}>
        {done && <Check size={12} color="#fff" />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: '.9rem',
          color: done ? 'var(--text-soft)' : 'var(--text-primary)',
          textDecoration: done ? 'line-through' : 'none'
        }}>
          {goal.title}
        </div>
        {goal.description && (
          <div className="text-xs text-soft mt-1">{goal.description}</div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 5, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="text-xs font-ui" style={{ color: 'var(--text-soft)' }}>
            {format(new Date(goal.createdAt), 'd MMM')}
          </span>
          {goal.dueDate && (
            <span className="tag" style={{ background: isOverdue ? 'rgba(198,40,40,.08)' : 'rgba(21,101,192,.08)', color: isOverdue ? 'var(--error)' : 'var(--info)' }}>
              Due {format(new Date(goal.dueDate), 'd MMM')}
            </span>
          )}
          {done && goal.completedAt && (
            <span className="tag" style={{ background: 'rgba(46,125,50,.08)', color: 'var(--success)' }}>
              ✓ Done {format(new Date(goal.completedAt), 'd MMM')}
            </span>
          )}
        </div>
      </div>
      <button className="btn-icon" onClick={onDelete} style={{ color: 'var(--text-soft)' }}>
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function AddGoalModal({ defaultType, onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', description: '', type: defaultType, dueDate: '' });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await onAdd({ title: form.title.trim(), description: form.description.trim(), type: form.type, dueDate: form.dueDate || null, status: 'pending' });
    setSaving(false);
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <div className="modal-header">
          <span className="modal-title">Add New Goal</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Goal Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {GOAL_TYPES.map(({ id, label }) => (
                  <button
                    key={id} type="button"
                    onClick={() => set('type', id)}
                    style={{
                      flex: 1, padding: '7px 4px', borderRadius: 6, border: `1.5px solid ${form.type === id ? 'var(--gold)' : 'var(--divider)'}`,
                      background: form.type === id ? 'var(--navy)' : 'var(--parchment)',
                      fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '.68rem', letterSpacing: '.07em',
                      color: form.type === id ? 'var(--gold)' : 'var(--text-soft)', cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="e.g. Complete Unit 3 of DBMS" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <textarea className="form-input" rows={2} placeholder="Details..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date (optional)</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} min={format(new Date(), 'yyyy-MM-dd')} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
