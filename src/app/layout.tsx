import type { Metadata } from 'next';
import '@/index.css';
import { DataProvider } from '@/context/DataContext';

export const metadata: Metadata = {
  title: 'COREPAWAS - Gadget Second Terpercaya',
  description: 'Jual beli handphone second berkualitas, jasa service, dan edukasi gadget.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 flex flex-col overflow-x-hidden">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
