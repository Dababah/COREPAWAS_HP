"use client";
import Link from 'next/link';
import { Smartphone, Star, ShieldCheck, ArrowRight, MessageCircle, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/data/products';
import { useData } from '@/context/DataContext';

interface ProductCardProps {
  product: Product;
  showFeaturedBadge?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product, showFeaturedBadge }: ProductCardProps) {
  const { waNumber, compareIds, toggleCompare } = useData();
  const isSold = product.status === 'Sold';
  const isCompared = compareIds.includes(product.id);
  
  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya tertarik dengan *${product.name}* seharga ${formatPrice(product.price)}. Apakah masih tersedia?`
  );

  return (
    <div 
      className={`group relative flex flex-col bento-card tilt-3d h-full ${
        isSold ? 'opacity-60 grayscale' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy-dark">
        <Link href={`/katalog/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${!isSold && 'group-hover:scale-110'}`}
          />
        </Link>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/80 via-transparent to-transparent pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border ${
            isSold 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-emerald-500 text-white border-emerald-400'
          }`}>
            {isSold ? 'Sold Out' : 'Ready Stock'}
          </span>
          {showFeaturedBadge && product.isFeatured && !isSold && (
            <span className="px-4 py-1.5 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-brand-orange/40 border border-brand-orange/50">
              ⭐ Pilihan Utama
            </span>
          )}
        </div>

        {/* Compare Toggle */}
        {!isSold && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl flex items-center justify-center transition-all backdrop-blur-xl border ${
              isCompared 
                ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/40' 
                : 'bg-white/10 border-white/20 text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Condition Info Bottom Overlay */}
        {!isSold && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="glass-premium rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <div className="text-white font-black text-xs uppercase tracking-wider">Deep Inspection</div>
                  <div className="text-slate-400 text-[10px]">100% Amanah</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/katalog/${product.id}`} className="block flex-1">
          <div className="mb-4">
            <h3 className="text-xl font-black text-white group-hover:text-brand-orange transition-colors line-clamp-1 tracking-tighter">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{product.brand}</span>
               <span className="w-1 h-1 rounded-full bg-slate-700" />
               <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{product.storage}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-6">
             <div className="px-2 py-1 rounded-lg bg-brand-navy border border-white/5 text-[10px] font-black text-slate-300 uppercase tracking-wider">
                Cond {product.condition}/10
             </div>
             <div className="px-2 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black text-brand-orange uppercase tracking-wider">
                {product.batteryHealth}% BH
             </div>
          </div>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1">Harga Nett</div>
            <div className="text-2xl font-black text-white truncate tracking-tighter">{formatPrice(product.price)}</div>
          </div>
          
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isSold 
                ? 'bg-slate-800 text-slate-600 pointer-events-none' 
                : 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30 hover:scale-110 hover:-rotate-6 active:scale-90'
            }`}
          >
            {isSold ? <ArrowRight className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </a>
        </div>
      </div>
    </div>
  );
}
