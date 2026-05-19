"use client";
import { useState, useMemo } from 'react';
import { Smartphone, RefreshCw, ShieldCheck, Info, MessageCircle, ChevronDown, CheckCircle2, TrendingDown, HelpCircle, ArrowRight, AlertTriangle, Search, Calculator, Check, ChevronsUpDown } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

import { BRANDS, DEVICE_MASTER_DATABASE } from '@/data/phoneModels';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/components/ui/utils';

// Dynamically generate MODELS_DATA map from Master Baseline
const MODELS_DATA: Record<string, string[]> = {};
BRANDS.forEach(b => {
  if (b === 'Others') {
    MODELS_DATA[b] = ['Tecno Pova 6 Pro 5G 12/256GB', 'Tipe lain (Gunakan Manual Input)'];
  } else {
    MODELS_DATA[b] = DEVICE_MASTER_DATABASE
      .filter(d => d.brand === b)
      .map(d => d.model);
  }
});

const CHECKLIST_QUESTIONS = [
  { id: 'screen', label: 'Layar Mulus & Sentuhan Normal?', desc: 'Tidak ada retak, tompel, layar shadow, atau dead pixel. Sentuhan merata di semua sisi.', penalty: 0.15 },
  { id: 'biometric', label: 'Face ID / Fingerprint Aktif?', desc: 'Sensor biometrik (wajah/sidik jari) berfungsi cepat dan normal.', penalty: 0.10 },
  { id: 'battery', label: 'Battery Health di atas 85%?', desc: 'Baterai tidak drop/bocor. (Untuk iPhone, pastikan BH di atas 85%)', penalty: 0.10 },
  { id: 'body', label: 'Bodi Mulus & Kelengkapan Fullset?', desc: 'Lecet pemakaian wajar, dusbox dan charger bawaan tersedia.', penalty: 0.05 },
];

export default function TradeInPage() {
  const { waNumber, products } = useData();
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  
  const [openModelDropdown, setOpenModelDropdown] = useState(false);
  
  // Interactive Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    screen: true,
    biometric: true,
    battery: true,
    body: true,
  });

  const [isCalculated, setIsCalculated] = useState(false);
  
  // Upgrade Mode States
  const [isUpgradeMode, setIsUpgradeMode] = useState(false);
  const [selectedUpgradeProduct, setSelectedUpgradeProduct] = useState<any>(null);
  const [openUpgradeDropdown, setOpenUpgradeDropdown] = useState(false);

  // Custom manual states
  const [isManual, setIsManual] = useState(false);
  const [manualBrand, setManualBrand] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualStorage, setManualStorage] = useState('128GB');
  const [manualMarketPrice, setManualMarketPrice] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { buybackEstimate, topUpNeeded } = useMemo(() => {
    let finalVal = 2000000;

    // Calculate penalty from checklist
    const totalPenalty = CHECKLIST_QUESTIONS.reduce((acc, q) => {
      return acc + (checklist[q.id] ? 0 : q.penalty);
    }, 0);
    // Factor is between 0.60 and 1.00
    const factor = Math.max(0, 1.0 - totalPenalty);

    if (isManual) {
      const max_buyback = (manualMarketPrice || 0) * 0.80;
      const floor_buyback = (manualMarketPrice || 0) * 0.55;
      finalVal = floor_buyback + (max_buyback - floor_buyback) * factor;
    } else {
      const matched = DEVICE_MASTER_DATABASE.find(d => d.brand === brand && d.model === model);
      if (matched) {
        const max_buyback = matched.max_buyback;
        const floor_buyback = matched.floor_buyback;
        finalVal = floor_buyback + (max_buyback - floor_buyback) * factor;
      }
    }

    const buybackEst = Math.round(finalVal / 10000) * 10000;
    
    let topUp = 0;
    if (isUpgradeMode && selectedUpgradeProduct) {
      topUp = Math.max(0, selectedUpgradeProduct.price - buybackEst);
    }

    return { buybackEstimate: buybackEst, topUpNeeded: topUp };
  }, [brand, model, checklist, isManual, manualMarketPrice, isUpgradeMode, selectedUpgradeProduct]);

  const validateManualInput = (): boolean => {
    if (!isManual) return true;
    const cleanBrand = manualBrand.trim().toLowerCase();
    if (cleanBrand.length < 2) { setValidationError("Nama merk minimal 2 karakter."); return false; }
    const cleanModel = manualModel.trim().toLowerCase();
    if (cleanModel.length < 3) { setValidationError("Nama tipe/seri minimal 3 karakter."); return false; }
    if (!manualMarketPrice || manualMarketPrice < 500000) { setValidationError("Harga pasar minimal Rp 500.000."); return false; }
    if (manualMarketPrice > 35000000) { setValidationError("Harga maksimal Rp 35.000.000."); return false; }
    setValidationError(null);
    return true;
  };

  const handleCalculate = () => {
    if (isManual) {
      if (!validateManualInput()) { setIsCalculated(false); return; }
    } else {
      if (!model) return;
      setValidationError(null);
    }
    
    if (isUpgradeMode && !selectedUpgradeProduct) {
      setValidationError("Pilih HP Baru yang ingin Anda upgrade terlebih dahulu.");
      setIsCalculated(false);
      return;
    }

    setIsCalculated(true);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    setIsCalculated(false);
  };

  let waText = `Halo COREPAWAS! Saya mau Tukar Tambah unit.\n\n`;
  waText += `*Unit Saya:* ${isManual ? manualBrand : brand} ${isManual ? manualModel : model} (${isManual ? manualStorage : storage})\n`;
  waText += `*Cek Kondisi:*\n`;
  CHECKLIST_QUESTIONS.forEach(q => {
    waText += `- ${q.label} ${checklist[q.id] ? '✅ Ya' : '❌ Tidak'}\n`;
  });
  waText += `\n*Penawaran Beli Sistem:* Rp ${buybackEstimate.toLocaleString('id-ID')}\n`;

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
            <TrendingDown className="w-4 h-4" />
            Penampungan & Upgrade Unit
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Kalkulator <br />
            <span className="text-gradient">Tukar Tambah</span>
          </h1>
          <p className="text-slate-600 max-w-3xl text-lg font-medium leading-relaxed">
            Jual HP lamamu ke kami dengan harga bakul, atau gunakan fitur Upgrade untuk langsung tukar tambah dengan stok terbaru kami. Cepat, transparan, dan terpercaya!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-8 sm:p-14 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
               
               {/* Upgrade Mode Switch */}
               <div>
                 <div className="flex bg-slate-100 p-2 rounded-3xl mb-8 relative z-10 border border-slate-200">
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
                                 <Check className={cn("mr-2 h-4 w-4", selectedUpgradeProduct?.id === product.id ? "opacity-100" : "opacity-0")} />
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

               {/* Brand Selection */}
              <div>
                <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">1</span>
                  Pilih Merk HP Lama
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {BRANDS.map(b => (
                    <button 
                      key={b}
                      type="button"
                      onClick={() => { 
                        setBrand(b); 
                        setModel(''); 
                        setIsCalculated(false);
                        setIsManual(b === 'Others');
                        setValidationError(null);
                      }}
                      className={`py-5 rounded-2xl text-[11px] font-black border transition-all cursor-pointer relative z-10 ${
                        brand === b 
                          ? 'bg-brand-orange border-brand-orange text-white shadow-xl scale-[1.03]' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Search Autocomplete & Custom Inputs */}
              <div>
                {isManual ? (
                  <div className="space-y-8 animate-fade-in">
                    <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">2</span>
                      Spesifikasi Manual (Others)
                    </label>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Nama Merk HP</label>
                        <input 
                          type="text"
                          placeholder="Contoh: Nokia..."
                          value={manualBrand}
                          onChange={(e) => { setManualBrand(e.target.value); setIsCalculated(false); setValidationError(null); }}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Seri / Tipe HP</label>
                        <input 
                          type="text"
                          placeholder="Contoh: Pura 70..."
                          value={manualModel}
                          onChange={(e) => { setManualModel(e.target.value); setIsCalculated(false); setValidationError(null); }}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Harga Pasar Baru (Saat Ini)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                          <input 
                            type="number"
                            placeholder="Contoh: 5000000"
                            value={manualMarketPrice || ''}
                            onChange={(e) => { setManualMarketPrice(Number(e.target.value)); setIsCalculated(false); setValidationError(null); }}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-14 pr-6 py-5 text-slate-900 text-sm font-black focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative animate-fade-in">
                    <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                      <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">2</span>
                      Pilih Seri & Varian Tipe HP Lama
                    </label>
                    <div className="relative z-10">
                      <Popover open={openModelDropdown} onOpenChange={setOpenModelDropdown}>
                        <PopoverTrigger asChild>
                          <button className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold shadow-sm flex items-center justify-between hover:border-brand-orange/50 transition-colors">
                            {model ? model : "Ketik untuk mencari seri HP (Misal: 13 Pro)..."}
                            <Search className="w-5 h-5 text-slate-400" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] sm:w-[500px] p-0 rounded-2xl" align="start">
                          <Command>
                            <CommandInput placeholder={`Cari di lini ${brand}...`} />
                            <CommandList className="max-h-72">
                              <CommandEmpty>Seri tidak ditemukan di database. Gunakan mode "Others".</CommandEmpty>
                              <CommandGroup>
                                {(MODELS_DATA[brand] || []).map(m => (
                                  <CommandItem
                                    key={m}
                                    value={m}
                                    onSelect={(currentValue) => {
                                      if (m === 'Tipe lain (Gunakan Manual Input)') {
                                        setBrand('Others');
                                        setIsManual(true);
                                      } else {
                                        setModel(m);
                                      }
                                      setOpenModelDropdown(false);
                                      setIsCalculated(false);
                                    }}
                                    className="cursor-pointer py-3 text-sm font-bold text-slate-800"
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", model === m ? "opacity-100 text-brand-orange" : "opacity-0")} />
                                    {m}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Diagnostic Checklist */}
              <div>
                <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">3</span>
                  Diagnostic Checklist Fisik
                </label>
                <div className="space-y-4 relative z-10">
                  {CHECKLIST_QUESTIONS.map((q) => (
                    <div 
                      key={q.id}
                      onClick={() => toggleChecklist(q.id)}
                      className={`w-full text-left p-6 rounded-3xl border transition-all cursor-pointer flex gap-4 items-start ${
                        checklist[q.id] ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${checklist[q.id] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                         {checklist[q.id] && <Check className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-2">
                          <span className={`text-[13px] font-black uppercase tracking-wide ${checklist[q.id] ? 'text-emerald-900' : 'text-slate-900'}`}>{q.label}</span>
                          <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm self-start">
                            <div className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest ${checklist[q.id] ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>Ya</div>
                            <div className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest ${!checklist[q.id] ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>Tidak</div>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{q.desc}</p>
                      </div>
                    </div>
                  ))}
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
                onClick={handleCalculate}
                disabled={isManual ? (!manualModel || !manualBrand || !manualMarketPrice) : (!model || model.includes('Manual'))}
                className="w-full py-6 rounded-3xl bg-brand-orange text-white font-black text-xl shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] transition-all disabled:opacity-20 active:scale-95 cursor-pointer flex items-center justify-center gap-3 relative z-10"
              >
                {isUpgradeMode ? <Calculator className="w-6 h-6" /> : null}
                {isUpgradeMode ? 'Hitung Total Upgrade' : 'Lihat Penawaran Beli'}
              </button>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-5">
            {isCalculated ? (
              <div className="sticky top-28 space-y-10 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 text-brand-navy shadow-[0_40px_100px_-20px_rgba(250,140,22,0.3)] border-[6px] border-brand-orange relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-2 bg-brand-orange" />
                  
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.15em] mb-6 flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Ini perkiraan awal, final check saat COD
                  </div>

                  {isUpgradeMode ? (
                    <>
                      <div className="space-y-4 mb-8 border-b border-slate-100 pb-8">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                          <span>Nilai Beli HP Anda:</span>
                          <span className="text-emerald-600 font-black">+ Rp {buybackEstimate.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                          <span>Harga {selectedUpgradeProduct?.name}:</span>
                          <span className="text-rose-600 font-black">- Rp {selectedUpgradeProduct?.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Nambah:</div>
                      <div className="text-5xl sm:text-6xl font-black mb-10 flex items-start tracking-tighter text-brand-orange">
                        <span className="text-2xl font-black mr-1 mt-2">Rp</span>
                        {topUpNeeded.toLocaleString('id-ID')}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Penawaran Tampung Kami:</div>
                      <div className="text-6xl sm:text-7xl font-black mb-10 flex items-start tracking-tighter">
                        <span className="text-2xl font-black mr-1 mt-3">Rp</span>
                        {buybackEstimate.toLocaleString('id-ID')}
                      </div>
                    </>
                  )}
                  
                  <div className="bg-brand-navy text-white rounded-3xl p-8 mb-10">
                    <div className="flex gap-5">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                        <Info className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm mb-2 uppercase tracking-widest">Sistem Transparan</h4>
                        <p className="text-blue-100/60 text-[11px] leading-relaxed font-medium">
                          Nilai dihitung berdasarkan <span className="text-white font-bold">Harga Bakul Pasaran 2026</span> dan hasil diagnostik awal Anda. Tim kami akan melakukan validasi ulang saat pertemuan fisik (COD).
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    className="flex items-center justify-center gap-4 w-full py-6 rounded-2xl bg-brand-orange text-white font-black text-xl sm:text-2xl transition-all hover:brightness-110 shadow-xl shadow-brand-orange/30"
                  >
                    <WhatsAppIcon className="w-7 h-7" />
                    Chat Admin Sekarang
                  </a>
                </div>

                <div className="glass-premium border border-white/10 rounded-3xl p-8 text-center">
                   <HelpCircle className="w-8 h-8 text-brand-orange mx-auto mb-4" />
                   <p className="text-muted-foreground text-xs font-bold leading-relaxed">
                     Mau nego atau punya unit dalam jumlah banyak? Kami terbuka untuk diskusi. Langsung klik tombol WhatsApp di atas.
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center shadow-sm sticky top-28">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-10 relative">
                  <Smartphone className="w-12 h-12 text-slate-400 absolute" />
                  {isUpgradeMode && <Calculator className="w-6 h-6 text-brand-orange absolute -bottom-2 -right-2 bg-white rounded-full" />}
                </div>
                <h3 className="text-slate-900 text-3xl font-black mb-6 tracking-tight">Menunggu Input</h3>
                <p className="text-slate-500 text-lg max-w-xs leading-relaxed font-medium">
                  {isUpgradeMode ? "Lengkapi data tukar tambah di samping untuk melihat estimasi biaya upgrade ke HP idaman Anda." : "Lengkapi data unit di samping untuk mendapatkan estimasi penawaran beli dari tim kami."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
