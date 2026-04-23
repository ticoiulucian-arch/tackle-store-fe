'use client';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {adminGetTranslations, adminUpsertTranslation} from '@/lib/adminApi';
import {getProduct} from '@/lib/api';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

const LOCALES = [
    {code: 'ro', label: '🇷🇴 Română'},
    {code: 'en', label: '🇬🇧 English'},
];

export default function AdminTranslationsPage() {
    const {id} = useParams();
    const router = useRouter();
    const t = useTranslations('admin');
    const [productName, setProductName] = useState('');
    const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({});
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        getProduct(Number(id)).then(p => setProductName(p.name)).catch(() => {
        });
        adminGetTranslations(Number(id)).then(setTranslations).catch(() => {
        });
    }, [id]);

    const update = (locale: string, field: 'name' | 'description', value: string) => {
        setTranslations(prev => {
            const existing = prev[locale] || {name: '', description: ''};
            return {...prev, [locale]: {...existing, [field]: value}};
        });
    };

    const handleSave = async (locale: string) => {
        setSaving(locale);
        try {
            const data = translations[locale] || {name: '', description: ''};
            await adminUpsertTranslation(Number(id), locale, data);
            setSaved(locale);
            setTimeout(() => setSaved(null), 2000);
        } catch {
        }
        setSaving(null);
    };

    const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition';

    return (
        <div className="p-6 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
                <Link href={`/admin/products/${id}`}
                      className="text-brand hover:underline text-sm">← {t('editProduct')}</Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{t('translations') || 'Translations'}</h1>
            <p className="text-sm text-slate-500 mb-6">{productName}</p>

            <div className="space-y-6">
                {LOCALES.map(({code, label}) => (
                    <div key={code} className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-slate-700">{label}</h2>
                            <button
                                onClick={() => handleSave(code)}
                                disabled={saving === code}
                                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition text-white ${
                                    saved === code ? 'bg-green-600' : 'bg-brand hover:bg-brand-dark'
                                } disabled:opacity-50`}
                            >
                                {saving === code ? (t('saving') || 'Saving...') : saved === code ? '✓ Saved' : (t('saveChanges') || 'Save')}
                            </button>
                        </div>
                        <div>
                            <label
                                className="block text-xs font-medium text-slate-500 mb-1">{t('productName') || 'Name'}</label>
                            <input
                                value={translations[code]?.name || ''}
                                onChange={e => update(code, 'name', e.target.value)}
                                placeholder={productName}
                                className={inputCls}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs font-medium text-slate-500 mb-1">{t('description') || 'Description'}</label>
                            <textarea
                                rows={3}
                                value={translations[code]?.description || ''}
                                onChange={e => update(code, 'description', e.target.value)}
                                className={inputCls}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button onClick={() => router.push('/admin/products')}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold transition">
                    {t('cancel') || 'Back'}
                </button>
            </div>
        </div>
    );
}

