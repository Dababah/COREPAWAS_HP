"use client";
import Link from 'next/link';
import { Cpu, MapPin, MessageCircle, Instagram } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';
import { BrandLogo } from './BrandLogo';

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
    <footer className="bg-background border-t border-border relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-navy/30 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-8">
              <BrandLogo size="lg" />
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm font-medium">
              Tempat jual beli gadget second terpercaya di Jogja. Mengutamakan <strong className="text-white font-black">Kejujuran & Transparansi</strong> 
              agar Anda bisa beli dengan tenang dan amanah.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Navigasi Cepat</h4>
            <ul className="space-y-4">
              {[
                { label: 'Katalog HP', href: '/katalog' },
                { label: 'Jasa & Servis', href: '/jasa' },
                { label: 'Trade-In / Tukar Tambah', href: '/tukar-tambah' },
                { label: 'Edukasi & Tips', href: '/edukasi' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-muted-foreground hover:text-brand-orange text-sm font-bold transition-all flex items-center gap-3 group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-brand-orange group-hover:scale-125 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Hubungi Kami</h4>
            <ul className="space-y-6">
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-green-500/20 transition-all border border-white/5">
                    <WhatsAppIcon className="w-5 h-5 text-green-500" />
                  </div>
                  +{waNumber}
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/corepawas.gadget/?utm_source=ig_web_button_share_sheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20 transition-all border border-white/5">
                    <Instagram className="w-5 h-5 text-pink-500" />
                  </div>
                  @corepawas.gadget
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl || `https://maps.google.com/?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-muted-foreground hover:text-white text-sm font-bold transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-all border border-white/5">
                    <MapPin className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="line-clamp-1">{storeAddress}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-[3rem] overflow-hidden border border-border mb-16 h-64 sm:h-80 shadow-2xl relative group">
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
          <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[3rem]" />
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-muted-foreground text-xs font-black tracking-widest uppercase">
            © {new Date().getFullYear()} COREPAWAS. Handcrafted in Jogja.
          </p>
          <div className="flex items-center gap-6">
             <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black tracking-[0.2em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                Trusted Seller
             </span>
             <span className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-navy/10 border border-brand-navy/20 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase">
                Jogja Based
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
