'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

const CATEGORY_ICONS: Record<string, string> = {
  '1': '🎣', '2': '⚙️', '3': '🪣', '4': '🪱', '5': '🪝', '6': '🧵', '7': '🎒',
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const t = useTranslations();
  const catName = useCategoryName();

  useEffect(() => {
    getProducts(0, 8).then(p => setProducts(p.content)).catch(() => {});
    getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface-dark via-slate-900 to-emerald-950 text-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/5 rounded-full blur-3xl animate-shimmer" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-white/10">
            🎣 Method Feeder Specialists
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.1]">
            {t('home.heroTitle').replace('🎣 ', '')}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products"
              className="group relative bg-brand hover:bg-brand-light text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-brand/30 hover:shadow-brand/50 hover:-translate-y-0.5">
              {t('home.shopNow')}
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/products?category=3"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/20 hover:-translate-y-0.5">
              {t('nav.feeders')}
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap gap-8 justify-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">🚚</span>
              <span>Free shipping 200+ RON</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">🔒</span>
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-lg">↩️</span>
              <span>30-day returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t('home.shopByCategory')}</h2>
            <p className="text-slate-500 mt-2">Find exactly what you need for your next session</p>
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center gap-1 text-brand hover:text-brand-dark font-semibold text-sm transition">
            {t('common.allProducts')} →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
          {categories.map(c => (
            <Link key={c.id} href={`/products?category=${c.id}`}
              className="group relative bg-white rounded-2xl border border-slate-100 p-6 text-center hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3 group-hover:animate-float">
                {CATEGORY_ICONS[String(c.id)] || '📦'}
              </div>
              <p className="font-bold text-slate-800 group-hover:text-brand transition-colors">{catName(c.name)}</p>
              <p className="text-xs text-slate-400 mt-1">{t('home.productCount', { count: c.productCount })}</p>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t('home.featuredProducts')}</h2>
              <p className="text-slate-500 mt-2">Top picks from our latest collection</p>
            </div>
            <Link href="/products" className="hidden md:inline-flex items-center gap-1 text-brand hover:text-brand-dark font-semibold text-sm transition">
              View all →
            </Link>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>

      {/* Newsletter / CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-brand to-emerald-600 rounded-3xl px-8 py-14 md:px-16 md:py-16 text-center text-white">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Ready to catch more?</h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">Browse our full range of method feeder tackle and get free delivery on orders over 200 RON.</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 bg-white text-brand font-bold px-8 py-4 rounded-xl text-lg hover:bg-slate-50 transition-all shadow-lg hover:-translate-y-0.5">
              {t('home.shopNow')} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
