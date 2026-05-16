export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import CompareBar from '@/components/CompareBar';
import CustomerChat from '@/components/CustomerChat';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {/* pb-32 on mobile accounts for the fixed bottom nav bar height */}
      <main className="flex-1 text-white pb-32 md:pb-0">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
      <CompareBar />
      <FloatingButtons />
      <CustomerChat />
    </>
  );
}

