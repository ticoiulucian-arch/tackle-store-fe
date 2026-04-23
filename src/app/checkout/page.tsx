'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { createCustomer, createOrder, getCustomerByEmail } from '@/lib/api';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isAuthenticated, customer } = useCustomerAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', country: 'România',
  });

  // Auto-fill from logged-in customer
  useEffect(() => {
    if (isAuthenticated && customer) {
      setForm(f => ({
        ...f,
        firstName: customer.firstName || f.firstName,
        lastName: customer.lastName || f.lastName,
        email: customer.email || f.email,
        phone: customer.phone || f.phone,
        address: customer.address || f.address,
        city: customer.city || f.city,
        postalCode: customer.postalCode || f.postalCode,
        country: customer.country || f.country,
      }));
    }
  }, [isAuthenticated, customer]);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      let customerId: number;
      if (isAuthenticated && customer) {
        customerId = customer.id;
      } else {
        let found;
        try { found = await getCustomerByEmail(form.email); } catch { found = await createCustomer(form); }
        customerId = found.id;
      }
      const order = await createOrder({
        customerId,
        shippingAddress: form.address, shippingCity: form.city,
        shippingPostalCode: form.postalCode, shippingCountry: form.country,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      clearCart();
      router.push(`/orders/${order.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('checkout.orderFailed'));
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl block mb-6 opacity-30">🛒</span>
        <p className="text-lg text-slate-500 mb-4">{t('checkout.emptyCart')}</p>
        <Link href="/products" className="text-brand hover:underline">{t('checkout.viewProducts')}</Link>
      </div>
    );
  }

  const shipping = totalPrice >= 200 ? 0 : 15;
  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand">{t('common.home')}</Link><span>/</span>
        <Link href="/cart" className="hover:text-brand">{t('common.cart')}</Link><span>/</span>
        <span className="text-slate-800 font-medium">{t('checkout.title')}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('checkout.title')}</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="font-semibold text-slate-700 mb-3">{t('checkout.personalData')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder={t('checkout.firstName')} required value={form.firstName} onChange={set('firstName')} className={inputCls} />
                <input placeholder={t('checkout.lastName')} required value={form.lastName} onChange={set('lastName')} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <input placeholder={t('checkout.email')} type="email" required value={form.email} onChange={set('email')} className={inputCls} />
                <input placeholder={t('checkout.phone')} value={form.phone} onChange={set('phone')} className={inputCls} />
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-slate-700 mb-3">{t('checkout.shippingAddress')}</h2>
              <input placeholder={t('checkout.address')} required value={form.address} onChange={set('address')} className={inputCls} />
              <div className="grid grid-cols-3 gap-4 mt-3">
                <input placeholder={t('checkout.city')} required value={form.city} onChange={set('city')} className={inputCls} />
                <input placeholder={t('checkout.postalCode')} required value={form.postalCode} onChange={set('postalCode')} className={inputCls} />
                <input placeholder={t('checkout.country')} required value={form.country} onChange={set('country')} className={inputCls} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white py-3.5 rounded-lg font-semibold transition disabled:opacity-50 text-lg">
              {loading ? t('checkout.placing') : t('checkout.placeOrder', { total: (totalPrice + shipping).toFixed(2) })}
            </button>
          </form>
        </div>

        {/* Order summary sidebar */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 h-fit sticky top-32">
          <h2 className="font-bold text-lg text-slate-800 mb-4">{t('checkout.yourOrder')}</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map(i => (
              <div key={i.product.id} className="flex gap-3">
                <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {i.product.imageUrl ? <img src={i.product.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-sm opacity-30">🎣</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 line-clamp-1">{i.product.name}</p>
                  <p className="text-xs text-slate-400">{i.quantity} × {i.product.price.toFixed(2)} RON</p>
                </div>
                <p className="text-xs font-bold text-slate-700 whitespace-nowrap">{(i.product.price * i.quantity).toFixed(2)} RON</p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>{t('common.subtotal')}</span><span>{totalPrice.toFixed(2)} RON</span></div>
            <div className="flex justify-between text-slate-500"><span>{t('common.shipping')}</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? t('common.free') : '15.00 RON'}</span></div>
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 flex justify-between font-bold text-lg">
            <span>{t('common.total')}</span><span>{(totalPrice + shipping).toFixed(2)} RON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
