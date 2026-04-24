'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations();
  return (
    <footer className="bg-surface-dark text-slate-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-brand to-emerald-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                🎣
              </div>
              <div>
                <p className="text-white font-extrabold leading-tight">Lucian Demo Carp</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Method Feeder Shop</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your trusted source for premium method feeder fishing tackle and accessories.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products?category=1" className="hover:text-white transition">{t('nav.rods')}</Link></li>
              <li><Link href="/products?category=2" className="hover:text-white transition">{t('nav.reels')}</Link></li>
              <li><Link href="/products?category=3" className="hover:text-white transition">{t('nav.feeders')}</Link></li>
              <li><Link href="/products?category=4" className="hover:text-white transition">{t('nav.baits')}</Link></li>
              <li><Link href="/products?category=5" className="hover:text-white transition">{t('nav.rigs')}</Link></li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/account" className="hover:text-white transition">{t('common.myAccount')}</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">{t('common.cart')}</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition">{t('orders.title')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">📞 <span>+40 700 000 000</span></li>
              <li className="flex items-center gap-2">📧 <span>contact@LucianDemoCarp.ro</span></li>
              <li className="flex items-center gap-2">📍 <span>București, România</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <div className="flex items-center gap-4">
            <span>🔒 Secure Payments</span>
            <span>🚚 Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
