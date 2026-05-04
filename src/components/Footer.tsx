"use client";
import Link from 'next/link';
import { Cpu, MapPin, MessageCircle, Instagram } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z" />
  </svg>
);

export default function Footer() {
  const { waNumber, storeAddress, googleMapsApiKey, googleMapsUrl, googleMapsEmbedUrl } = useData();

  const mapsQuery = encodeURIComponent(storeAddress);

  // Priority: 1. Manual Embed Url, 2. API Key Format, 3. Legacy Search Format
  const mapSrc = googleMapsEmbedUrl
    ? googleMapsEmbedUrl
    : googleMapsApiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${mapsQuery}`
      : `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

  return (
    <footer className="bg-[#020617] border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 glow-orange opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 glow-navy opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-orange flex items-center justify-center shadow-xl shadow-brand-navy/20 group-hover:rotate-6 transition-transform">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-white font-black tracking-tighter text-2xl uppercase">CORE PAWAS</span>
                <span className="block text-orange-400 text-[10px] tracking-[0.3em] uppercase font-black">Teman Setia Gadget Kamu</span>
              </div>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-sm font-medium">
              Tempat jual beli gadget second terpercaya di Jogja. Mengutamakan <strong className="text-white font-black">Kejujuran & Transparansi</strong> 
              kondisi unit apa adanya agar kamu bisa beli dengan tenang.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Katalog HP', href: '/katalog' },
                { label: 'Jasa & Servis', href: '/jasa' },
                { label: 'Edukasi & Blog', href: '/edukasi' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-slate-500 hover:text-brand-orange text-sm font-bold transition-all flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-brand-orange transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-all">
                    <WhatsAppIcon className="w-4 h-4 text-green-500" />
                  </div>
                  +{waNumber}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/corepawas.gadget/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-all">
                    <Instagram className="w-4 h-4 text-pink-500" />
                  </div>
                  @corepawas.gadget
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl || `https://maps.google.com/?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-500 hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                    <MapPin className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="line-clamp-1">{storeAddress}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Embed (Bento Style) */}
        <div className="rounded-[2.5rem] overflow-hidden border border-white/5 mb-12 h-56 sm:h-64 shadow-2xl relative group">
          <iframe
            title="Lokasi COREPAWAS"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            className="grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[2.5rem]" />
        </div>

        {/* Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            © {new Date().getFullYear()} COREPAWAS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
             <span className="px-4 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-black tracking-[0.2em] uppercase">
                Terpercaya 100%
             </span>
             <span className="px-4 py-1 rounded-full bg-brand-navy/10 text-brand-navy text-[10px] font-black tracking-[0.2em] uppercase">
                Jogja Based
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
