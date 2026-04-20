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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass py-2 shadow-lg shadow-blue-500/10'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
                  <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                {/* Real-time indicator dot */}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                </div>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="block text-white font-black tracking-tight text-lg sm:text-xl">COREPAWAS</span>
                </div>
                <span className="text-cyan-400 text-[10px] sm:text-[11px] leading-none tracking-widest uppercase font-bold">
                  Premium Gadget
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
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
                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-950 text-sm font-bold hover:bg-white transition-all shadow-lg hover:shadow-white/10 hover:scale-105 active:scale-95"
              >
                Cek Stok via WA
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <a
                href={`https://wa.me/${waNumber}`}
                className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20 active:scale-90 transition-transform"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <button
                className="p-2.5 rounded-full text-white bg-slate-800 border border-slate-700 active:scale-90 transition-transform"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE FULLSCREEN DRAWER ── */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-all duration-500 ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-sm bg-slate-950 border-l border-white/5 shadow-2xl flex flex-col p-6 transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black text-xl">COREPAWAS</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
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
                  className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-lg font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-900'}`}>
                    <Icon className="w-6 h-6" />
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
              className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-black shadow-xl shadow-blue-500/25 active:scale-95 transition-all"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM BAR (Minimalist) ── */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-blue-900/20 ring-1 ring-white/10">
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
                className={`p-2.5 rounded-full transition-all relative ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 -translate-y-1' : 'text-slate-400 active:scale-90'
                }`}
              >
                <Icon className="w-6 h-6" />
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
