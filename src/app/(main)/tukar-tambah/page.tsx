"use client";
import { useState, useMemo } from 'react';
import { Smartphone, RefreshCw, ShieldCheck, Info, MessageCircle, ChevronDown, CheckCircle2, TrendingDown, HelpCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';

const BRANDS = ['iPhone', 'Samsung', 'Google Pixel', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Infinix', 'Others'];

interface MasterDevice {
  brand: string;
  model: string;
  market_sell: number;
  max_buyback: number;
  floor_buyback: number;
}

const DEVICE_MASTER_DATABASE: MasterDevice[] = [
  // Apple
  { brand: "iPhone", model: "iPhone 11 64GB", market_sell: 3100000, max_buyback: 2500000, floor_buyback: 2100000 },
  { brand: "iPhone", model: "iPhone 11 128GB", market_sell: 3600000, max_buyback: 2950000, floor_buyback: 2500000 },
  { brand: "iPhone", model: "iPhone 11 Pro 64GB", market_sell: 3750000, max_buyback: 3100000, floor_buyback: 2600000 },
  { brand: "iPhone", model: "iPhone 11 Pro Max 256GB", market_sell: 4900000, max_buyback: 4050000, floor_buyback: 3500000 },
  { brand: "iPhone", model: "iPhone 12 128GB", market_sell: 4800000, max_buyback: 3900000, floor_buyback: 3400000 },
  { brand: "iPhone", model: "iPhone 12 Pro 128GB", market_sell: 6200000, max_buyback: 5100000, floor_buyback: 4500000 },
  { brand: "iPhone", model: "iPhone 13 Mini 128GB", market_sell: 6000000, max_buyback: 4900000, floor_buyback: 4300000 },
  { brand: "iPhone", model: "iPhone 13 128GB", market_sell: 7200000, max_buyback: 6000000, floor_buyback: 5300000 },
  { brand: "iPhone", model: "iPhone 13 Pro 128GB", market_sell: 9300000, max_buyback: 7800000, floor_buyback: 7000000 },
  { brand: "iPhone", model: "iPhone 13 Pro Max 128GB", market_sell: 10500000, max_buyback: 8800000, floor_buyback: 7800000 },
  { brand: "iPhone", model: "iPhone 14 128GB", market_sell: 8900000, max_buyback: 7450000, floor_buyback: 6700000 },
  { brand: "iPhone", model: "iPhone 14 Pro 128GB", market_sell: 11500000, max_buyback: 9500000, floor_buyback: 8400000 },
  { brand: "iPhone", model: "iPhone 14 Pro Max 128GB", market_sell: 12800000, max_buyback: 10800000, floor_buyback: 9600000 },
  { brand: "iPhone", model: "iPhone 15 128GB", market_sell: 11200000, max_buyback: 9300000, floor_buyback: 8300000 },
  { brand: "iPhone", model: "iPhone 15 Pro 128GB", market_sell: 14800000, max_buyback: 12300000, floor_buyback: 11000000 },
  { brand: "iPhone", model: "iPhone 15 Pro Max 256GB", market_sell: 17200000, max_buyback: 14500000, floor_buyback: 13000000 },
  { brand: "iPhone", model: "iPhone 16 128GB", market_sell: 13800000, max_buyback: 11500000, floor_buyback: 10200000 },
  { brand: "iPhone", model: "iPhone 16 Pro 128GB", market_sell: 17500000, max_buyback: 14800000, floor_buyback: 13200000 },
  { brand: "iPhone", model: "iPhone 16 Pro Max 256GB", market_sell: 20500000, max_buyback: 17200000, floor_buyback: 15500000 },

  // Samsung
  { brand: "Samsung", model: "Galaxy A34 5G 8/128GB", market_sell: 2700000, max_buyback: 2150000, floor_buyback: 1800000 },
  { brand: "Samsung", model: "Galaxy A54 5G 8/256GB", market_sell: 3600000, max_buyback: 2900000, floor_buyback: 2400000 },
  { brand: "Samsung", model: "Galaxy A55 5G 8/256GB", market_sell: 4700000, max_buyback: 3850000, floor_buyback: 3300000 },
  { brand: "Samsung", model: "Galaxy S21 Ultra 5G 12/256GB", market_sell: 5100000, max_buyback: 4150000, floor_buyback: 3600000 },
  { brand: "Samsung", model: "Galaxy S22 5G 8/128GB", market_sell: 4400000, max_buyback: 3550000, floor_buyback: 3000000 },
  { brand: "Samsung", model: "Galaxy S22 Ultra 5G 12/256GB", market_sell: 7800000, max_buyback: 6300000, floor_buyback: 5500000 },
  { brand: "Samsung", model: "Galaxy S23 Ultra 12/256GB", market_sell: 11000000, max_buyback: 9000000, floor_buyback: 8000000 },
  { brand: "Samsung", model: "Galaxy S24 5G 8/128GB", market_sell: 8800000, max_buyback: 7300000, floor_buyback: 6400000 },
  { brand: "Samsung", model: "Galaxy S24 5G 8/256GB", market_sell: 9500000, max_buyback: 7900000, floor_buyback: 7000000 },
  { brand: "Samsung", model: "Galaxy S24 Ultra 12/256GB", market_sell: 14500000, max_buyback: 12000000, floor_buyback: 10500000 },

  // Google Pixel
  { brand: "Google Pixel", model: "Google Pixel 6 8/128GB", market_sell: 3400000, max_buyback: 2700000, floor_buyback: 2200000 },
  { brand: "Google Pixel", model: "Google Pixel 6a 6/128GB", market_sell: 3100000, max_buyback: 2400000, floor_buyback: 1900000 },
  { brand: "Google Pixel", model: "Google Pixel 7 8/128GB", market_sell: 4500000, max_buyback: 3650000, floor_buyback: 3100000 },
  { brand: "Google Pixel", model: "Google Pixel 7 Pro 12/256GB", market_sell: 5400000, max_buyback: 4400000, floor_buyback: 3800000 },
  { brand: "Google Pixel", model: "Google Pixel 8 8/128GB", market_sell: 7300000, max_buyback: 6000000, floor_buyback: 5200000 },
  { brand: "Google Pixel", model: "Google Pixel 8 Pro 12/128GB", market_sell: 9200000, max_buyback: 7600000, floor_buyback: 6700000 },

  // Xiaomi
  { brand: "Xiaomi", model: "POCO X6 Pro 5G 12/512GB", market_sell: 3700000, max_buyback: 3000000, floor_buyback: 2550000 },
  { brand: "Xiaomi", model: "POCO F5 5G 8/256GB", market_sell: 3400000, max_buyback: 2750000, floor_buyback: 2300000 },
  { brand: "Xiaomi", model: "Redmi Note 12 Pro 5G 8/256GB", market_sell: 2500000, max_buyback: 1950000, floor_buyback: 1600000 },
  { brand: "Xiaomi", model: "Redmi Note 13 Pro 5G 8/256GB", market_sell: 3200000, max_buyback: 2550000, floor_buyback: 2100000 },
  { brand: "Xiaomi", model: "Xiaomi 13T 12/256GB", market_sell: 4900000, max_buyback: 4000000, floor_buyback: 3500000 },

  // Oppo
  { brand: "Oppo", model: "Oppo Reno 10 5G 8/256GB", market_sell: 3100000, max_buyback: 2450000, floor_buyback: 2000000 },
  { brand: "Oppo", model: "Oppo Reno 11 5G 8/256GB", market_sell: 3900000, max_buyback: 3100000, floor_buyback: 2650000 },

  // Vivo
  { brand: "Vivo", model: "Vivo V27 5G 8/256GB", market_sell: 3200000, max_buyback: 2550000, floor_buyback: 2150000 },
  { brand: "Vivo", model: "Vivo V30 5G 8/256GB", market_sell: 4100000, max_buyback: 3300000, floor_buyback: 2800000 },

  // Realme
  { brand: "Realme", model: "Realme 12 Pro+ 5G 8/256GB", market_sell: 4300000, max_buyback: 3500000, floor_buyback: 3000000 },

  // Infinix
  { brand: "Infinix", model: "Infinix Note 40 Pro 8/256GB", market_sell: 2100000, max_buyback: 1600000, floor_buyback: 1250000 },
  { brand: "Infinix", model: "Infinix GT 20 Pro 5G 12/256GB", market_sell: 3300000, max_buyback: 2650000, floor_buyback: 2200000 },

  // Others (Tecno)
  { brand: "Others", model: "Tecno Pova 6 Pro 5G 12/256GB", market_sell: 2250000, max_buyback: 1750000, floor_buyback: 1350000 }
];

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

const CONDITIONS = [
  { 
    label: 'Perfect (Like New)', 
    desc: 'Mulus total, BH >90%, Fullset Ori, No Minus fisik/fungsi.', 
    factor: 1.0 // Directly anchors to max_buyback
  },
  { 
    label: 'Great', 
    desc: 'Lecet halus pemakaian, BH 85-90%, Box ada, Berfungsi normal.', 
    factor: 0.75 // Interpolation Weight
  },
  { 
    label: 'Good', 
    desc: 'Ada dent kecil, BH 80-85%, Pernah ganti baterai/layar ori.', 
    factor: 0.40 // Interpolation Weight
  },
  { 
    label: 'Fair / Minus', 
    desc: 'Lecet parah, BH <80%, Box hilang, atau minus fungsi ringan.', 
    factor: 0.0 // Directly anchors to floor_buyback
  },
];

export default function TradeInPage() {
  const { waNumber } = useData();
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [conditionIndex, setConditionIndex] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);
  
  // Custom manual states
  const [isManual, setIsManual] = useState(false);
  const [manualBrand, setManualBrand] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualStorage, setManualStorage] = useState('128GB');
  const [manualMarketPrice, setManualMarketPrice] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const calculateEstimate = useMemo(() => {
    let finalVal = 2000000;

    if (isManual) {
      // For manual input, we define margins:
      // max_buyback is roughly 80% of current retail price (20% dealer margin)
      // floor_buyback is roughly 55% of current retail price
      const max_buyback = (manualMarketPrice || 0) * 0.80;
      const floor_buyback = (manualMarketPrice || 0) * 0.55;

      if (conditionIndex === 0) {
        finalVal = max_buyback;
      } else if (conditionIndex === 3) {
        finalVal = floor_buyback;
      } else {
        const weight = CONDITIONS[conditionIndex].factor;
        finalVal = floor_buyback + (max_buyback - floor_buyback) * weight;
      }
    } else {
      const matched = DEVICE_MASTER_DATABASE.find(d => d.brand === brand && d.model === model);
      if (!matched) return 2000000;

      const max_buyback = matched.max_buyback;
      const floor_buyback = matched.floor_buyback;

      if (conditionIndex === 0) {
        finalVal = max_buyback;
      } else if (conditionIndex === 3) {
        finalVal = floor_buyback;
      } else {
        const weight = CONDITIONS[conditionIndex].factor;
        finalVal = floor_buyback + (max_buyback - floor_buyback) * weight;
      }
    }

    // Round to nearest Rp 10.000 for realistic retail format
    return Math.round(finalVal / 10000) * 10000;
  }, [brand, model, conditionIndex, isManual, manualBrand, manualModel, manualStorage, manualMarketPrice]);

  const validateManualInput = (): boolean => {
    if (!isManual) return true;

    // Check custom brand
    const cleanBrand = manualBrand.trim().toLowerCase();
    if (cleanBrand.length < 2) {
      setValidationError("Nama merk minimal harus 2 karakter.");
      return false;
    }
    if (/^[0-9\s\-_]+$/.test(cleanBrand)) {
      setValidationError("Nama merk tidak boleh hanya berisi angka atau simbol.");
      return false;
    }

    // Check custom model
    const cleanModel = manualModel.trim().toLowerCase();
    if (cleanModel.length < 3) {
      setValidationError("Nama tipe/seri minimal harus 3 karakter.");
      return false;
    }
    if (/^[0-9\s\-_]+$/.test(cleanModel)) {
      setValidationError("Nama tipe/seri tidak boleh hanya berisi angka atau simbol.");
      return false;
    }
    
    // Anti-spam keyboard mashing and joke patterns
    const spamWords = [
      'asdf', 'qwer', 'zxcv', 'uiop', 'jkl;', 'hjkl', '1111', '2222', '3333', '4444', '5555',
      'aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff', 'gggg', 'test', 'hp', 'phone', 'dummy',
      'anjing', 'kontol', 'bangsat', 'memek', 'goblok', 'babi', 'asu', 'bajingan', 'pepek'
    ];
    if (spamWords.some(pat => cleanModel.includes(pat) || cleanBrand.includes(pat))) {
      setValidationError("Harap masukkan merk dan seri HP asli (sistem mendeteksi input acak, spam, atau kata kasar).");
      return false;
    }

    // Check market price
    if (!manualMarketPrice || manualMarketPrice < 500000) {
      setValidationError("Harga pasar baru HP minimal adalah Rp 500.000.");
      return false;
    }
    if (manualMarketPrice > 35000000) {
      setValidationError("Harga pasar baru HP maksimal yang diterima sistem adalah Rp 35.000.000.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleCalculate = () => {
    if (isManual) {
      const isValid = validateManualInput();
      if (!isValid) {
        setIsCalculated(false);
        return;
      }
    } else {
      if (!model) return;
      setValidationError(null);
    }
    setIsCalculated(true);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya mau Trade-In unit.\n\nUnit: ${isManual ? manualBrand : brand} ${isManual ? manualModel : model} (${isManual ? manualStorage : storage})\nKondisi: ${CONDITIONS[conditionIndex].label}\nPenawaran Sistem: Rp ${calculateEstimate.toLocaleString('id-ID')}`
  );

  return (
    <div className="min-h-screen bg-transparent pt-36 sm:pt-44 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-20 relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in">
            <TrendingDown className="w-4 h-4" />
            Penampungan Unit Terpercaya
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
            Kalkulator <br />
            <span className="text-gradient">Penampungan HP</span>
          </h1>
          <p className="text-slate-600 max-w-3xl text-lg font-medium leading-relaxed">
            Mau jual HP lamamu dengan cepat? Kami berikan penawaran harga beli langsung (Bakul) untuk stok operasional kami dengan margin aman 15-20% terjamin!
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[3.5rem] p-8 sm:p-14 space-y-12 shadow-2xl relative overflow-hidden">
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

              {/* Model, Storage & Custom Inputs */}
              <div>
                {isManual ? (
                  <div className="space-y-8">
                    <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                      <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">2</span>
                      Spesifikasi Detail Manual (Others)
                    </label>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Nama Merk HP</label>
                        <input 
                          type="text"
                          placeholder="Contoh: Asus, Nokia, Huawei..."
                          value={manualBrand}
                          onChange={(e) => { setManualBrand(e.target.value); setIsCalculated(false); setValidationError(null); }}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Seri / Tipe HP</label>
                        <input 
                          type="text"
                          placeholder="Contoh: ROG Phone 8, Pura 70..."
                          value={manualModel}
                          onChange={(e) => { setManualModel(e.target.value); setIsCalculated(false); setValidationError(null); }}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Kapasitas Internal</label>
                        <input 
                          type="text"
                          placeholder="Contoh: 128GB, 256GB..."
                          value={manualStorage}
                          onChange={(e) => { setManualStorage(e.target.value); setIsCalculated(false); setValidationError(null); }}
                          className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none shadow-sm transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-black uppercase tracking-wider mb-2.5">Harga Pasar Baru HP Saat Ini</label>
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
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2.5 leading-normal">
                          Masukkan kisaran harga beli baru unit ini saat ini di pasar Indonesia.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="flex items-center gap-3 text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                      <span className="w-6 h-6 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center font-black">2</span>
                      Pilih Seri & Varian Tipe HP
                    </label>
                    <div className="relative">
                      {model === 'Tipe lain (Gunakan Manual Input)' ? (
                        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4 text-slate-700 text-xs font-bold leading-normal relative z-10">
                          <Info className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-900 text-[10px] font-black uppercase tracking-widest block mb-1">Peralihan Input</span>
                            <p>Tipe ini membutuhkan data spesifikasi kustom. Silakan klik tombol <b>Others</b> di bagian atas untuk mengaktifkan input manual.</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <select 
                            value={model}
                            onChange={(e) => { 
                              setModel(e.target.value); 
                              setIsCalculated(false); 
                              if (e.target.value === 'Tipe lain (Gunakan Manual Input)') {
                                setBrand('Others');
                                setIsManual(true);
                              }
                            }}
                            className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-5 text-slate-900 text-sm font-bold focus:border-brand-orange/50 outline-none appearance-none cursor-pointer shadow-sm animate-fade-in"
                          >
                            <option value="" className="bg-[#0f172a]">-- Pilih Seri & Kapasitas --</option>
                            {(MODELS_DATA[brand] || []).map(m => (
                              <option key={m} value={m} className="bg-[#0f172a] text-white">{m}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </>
                      )}
                    </div>
                  </div>
                )}
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
                        conditionIndex === i ? 'bg-brand-orange/10 border-brand-orange/40' : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[13px] font-black uppercase tracking-[0.2em] ${conditionIndex === i ? 'text-brand-orange' : 'text-slate-900'}`}>{c.label}</span>
                        {conditionIndex === i && <CheckCircle2 className="w-5 h-5 text-brand-orange" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed pr-10 font-medium">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Validation Alert */}
              {validationError && (
                <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex gap-4 text-rose-600 text-xs font-bold leading-relaxed relative z-10 animate-fade-in">
                  <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-rose-700 text-[10px] font-black uppercase tracking-widest block mb-1">Gagal Validasi</span>
                    <p>{validationError}</p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleCalculate}
                disabled={isManual ? (!manualModel || !manualBrand || !manualMarketPrice) : (!model || model.includes('Manual'))}
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
                  
                  <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.15em] mb-6 flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Ini masih perkiraan, biar pas langsung chat admin aja
                  </div>
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
                          Kami memberikan penawaran harga beli terbaik berdasarkan <span className="text-white font-bold">Master baseline 2026</span> dengan margin aman 15-20%. Penilaian final ditentukan setelah pengecekan fisik menyeluruh oleh tim teknisi kami.
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
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-20 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-10">
                  <Smartphone className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-slate-900 text-3xl font-black mb-6 tracking-tight">Menunggu Input</h3>
                <p className="text-slate-500 text-lg max-w-xs leading-relaxed font-medium">
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
