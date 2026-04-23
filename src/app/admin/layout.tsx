'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, username, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('admin');

  const NAV = [
    { href: '/admin', label: t('dashboard'), icon: '📊' },
    { href: '/admin/products', label: t('products'), icon: '🎣' },
    { href: '/admin/categories', label: t('categories'), icon: '📁' },
    { href: '/admin/orders', label: t('orders'), icon: '📦' },
  ];

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') router.push('/admin/login');
  }, [isAuthenticated, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-56 bg-surface-dark text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-sm font-bold">MG</div>
            <div>
              <p className="text-sm font-bold">MG Carp</p>
              <p className="text-[10px] text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${pathname === n.href ? 'bg-brand text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
              <span>{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">{username}</span>
            <button onClick={logout} className="text-red-400 hover:text-red-300 text-xs">{t('exit')}</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
