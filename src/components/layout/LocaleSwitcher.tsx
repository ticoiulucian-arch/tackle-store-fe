'use client';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

const LOCALE_LABELS: Record<string, string> = {
  ro: '🇷🇴 RO',
  en: '🇬🇧 EN',
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-1">
      {Object.entries(LOCALE_LABELS).map(([loc, label]) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          disabled={isPending}
          className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
            locale === loc
              ? 'bg-brand text-white'
              : 'text-slate-500 hover:text-brand hover:bg-slate-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

