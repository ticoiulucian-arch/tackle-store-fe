'use client';
import { useState } from 'react';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CustomerRegisterPage() {
  const { register, isAuthenticated } = useCustomerAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const t = useTranslations();

  if (isAuthenticated) { router.push('/account'); return null; }

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError(t('account.passwordsMismatch')); return; }
    if (form.password.length < 6) { setError(t('account.passwordTooShort')); return; }
    setLoading(true);
    try { await register(form); router.push('/account'); }
    catch (err) { setError(err instanceof Error ? err.message : t('common.error')); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">{t('account.registerTitle')}</h1>
      <p className="text-sm text-slate-500 text-center mb-6">{t('account.registerSubtitle')}</p>
      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input placeholder={t('checkout.firstName')} required value={form.firstName} onChange={set('firstName')} className={inputCls} />
          <input placeholder={t('checkout.lastName')} required value={form.lastName} onChange={set('lastName')} className={inputCls} />
        </div>
        <input type="email" placeholder={t('checkout.email')} required value={form.email} onChange={set('email')} className={inputCls} />
        <input placeholder={t('checkout.phone')} value={form.phone} onChange={set('phone')} className={inputCls} />
        <input type="password" placeholder={t('account.passwordMin')} required value={form.password} onChange={set('password')} className={inputCls} />
        <input type="password" placeholder={t('account.confirmPassword')} required value={form.confirmPassword} onChange={set('confirmPassword')} className={inputCls} />
        <button type="submit" disabled={loading} className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
          {loading ? t('account.creating') : t('account.createAccount')}
        </button>
      </form>
      <p className="text-sm text-slate-500 text-center mt-4">{t('account.hasAccount')} <Link href="/account/login" className="text-brand font-medium hover:underline">{t('common.login')}</Link></p>
    </div>
  );
}
