'use client';
import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {
    filterProducts, getCategories, getProducts, getProductsByCategory,
    getProductsByPriceRange, getSpecOptions, searchProducts
} from '@/lib/api';
import {Category, Product, ProductType} from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import { useTranslations } from 'next-intl';
import { useCategoryName } from '@/lib/useCategoryName';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-slate-100 rounded w-48"/>
                <div className="grid grid-cols-4 gap-6">{[1, 2, 3, 4].map(i => <div key={i} className="h-72 bg-slate-100 rounded-xl"/>)}</div>
            </div>
        </div>}>
            <ProductsContent/>
        </Suspense>
    );
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [specOptions, setSpecOptions] = useState<Record<string, string[]>>({});
    const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const t = useTranslations();
    const catName = useCategoryName();

    const q = searchParams.get('q');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);
    useEffect(() => {
        setSelectedSpecs({});
        if (type) { getSpecOptions(type).then(setSpecOptions).catch(() => setSpecOptions({})); }
        else { setSpecOptions({}); }
    }, [type]);

    useEffect(() => {
        setLoading(true);
        const hasSpecs = Object.keys(selectedSpecs).length > 0;
        if (hasSpecs || (type && Object.keys(selectedSpecs).length >= 0 && type)) {
            const params: Record<string, string> = {...selectedSpecs};
            if (type) params.type = type;
            if (category) params.categoryId = category;
            filterProducts(params, 0, 40).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
        } else if (q) {
            searchProducts(q).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
        } else if (category) {
            getProductsByCategory(Number(category)).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
        } else if (min && max) {
            getProductsByPriceRange(Number(min), Number(max)).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
        } else {
            getProducts(0, 40).then(p => setProducts(p.content)).catch(() => {}).finally(() => setLoading(false));
        }
    }, [q, category, type, min, max, selectedSpecs]);

    const handleSpecChange = (key: string, value: string) => {
        setSelectedSpecs(prev => {
            const next = {...prev};
            if (value === '') delete next[key]; else next[key] = value;
            return next;
        });
    };
    const clearSpecs = () => setSelectedSpecs({});

    const activeCategory = categories.find(c => String(c.id) === category);
    const title = q ? t('products.resultsFor', { query: q }) : activeCategory ? catName(activeCategory.name) : type ? (t(`productTypesPlural.${type}`) || type) : t('common.allProducts');
    const activeSpecCount = Object.keys(selectedSpecs).length;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <nav className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                <Link href="/" className="hover:text-brand transition">{t('common.home')}</Link>
                <span>/</span>
                <span className="text-slate-800 font-medium">{title}</span>
            </nav>

            <h1 className="text-2xl font-bold text-slate-800 mb-6">{title}
                {!loading && <span className="text-slate-400 font-normal text-base ml-2">{t('products.productCount', { count: products.length })}</span>}
            </h1>

            <div className="grid lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                        <h3 className="font-semibold text-sm text-slate-800 mb-3">{t('products.categories')}</h3>
                        <ul className="space-y-1">
                            <li><a href="/products" className={`block px-3 py-1.5 rounded-lg text-sm transition ${!category && !type ? 'bg-brand text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>{t('common.all')}</a></li>
                            {categories.map(c => (
                                <li key={c.id}><a href={`/products?category=${c.id}`}
                                    className={`block px-3 py-1.5 rounded-lg text-sm transition ${category === String(c.id) ? 'bg-brand text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    {catName(c.name)} <span className="text-xs opacity-60">({c.productCount})</span>
                                </a></li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-100 p-4">
                        <h3 className="font-semibold text-sm text-slate-800 mb-3">{t('products.productType')}</h3>
                        <ul className="space-y-1">
                            {Object.values(ProductType).map(tp => (
                                <li key={tp}><a href={`/products?type=${tp}`}
                                    className={`block px-3 py-1.5 rounded-lg text-sm transition ${type === tp ? 'bg-brand text-white font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                                    {t(`productTypesPlural.${tp}`)}
                                </a></li>
                            ))}
                        </ul>
                    </div>

                    {Object.keys(specOptions).length > 0 && (
                        <div className="bg-white rounded-xl border border-slate-100 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm text-slate-800">{t('products.specifications')}</h3>
                                {activeSpecCount > 0 && (
                                    <button onClick={clearSpecs} className="text-xs text-red-500 hover:text-red-700 transition">
                                        {t('products.reset', { count: activeSpecCount })}
                                    </button>
                                )}
                            </div>
                            <div className="space-y-3">
                                {Object.entries(specOptions).map(([key, values]) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">{key}</label>
                                        <select value={selectedSpecs[key] || ''} onChange={e => handleSpecChange(key, e.target.value)}
                                            className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition ${selectedSpecs[key] ? 'border-brand bg-brand/5 font-medium' : 'border-slate-200'}`}>
                                            <option value="">{t('common.all')}</option>
                                            {values.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>

                <div className="lg:col-span-3">
                    {activeSpecCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {Object.entries(selectedSpecs).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center gap-1 bg-brand/10 text-brand text-xs font-medium px-2.5 py-1 rounded-full">
                                    {key}: {value}
                                    <button onClick={() => handleSpecChange(key, '')} className="hover:text-red-600 ml-0.5">×</button>
                                </span>
                            ))}
                            <button onClick={clearSpecs} className="text-xs text-slate-500 hover:text-red-500 transition px-2">{t('products.clearAllFilters')}</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-72 bg-slate-100 rounded-xl animate-pulse"/>)}
                        </div>
                    ) : (
                        <ProductGrid products={products}/>
                    )}
                </div>
            </div>
        </div>
    );
}
