"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cpu, Home, BookOpen, Wrench, Smartphone, RefreshCw } from 'lucide-react';
import { useData } from '@/context/DataContext';

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

  // Lock body scroll when mobile drawer is open
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
      {/* ── TOP NAVBAR ── */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] max-w-5xl ${
          scrolled
            ? 'glass-premium py-2 rounded-3xl shadow-2xl shadow-orange-500/10'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="px-4 sm:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-orange flex items-center justify-center shadow-xl shadow-brand-navy/30 group-hover:shadow-brand-orange/40 transition-all duration-500 group-hover:rotate-6">
                  <Cpu className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                {/* Real-time indicator dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(240,90,40,0.8)]" />
                </div>
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="block text-white font-black tracking-tighter text-xl">COREPAWAS</span>
                </div>
                <span className="text-orange-400 text-[10px] leading-none tracking-[0.2em] uppercase font-black">
                  Premium Gadget
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-1 p-1.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS,%20saya%20ingin%20tanya%20stok%20HP`}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-6 py-3 rounded-full bg-white text-brand-navy text-sm font-black hover:bg-brand-orange hover:text-white transition-all shadow-xl hover:shadow-brand-orange/20 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Cek Stok
                <Smartphone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                className="p-3 rounded-2xl text-white glass-premium border border-white/10 active:scale-90 transition-transform shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULLSCREEN DRAWER ── */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-all duration-700 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand-navy/90 backdrop-blur-2xl"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-slate-950/50 border-l border-white/10 shadow-2xl flex flex-col p-8 transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-orange flex items-center justify-center">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">COREPAWAS</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-5 px-6 py-5 rounded-3xl text-xl font-black transition-all ${
                    isActive
                      ? 'bg-brand-orange text-white shadow-2xl shadow-brand-orange/30 scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 w-full py-6 rounded-3xl bg-gradient-to-r from-brand-navy to-brand-orange text-white text-xl font-black shadow-2xl shadow-brand-orange/20 active:scale-95 transition-all"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR (Habitline Style) ── */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm pointer-events-none">
        <div className="glass-premium rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-2xl shadow-brand-navy/50 border border-white/20 pointer-events-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-2xl transition-all relative ${
                  isActive ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/40 -translate-y-2' : 'text-slate-400 active:scale-90'
                }`}
              >
                <Icon className="w-7 h-7" />
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
