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
      {/* Floating Bar */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom,1.5rem)+4.5rem)] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-[70] animate-fade-in-up">
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {compareProducts.map(p => (
              <div key={p.id} className="relative flex-shrink-0">
                <img 
                  src={p.image} 
                  className="w-10 h-12 rounded-lg object-cover border border-white/10" 
                  alt={p.name} 
                />
                <button 
                  onClick={() => toggleCompare(p.id)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]"
                >
                  <X className="w-2 h-2" />
                </button>
              </div>
            ))}
            {compareIds.length < 3 && (
              <div className="w-10 h-12 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                <Plus className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-600/20"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Bandingkan ({compareIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white">Perbandingan Unit</h2>
                <p className="text-slate-400 text-xs mt-1">Bandingkan spesifikasi teknis antar unit pilihanmu.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              <div className="grid grid-cols-4 gap-6 text-sm">
                {/* Labels Column */}
                <div className="space-y-8 pt-48">
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Harga</div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Kondisi</div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Battery Health</div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Storage</div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Chipset</div>
                  <div className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Status UBL</div>
                </div>

                {/* Units Columns */}
                {compareProducts.map(p => (
                  <div key={p.id} className="space-y-8 text-center bg-slate-800/10 rounded-2xl p-4">
                    {/* Header */}
                    <div className="space-y-3">
                      <img src={p.image} className="w-full aspect-[4/5] object-cover rounded-xl border border-white/5" alt={p.name} />
                      <h3 className="text-white font-black text-sm">{p.name}</h3>
                    </div>

                    <div className="text-white font-black">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(p.price)}
                    </div>
                    <div className="text-blue-400 font-bold">{p.condition}</div>
                    <div className="text-emerald-400 font-bold">{p.batteryHealth}%</div>
                    <div className="text-white">{p.storage}</div>
                    <div className="text-white truncate">{p.chipset}</div>
                    <div className={p.hasUBL ? 'text-red-400' : 'text-emerald-400'}>
                      {p.hasUBL ? 'ON' : 'OFF'}
                    </div>

                    <Link 
                      href={`/katalog/${p.id}`}
                      className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs hover:underline"
                    >
                      Detail Produk <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}

                {/* Empty Placeholder if less than 3 */}
                {Array.from({ length: 3 - compareProducts.length }).map((_, i) => (
                  <div key={i} className="rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center p-8">
                    <p className="text-slate-600 font-bold text-sm text-center">Tambah Unit<br/>lainnya</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
              <p className="text-slate-500 text-xs">Pilih hingga 3 unit untuk dibandingkan.</p>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-sm"
              >
                Tutup Table
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
