import type {Metadata} from 'next';
import './globals.css';
import {CartProvider} from '@/context/CartContext';
import {CustomerAuthProvider} from '@/context/CustomerAuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';

export const metadata: Metadata = {
    title: 'MG Carp – Magazin Method Feeder',
    description: 'Magazin online specializat în echipamente de pescuit method feeder. Lansete, mulinete, feedere, momeli și accesorii.',
};

export default async function RootLayout({children}: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html lang={locale}>
        <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
            <CustomerAuthProvider>
                <CartProvider>
                    <Header/>
                    <main className="flex-1">{children}</main>
                    <Footer/>
                </CartProvider>
            </CustomerAuthProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
