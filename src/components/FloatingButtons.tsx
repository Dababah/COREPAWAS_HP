"use client";
import { MessageCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export default function FloatingButtons() {
  const { waNumber } = useData();

  return (
    <div className="fixed right-6 bottom-32 md:bottom-8 z-[100] flex flex-col gap-4 animate-fade-in-up">
      {/* TikTok */}
      <a
        href="https://tiktok.com/@corepawas"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok COREPAWAS"
        className="group relative w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 hover:scale-110 transition-all duration-300 shadow-2xl"
      >
        <TiktokIcon />
        <span className="absolute right-full mr-3 px-2 py-1 rounded bg-slate-900 border border-white/10 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          TikTok
        </span>
      </a>

      {/* Instagram */}
      <a
        href="https://instagram.com/corepawas"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram COREPAWAS"
        className="group relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/20"
      >
        <InstagramIcon />
        <span className="absolute right-full mr-3 px-2 py-1 rounded bg-slate-900 border border-white/10 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Instagram
        </span>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20tentang%20stok%20HP%20second.`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp COREPAWAS"
        className="group relative w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-400 hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/40"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl pointer-events-none">
          Chat Sekarang
        </span>
      </a>
    </div>
  );
}
