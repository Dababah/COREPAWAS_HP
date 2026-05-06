"use client";
import { useState, useMemo } from 'react';
import { Smartphone, RefreshCw, ShieldCheck, Info, MessageCircle, ChevronDown, CheckCircle2, TrendingDown, HelpCircle, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

const BRANDS = ['iPhone', 'Samsung', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Google Pixel', 'Others'];

const MODELS_DATA: Record<string, string[]> = {
  'iPhone': [
    'iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17 Plus', 'iPhone 17', 'iPhone 17 Air',
    'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max',
    'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12', 'iPhone 11'
  ],
  'Samsung': [
    'Galaxy S26 Ultra', 'Galaxy S26+', 'Galaxy S26',
    'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
    'Galaxy Z Fold 7', 'Galaxy Z Flip 7', 'Galaxy Z Fold 6', 'Galaxy Z Flip 6',
    'Galaxy S24 Ultra', 'Galaxy S23 Ultra', 'Galaxy A56 5G', 'Galaxy A36 5G', 'Galaxy S24 FE'
  ],
  'Infinix': [
    'GT 30 Pro', 'Zero 50 Ultra', 'Zero 40 5G', 'Note 50 Pro', 'Note 50', 
    'Note 40 Pro', 'Hot 60 Pro', 'Hot 50 Pro', 'Hot 50i', 'Smart 9 Pro', 'Smart 9'
  ],
  'Xiaomi': [
    'Xiaomi 16 Ultra', 'Xiaomi 16 Pro', 'Xiaomi 16', 'Xiaomi 15T Pro', 'Xiaomi 15T',
    'Redmi Note 15 Pro+ 5G', 'Redmi Note 15 Pro', 'Redmi Note 15',
    'Redmi Note 14 Pro 5G', 'Poco F7 Pro', 'Poco F7', 'Poco X7 Pro', 'Poco M7 Pro'
  ],
  'Oppo': [
    'Find X9 Pro', 'Find X9', 'Find N5 Flip', 'Reno 13 Pro', 'Reno 13', 
    'Reno 12 Pro', 'Oppo A100', 'Oppo A98', 'Oppo A79', 'Oppo A59'
  ],
  'Vivo': [
    'X110 Pro+', 'X110 Pro', 'V40 Pro', 'V40', 'V30 Pro', 'V30', 
    'V29 5G', 'Vivo Y200 5G', 'Vivo Y100', 'Vivo Y30', 'Vivo iQOO 13'
  ],
  'Realme': [
    'Realme GT 7', 'Realme 14 Pro+', 'Realme 14', 'Realme 13 Pro+', 
    'Realme 12 Pro+', 'Realme C77', 'Realme C67', 'Realme C55'
  ],
  'Google Pixel': [
    'Pixel 10 Pro XL', 'Pixel 10 Pro', 'Pixel 10', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 8 Pro'
  ],
  'Others': ['Tipe lain (Gunakan Manual Input)']
};

const CONDITIONS = [
  { 
    label: 'Perfect (Like New)', 
    desc: 'Mulus total, BH >90%, Fullset Ori, No Minus fisik/fungsi.', 
    factor: 0.75
  },
  { 
    label: 'Great', 
    desc: 'Lecet halus pemakaian, BH 85-90%, Box ada, Berfungsi normal.', 
    factor: 0.68 
  },
  { 
    label: 'Good', 
    desc: 'Ada dent kecil, BH 80-85%, Pernah ganti baterai/layar ori.', 
    factor: 0.58 
  },
  { 
    label: 'Fair / Minus', 
    desc: 'Lecet parah, BH <80%, Box hilang, atau minus fungsi ringan.', 
    factor: 0.45 
  },
];

export default function TradeInPage() {
  const { waNumber } = useData();
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [conditionIndex, setConditionIndex] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [manualModel, setManualModel] = useState('');
  const [manualStorage, setManualStorage] = useState('');

  const calculateEstimate = useMemo(() => {
    let base = 3000000;

    if (brand === 'iPhone') {
      if (model.includes('17 Pro')) base = 22000000;
      else if (model.includes('17')) base = 16000000;
      else if (model.includes('16 Pro')) base = 18000000;
      else if (model.includes('16')) base = 12500000;
      else if (model.includes('15 Pro')) base = 13500000;
      else if (model.includes('14 Pro')) base = 11000000;
      else if (model.includes('13')) base = 7500000;
      else if (model.includes('11')) base = 3500000;
    } 
    else if (brand === 'Samsung') {
      if (model.includes('S26 Ultra')) base = 21000000;
      else if (model.includes('S26')) base = 14000000;
      else if (model.includes('S25 Ultra')) base = 17500000;
      else if (model.includes('S25')) base = 11000000;
      else if (model.includes('S24 Ultra')) base = 14500000;
      else if (model.includes('Z Fold')) base = 18000000;
      else if (model.includes('A56')) base = 5800000;
      else base = 2500000;
    }
    else if (brand === 'Infinix' || brand === 'Realme' || brand === 'Xiaomi') {
      if (model.includes('Xiaomi 16')) base = 12500000;
      else if (model.includes('Xiaomi 15')) base = 9500000;
      else if (model.includes('GT 30') || model.includes('GT 7')) base = 7500000;
      else if (model.includes('Note 15 Pro')) base = 4200000;
      else if (model.includes('Note 50 Pro')) base = 3800000;
      else if (model.includes('C77')) base = 2200000;
      else base = 1500000;
    }

    let storageFactor = 1.0;
    const currentStorage = isManual ? manualStorage : storage;
    if (currentStorage.includes('256')) storageFactor = 1.08;
    if (currentStorage.includes('512')) storageFactor = 1.15;
    if (currentStorage.includes('1TB')) storageFactor = 1.25;

    const result = (base * storageFactor) * CONDITIONS[conditionIndex].factor;
    return Math.round(result / 10000) * 10000;
  }, [brand, model, storage, conditionIndex, isManual, manualModel, manualStorage]);

  const handleCalculate = () => {
    if (!isManual && !model) return;
    if (isManual && !manualModel) return;
    setIsCalculated(true);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya mau Trade-In unit.\n\nUnit: ${brand} ${isManual ? manualModel : model} (${isManual ? manualStorage : storage})\nKondisi: ${CONDITIONS[conditionIndex].label}\nPenawaran Sistem: Rp ${calculateEstimate.toLocaleString('id-ID')}`
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
            <TrendingDown className="w-4 h-4" />
            Penampungan Unit Terpercaya
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Kalkulator <br />
            <span className="text-gradient">Penampungan HP</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg font-medium leading-relaxed">
            Mau jual HP lamamu dengan cepat? Kami berikan penawaran harga beli langsung (Bakul) untuk stok operasional kami. Proses instan, harga transparan!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-card border border-border rounded-[3.5rem] p-8 sm:p-14 space-y-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 blur-[120px] rounded-full" />
               
               {/* Brand Selection */}
              <div>
                <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">1</span>
                  Pilih Merk HP
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
                      }}
                      className={`py-5 rounded-2xl text-[11px] font-black border transition-all cursor-pointer relative z-10 ${
                        brand === b 
                          ? 'bg-brand-orange border-brand-orange text-white shadow-xl scale-[1.03]' 
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model & Storage */}
              <div className="grid sm:grid-cols-2 gap-10">
                <div className="relative">
                  <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                    <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">2</span>
                    Tipe / Seri Unit
                  </label>
                  <div className="relative">
                    {isManual ? (
                      <input 
                        type="text"
                        placeholder="Ketik Seri HP Anda..."
                        value={manualModel}
                        onChange={(e) => { setManualModel(e.target.value); setIsCalculated(false); }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-bold focus:border-brand-orange/50 outline-none"
                      />
                    ) : (
                      <div className="relative">
                        <select 
                          value={model}
                          onChange={(e) => { setModel(e.target.value); setIsCalculated(false); }}
                          className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-bold focus:border-brand-orange/50 outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0f172a]">-- Pilih Seri --</option>
                          {(MODELS_DATA[brand] || []).map(m => (
                            <option key={m} value={m} className="bg-[#0f172a] text-white">{m}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                    Kapasitas Internal
                  </label>
                  <div className="flex gap-2">
                    {isManual ? (
                      <input 
                        type="text"
                        placeholder="cth: 256GB"
                        value={manualStorage}
                        onChange={(e) => { setManualStorage(e.target.value); setIsCalculated(false); }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm font-bold focus:border-brand-orange/50 outline-none"
                      />
                    ) : (
                      ['128GB', '256GB', '512GB'].map(s => (
                        <button 
                          key={s}
                          type="button"
                          onClick={() => { setStorage(s); setIsCalculated(false); }}
                          className={`flex-1 py-5 rounded-2xl text-[10px] font-black border transition-all cursor-pointer ${
                            storage === s ? 'bg-brand-orange/20 border-brand-orange/50 text-brand-orange' : 'bg-white/5 border-white/5 text-slate-600'
                          }`}
                        >
                          {s}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                  <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">3</span>
                  Kelayakan Unit Saat Ini
                </label>
                <div className="space-y-4">
                  {CONDITIONS.map((c, i) => (
                    <button 
                      key={i}
                      onClick={() => { setConditionIndex(i); setIsCalculated(false); }}
                      className={`w-full text-left p-6 rounded-3xl border transition-all ${
                        conditionIndex === i ? 'bg-brand-orange/10 border-brand-orange/40' : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[13px] font-black uppercase tracking-[0.2em] ${conditionIndex === i ? 'text-brand-orange' : 'text-white'}`}>{c.label}</span>
                        {conditionIndex === i && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed pr-10 font-medium">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

                <button 
                  onClick={handleCalculate}
                  disabled={isManual ? !manualModel : !model}
                  className="w-full py-6 rounded-3xl bg-brand-orange text-white font-black text-xl shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] transition-all disabled:opacity-20 active:scale-95 cursor-pointer"
                >
                  Lihat Penawaran Beli
                </button>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-5">
            {isCalculated ? (
              <div className="sticky top-28 space-y-10 animate-fade-in">
                <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 text-brand-navy shadow-[0_40px_100px_-20px_rgba(250,140,22,0.3)] border-[6px] border-brand-orange relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-2 bg-brand-orange" />
                  
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Estimasi Penawaran Kami</div>
                  <div className="text-6xl sm:text-7xl font-black mb-10 flex items-start tracking-tighter">
                    <span className="text-2xl font-black mr-1 mt-3">Rp</span>
                    {calculateEstimate.toLocaleString('id-ID')}
                  </div>
                  
                  <div className="bg-brand-navy text-white rounded-3xl p-8 mb-10">
                    <div className="flex gap-5">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                        <Info className="w-6 h-6 text-brand-orange" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm mb-2 uppercase tracking-widest">Penawaran Nett (Harga Bakul)</h4>
                        <p className="text-blue-100/60 text-[11px] leading-relaxed font-medium">
                          Kami memberikan harga beli terbaik untuk sistem penampungan di <span className="text-white font-bold">COREPAWAS</span>. Penilaian final ditentukan setelah pengecekan fisik menyeluruh.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    className="flex items-center justify-center gap-4 w-full py-6 rounded-2xl bg-brand-orange text-white font-black text-2xl transition-all hover:brightness-110 shadow-xl shadow-brand-orange/30"
                  >
                    <WhatsAppIcon className="w-7 h-7" />
                    Ambil Penawaran
                  </a>
                </div>

                <div className="glass-premium border border-white/10 rounded-3xl p-8 text-center">
                   <HelpCircle className="w-8 h-8 text-brand-orange mx-auto mb-4" />
                   <p className="text-muted-foreground text-xs font-bold leading-relaxed">
                     Punya unit dalam jumlah banyak? Hubungi admin untuk negosiasi harga khusus reseller. Kami siap menampung stok skala besar.
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-card border-2 border-dashed border-border rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10">
                  <Smartphone className="w-12 h-12 text-slate-800" />
                </div>
                <h3 className="text-white text-3xl font-black mb-6 tracking-tight">Menunggu Input</h3>
                <p className="text-muted-foreground text-lg max-w-xs leading-relaxed font-medium">
                  Lengkapi data unit di samping untuk mendapatkan estimasi penawaran beli dari tim kami.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
