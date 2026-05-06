"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Smartphone, Star, ShieldCheck, ArrowRight, MessageCircle, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isSold = product.status === 'Sold';
  const isCompared = compareIds.includes(product.id);
  
  const productImages = product.images || [product.image];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };
  
  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya tertarik dengan *${product.name}* seharga ${formatPrice(product.price)}. Apakah masih tersedia?`
  );

  return (
    <div 
      className={`group relative flex flex-col bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-brand-orange/30 hover:shadow-2xl hover:shadow-brand-orange/10 ${
        isSold ? 'opacity-60 grayscale' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy-dark">
        <Link href={`/katalog/${product.id}`} className="block w-full h-full">
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${!isSold && 'group-hover:scale-110'}`}
          />
        </Link>
        
        {/* Slider Controls */}
        {!isSold && productImages.length > 1 && (
          <>
            <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <button 
                onClick={prevImage}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center pointer-events-auto hover:bg-brand-orange hover:border-brand-orange transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextImage}
                className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center pointer-events-auto hover:bg-brand-orange hover:border-brand-orange transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Pagination Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {productImages.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? 'w-6 bg-brand-orange' : 'w-1.5 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-transparent to-transparent pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border ${
            isSold 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-emerald-500 text-white border-emerald-400'
          }`}>
            {isSold ? 'Sold Out' : 'Ready'}
          </span>
          {showFeaturedBadge && product.isFeatured && !isSold && (
            <span className="px-4 py-1.5 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-orange/40 border border-brand-orange/50">
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
            className={`absolute top-5 right-5 z-20 w-10 h-10 rounded-2xl flex items-center justify-center transition-all backdrop-blur-xl border ${
              isCompared 
                ? 'bg-brand-orange border-brand-orange text-white shadow-xl shadow-brand-orange/40' 
                : 'bg-white/10 border-white/20 text-white/60 hover:text-white hover:bg-white/20'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Condition Info Overlay */}
        {!isSold && (
          <div className="absolute bottom-5 left-5 right-5 translate-y-20 group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <div className="text-white font-black text-[10px] uppercase tracking-wider">Deep Inspection</div>
                  <div className="text-slate-400 text-[10px]">100% Amanah</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <Link href={`/katalog/${product.id}`} className="block flex-1">
          <div className="mb-4">
            <h3 className="text-xl font-black text-white group-hover:text-brand-orange transition-colors line-clamp-1 tracking-tighter">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{product.brand}</span>
               <span className="w-1 h-1 rounded-full bg-border" />
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{product.storage}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-8">
             <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Cond {product.condition}/10
             </div>
             <div className="px-2.5 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black text-brand-orange uppercase tracking-wider">
                {product.batteryHealth}% BH
             </div>
          </div>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-white/5">
          <div className="min-w-0">
            <div className="text-muted-foreground text-[10px] uppercase font-black tracking-[0.2em] mb-1">Price</div>
            <div className="text-2xl font-black text-white truncate tracking-tighter">{formatPrice(product.price)}</div>
          </div>
          
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
              isSold 
                ? 'bg-slate-800 text-slate-600 pointer-events-none' 
                : 'bg-brand-orange text-white shadow-xl shadow-brand-orange/30 hover:scale-110 hover:-rotate-6 active:scale-95'
            }`}
          >
            {isSold ? <ArrowRight className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
          </a>
        </div>
      </div>
    </div>
  );
}


