import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/');
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
        <p style={styles.welcome}>Create your account</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input type="text" name="name" placeholder="Jules Uwimpuhwe" value={form.name} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input type="text" name="username" placeholder="jules" value={form.username} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/">Sign in</Link>
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
  btnPrimary: { width: '100%', height: '42px', background: '#2563EB', color: '#fff', borderRadius: '10px', fontSize: '15px', fontWeight: '500', marginTop: '8px' },
  footer: { textAlign: 'center', fontSize: '13px', color: '#64748b' },
};
