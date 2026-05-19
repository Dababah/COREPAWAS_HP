"use client";
import { useState } from 'react';
import { Smartphone, Calculator, Check, ChevronsUpDown, TrendingDown, HelpCircle, AlertTriangle, Sparkles, Loader2, Info } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/components/ui/utils';

export default function TradeInPage() {
  const { waNumber, products } = useData();
  
  // User Input State
  const [deviceSpecs, setDeviceSpecs] = useState('');
  
  // AI Response States
  const [isCalculated, setIsCalculated] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [tradeInOffer, setTradeInOffer] = useState<number>(0);
  const [reasoning, setReasoning] = useState<string>('');
  
  // Upgrade Mode States
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);
  const [selectedUpgradeProduct, setSelectedUpgradeProduct] = useState<any>(null);
  const [openUpgradeDropdown, setOpenUpgradeDropdown] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const topUpNeeded = selectedUpgradeProduct ? Math.max(0, selectedUpgradeProduct.price - tradeInOffer) : 0;

  const handleCalculateAI = async () => {
    if (!deviceSpecs.trim()) {
      setValidationError("Mohon ketikkan spesifikasi HP Anda secara detail.");
      return;
    }
    
    if (isUpgradeMode && !selectedUpgradeProduct) {
      setValidationError("Pilih HP Baru yang ingin Anda upgrade terlebih dahulu.");
      return;
    }

    setValidationError(null);
    setLoadingAI(true);
    setIsCalculated(false);

    try {
      const res = await fetch('/api/tradein-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: deviceSpecs })
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setTradeInOffer(data.tradeInOffer);
      setReasoning(data.reasoning);
      setIsCalculated(true);
      
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 300);

    } catch (err: any) {
      setValidationError("AI Gagal Menghitung: " + err.message);
    } finally {
      setLoadingAI(false);
    }
  };

  let waText = `Halo COREPAWAS! Saya mau Tukar Tambah unit.\n\n`;
  waText += `*Unit Saya:* ${deviceSpecs}\n`;
  waText += `*Penawaran Beli Sistem AI:* Rp ${tradeInOffer.toLocaleString('id-ID')}\n`;

  if (isUpgradeMode && selectedUpgradeProduct) {
    waText += `\n*Saya ingin Upgrade ke:*\n${selectedUpgradeProduct.name} - Rp ${selectedUpgradeProduct.price.toLocaleString('id-ID')}\n`;
    waText += `*Estimasi Nambah:* Rp ${topUpNeeded.toLocaleString('id-ID')}`;
  }

  const waMessage = encodeURIComponent(waText);

  return (
    <div className="min-h-screen bg-transparent pt-36 sm:pt-44 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-20 relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            AI Trade-In Estimator
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Penaksir Harga <br />
            <span className="text-gradient">Bertenaga AI</span>
          </h1>
          <p className="text-slate-600 max-w-3xl text-lg font-medium leading-relaxed">
            Deskripsikan kondisi HP lamamu, dan biarkan AI kami menganalisa harga pasar seketika. Gunakan fitur Upgrade untuk langsung menukar tambah dengan stok terbaru kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-8 sm:p-14 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
               
               {/* Upgrade Mode Switch */}
               <div className="relative z-10">
                 <div className="flex bg-slate-100 p-2 rounded-3xl mb-8 border border-slate-200">
                    <button 
                      onClick={() => { setIsUpgradeMode(false); setIsCalculated(false); }}
                      className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${!isUpgradeMode ? 'bg-white text-brand-navy shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Jual Unit Saja
                    </button>
                    <button 
                      onClick={() => { setIsUpgradeMode(true); setIsCalculated(false); }}
                      className={`flex-1 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${isUpgradeMode ? 'bg-brand-navy text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Upgrade ke HP Baru
                    </button>
                 </div>
               </div>

               {/* Upgrade Target Selection */}
               {isUpgradeMode && (
                 <div className="p-8 bg-brand-navy/5 rounded-3xl border border-brand-navy/10 relative z-10 animate-fade-in">
                   <label className="flex items-center gap-3 text-brand-navy text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                     <Calculator className="w-5 h-5 text-brand-orange" />
                     Pilih HP Incaran Anda (Stok Toko)
                   </label>
                   
                   <Popover open={openUpgradeDropdown} onOpenChange={setOpenUpgradeDropdown}>
                     <PopoverTrigger asChild>
                       <button className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold shadow-sm flex items-center justify-between">
                         {selectedUpgradeProduct ? `${selectedUpgradeProduct.name} - Rp ${selectedUpgradeProduct.price.toLocaleString('id-ID')}` : 'Cari stok HP idaman Anda...'}
                         <ChevronsUpDown className="w-5 h-5 text-slate-400" />
                       </button>
                     </PopoverTrigger>
                     <PopoverContent className="w-[400px] p-0 rounded-2xl" align="start">
                       <Command>
                         <CommandInput placeholder="Cari iPhone 15, S24..." />
                         <CommandList className="max-h-64">
                           <CommandEmpty>Stok tidak ditemukan.</CommandEmpty>
                           <CommandGroup>
                             {products.filter(p => p.status === 'Ready').map((product) => (
                               <CommandItem
                                 key={product.id}
                                 value={product.name}
                                 onSelect={() => {
                                   setSelectedUpgradeProduct(product);
                                   setOpenUpgradeDropdown(false);
                                   setIsCalculated(false);
                                 }}
                                 className="cursor-pointer py-3"
                               >
                                 <Check className={cn("mr-2 h-4 w-4", selectedUpgradeProduct?.id === product.id ? "opacity-100 text-brand-orange" : "opacity-0")} />
                                 <div className="flex flex-col">
                                   <span className="font-bold text-sm text-slate-900">{product.name}</span>
                                   <span className="font-medium text-[10px] text-brand-orange">Rp {product.price.toLocaleString('id-ID')}</span>
                                 </div>
                               </CommandItem>
                             ))}
                           </CommandGroup>
                         </CommandList>
                       </Command>
                     </PopoverContent>
                   </Popover>
                 </div>
               )}

               {/* AI Input Section */}
              <div className="relative z-10">
                <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black"><Sparkles className="w-3 h-3" /></span>
                  Deskripsikan Kondisi HP Anda Secara Detail
                </label>
                <div className="relative">
                  <textarea 
                    value={deviceSpecs}
                    onChange={(e) => { setDeviceSpecs(e.target.value); setIsCalculated(false); setValidationError(null); }}
                    placeholder="Contoh: Jual iPhone 13 Pro 256GB Warna Biru ex iBox. Layar ada baret halus sedikit, baterai health 86%, fungsi normal semua fullset dus ori."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-900 text-sm font-medium focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/10 outline-none shadow-inner transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Validation Alert */}
              {validationError && (
                <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex gap-4 text-rose-600 text-xs font-bold leading-relaxed relative z-10 animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-rose-700 text-[10px] font-black uppercase tracking-widest block mb-1">Perhatian</span>
                    <p>{validationError}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleCalculateAI}
                disabled={loadingAI || !deviceSpecs.trim()}
                className="w-full py-6 rounded-3xl bg-brand-orange text-white font-black text-xl shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-95 cursor-pointer flex items-center justify-center gap-3 relative z-10 group"
              >
                {loadingAI ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />}
                {loadingAI ? 'AI Sedang Menganalisa...' : 'Taksir Harga dengan AI'}
              </button>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-5 relative z-20">
            {isCalculated ? (
              <div className="sticky top-28 space-y-8 animate-fade-in-up">
                <div className="bg-brand-navy rounded-[3.5rem] p-10 sm:p-14 text-white shadow-[0_40px_100px_-20px_rgba(250,140,22,0.4)] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-brand-orange to-orange-400" />
                  
                  <div className="text-[10px] font-black text-brand-orange uppercase tracking-[0.15em] mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Hasil Analisa AI Generatif
                  </div>

                  {isUpgradeMode ? (
                    <>
                      <div className="space-y-4 mb-8 border-b border-white/10 pb-8">
                         <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                          <span>Nilai Beli HP Anda:</span>
                          <span className="text-emerald-400 font-black">+ Rp {tradeInOffer.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                          <span>Harga {selectedUpgradeProduct?.name}:</span>
                          <span className="text-rose-400 font-black">- Rp {selectedUpgradeProduct?.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Nambah:</div>
                      <div className="text-5xl sm:text-6xl font-black mb-10 flex items-start tracking-tighter text-white drop-shadow-xl">
                        <span className="text-2xl font-black mr-1 mt-2 text-brand-orange">Rp</span>
                        {topUpNeeded.toLocaleString('id-ID')}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Penawaran Tampung Toko:</div>
                      <div className="text-6xl sm:text-7xl font-black mb-10 flex items-start tracking-tighter text-white drop-shadow-xl">
                        <span className="text-2xl font-black mr-1 mt-3 text-brand-orange">Rp</span>
                        {tradeInOffer.toLocaleString('id-ID')}
                      </div>
                    </>
                  )}
                  
                  <div className="bg-black/30 border border-white/5 rounded-3xl p-6 mb-10">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="font-black text-[10px] mb-2 uppercase tracking-widest text-slate-300">Catatan AI Valuator</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-medium">
                          {reasoning}
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    className="flex items-center justify-center gap-4 w-full py-6 rounded-2xl bg-brand-orange text-white font-black text-xl sm:text-2xl transition-all hover:brightness-110 shadow-xl shadow-brand-orange/30 group"
                  >
                    <WhatsAppIcon className="w-7 h-7 group-hover:scale-110 transition-transform" />
                    Deal, Lanjut WhatsApp
                  </a>
                </div>

                <div className="glass-premium border border-white/10 rounded-3xl p-8 text-center bg-white/5 backdrop-blur-md">
                   <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                   <p className="text-slate-400 text-xs font-bold leading-relaxed">
                     Harga yang ditampilkan adalah estimasi sistem AI berdasarkan kondisi pasar. Tim kami akan memverifikasi fisik saat pertemuan COD.
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border-2 border-dashed border-slate-200/50 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center shadow-sm sticky top-28">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 flex items-center justify-center mb-10 relative">
                  <Sparkles className="w-12 h-12 text-slate-300 absolute" />
                  {isUpgradeMode && <Calculator className="w-6 h-6 text-brand-orange absolute -bottom-2 -right-2 bg-white rounded-full shadow-md" />}
                </div>
                <h3 className="text-slate-900 text-3xl font-black mb-6 tracking-tight">AI Menunggu Instruksi</h3>
                <p className="text-slate-500 text-lg max-w-xs leading-relaxed font-medium">
                  {isUpgradeMode ? "Deskripsikan HP lama Anda untuk melihat kalkulasi biaya upgrade ke perangkat baru." : "Ketik spesifikasi dan minus HP Anda, AI kami akan menaksir harga belinya seketika."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
