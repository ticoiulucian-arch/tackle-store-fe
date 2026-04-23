'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderByNumber } from '@/lib/api';
import { Order } from '@/types';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700', SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const t = useTranslations();

  useEffect(() => {
    if (orderNumber) getOrderByNumber(String(orderNumber)).then(setOrder).catch(() => {});
  }, [orderNumber]);

  if (!order) return <div className="max-w-2xl mx-auto px-4 py-20"><div className="animate-pulse space-y-4"><div className="h-12 bg-slate-100 rounded w-1/2 mx-auto" /><div className="h-64 bg-slate-100 rounded-xl" /></div></div>;

  const statusColor = STATUS_COLORS[order.status] || 'bg-slate-100 text-slate-700';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-800">{t('orders.orderSuccess')}</h1>
        <p className="text-slate-500 mt-2">{t('orders.orderNumber', { number: order.orderNumber })}</p>
        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>{t(`orderStatus.${order.status}`)}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="p-6">
          <h2 className="font-bold text-slate-800 mb-4">{t('orders.orderedProducts')}</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-slate-700">{item.productName}</p>
                  <p className="text-xs text-slate-400">{item.quantity} × {item.unitPrice.toFixed(2)} RON</p>
                </div>
                <p className="font-semibold text-slate-700">{item.subtotal.toFixed(2)} RON</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-between font-bold text-lg border-t border-slate-100">
          <span>{t('common.total')}</span><span>{order.totalAmount.toFixed(2)} RON</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6 mt-4">
        <h2 className="font-bold text-slate-800 mb-3">{t('orders.shippingAddress')}</h2>
        <p className="text-sm text-slate-600">{order.shippingAddress}</p>
        <p className="text-sm text-slate-600">{order.shippingCity}, {order.shippingPostalCode}</p>
        <p className="text-sm text-slate-600">{order.shippingCountry}</p>
      </div>

      <div className="text-center mt-8">
        <Link href="/products" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold transition">
          {t('orders.continueShopping')}
        </Link>
      </div>
    </div>
  );
}
