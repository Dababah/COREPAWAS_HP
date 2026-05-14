"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter as useNavigate } from 'next/navigation';
import {
  ArrowLeft,
  Battery,
  HardDrive,
  Cpu,
  Smartphone,
  CheckCircle,
  XCircle,
  MessageCircle,
  ShieldCheck,
  Package,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

const conditionColors: Record<string, string> = {
  'Like New': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Very Good': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Good: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

function formatAntutu(score?: number) {
  if (!score) return 'N/A';
  return score.toLocaleString('id-ID');
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products, waNumber } = useData();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);
  const relatedProducts = products.filter((p) => p.id !== id && p.brand === product?.brand).slice(0, 3);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <Smartphone className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h2 className="text-slate-900 font-bold text-xl mb-2">Produk tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">Produk ini mungkin sudah terjual atau tidak tersedia.</p>
          <Link href="/katalog" className="px-6 py-3 rounded-xl bg-brand-navy text-white font-bold hover:bg-brand-orange transition-colors">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || [product.image];

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya tertarik dengan *${product.name}* (ID: #${product.id}) seharga ${formatPrice(product.price)}.\n\nBoleh minta info lebih lanjut?`
  );

  const isSold = product.status === 'Sold';

  const specs = [
    { label: 'Chipset', value: product.chipset, icon: <Cpu className="w-4 h-4 text-purple-400" /> },
    { label: 'RAM', value: product.ram, icon: <Zap className="w-4 h-4 text-yellow-400" /> },
    { label: 'Storage', value: product.storage, icon: <HardDrive className="w-4 h-4 text-blue-400" /> },
    { label: 'Battery Health', value: `${product.batteryHealth}%`, icon: <Battery className="w-4 h-4 text-green-400" /> },
    { label: 'Warna', value: product.color, icon: <Smartphone className="w-4 h-4 text-cyan-400" /> },
    { label: 'Garansi', value: product.warrantyStatus, icon: <ShieldCheck className="w-4 h-4 text-slate-400" /> },
  ];


  return (
    <div className="min-h-screen bg-transparent pt-14 sm:pt-16 pb-24 md:pb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 mt-3 sm:mt-4 overflow-hidden font-bold">
          <Link href="/" className="hover:text-brand-orange transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/katalog" className="hover:text-brand-orange transition-colors">Katalog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 aspect-[4/5] sm:aspect-square shadow-xl">
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-700 ${isSold ? 'grayscale opacity-70' : ''}`}
              />
              {isSold && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50">
                  <span className="px-6 py-3 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-lg tracking-widest uppercase">
                    TERJUAL
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full border text-xs font-semibold uppercase ${conditionColors[product.condition]}`}>
                  {product.condition}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      idx === currentImageIndex ? 'border-brand-orange scale-105' : 'border-slate-100 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Antutu Score Card */}
            {product.antutuScore && (
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-slate-900 font-black text-sm uppercase tracking-widest">AnTuTu Score</h4>
                  <span className="text-xs text-slate-400 font-bold">Tested Live</span>
                </div>
                <div className="text-3xl font-black text-slate-900 mb-2">
                  {formatAntutu(product.antutuScore)}
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                    style={{ width: `${Math.min((product.antutuScore / 1200000) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  {product.antutuScore > 700000
                    ? '🔥 Performa Flagship'
                    : product.antutuScore > 400000
                    ? '⚡ Performa Mid-range Tinggi'
                    : '✅ Performa Harian Lancar'}
                </p>
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            <div className="mb-6">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">{product.brand}</p>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">{product.name}</h1>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isSold
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}>
                  {isSold ? '● Terjual' : '● Ready Stock'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${conditionColors[product.condition]}`}>
                  {product.condition}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-300 line-through mb-1 font-bold">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-emerald-400 text-sm font-medium mb-4">
                  Hemat {formatPrice(product.originalPrice - product.price)}
                </p>
              )}

              <p className="text-slate-500 leading-relaxed mb-8 font-medium text-lg">{product.description}</p>

              {/* CTA */}
              {!isSold ? (
                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-colors shadow-lg shadow-green-600/30 mb-3"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Tanya via WhatsApp
                </a>
              ) : (
                <Link href="/katalog"
                  className="hidden sm:flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-lg hover:bg-slate-700 transition-colors mb-3"
                >
                  <Smartphone className="w-5 h-5" />
                  Lihat Unit Lainnya
                </Link>
              )}

              <p className="text-center text-slate-500 text-xs">
                Gratis konsultasi & migrasi data untuk setiap pembelian
              </p>
            </div>

            {/* Specs Table */}
            <div className="rounded-3xl bg-white border border-slate-200 p-8 mb-6 shadow-sm">
              <h3 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                Spesifikasi Teknis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      {spec.icon}
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{spec.label}</span>
                    </div>
                    <span className="text-slate-900 text-sm font-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accessories */}
            {product.accessories.length > 0 && (
              <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <h3 className="text-slate-900 font-black text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                  Kelengkapan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.accessories.map((acc, i) => (
                    <span key={i} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Unit {product.brand} Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/katalog/${p.id}`} className="block">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 hover:border-brand-orange/30 bg-white transition-all hover:-translate-y-1 shadow-sm">
                    <img src={p.image} alt={p.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <p className="text-slate-900 font-black text-sm truncate uppercase tracking-tight">{p.name}</p>
                      <p className="text-brand-orange font-black text-sm mt-1">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE STICKY BOTTOM CTA ── */}
      {!isSold && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 px-4 pb-2">
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-base shadow-xl shadow-green-900/50"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Tanya via WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
