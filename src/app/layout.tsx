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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'COREPAWAS',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0B355E', // brand-navy
};

import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`dark ${outfit.variable}`}>
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
      <body className={`${outfit.className} min-h-[100dvh] antialiased noise-bg selection:bg-brand-orange/30 selection:text-white`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const observerOptions = {
                threshold: 0.1
              };
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                  }
                });
              }, observerOptions);

              window.addEventListener('DOMContentLoaded', () => {
                document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
              });

              // Also check for dynamically added content if needed
              const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                  mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                      if (node.classList.contains('reveal')) observer.observe(node);
                      node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
                    }
                  });
                });
              });
              mutationObserver.observe(document.body, { childList: true, subtree: true });
            `
          }}
        />
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
