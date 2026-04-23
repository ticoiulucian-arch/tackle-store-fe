'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations('admin');

  if (isAuthenticated) { router.push('/admin'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(username, password); router.push('/admin'); }
    catch { setError(t('invalidCredentials')); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-brand rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">Lucian Demo</div>
          <h1 className="text-xl font-bold text-slate-800">Admin Panel</h1>
          <p className="text-sm text-slate-500">Lucian Demo – Method Feeder Shop</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
          <input type="password" placeholder={t('password') || 'Parolă'} value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand" />
          <button type="submit" disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
            {loading ? t('saving') : t('login') || 'Conectare'}
          </button>
        </form>
      </div>
    </div>
  );
}
