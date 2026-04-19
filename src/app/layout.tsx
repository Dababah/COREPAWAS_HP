import type { Metadata, Viewport } from 'next';
import '@/index.css';
import { DataProvider } from '@/context/DataContext';

export const metadata: Metadata = {
  title: 'COREPAWAS - Gadget Second Terpercaya',
  description: 'Jual beli handphone second berkualitas, jasa service, dan edukasi gadget.',
};

export const viewport: Viewport = {
  width: 1280,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 flex flex-col">
        <div className="min-w-[1280px]">
          <DataProvider>
            {children}
          </DataProvider>
        </div>
      </body>
    </html>
  );
}
