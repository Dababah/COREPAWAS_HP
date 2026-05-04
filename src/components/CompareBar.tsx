"use client";
import { X, ArrowRight, Plus, SlidersHorizontal } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useState } from 'react';
import Link from 'next/link';

export default function CompareBar() {
  const { compareIds, products, toggleCompare } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareIds.length === 0) return null;

  const compareProducts = products.filter(p => compareIds.includes(p.id));

  return (
    <>
      {/* Floating Bar (Bento Style) */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom,1.5rem)+5.5rem)] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[70] animate-fade-in-up">
        <div className="glass-premium rounded-[2rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6 border border-white/10">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {compareProducts.map(p => (
              <div key={p.id} className="relative flex-shrink-0 group">
                <div className="w-12 h-14 rounded-xl overflow-hidden border border-white/10 shadow-lg transition-transform group-hover:scale-110">
                  <img 
                    src={p.image} 
                    className="w-full h-full object-cover" 
                    alt={p.name} 
                  />
                </div>
                <button 
                  onClick={() => toggleCompare(p.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors border-2 border-brand-navy-dark"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {compareIds.length < 3 && (
              <div className="w-12 h-14 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center text-slate-600 bg-white/5">
                <Plus className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-brand-orange text-white text-sm font-black hover:bg-orange-500 transition-all flex items-center gap-3 whitespace-nowrap shadow-xl shadow-brand-orange/30 hover:-translate-y-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bandingkan ({compareIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal (Premium Bento Grid) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div 
            className="absolute inset-0 bg-[#020617]/95 backdrop-blur-xl"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-5xl bg-brand-navy-dark border border-white/5 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh] tilt-3d">
            <div className="flex items-center justify-between p-8 sm:p-10 border-b border-white/5">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Perbandingan Unit</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium italic">"Analisis mendalam untuk unit impianmu."</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all shadow-xl"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-8 sm:p-10 no-scrollbar">
              <div className="grid grid-cols-4 gap-8 text-sm">
                {/* Labels Column */}
                <div className="space-y-10 pt-64">
                  {[
                    'Harga Nett',
                    'Kondisi Fisik',
                    'Battery Health',
                    'Kapasitas',
                    'Chipset / CPU',
                    'Status UBL'
                  ].map(label => (
                    <div key={label} className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] h-12 flex items-center">
                      {label}
                    </div>
                  ))}
                </div>

                {/* Units Columns */}
                {compareProducts.map(p => (
                  <div key={p.id} className="space-y-10 text-center group">
                    {/* Header Card */}
                    <div className="space-y-4 bg-white/5 p-4 rounded-[2rem] border border-white/5 group-hover:border-brand-orange/30 transition-all duration-500">
                      <div className="aspect-[4/5] overflow-hidden rounded-2xl relative">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/80 via-transparent to-transparent" />
                      </div>
                      <h3 className="text-white font-black text-base truncate tracking-tight">{p.name}</h3>
                    </div>

                    <div className="text-white font-black text-lg h-12 flex items-center justify-center tracking-tighter">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)}
                    </div>
                    <div className="h-12 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-lg bg-brand-navy border border-white/5 text-slate-300 font-black text-[10px] uppercase">
                        {p.condition}/10
                      </span>
                    </div>
                    <div className="h-12 flex items-center justify-center">
                       <span className="px-3 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-black text-[10px] uppercase">
                        {p.batteryHealth}% BH
                      </span>
                    </div>
                    <div className="text-white font-bold h-12 flex items-center justify-center">{p.storage}</div>
                    <div className="text-slate-400 font-medium h-12 flex items-center justify-center italic line-clamp-2">{p.chipset}</div>
                    <div className="h-12 flex items-center justify-center">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        p.hasUBL 
                          ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {p.hasUBL ? 'UBL ON' : 'OFF'}
                      </span>
                    </div>

                    <Link 
                      href={`/katalog/${p.id}`}
                      className="inline-flex items-center gap-2 text-brand-orange font-black text-xs uppercase tracking-widest hover:underline pt-4"
                    >
                      Detail Unit <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}

                {/* Empty Placeholder */}
                {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                  <div key={i} className="rounded-[2.5rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-10 bg-white/[0.02]">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                      <Plus className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-600 font-black text-xs uppercase tracking-widest text-center">Tambah Unit<br/>Lainnya</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Maksimal 3 unit untuk perbandingan akurat.</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
              >
                Tutup Perbandingan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
