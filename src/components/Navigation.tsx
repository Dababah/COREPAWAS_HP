"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cpu, Home, BookOpen, Wrench, Smartphone, RefreshCw } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { BrandLogo } from './BrandLogo';

const navLinks = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Katalog HP', href: '/katalog', icon: Smartphone },
  { label: 'Jasa & Servis', href: '/jasa', icon: Wrench },
  { label: 'Trade-In', href: '/tukar-tambah', icon: RefreshCw },
  { label: 'Edukasi', href: '/edukasi', icon: BookOpen },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { waNumber } = useData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 w-[92%] max-w-7xl ${
          scrolled
            ? 'glass-premium py-3 px-6 rounded-[2rem] shadow-2xl shadow-brand-navy/50 border border-white/10'
            : 'bg-transparent py-6 px-4'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <BrandLogo size="md" />
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-1 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-2xl bg-white text-brand-navy text-[11px] font-black uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-xl hover:shadow-brand-orange/20 flex items-center gap-3"
            >
              Cek Stok
              <Smartphone className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-90 transition-all shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-700 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-brand-navy/95 backdrop-blur-3xl" onClick={() => setIsOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-background border-l border-white/5 shadow-2xl flex flex-col p-10 transition-transform duration-700 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-16">
            <Link href="/">
              <BrandLogo size="md" />
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-6 px-6 py-5 rounded-3xl text-lg font-black uppercase tracking-widest transition-all ${
                    isActive ? 'bg-brand-orange text-white shadow-2xl shadow-brand-orange/30' : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 w-full py-6 rounded-[2rem] bg-brand-orange text-white text-xl font-black shadow-2xl shadow-brand-orange/30 active:scale-95 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-xs pointer-events-none">
        <div className="glass-premium rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-2xl shadow-brand-navy/50 border border-white/20 pointer-events-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-2xl transition-all relative ${
                  isActive ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/40 -translate-y-4' : 'text-slate-500 active:scale-90'
                }`}
              >
                <Icon className="w-6 h-6" />
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

