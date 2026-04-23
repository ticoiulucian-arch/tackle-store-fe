import { useTranslations } from 'next-intl';

export function useCategoryName() {
  const t = useTranslations('categoryNames');

  return (name: string): string => {
    try {
      return t(name);
    } catch {
      return name;
    }
  };
}

