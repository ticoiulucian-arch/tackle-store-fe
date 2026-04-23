'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGetProducts, adminDeleteProduct } from '@/lib/adminApi';
import { useTranslations } from 'next-intl';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('admin');

  const load = () => {
    setLoading(true);
    adminGetProducts(0, 100).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`${t('delete') || 'Delete'} "${name}"?`)) return;
    await adminDeleteProduct(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('products')}</h1>
        <Link href="/admin/products/new" className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          + {t('addProduct')}
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">{t('productName')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('brand')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('category')}</th>
              <th className="text-right px-4 py-3 font-medium">{t('price')}</th>
              <th className="text-right px-4 py-3 font-medium">{t('stock')}</th>
              <th className="text-right px-4 py-3 font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">{t('saving') || 'Loading...'}</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">{t('noProducts')}</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden shrink-0 flex items-center justify-center">
                      {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs opacity-30">🎣</span>}
                    </div>
                    <span className="font-medium text-slate-800 line-clamp-1">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.brand}</td>
                <td className="px-4 py-3 text-slate-500">{p.categoryName}</td>
                <td className="px-4 py-3 text-right font-semibold">{p.price?.toFixed(2)} RON</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${p.stockQuantity > 5 ? 'bg-green-50 text-green-700' : p.stockQuantity > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'}`}>
                    {p.stockQuantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-brand hover:underline text-xs mr-3">{t('edit') || 'Edit'}</Link>
                  <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500 hover:underline text-xs">{t('delete') || 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
