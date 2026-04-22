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
      className={`group relative flex flex-col bg-slate-900 border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
        isSold ? 'opacity-70' : 'hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-800">
        <Link href={`/katalog/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${!isSold && 'group-hover:scale-110'} ${isSold && 'grayscale'}`}
          />
        </Link>
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
          <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
            isSold 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
          }`}>
            {isSold ? 'Sold' : 'Ready'}
          </span>
        </div>

        {/* Compare Toggle (Top Right) */}
        {!isSold && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all backdrop-blur-md border ${
              isCompared 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Quality Badge Bottom Overlay (Hidden on very small mobile if desired, but let's keep it refined) */}
        {!isSold && (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 translate-y-16 sm:translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-[7px] sm:text-[10px] font-black text-white uppercase tracking-wider">Amanah</span>
              </div>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 flex flex-col flex-1">
        <Link href={`/katalog/${product.id}`} className="block flex-1 group/title">
          <div className="flex justify-between items-start mb-1 sm:mb-2">
            <h3 className="text-sm sm:text-lg font-black text-white group-hover/title:text-blue-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5 mb-2 sm:mb-4">
             <div className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-white/5">
                {product.condition}
             </div>
             <div className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-[8px] sm:text-[10px] font-bold text-blue-400 uppercase tracking-wider border border-blue-500/20">
                {product.batteryHealth}% BH
             </div>
          </div>

          <p className="hidden sm:block text-slate-400 text-xs line-clamp-2 mb-6 h-8 leading-relaxed">
            {product.description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-slate-500 text-[7px] sm:text-[10px] uppercase font-bold tracking-widest mb-0.5">Harga Nett</div>
            <div className="text-sm sm:text-xl font-black text-white truncate">{formatPrice(product.price)}</div>
          </div>
          
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isSold 
                ? 'bg-slate-800 text-slate-600 pointer-events-none' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-110 hover:rotate-6'
            }`}
          >
            {isSold ? <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
          </a>
        </div>
      </div>
    </div>
  );
}
