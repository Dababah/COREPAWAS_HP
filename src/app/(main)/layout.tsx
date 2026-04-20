export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {/* pb-16 on mobile accounts for the fixed bottom nav bar height */}
      <main className="flex-1 text-white pb-16 md:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
