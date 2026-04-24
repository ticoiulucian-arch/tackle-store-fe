'use client';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const t = useTranslations('products');
  const catName = useCategoryName();

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="relative h-52 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="text-5xl opacity-20 transition-transform duration-500 group-hover:scale-110">🎣</span>
        )}
        {/* Quick-add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="bg-white text-brand font-bold text-sm px-5 py-2 rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand hover:text-white"
          >
            {t('addToCart')}
          </button>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[11px] font-semibold text-brand/70 uppercase tracking-wider">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="font-bold text-slate-800 hover:text-brand line-clamp-2 mt-1 transition-colors leading-snug">
          {product.name}
        </Link>
        <p className="text-xs text-slate-400 mt-1.5">{catName(product.categoryName)}</p>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div>
            <span className="text-xl font-extrabold text-slate-900">{product.price.toFixed(2)}</span>
            <span className="text-xs text-slate-400 ml-1">RON</span>
          </div>
          <button
            onClick={() => addItem(product)}
            className="bg-brand/10 text-brand text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-brand hover:text-white transition-all duration-200"
          >
            + {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
