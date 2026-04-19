"use client";
import Link from 'next/link';
import { Battery, HardDrive, Cpu, CheckCircle, XCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '@/data/products';
import { useData } from '@/context/DataContext';

interface ProductCardProps {
  product: Product;
  showFeaturedBadge?: boolean;
}

const conditionColors: Record<string, string> = {
  'Like New': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  'Very Good': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Good: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product, showFeaturedBadge }: ProductCardProps) {
  const { waNumber } = useData();
  const isSold = product.status === 'Sold';

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya tertarik dengan *${product.name}* seharga ${formatPrice(product.price)}. Apakah masih tersedia?`
  );

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 group ${
        isSold
          ? 'bg-slate-900/40 border-slate-800 opacity-70'
          : 'bg-slate-900 border-slate-800 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {showFeaturedBadge && !isSold && (
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-lg">
            ⭐ Roti Tawar
          </span>
        )}
        <span
          className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${conditionColors[product.condition]}`}
        >
          {product.condition}
        </span>
      </div>

      {/* Status overlay */}
      {isSold && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider">
            TERJUAL
          </span>
        </div>
      )}
      {!isSold && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            READY
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/katalog/${product.id}`}>
        <div className="relative h-52 overflow-hidden bg-slate-800">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              !isSold ? 'group-hover:scale-105' : ''
            } ${isSold ? 'grayscale' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/katalog/${product.id}`} className="hover:text-blue-400 transition-colors">
          <h3 className="font-bold text-white mb-1 truncate">{product.name}</h3>
        </Link>

        {/* Specs quick info */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
          <span className="flex items-center gap-1 text-slate-400 text-xs">
            <Battery className="w-3 h-3 text-green-400" />
            {product.batteryHealth}%
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-xs">
            <HardDrive className="w-3 h-3 text-blue-400" />
            {product.storage}
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-xs">
            <Cpu className="w-3 h-3 text-purple-400" />
            {product.ram} RAM
          </span>
        </div>

        {/* UBL / Root check */}
        <div className="flex gap-3 mb-3">
          <span className={`flex items-center gap-1 text-xs ${product.hasUBL ? 'text-orange-400' : 'text-emerald-400'}`}>
            {product.hasUBL ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
            UBL {product.hasUBL ? 'ON' : 'OFF'}
          </span>
          <span className={`flex items-center gap-1 text-xs ${product.isRooted ? 'text-orange-400' : 'text-emerald-400'}`}>
            {product.isRooted ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
            Root {product.isRooted ? 'YES' : 'NO'}
          </span>
          <span className="flex items-center gap-1 text-xs text-blue-400">
            <ShieldCheck className="w-3 h-3" />
            QC Teknisi
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end gap-2 mb-4">
          <span className="text-xl font-black text-white">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/katalog/${product.id}`}
            className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium text-center hover:border-blue-500/50 hover:text-blue-400 transition-all"
          >
            Detail
          </Link>
          {!isSold && (
            <a
              href={`https://wa.me/${waNumber}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WA
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
