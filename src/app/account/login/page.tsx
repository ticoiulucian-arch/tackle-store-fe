'use client';
import { useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CustomerLoginPage() {
  const { login, isAuthenticated } = useCustomerAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  if (isAuthenticated) { router.push('/account'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try { await login(email, password); router.push('/account'); }
    catch (err) { setError(err instanceof Error ? err.message : t('common.error')); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">{t('account.loginTitle')}</h1>
      <p className="text-sm text-slate-500 text-center mb-6">{t('account.loginSubtitle')}</p>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <input type="email" placeholder={t('checkout.email')} required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
        <input type="password" placeholder={t('account.password')} required value={password} onChange={e => setPassword(e.target.value)} className={inputCls} />
        <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
          {loading ? t('account.connecting') : t('common.login')}
        </button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-4">{t('account.noAccount')} <Link href="/account/register" className="text-brand font-medium hover:underline">{t('common.register')}</Link></p>
    </div>
  );
}
