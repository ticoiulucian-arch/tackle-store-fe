'use client';
import { useEffect, useState } from 'react';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '@/lib/adminApi';
import { useTranslations } from 'next-intl';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', specTemplate: [] as string[] });
  const [showNew, setShowNew] = useState(false);
  const t = useTranslations('admin');

  const load = () => adminGetCategories().then(setCategories).catch(() => {});
  useEffect(() => { load(); }, []);
  const reset = () => { setForm({ name: '', description: '', imageUrl: '', specTemplate: [] }); setEditing(null); setShowNew(false); };
  const handleSave = async () => {
    if (!form.name) return;
    const data = { ...form, specTemplate: form.specTemplate.filter(s => s.trim()) };
    if (editing) await adminUpdateCategory(editing, data);
    else await adminCreateCategory(data);
    reset(); load();
  };
  const startEdit = (c: any) => {
    setEditing(c.id); setShowNew(true);
    setForm({ name: c.name, description: c.description || '', imageUrl: c.imageUrl || '', specTemplate: c.specTemplate || [] });
  };
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`${t('delete')} "${name}"?`)) return;
    await adminDeleteCategory(id); load();
  };
  const addSpecKey = () => setForm(f => ({ ...f, specTemplate: [...f.specTemplate, ''] }));
  const removeSpecKey = (i: number) => setForm(f => ({ ...f, specTemplate: f.specTemplate.filter((_, idx) => idx !== i) }));
  const updateSpecKey = (i: number, val: string) => setForm(f => ({ ...f, specTemplate: f.specTemplate.map((s, idx) => idx === i ? val : s) }));

  const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">{t('categories')}</h1>
        <button onClick={() => { reset(); setShowNew(true); }}
          className="bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg text-sm font-semibold transition">+ {t('addCategory')}</button>
      </div>

      {showNew && (
        <div className="bg-white rounded-xl border border-slate-100 p-5 mb-6 space-y-3">
          <h2 className="font-semibold text-slate-700">{editing ? t('editCategory') : t('newCategory')}</h2>
          <input placeholder={t('categoryName')} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
          <input placeholder={t('categoryDesc')} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          <input placeholder={t('imageUrl')} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className={inputCls} />

          {/* Spec Template */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-600">{t('specTemplate') || 'Specification Template'}</label>
              <button type="button" onClick={addSpecKey} className="text-brand text-sm font-medium hover:underline">+ {t('addSpec') || 'Add Spec'}</button>
            </div>
            {form.specTemplate.length === 0 && <p className="text-xs text-slate-400">{t('noSpecTemplate') || 'No specification keys defined for this category'}</p>}
            {form.specTemplate.map((s, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input placeholder={t('specKey') || 'Spec key (e.g. Lungime)'} value={s} onChange={e => updateSpecKey(i, e.target.value)} className={inputCls} />
                <button type="button" onClick={() => removeSpecKey(i)} className="text-red-400 hover:text-red-600 text-lg shrink-0">×</button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold">{t('saveChanges')}</button>
            <button onClick={reset} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm">{t('cancel')}</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">{t('category')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('description')}</th>
              <th className="text-left px-4 py-3 font-medium">{t('specTemplate') || 'Specs'}</th>
              <th className="text-right px-4 py-3 font-medium">{t('products')}</th>
              <th className="text-right px-4 py-3 font-medium">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name}</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-xs">{c.description}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{(c.specTemplate || []).join(', ') || '—'}</td>
                <td className="px-4 py-3 text-right">{c.productCount}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(c)} className="text-brand hover:underline text-xs mr-3">{t('edit') || 'Edit'}</button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="text-red-500 hover:underline text-xs">{t('delete') || 'Delete'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
