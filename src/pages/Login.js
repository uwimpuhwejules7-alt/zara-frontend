import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import '../styles/global.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>💬</div>
          <span style={styles.logoText}>Zara</span>
        </div>
        <p style={styles.welcome}>Welcome back! Sign in to continue.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.pwWrap}>
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={styles.eyeBtn}
              >
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.remember}>
              <input type="checkbox" style={{ width: 'auto', marginRight: '6px' }} />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem 2.5rem', width: '360px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '1rem' },
  logo: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  logoIcon: { width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  logoText: { fontSize: '22px', fontWeight: '600', color: '#0f172a' },
  welcome: { textAlign: 'center', fontSize: '14px', color: '#64748b' },
  errorBox: { background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#dc2626' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#64748b', fontWeight: '500' },
  pwWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '0' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' },
  remember: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
  btnPrimary: { width: '100%', height: '42px', background: '#2563EB', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '500' },
  footer: { textAlign: 'center', fontSize: '13px', color: '#64748b' },
};
