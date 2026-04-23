'use client';
import { useEffect, useState } from 'react';
import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/adminApi';
import { useTranslations } from 'next-intl';

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700', SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  const load = () => {
    setLoading(true);
    adminGetOrders().then(o => setOrders(o.content || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (id: number, status: string) => {
    await adminUpdateOrderStatus(id, status);
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('admin.orders')}</h1>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">{t('admin.order')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('admin.client')}</th>
              <th className="text-right px-4 py-3 font-medium">{t('common.total')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('admin.status')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('admin.date')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">{t('common.loading')}</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">{t('admin.noOrders')}</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">#{o.orderNumber}</td>
                <td className="px-4 py-3 text-slate-600">{o.customerName}</td>
                <td className="px-4 py-3 text-right font-semibold">{o.totalAmount?.toFixed(2)} RON</td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[o.status] || 'bg-slate-100'}`}>
                    {STATUSES.map(s => <option key={s} value={s}>{t(`orderStatus.${s}`)}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{o.orderDate ? new Date(o.orderDate).toLocaleDateString('ro-RO') : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
