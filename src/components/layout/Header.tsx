'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCustomerAuth } from '@/context/CustomerAuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
	const { totalItems, totalPrice } = useCart();
	const { isAuthenticated, customer, logout } = useCustomerAuth();
	const [query, setQuery] = useState('');
	const [mobileOpen, setMobileOpen] = useState(false);
	const router = useRouter();
	const t = useTranslations();

	const NAV_LINKS = [
		{ label: t('nav.rods'), href: '/products?category=1' },
		{ label: t('nav.reels'), href: '/products?category=2' },
		{ label: t('nav.feeders'), href: '/products?category=3' },
		{ label: t('nav.baits'), href: '/products?category=4' },
		{ label: t('nav.rigs'), href: '/products?category=5' },
		{ label: t('nav.lines'), href: '/products?category=6' },
		{ label: t('nav.accessories'), href: '/products?category=7' },
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) {
			router.push(`/products?q=${encodeURIComponent(query.trim())}`);
			setQuery('');
		}
	};

	return (
		<header className="sticky top-0 z-50">
			{/* Top bar */}
			<div className="bg-surface-dark text-slate-400 text-xs py-1.5">
				<div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
					<div className="flex gap-4">
						<span>📞 +40 700 000 000</span>
						<span className="hidden sm:inline">📧 contact@LucianDemoCarp.ro</span>
					</div>
					<div className="flex items-center gap-3">
						<span>{t('common.freeShippingBanner')}</span>
						<LocaleSwitcher />
					</div>
				</div>
			</div>

			{/* Main header */}
			<div className="bg-white shadow-md">
				<div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
					<Link href="/" className="flex items-center gap-2 shrink-0">
						<div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white text-lg font-bold">
							Lucian Demo
						</div>
						<div className="hidden sm:block">
							<p className="text-lg font-bold text-slate-800 leading-tight">Lucian Demo Carp</p>
							<p className="text-[10px] text-slate-400 uppercase tracking-wider">
								Method Feeder Shop
							</p>
						</div>
					</Link>

					<form onSubmit={handleSearch} className="flex-1 max-w-xl">
						<div className="relative">
							<input
								type="text"
								value={query}
								onChange={e => setQuery(e.target.value)}
								placeholder={t('common.search')}
								className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand transition"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</button>
						</div>
					</form>

					<div className="flex items-center gap-2">
						{isAuthenticated ? (
							<div className="hidden sm:flex items-center gap-2">
								<Link href="/account" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand transition px-3 py-2 rounded-lg hover:bg-slate-50">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									{customer?.firstName}
								</Link>
							</div>
						) : (
							<Link href="/account/login" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand transition px-3 py-2 rounded-lg hover:bg-slate-50">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
								{t('common.myAccount')}
							</Link>
						)}

						<Link href="/cart" className="relative flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2.5 rounded-lg transition">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
							</svg>
							<span className="hidden sm:inline text-sm font-medium">
								{totalItems > 0 ? `${totalPrice.toFixed(2)} RON` : t('common.cart')}
							</span>
							{totalItems > 0 && (
								<span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{totalItems}
								</span>
							)}
						</Link>

						<button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-slate-600">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
							</svg>
						</button>
					</div>
				</div>

				<nav className="border-t border-slate-100 hidden lg:block">
					<div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
						<Link href="/products" className="px-4 py-2.5 text-sm font-semibold text-brand hover:bg-brand hover:text-white rounded-t transition">
							{t('common.allProducts')}
						</Link>
						{NAV_LINKS.map(l => (
							<Link key={l.href} href={l.href} className="px-3 py-2.5 text-sm text-slate-600 hover:text-brand hover:bg-slate-50 rounded-t transition">
								{l.label}
							</Link>
						))}
					</div>
				</nav>

				{mobileOpen && (
					<nav className="lg:hidden border-t border-slate-100 bg-white">
						{!isAuthenticated && (
							<Link href="/account/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-slate-600 border-b border-slate-50">
								{t('account.mobileLogin')}
							</Link>
						)}
						{isAuthenticated && (
							<Link href="/account" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-brand font-medium border-b border-slate-50">
								{t('account.mobileAccount', { name: customer?.firstName || '' })}
							</Link>
						)}
						<Link href="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-semibold text-brand border-b border-slate-50">
							{t('common.allProducts')}
						</Link>
						{NAV_LINKS.map(l => (
							<Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-b border-slate-50">
								{l.label}
							</Link>
						))}
					</nav>
				)}
			</div>
		</header>
	);
}
