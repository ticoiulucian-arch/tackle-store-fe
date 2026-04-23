'use client';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailPage() {
  const { isAuthenticated, token } = useCustomerAuth();
  const router = useRouter();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => { if (!isAuthenticated) router.push('/account/login'); }, [isAuthenticated, router]);

  useEffect(() => {
    if (!token || !orderNumber) return;
    fetch(`/api/v1/customer/orders/${orderNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [token, orderNumber]);

  if (!isAuthenticated) return null;
  if (loading) return <div className="max-w-3xl mx-auto px-4 py-20"><div className="animate-pulse space-y-4"><div className="h-10 bg-slate-100 rounded w-1/3" /><div className="h-48 bg-slate-100 rounded-xl" /></div></div>;
  if (!order) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-slate-500">{t('orders.orderNotFound')}</p></div>;

  const isCancelled = order.status === 'CANCELLED';
  const currentStep = STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/account/orders" className="text-sm text-slate-500 hover:text-brand transition mb-4 inline-block">{t('orders.backToOrders')}</Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t('orders.orderNumber', { number: order.orderNumber })}</h1>
          <p className="text-sm text-slate-400">{order.orderDate ? new Date(order.orderDate).toLocaleDateString('ro-RO', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}</p>
        </div>
      </div>

      {/* Status timeline */}
      {!isCancelled ? (
        <div className="bg-white rounded-xl border border-slate-100 p-6 mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">{t('orders.orderStatus')}</h2>
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  i <= currentStep ? 'bg-brand text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <p className={`text-[10px] mt-1 ${i <= currentStep ? 'text-brand font-medium' : 'text-slate-400'}`}>{t(`orderSteps.${step}`)}</p>
                {i < STEPS.length - 1 && (
                  <div className={`absolute top-4 left-[calc(50%+16px)] w-[calc(100%-32px)] h-0.5 ${
                    i < currentStep ? 'bg-brand' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-red-700 font-semibold">{t('orders.orderCancelled')}</p>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden mb-6">
        <div className="p-5">
          <h2 className="font-semibold text-slate-800 mb-3">{t('orders.orderedProducts')}</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div>
                  <Link href={`/products/${item.productId}`} className="text-slate-700 hover:text-brand transition">{item.productName}</Link>
                  <p className="text-xs text-slate-400">{item.quantity} × {item.unitPrice?.toFixed(2)} RON</p>
                </div>
                <p className="font-semibold text-slate-700">{item.subtotal?.toFixed(2)} RON</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 px-5 py-3 flex justify-between font-bold border-t border-slate-100">
          <span>{t('common.total')}</span><span>{order.totalAmount?.toFixed(2)} RON</span>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white rounded-xl border border-slate-100 p-5">
        <h2 className="font-semibold text-slate-800 mb-3">{t('orders.shippingAddress')}</h2>
        <p className="text-sm text-slate-600">{order.shippingAddress}</p>
        <p className="text-sm text-slate-600">{order.shippingCity}, {order.shippingPostalCode}</p>
        <p className="text-sm text-slate-600">{order.shippingCountry}</p>
      </div>
    </div>
  );
}

