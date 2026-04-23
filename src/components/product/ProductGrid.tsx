'use client';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useTranslations } from 'next-intl';

export default function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations('products');
  if (products.length === 0) {
    return <p className="text-center text-slate-500 py-12">{t('noProducts')}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
