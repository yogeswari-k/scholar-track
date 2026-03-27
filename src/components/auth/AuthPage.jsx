// src/components/auth/AuthPage.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login | register
  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-icon">
            <GraduationCap size={32} color="var(--gold)" />
          </div>
          <div className="auth-title">Scholar Track</div>
          <div className="auth-sub">B.TECH CSE — ACADEMIC TRACKER</div>
        </div>
        {mode === 'login' ? (
          <LoginForm onSwitch={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitch={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Scholar!');
    } catch (err) {
      toast.error(err.message.includes('password') ? 'Incorrect password' : 'Account not found');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-card">
      <div style={{ marginBottom: 24 }}>
        <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>Sign In</div>
        <div className="text-sm text-soft mt-1">Welcome back, Scholar</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <label className="form-label">Password</label>
          <input className="form-input" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ marginTop: 8, justifyContent: 'center', height: 46 }}>
          {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'SIGN IN'}
        </button>
      </form>
      <div className="auth-switch">Don't have an account? <a onClick={onSwitch}>Register here</a></div>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', password: '',
    collegeName: '', batch: '', currentSemester: '1'
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome aboard 🎓');
    } catch (err) {
      toast.error(err.message.includes('email') ? 'Email already in use' : 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="auth-card" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)' }}>Create Account</div>
        <div className="text-sm text-soft mt-1">B.Tech CSE Student Registration</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" placeholder="e.g. Arun Kumar" value={form.name} onChange={e => set('name', e.target.value)} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Roll Number</label>
            <input className="form-input" placeholder="e.g. 21CS001" value={form.rollNumber} onChange={e => set('rollNumber', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Current Semester</label>
            <select className="form-select" value={form.currentSemester} onChange={e => set('currentSemester', e.target.value)}>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">College / Institution</label>
          <input className="form-input" placeholder="e.g. Anna University" value={form.collegeName} onChange={e => set('collegeName', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Batch Year</label>
          <input className="form-input" placeholder="e.g. 2021-2025" value={form.batch} onChange={e => set('batch', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} minLength={6} required />
        </div>
        <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent: 'center', height: 46 }}>
          {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'CREATE ACCOUNT'}
        </button>
      </form>
      <div className="auth-switch">Already have an account? <a onClick={onSwitch}>Sign in</a></div>
    </div>
  );
}
