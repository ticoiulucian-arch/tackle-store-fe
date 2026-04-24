'use client';
import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {adminCreateProduct, adminGetCategories, adminUpdateProduct, adminUploadImage} from '@/lib/adminApi';
import {getProduct} from '@/lib/api';
import {useTranslations} from 'next-intl';
import Link from 'next/link';

const TYPE_LABELS: Record<string, string> = {
    ROD: 'Lansetă', REEL: 'Mulinetă', FEEDER: 'Feeder', LINE: 'Fir',
    HOOK: 'Cârlig', NET: 'Minciog', BAIT: 'Momeală', ACCESSORY: 'Accesoriu', RIG: 'Montură', LEAD: 'Plumb',
};

const CATEGORY_TYPE_MAP: Record<string, string> = {
    'Rods': 'ROD', 'Reels': 'REEL', 'Feeders & Weights': 'FEEDER',
    'Baits & Groundbait': 'BAIT', 'Rigs & Terminal Tackle': 'RIG', 'Lines & Leaders': 'LINE',
    'Hooks': 'HOOK', 'Accessories': 'ACCESSORY', 'Landing Nets & Keepnets': 'NET',
    'Rod Pods & Bite Alarms': 'ACCESSORY', 'Luggage & Storage': 'ACCESSORY',
    'Chairs & Bedchairs': 'ACCESSORY', 'Clothing & Footwear': 'ACCESSORY',
    'Electronics': 'ACCESSORY',
    'Feeder Rods': 'ROD', 'Match Rods': 'ROD', 'Bolognese Rods': 'ROD',
    'Spinning Rods': 'ROD', 'Carp Rods': 'ROD', 'Float Rods': 'ROD', 'Telescopic Rods': 'ROD',
    'Spinning Reels': 'REEL', 'Baitcasting Reels': 'REEL', 'Big Pit Reels': 'REEL',
    'Feeder Reels': 'REEL', 'Match Reels': 'REEL',
    'Monofilament': 'LINE', 'Fluorocarbon': 'LINE', 'Braided Line': 'LINE',
    'Leaders': 'LINE', 'Shock Leaders': 'LINE',
    'Single Hooks': 'HOOK', 'Treble Hooks': 'HOOK', 'Barbless Hooks': 'HOOK',
    'Carp Hooks': 'HOOK', 'Feeder Hooks': 'HOOK',
    'Method Feeders': 'FEEDER', 'Cage Feeders': 'FEEDER', 'Flat Feeders': 'FEEDER',
    'Leads & Sinkers': 'LEAD', 'Feeder Moulds': 'FEEDER',
    'Boilies': 'BAIT', 'Pellets': 'BAIT', 'Groundbait Mixes': 'BAIT',
    'Pop-ups & Wafters': 'BAIT', 'Liquid Additives': 'BAIT', 'Dips & Glugs': 'BAIT',
    'Corn & Particles': 'BAIT',
    'Ready Rigs': 'RIG', 'Swivels & Clips': 'RIG', 'Beads & Sleeves': 'RIG',
    'Lead Clips': 'RIG', 'Hair Rigs': 'RIG', 'Rig Tubing': 'RIG',
    'Landing Nets': 'NET', 'Keepnets': 'NET', 'Net Handles': 'NET', 'Net Accessories': 'NET',
};

export default function AdminProductForm() {
    const {id} = useParams();
    const isNew = id === 'new';
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedParentId, setSelectedParentId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const t = useTranslations('admin');
    const [specs, setSpecs] = useState<{ key: string; value: string }[]>([]);
    const [form, setForm] = useState({
        name: '', description: '', price: '', stockQuantity: '', imageUrl: '',
        brand: '', type: 'ROD', categoryId: '',
    });

    useEffect(() => {
        adminGetCategories().then(setCategories).catch(() => {
        });
    }, []);

    // When editing, auto-select parent category based on loaded categoryId
    useEffect(() => {
        if (!isNew && id && categories.length > 0 && form.categoryId) {
            const catId = form.categoryId;
            // Check if it's a subcategory
            for (const parent of categories) {
                if (parent.children?.some((c: any) => String(c.id) === String(catId))) {
                    setSelectedParentId(String(parent.id));
                    return;
                }
            }
            // It's a root category
            if (categories.some(c => String(c.id) === String(catId))) {
                setSelectedParentId(String(catId));
            }
        }
    }, [categories, form.categoryId, isNew, id]);

    useEffect(() => {
        if (!isNew && id) {
            getProduct(Number(id)).then(p => {
                setForm({
                    name: p.name, description: p.description || '', price: String(p.price),
                    stockQuantity: String(p.stockQuantity), imageUrl: p.imageUrl || '',
                    brand: p.brand || '', type: p.type, categoryId: p.categoryId ? String(p.categoryId) : '',
                });
                if (p.specifications) {
                    setSpecs(Object.entries(p.specifications).map(([key, value]) => ({key, value})));
                }
            }).catch(() => {
            });
        }
    }, [id, isNew]);

    const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({...f, [field]: e.target.value}));

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await adminUploadImage(file);
            setForm(f => ({...f, imageUrl: result.url}));
        } catch {
            setError(t('uploadFailed'));
        }
    };

    const addSpec = () => setSpecs(s => [...s, {key: '', value: ''}]);
    const removeSpec = (i: number) => setSpecs(s => s.filter((_, idx) => idx !== i));
    const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
        setSpecs(s => s.map((sp, idx) => idx === i ? {...sp, [field]: val} : sp));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const data = {
                name: form.name, description: form.description,
                price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity),
                imageUrl: form.imageUrl, brand: form.brand, type: form.type,
                categoryId: form.categoryId ? parseInt(form.categoryId) : null,
            };
            if (isNew) {
                await adminCreateProduct(data);
            } else {
                await adminUpdateProduct(Number(id), data);
            }
            router.push('/admin/products');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Eroare');
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition";

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">{isNew ? t('addProduct') : t('editProduct')}</h1>
            {!isNew && (
                <Link href={`/admin/products/${id}/translations`}
                      className="inline-block mb-4 text-sm text-brand hover:underline font-medium">
                    🌐 {t('translations') || 'Manage Translations'}
                </Link>
            )}
            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                    <h2 className="font-semibold text-slate-700">{t('productInfo')}</h2>
                    <input placeholder={t('productName')} required value={form.name} onChange={set('name')}
                           className={inputCls}/>
                    <textarea placeholder={t('description')} rows={3} value={form.description}
                              onChange={set('description')} className={inputCls}/>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder={t('price')} type="number" step="0.01" required value={form.price}
                               onChange={set('price')} className={inputCls}/>
                        <input placeholder={t('stock')} type="number" required value={form.stockQuantity}
                               onChange={set('stockQuantity')} className={inputCls}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder={t('brand')} value={form.brand} onChange={set('brand')}
                               className={inputCls}/>
                        <div>
                            <select value={selectedParentId} onChange={e => {
                                const parentId = e.target.value;
                                setSelectedParentId(parentId);
                                const parent = categories.find(c => String(c.id) === parentId);
                                // If parent has no children, use parent as category
                                if (parent && (!parent.children || parent.children.length === 0)) {
                                    const autoType = CATEGORY_TYPE_MAP[parent.name] || form.type;
                                    setForm(f => ({...f, categoryId: parentId, type: autoType}));
                                    if (parent.specTemplate?.length && specs.length === 0) {
                                        setSpecs(parent.specTemplate.map((key: string) => ({key, value: ''})));
                                    }
                                } else {
                                    setForm(f => ({...f, categoryId: ''}));
                                }
                            }} className={inputCls}>
                                <option value="">{t('selectCategory')}</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    {/* Subcategory dropdown */}
                    {selectedParentId && (() => {
                        const parent = categories.find(c => String(c.id) === selectedParentId);
                        if (!parent?.children?.length) return null;
                        return (
                            <div>
                                <select value={form.categoryId} onChange={e => {
                                    const subId = e.target.value;
                                    const sub = parent.children.find((c: any) => String(c.id) === subId);
                                    const autoType = sub ? (CATEGORY_TYPE_MAP[sub.name] || CATEGORY_TYPE_MAP[parent.name] || form.type) : form.type;
                                    setForm(f => ({...f, categoryId: subId, type: autoType}));
                                    if (sub?.specTemplate?.length && specs.length === 0) {
                                        setSpecs(sub.specTemplate.map((key: string) => ({key, value: ''})));
                                    } else if (parent.specTemplate?.length && specs.length === 0) {
                                        setSpecs(parent.specTemplate.map((key: string) => ({key, value: ''})));
                                    }
                                }} className={inputCls}>
                                    <option value="">— Select subcategory —</option>
                                    {parent.children.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        );
                    })()}
                </div>

                {/* Image */}
                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                    <h2 className="font-semibold text-slate-700">{t('image')}</h2>
                    <div className="flex items-center gap-4">
                        {form.imageUrl && (
                            <div className="w-20 h-20 bg-slate-50 rounded-lg overflow-hidden border">
                                <img src={form.imageUrl} alt="" className="w-full h-full object-cover"/>
                            </div>
                        )}
                        <div className="flex-1">
                            <input type="file" accept="image/*" onChange={handleImageUpload}
                                   className="block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand/10 file:text-brand hover:file:bg-brand/20 cursor-pointer"/>
                            <p className="text-xs text-slate-400 mt-1">{t('orEnterUrl')}</p>
                            <input placeholder={t('imageUrl')} value={form.imageUrl} onChange={set('imageUrl')}
                                   className={inputCls + ' mt-1'}/>
                        </div>
                    </div>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold text-slate-700">{t('specifications') || 'Specificații'}</h2>
                        <button type="button" onClick={addSpec}
                                className="text-brand text-sm font-medium hover:underline">+ {t('addCategory') || 'Adaugă'}</button>
                    </div>
                    {specs.length === 0 && <p className="text-sm text-slate-400">{t('noSpecs')}</p>}
                    {specs.map((s, i) => (
                        <div key={i} className="flex gap-2 items-center">
                            <input placeholder={t('specKey')} value={s.key}
                                   onChange={e => updateSpec(i, 'key', e.target.value)} className={inputCls}/>
                            <input placeholder={t('specValue')} value={s.value}
                                   onChange={e => updateSpec(i, 'value', e.target.value)} className={inputCls}/>
                            <button type="button" onClick={() => removeSpec(i)}
                                    className="text-red-400 hover:text-red-600 text-lg shrink-0">×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button type="submit" disabled={saving}
                            className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
                        {saving ? t('saving') || 'Se salvează...' : isNew ? t('createProduct') : t('saveChanges')}
                    </button>
                    <button type="button" onClick={() => router.push('/admin/products')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg font-semibold transition">
                        {t('cancel') || 'Cancel'}
                    </button>
                </div>
            </form>
        </div>
    );
}

