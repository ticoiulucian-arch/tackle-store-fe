'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="bg-slate-800 text-slate-400 text-center text-sm py-6 mt-12">
      {t('copyright', { year: new Date().getFullYear() })}
    </footer>
  );
}
