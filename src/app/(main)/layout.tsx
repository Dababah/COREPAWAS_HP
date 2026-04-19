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
      <main className="flex-1 text-white">
        {children}
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
