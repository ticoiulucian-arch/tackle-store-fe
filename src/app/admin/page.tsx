'use client';
import { useEffect, useState } from 'react';
import { getAdminStats } from '@/lib/adminApi';
import { useTranslations } from 'next-intl';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const t = useTranslations('admin');

  useEffect(() => { getAdminStats().then(setStats).catch(() => {}); }, []);

  const cards = [
    { label: t('products'), value: stats?.totalProducts, icon: '🎣', color: 'bg-emerald-50 text-emerald-700' },
    { label: t('categories'), value: stats?.totalCategories, icon: '📁', color: 'bg-blue-50 text-blue-700' },
    { label: t('orders'), value: stats?.totalOrders, icon: '📦', color: 'bg-amber-50 text-amber-700' },
    { label: t('customers'), value: stats?.totalCustomers, icon: '👥', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('dashboard')}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg mb-3 ${c.color}`}>{c.icon}</div>
            <p className="text-2xl font-bold text-slate-800">{c.value ?? '–'}</p>
            <p className="text-sm text-slate-500">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
