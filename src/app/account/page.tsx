'use client';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AccountPage() {
  const { isAuthenticated, customer, logout, refreshProfile } = useCustomerAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '', country: '' });
  const { token } = useCustomerAuth();
  const t = useTranslations();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/account/login'); return; }
    if (customer) setForm({
      firstName: customer.firstName || '', lastName: customer.lastName || '',
      phone: customer.phone || '', address: customer.address || '',
      city: customer.city || '', postalCode: customer.postalCode || '', country: customer.country || '',
    });
  }, [isAuthenticated, customer, router]);

  if (!isAuthenticated || !customer) return null;

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/v1/customer/profile', {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      await refreshProfile();
      setEditing(false);
    } catch {} finally { setSaving(false); }
  };

  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('account.title')}</h1>
        <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 transition">{t('common.logout')}</button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Link href="/account" className="block px-4 py-2.5 bg-brand text-white rounded-lg text-sm font-medium">{t('account.profile')}</Link>
          <Link href="/account/orders" className="block px-4 py-2.5 bg-white border border-slate-100 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition">{t('account.myOrders')}</Link>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-800">{t('account.personalInfo')}</h2>
              {!editing && <button onClick={() => setEditing(true)} className="text-sm text-brand hover:underline">{t('common.edit')}</button>}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder={t('checkout.firstName')} value={form.firstName} onChange={set('firstName')} className={inputCls} />
                  <input placeholder={t('checkout.lastName')} value={form.lastName} onChange={set('lastName')} className={inputCls} />
                </div>
                <input placeholder={t('checkout.phone')} value={form.phone} onChange={set('phone')} className={inputCls} />
                <input placeholder={t('checkout.address')} value={form.address} onChange={set('address')} className={inputCls} />
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder={t('checkout.city')} value={form.city} onChange={set('city')} className={inputCls} />
                  <input placeholder={t('checkout.postalCode')} value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
                  <input placeholder={t('checkout.country')} value={form.country} onChange={set('country')} className={inputCls} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSave} disabled={saving} className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">
                    {saving ? t('common.saving') : t('common.save')}
                  </button>
                  <button onClick={() => setEditing(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm transition">{t('common.cancel')}</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-400 block text-xs mb-0.5">{t('checkout.firstName')}</span><span className="text-slate-800 font-medium">{customer.firstName}</span></div>
                  <div><span className="text-slate-400 block text-xs mb-0.5">{t('checkout.lastName')}</span><span className="text-slate-800 font-medium">{customer.lastName}</span></div>
                </div>
                <div><span className="text-slate-400 block text-xs mb-0.5">{t('checkout.email')}</span><span className="text-slate-800">{customer.email}</span></div>
                <div><span className="text-slate-400 block text-xs mb-0.5">{t('checkout.phone')}</span><span className="text-slate-800">{customer.phone || '–'}</span></div>
                <div><span className="text-slate-400 block text-xs mb-0.5">{t('checkout.shippingAddress')}</span><span className="text-slate-800">{customer.address || '–'}, {customer.city || ''} {customer.postalCode || ''}, {customer.country || ''}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
