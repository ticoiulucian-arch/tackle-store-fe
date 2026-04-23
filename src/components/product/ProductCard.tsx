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
    <div className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-4xl">🎣</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-slate-500 uppercase">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="font-semibold text-slate-800 hover:text-emerald-600 line-clamp-2">
          {product.name}
        </Link>
        <p className="text-xs text-slate-400 mt-1">{catName(product.categoryName)}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-600">{product.price.toFixed(2)} RON</span>
          <button
            onClick={() => addItem(product)}
            className="bg-emerald-600 text-white text-sm px-3 py-1 rounded hover:bg-emerald-700 transition"
          >
            {t('addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
