"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname as useLocation } from 'next/navigation';
import { Menu, X, Cpu, ChevronDown } from 'lucide-react';

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog HP', href: '/katalog' },
  { label: 'Jasa & Servis', href: '/jasa' },
  { label: 'Edukasi', href: '/edukasi' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-blue-900/10 border-b border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-white font-black tracking-tight text-lg">COREPAWAS</span>
              <span className="block text-cyan-400 text-[10px] leading-none tracking-widest uppercase">
                Gadget Second Terpercaya
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20COREPAWAS,%20saya%20ingin%20tanya%20stok%20HP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
            >
              Cek Stok via WA
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 pb-1">
            <a
              href="https://wa.me/6281234567890?text=Halo%20COREPAWAS,%20saya%20ingin%20tanya%20stok%20HP"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2.5 rounded-lg text-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold"
            >
              Cek Stok via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
