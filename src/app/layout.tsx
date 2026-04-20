export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DataProvider } from '@/context/DataContext';

export const metadata: Metadata = {
  title: 'COREPAWAS - Gadget Second Terpercaya | Deep Inspection Teknisi',
  description: 'Jual beli handphone second berkualitas tinggi dengan standar inspeksi teknisi. Transparansi 100%, cek 3uTools, Antutu, dan stress test. Gratis migrasi data!',
  keywords: 'hp second, handphone bekas, service hp, corepawas, jual beli hp jogja, iphone second, samsung second',
  openGraph: {
    title: 'COREPAWAS - Gadget Second Terpercaya',
    description: 'Beli HP second dengan ketenangan pikiran. Inspeksi level teknisi, no tipu-tipu.',
    url: 'https://corepawas.vercel.app',
    siteName: 'COREPAWAS',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'COREPAWAS - Gadget Second Terpercaya',
    description: 'Inspeksi level teknisi untuk HP second impianmu.',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#020617', // slate-950
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        {/* Anti-flash white background script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-slate-950 text-slate-50 antialiased selection:bg-blue-500/30 selection:text-white">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
