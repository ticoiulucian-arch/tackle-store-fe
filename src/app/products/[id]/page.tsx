'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const t = useTranslations();
  const catName = useCategoryName();

  useEffect(() => {
    if (id) getProduct(Number(id)).then(setProduct).catch(() => {});
  }, [id]);

  const handleAdd = () => {
    if (product) { addItem(product, qty); setAdded(true); setTimeout(() => setAdded(false), 2000); }
  };

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-20"><div className="animate-pulse space-y-4"><div className="h-80 bg-slate-100 rounded-xl" /><div className="h-8 bg-slate-100 rounded w-2/3" /></div></div>;

  const specs = product.specifications || {};
  const hasSpecs = Object.keys(specs).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-slate-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand transition">{t('common.home')}</Link><span>/</span>
        <Link href="/products" className="hover:text-brand transition">{t('common.products')}</Link><span>/</span>
        <Link href={`/products?category=${product.categoryId}`} className="hover:text-brand transition">{catName(product.categoryName)}</Link><span>/</span>
        <span className="text-slate-800 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-slate-50 rounded-2xl h-96 flex items-center justify-center overflow-hidden border border-slate-100">
          {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" /> : <span className="text-7xl opacity-20">🎣</span>}
        </div>

        <div>
          <p className="text-sm font-medium text-brand uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{product.name}</h1>
          <p className="text-sm text-slate-400 mt-2">{catName(product.categoryName)} · {product.type.replace('_', ' ')}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-800">{product.price.toFixed(2)}</span>
            <span className="text-lg text-slate-500">RON</span>
          </div>

          <p className="text-slate-600 mt-6 leading-relaxed">{product.description}</p>

          <div className={`mt-4 inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${product.stockQuantity > 5 ? 'bg-green-50 text-green-700' : product.stockQuantity > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${product.stockQuantity > 5 ? 'bg-green-500' : product.stockQuantity > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
            {product.stockQuantity > 5 ? t('products.inStock') : product.stockQuantity > 0 ? t('products.onlyLeft', { count: product.stockQuantity }) : t('products.outOfStock')}
          </div>

          {product.stockQuantity > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-lg">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-slate-500 hover:text-slate-800 transition">−</button>
                <span className="px-3 py-2 font-semibold text-sm min-w-[2rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))} className="px-3 py-2 text-slate-500 hover:text-slate-800 transition">+</button>
              </div>
              <button onClick={handleAdd} className={`flex-1 py-3 rounded-lg font-semibold transition text-white ${added ? 'bg-green-600' : 'bg-brand hover:bg-brand-dark'}`}>
                {added ? t('products.addedToCart') : t('products.addToCart')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specifications table */}
      {hasSpecs && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{t('products.technicalSpecs')}</h2>
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            {Object.entries(specs).map(([key, value], i) => (
              <div key={key} className={`flex ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                <span className="w-1/3 px-4 py-3 text-sm font-medium text-slate-600">{key}</span>
                <span className="w-2/3 px-4 py-3 text-sm text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
