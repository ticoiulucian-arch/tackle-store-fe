'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const t = useTranslations();
  const catName = useCategoryName();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <span className="text-6xl block mb-6 opacity-30">🛒</span>
        <p className="text-xl text-slate-500 mb-2">{t('cart.empty')}</p>
        <p className="text-sm text-slate-400 mb-6">{t('cart.emptyHint')}</p>
        <Link href="/products" className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-semibold transition">
          {t('cart.viewProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">{t('cart.title')} <span className="text-slate-400 font-normal text-lg">({totalItems} {totalItems === 1 ? t('cart.product') : t('cart.productsPlural')})</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item.product.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                {item.product.imageUrl ? (
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl opacity-30">🎣</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} className="font-semibold text-sm text-slate-800 hover:text-brand transition line-clamp-1">{item.product.name}</Link>
                <p className="text-xs text-slate-400 mt-0.5">{item.product.brand} · {catName(item.product.categoryName)}</p>
                <p className="text-sm font-bold text-slate-700 mt-1">{item.product.price.toFixed(2)} RON</p>
              </div>
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="px-2.5 py-1.5 text-slate-400 hover:text-slate-800 text-sm">−</button>
                <span className="px-2 py-1.5 text-sm font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2.5 py-1.5 text-slate-400 hover:text-slate-800 text-sm">+</button>
              </div>
              <p className="font-bold text-slate-800 w-24 text-right">{(item.product.price * item.quantity).toFixed(2)} RON</p>
              <button onClick={() => removeItem(item.product.id)} className="text-slate-300 hover:text-red-500 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 h-fit sticky top-32">
          <h2 className="font-bold text-lg text-slate-800 mb-4">{t('cart.orderSummary')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>{t('common.subtotal')}</span><span>{totalPrice.toFixed(2)} RON</span></div>
            <div className="flex justify-between text-slate-500"><span>{t('common.shipping')}</span><span className={totalPrice >= 200 ? 'text-green-600 font-medium' : ''}>{totalPrice >= 200 ? t('common.free') : '15.00 RON'}</span></div>
            {totalPrice < 200 && <p className="text-xs text-amber-600">{t('cart.freeShippingHint', { amount: (200 - totalPrice).toFixed(2) })}</p>}
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>{t('common.total')}</span><span>{(totalPrice + (totalPrice >= 200 ? 0 : 15)).toFixed(2)} RON</span>
          </div>
          <Link href="/checkout" className="block w-full mt-6 bg-brand hover:bg-brand-dark text-white text-center py-3 rounded-lg font-semibold transition">
            {t('cart.checkout')}
          </Link>
          <Link href="/products" className="block text-center text-sm text-slate-500 hover:text-brand mt-3 transition">
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
