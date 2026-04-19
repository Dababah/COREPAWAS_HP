"use client";
import Link from 'next/link';
import { Cpu, MapPin, MessageCircle, Mail, Instagram } from 'lucide-react';
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
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block text-white font-black tracking-tight text-lg">COREPAWAS</span>
                <span className="block text-cyan-400 text-[10px] tracking-widest uppercase">Gadget Second Terpercaya</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-sm">
              Jual beli HP second dengan standar inspeksi teknisi. Deep Inspection, No Tipu-Tipu. Setiap unit dicek
              3uTools, AnTuTu, dan stress test sebelum dijual.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white hover:bg-green-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/corepawas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-opacity"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@corepawas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
              >
                <TiktokIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Katalog HP', href: '/katalog' },
                { label: 'Jasa & Servis', href: '/jasa' },
                { label: 'Edukasi & Blog', href: '/edukasi' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                  +{waNumber}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@corepawas.id"
                  className="flex items-start gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                  hello@corepawas.id
                </a>
              </li>
              <li>
                <a
                  href={googleMapsUrl || `https://maps.google.com/?q=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
                  {storeAddress}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Google Maps Embed */}
        <div className="rounded-xl overflow-hidden border border-slate-800 mb-8 h-40">
          <iframe
            title="Lokasi COREPAWAS"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapSrc}
            className="grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
          />
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} COREPAWAS. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built with React + Vite + Tailwind CSS · Hosted on Netlify
          </p>
        </div>
      </div>
    </footer>
  );
}
