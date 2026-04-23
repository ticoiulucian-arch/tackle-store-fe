'use client';
import {useCustomerAuth} from '@/context/CustomerAuthContext';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';

const STATUS_COLORS: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700', CONFIRMED: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-indigo-100 text-indigo-700', SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export default function MyOrdersPage() {
    const {isAuthenticated, token} = useCustomerAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const t = useTranslations();

    useEffect(() => {
        if (!isAuthenticated) router.push('/account/login');
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter) params.set('status', statusFilter);
        fetch(`/api/v1/customer/orders?${params}`, {
            headers: {Authorization: `Bearer ${token}`},
        }).then(r => r.json()).then(d => setOrders(d.content || []))
            .catch(() => {
            }).finally(() => setLoading(false));
    }, [token, search, statusFilter]);

    if (!isAuthenticated) return null;

    const STATUS_LABELS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].reduce((acc, k) => {
        acc[k] = t(`orderStatus.${k}`);
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-800">{t('orders.title')}</h1>
                <Link href="/account"
                      className="text-sm text-slate-500 hover:text-brand transition">{t('orders.backToProfile')}</Link>
            </div>

            <div className="flex gap-3 mb-6">
                <input placeholder={t('orders.searchPlaceholder')} value={search}
                       onChange={e => setSearch(e.target.value)}
                       className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"/>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30">
                    <option value="">{t('orders.allStatuses')}</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            <div className="space-y-3">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse"/>)
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
                        <span className="text-4xl block mb-3 opacity-30">📦</span>
                        <p className="text-slate-500">{statusFilter || search ? t('orders.noOrdersFound') : t('orders.noOrdersYet')}</p>
                        {!statusFilter && !search && <Link href="/products"
                                                           className="text-brand text-sm hover:underline mt-2 inline-block">{t('orders.startShopping')}</Link>}
                    </div>
                ) : orders.map(o => (
                    <Link key={o.id} href={`/account/orders/${o.orderNumber}`}
                          className="block bg-white rounded-xl border border-slate-100 p-5 hover:border-brand/30 hover:shadow-sm transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-mono text-sm font-semibold text-slate-700">#{o.orderNumber}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{o.orderDate ? new Date(o.orderDate).toLocaleDateString('ro-RO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : ''}</p>
                            </div>
                            <div className="text-right">
                <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status] || 'bg-slate-100 text-slate-600'}`}>
                  {STATUS_LABELS[o.status] || o.status}
                </span>
                                <p className="text-sm font-bold text-slate-800 mt-1">{o.totalAmount?.toFixed(2)} RON</p>
                            </div>
                        </div>
                        {o.items && (
                            <p className="text-xs text-slate-400 mt-2">{o.items.length} {o.items.length === 1 ? t('cart.product') : t('cart.productsPlural')}: {o.items.map((i: any) => i.productName).join(', ')}</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
