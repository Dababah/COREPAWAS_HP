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
      className={`group relative flex flex-col bg-slate-900 border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 ${
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
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
            isSold 
              ? 'bg-red-500/20 border-red-500/50 text-red-400' 
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
          }`}>
            {isSold ? 'Sold Out' : 'Ready Stock'}
          </span>
        </div>

        {/* Compare Toggle (Top Right) */}
        {!isSold && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product.id);
            }}
            className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all backdrop-blur-md border ${
              isCompared 
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        )}

        {/* 3uTools Verified Bottom Overlay */}
        {!isSold && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">Technician Verified</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <Link href={`/katalog/${product.id}`} className="block flex-1 group/title">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-black text-white group-hover/title:text-blue-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold text-slate-400">NEW</span>
            </div>
          </div>
          
          <p className="text-slate-400 text-xs line-clamp-2 mb-6 h-8 leading-relaxed">
            {product.description}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Harga Nett</div>
            <div className="text-xl font-black text-white">{formatPrice(product.price)}</div>
          </div>
          
          <a
            href={`https://wa.me/${waNumber}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              isSold 
                ? 'bg-slate-800 text-slate-600 pointer-events-none' 
                : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:scale-110 hover:rotate-6'
            }`}
          >
            {isSold ? <ArrowRight className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </a>
        </div>
      </div>
    </div>
  );
}
