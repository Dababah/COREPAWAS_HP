export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata, Viewport } from 'next';
import '@/index.css';
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
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 flex flex-col">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
