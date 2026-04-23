'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

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
      <section className="bg-gradient-to-r from-slate-800 to-emerald-800 text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
        <p className="text-lg text-slate-200 mb-6">{t('home.heroSubtitle')}</p>
        <Link href="/products" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition">
          {t('home.shopNow')}
        </Link>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.shopByCategory')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(c => (
            <Link key={c.id} href={`/products?category=${c.id}`}
              className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition">
              <p className="font-semibold">{catName(c.name)}</p>
              <p className="text-sm text-slate-500">{t('home.productCount', { count: c.productCount })}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">{t('home.featuredProducts')}</h2>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
