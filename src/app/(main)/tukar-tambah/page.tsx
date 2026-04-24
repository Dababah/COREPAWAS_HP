"use client";
import { useState, useMemo } from 'react';
import { Smartphone, RefreshCw, ShieldCheck, Info, MessageCircle, ChevronDown, CheckCircle2, TrendingDown } from 'lucide-react';
import { useData } from '@/context/DataContext';

const BRANDS = ['iPhone', 'Samsung', 'Infinix', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Google Pixel', 'Others'];

const MODELS_DATA: Record<string, string[]> = {
  'iPhone': [
    'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
    'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
    'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 mini', 'iPhone 13',
    'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11 Pro Max',
    'iPhone 11 Pro', 'iPhone 11', 'iPhone Xs Max', 'iPhone Xr'
  ],
  'Samsung': [
    'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24',
    'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23',
    'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
    'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4',
    'Galaxy A54 5G', 'Galaxy A34 5G', 'Galaxy S21 FE', 'Galaxy A24', 'Galaxy A14'
  ],
  'Infinix': [
    'Zero 30 5G', 'Zero 30 Pro', 'Note 40 Pro', 'Note 40', 'Note 30 Pro', 
    'Note 30', 'Note 12', 'Hot 40 Pro', 'Hot 40i', 'Hot 30', 'Hot 20 5G', 
    'Smart 8 Pro', 'Smart 8', 'Smart 7'
  ],
  'Xiaomi': [
    'Xiaomi 14', 'Xiaomi 13T', 'Xiaomi 12 Pro', 'Xiaomi 12',
    'Redmi Note 13 Pro+ 5G', 'Redmi Note 13 Pro', 'Redmi Note 13',
    'Redmi Note 12 Pro 5G', 'Redmi Note 12', 'Redmi 13C', 'Redmi 12',
    'Poco F5', 'Poco X6 Pro', 'Poco M6 Pro', 'Poco F4'
  ],
  'Oppo': [
    'Find N3', 'Find X6 Pro', 'Reno 11 Pro', 'Reno 11', 'Reno 10 Pro+', 
    'Reno 10', 'Reno 8T', 'Oppo A98', 'Oppo A78', 'Oppo A58', 'Oppo A38'
  ],
  'Vivo': [
    'X100 Pro', 'X90 Pro', 'V30 Pro', 'V30', 'V29 5G', 'V29e', 
    'V27 5G', 'Vivo Y100 5G', 'Vivo Y27s', 'Vivo Y17s', 'Vivo Y02t'
  ],
  'Realme': [
    'Realme GT 5', 'Realme 12 Pro+', 'Realme 12', 'Realme 11 Pro+', 
    'Realme 11', 'Realme C67', 'Realme C55', 'Realme C53', 'Realme C51'
  ],
  'Google Pixel': [
    'Pixel 8 Pro', 'Pixel 8', 'Pixel 7 Pro', 'Pixel 7', 'Pixel 6 Pro', 'Pixel 6'
  ],
  'Others': ['Tipe lain (Hubungi WA)']
};

const CONDITIONS = [
  { 
    label: 'Perfect (Like New)', 
    desc: 'Mulus total, BH >90% / Cycle rendah, Fullset Ori, No Minus fisik/fungsi.', 
    factor: 0.75 // Lowered further to ensure reseller margin (Harga Bakul Rendah)
  },
  { 
    label: 'Great', 
    desc: 'Lecet halus pemakaian jarang, BH 85-90%, Box ada, Berfungsi normal.', 
    factor: 0.68 
  },
  { 
    label: 'Good', 
    desc: 'Ada dent/lecek, BH 80-85%, Pernah ganti baterai/layar ori.', 
    factor: 0.58 
  },
  { 
    label: 'Fair / Minus', 
    desc: 'Lecet parah, BH <80%, Ada jamur, Box hilang, atau minus fungsi ringan.', 
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

  // Aggressive Pricing Strategy (Maximize Merchant Margin)
  const calculateEstimate = useMemo(() => {
    let base = 3000000; // Lower default fallback

    // Logic for High Stability Brands (iPhone/Pixel)
    if (brand === 'iPhone') {
      if (model.includes('15 Pro Max')) base = 15500000;
      else if (model.includes('15 Pro')) base = 13500000;
      else if (model.includes('14 Pro Max')) base = 12000000;
      else if (model.includes('13 Pro Max')) base = 9500000;
      else if (model.includes('13')) base = 6800000;
      else if (model.includes('11')) base = 3500000;
    } 
    // Logic for Fast Depreciating Brands (Infinix, Redmi, Realme C Series)
    else if (brand === 'Infinix' || brand === 'Realme' || brand === 'Xiaomi') {
      if (model.includes('Zero') || model.includes('Xiaomi 14')) base = 5500000;
      else if (model.includes('Note 40 Pro')) base = 2800000;
      else if (model.includes('Note 30')) base = 1800000;
      else if (model.includes('Hot 40')) base = 1400000;
      else if (model.includes('Smart 8')) base = 850000;
      else if (model.includes('Redmi Note 13 Pro')) base = 3200000;
      else if (model.includes('C67') || model.includes('C55')) base = 1700000;
      else base = 1200000; // Default budget price
    }
    else if (brand === 'Samsung') {
      if (model.includes('S24 Ultra')) base = 14500000;
      else if (model.includes('A54')) base = 3800000;
      else if (model.includes('A34')) base = 2800000;
      else base = 2500000;
    }

    // Storage modifier
    let storageFactor = 1.0;
    if (storage === '256GB') storageFactor = 1.08; // Small bump for storage to keep buy price low
    if (storage === '512GB') storageFactor = 1.15;
    if (storage === '1TB') storageFactor = 1.25;

    const result = (base * storageFactor) * CONDITIONS[conditionIndex].factor;
    return Math.round(result / 10000) * 10000; // Round to nearest 10k for better precision
  }, [brand, model, storage, conditionIndex]);

  const handleCalculate = () => {
    if (!model) return;
    setIsCalculated(true);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya mau Trade-In unit bakul.\n\nUnit: ${brand} ${model} (${storage})\nKondisi: ${CONDITIONS[conditionIndex].label}\nPenawaran Sistem: Rp ${calculateEstimate.toLocaleString('id-ID')}\n\nKapan bisa saya antar unitnya?`
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-32 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/5 blur-[120px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <TrendingDown className="w-3 h-3" />
            Penampungan Unit Terpercaya
          </div>
          <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Kalkulator <br />
            <span className="text-gradient">Penampungan HP</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Khusus untuk Anda yang ingin jual unit dengan proses cepat. Kami berikan penawaran harga beli langsung (Bakul) untuk stok operasional kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-slate-900 border border-slate-800/50 rounded-[3rem] p-8 sm:p-12 space-y-10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
               
               {/* Brand Selection */}
              <div>
                <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                  <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">1</span>
                  Pilih Merk HP
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                  {BRANDS.map(b => (
                    <button 
                      key={b}
                      onClick={() => { setBrand(b); setModel(''); setIsCalculated(false); }}
                      className={`py-4 rounded-2xl text-[11px] font-black border transition-all ${
                        brand === b ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-[1.02]' : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model & Storage */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="relative">
                  <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                    <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">2</span>
                    Tipe / Seri Unit
                  </label>
                  <div className="relative">
                    <select 
                      value={model}
                      onChange={(e) => { setModel(e.target.value); setIsCalculated(false); }}
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-4 text-white text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih Seri --</option>
                      {(MODELS_DATA[brand] || ['Lainnya...']).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                    Kapasitas Internal
                  </label>
                  <div className="flex gap-2">
                    {['128GB', '256GB', '512GB'].map(s => (
                      <button 
                        key={s}
                        onClick={() => { setStorage(s); setIsCalculated(false); }}
                        className={`flex-1 py-4 rounded-2xl text-[10px] font-black border transition-all ${
                          storage === s ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-slate-800/40 border-slate-700 text-slate-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                  <span className="w-5 h-5 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">3</span>
                  Kelayakan Unit Saat Ini
                </label>
                <div className="space-y-3">
                  {CONDITIONS.map((c, i) => (
                    <button 
                      key={i}
                      onClick={() => { setConditionIndex(i); setIsCalculated(false); }}
                      className={`w-full text-left p-5 rounded-3xl border transition-all ${
                        conditionIndex === i ? 'bg-blue-600/10 border-blue-600/40' : 'bg-slate-800/20 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[13px] font-black uppercase tracking-wider ${conditionIndex === i ? 'text-blue-400' : 'text-slate-300'}`}>{c.label}</span>
                        {conditionIndex === i && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed pr-10">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                disabled={!model}
                className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl shadow-2xl shadow-blue-900/50 hover:brightness-110 transition-all disabled:opacity-20 active:scale-95"
              >
                Lihat Penawaran Beli
              </button>
            </div>
          </div>

          {/* Result Side */}
          <div className="lg:col-span-5">
            {isCalculated ? (
              <div className="sticky top-28 space-y-8 animate-fade-in-up">
                <div className="bg-slate-100 rounded-[3rem] p-8 sm:p-10 pt-14 sm:pt-10 text-slate-950 shadow-2xl border-4 border-blue-600 relative">
                  <div className="absolute top-5 right-6 sm:top-6 sm:right-8 text-[9px] sm:text-[10px] font-black text-blue-600 uppercase border border-blue-600 px-2 py-0.5 rounded">Verified Buy Price</div>
                  
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Estimasi Penawaran Kami</div>
                  <div className="text-5xl sm:text-6xl font-black mb-8 flex items-start">
                    <span className="text-xl font-bold mr-1 mt-2">Rp</span>
                    {calculateEstimate.toLocaleString('id-ID')}
                  </div>
                  
                  <div className="bg-slate-900 text-white rounded-3xl p-6 mb-8">
                    <div className="flex gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                      <Info className="w-6 h-6 text-blue-100 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm mb-1">Penawaran Nett (Harga Bakul)</h4>
                        <p className="text-blue-100 text-[10px] leading-relaxed">
                          Kami memberikan harga beli terbaik untuk sistem penampungan di <span className="font-bold text-white">COD Jogja</span>. Penilaian final ditentukan setelah tim kami melakukan pengecekan fisik menyeluruh di lokasi.
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-6 rounded-3xl bg-blue-600 text-white font-black text-xl transition-all hover:bg-blue-700 shadow-xl shadow-blue-600/30"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Kabari Admin via WA
                  </a>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-8 backdrop-blur-md">
                   <p className="text-blue-400 text-xs font-bold leading-relaxed">
                     ⚠️ Catatan: Hubungi admin jika tipe HP tidak terdaftar atau untuk negosiasi kuantitas (lebih dari 5 unit). Kami melayani penampungan skala besar dari reseller lain.
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center">
                <Smartphone className="w-24 h-24 text-slate-800 mb-8" />
                <h3 className="text-slate-400 text-2xl font-black mb-4">Menunggu Input</h3>
                <p className="text-slate-600 text-sm max-w-xs leading-relaxed">
                  Lengkapi data unit di samping untuk mendapatkan penawaran beli dari tim COREPAWAS.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
