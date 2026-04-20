"use client";
import { useState, useMemo } from 'react';
import { Smartphone, RefreshCw, ShieldCheck, Info, MessageCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useData } from '@/context/DataContext';

const BRANDS = ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Google Pixel', 'Others'];

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
    'Galaxy A54 5G', 'Galaxy A34 5G', 'Galaxy S21 FE'
  ],
  'Xiaomi': [
    'Xiaomi 14', 'Xiaomi 13T', 'Xiaomi 12 Pro', 'Xiaomi 12',
    'Redmi Note 13 Pro+', 'Redmi Note 12 Pro', 'Poco F5', 'Poco X6 Pro', 'Poco F4'
  ],
  'Oppo': [
    'Find N3', 'Find X6 Pro', 'Reno 11 Pro', 'Reno 10 Pro+', 'Reno 8 Pro'
  ],
  'Vivo': [
    'X100 Pro', 'X90 Pro', 'V30 Pro', 'V29 5G', 'V27 5G'
  ],
  'Realme': [
    'Realme GT 5', 'Realme 12 Pro+', 'Realme 11 Pro+', 'Realme GT Neo 5'
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
    factor: 0.82 // Set slightly lower for business margin (bakul price)
  },
  { 
    label: 'Great', 
    desc: 'Lecet halus pemakaian jarah, BH 85-90%, Box ada, Berfungsi normal.', 
    factor: 0.75 
  },
  { 
    label: 'Good', 
    desc: 'Ada dent/lecek, BH 80-85%, Pernah ganti baterai/layar ori.', 
    factor: 0.65 
  },
  { 
    label: 'Fair / Minus', 
    desc: 'Lecet parah, BH <80%, Ada jamur, Box hilang, atau minus fungsi ringan.', 
    factor: 0.50 
  },
];

export default function TradeInPage() {
  const { waNumber } = useData();
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [conditionIndex, setConditionIndex] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  // Expanded base pricing logic (Harga Pasar Second minus Margin Bakul 15-20%)
  const calculateEstimate = useMemo(() => {
    let base = 5000000; // Default fallback

    if (brand === 'iPhone') {
      if (model.includes('15 Pro Max')) base = 16500000;
      else if (model.includes('15 Pro')) base = 14500000;
      else if (model.includes('14 Pro Max')) base = 13500000;
      else if (model.includes('13 Pro Max')) base = 10500000;
      else if (model.includes('13')) base = 7500000;
      else if (model.includes('11')) base = 4000000;
    } else if (brand === 'Samsung') {
      if (model.includes('S24 Ultra')) base = 15500000;
      else if (model.includes('S23 Ultra')) base = 11500000;
      else if (model.includes('Fold 5')) base = 13000000;
    } else if (brand === 'Xiaomi') {
      if (model.includes('14')) base = 8500000;
      else if (model.includes('13T')) base = 4500000;
    }

    // Storage multiplier
    let storageFactor = 1.0;
    if (storage === '256GB') storageFactor = 1.1;
    if (storage === '512GB') storageFactor = 1.25;
    if (storage === '1TB') storageFactor = 1.4;

    const result = (base * storageFactor) * CONDITIONS[conditionIndex].factor;
    return Math.round(result / 50000) * 50000; // Round to nearest 50k
  }, [brand, model, storage, conditionIndex]);

  const handleCalculate = () => {
    if (!model) return;
    setIsCalculated(true);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya mau cek harga Trade-In.\n\nUnit: ${brand} ${model} (${storage})\nKondisi: ${CONDITIONS[conditionIndex].label}\nPenawaran Web: Rp ${calculateEstimate.toLocaleString('id-ID')}\n\nSiap kirim/bawa ke toko untuk cek fisik?`
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-600/10 blur-[100px] -z-10 rounded-full" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            Upgrade Station
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Jual HP Lama Jadi <br />
            <span className="text-gradient">Modal Upgrade</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
            Dapatkan harga penampungan terbaik (Harga Bakul) untuk unit kamu. Proses cepat, transparan, dan sisa pembayaran bisa dicicil.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Step 1 & 2: Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-6 sm:p-10 space-y-8 backdrop-blur-xl">
              {/* Brand Selection */}
              <div>
                <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">1</div>
                  Pilih Merk Perangkat
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BRANDS.map(b => (
                    <button 
                      key={b}
                      onClick={() => { setBrand(b); setModel(''); setIsCalculated(false); }}
                      className={`py-3 rounded-2xl text-xs font-bold border transition-all ${
                        brand === b ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model & Storage */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">2</div>
                    Pilih Tipe / Model
                  </label>
                  <div className="relative">
                    <select 
                      value={model}
                      onChange={(e) => { setModel(e.target.value); setIsCalculated(false); }}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white text-sm focus:border-blue-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih Model --</option>
                      {(MODELS_DATA[brand] || ['Lainnya...']).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    Kapasitas Memori
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['128GB', '256GB', '512GB'].map(s => (
                      <button 
                        key={s}
                        onClick={() => { setStorage(s); setIsCalculated(false); }}
                        className={`py-3 rounded-2xl text-[10px] font-black border transition-all ${
                          storage === s ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-slate-800/50 border-slate-700 text-slate-400'
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
                <label className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">3</div>
                  Kondisi Aktual Unit
                </label>
                <div className="grid gap-3">
                  {CONDITIONS.map((c, i) => (
                    <button 
                      key={i}
                      onClick={() => { setConditionIndex(i); setIsCalculated(false); }}
                      className={`w-full text-left p-5 rounded-3xl border transition-all relative ${
                        conditionIndex === i ? 'bg-blue-500/10 border-blue-500/40' : 'bg-slate-800/30 border-slate-800/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-black ${conditionIndex === i ? 'text-blue-400' : 'text-slate-200'}`}>{c.label}</span>
                        {conditionIndex === i && <CheckCircle2 className="w-5 h-5 text-blue-400 animate-in zoom-in" />}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug pr-8">{c.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCalculate}
                disabled={!model}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl shadow-2xl shadow-blue-900/40 hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95"
              >
                Cek Harga Penampungan
              </button>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-5 space-y-6">
            {isCalculated ? (
              <div className="sticky top-28 space-y-6 animate-fade-in-up">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(30,58,138,0.3)] border border-white/10 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full" />
                  
                  <div className="relative z-10">
                    <div className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Estimasi Harga Beli COREPAWAS</div>
                    <div className="text-5xl sm:text-6xl font-black mb-8">
                       <span className="text-2xl font-bold align-top mt-2 inline-block">Rp</span>
                       {calculateEstimate.toLocaleString('id-ID')}
                    </div>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10">
                        <Info className="w-6 h-6 text-blue-100 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-sm mb-1">Penawaran Nett (Harga Bakul)</h4>
                          <p className="text-blue-100 text-[10px] leading-relaxed">
                            Kami memberikan harga beli terbaik untuk sistem penampungan. Penilaian final ditentukan di toko setelah teknisi melakukan inspeksi fisik & hardware.
                          </p>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={`https://wa.me/${waNumber}?text=${waMessage}`}
                      target="_blank"
                      className="flex items-center justify-center gap-3 w-full py-5 rounded-3xl bg-white text-blue-700 font-black text-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95 shadow-xl"
                    >
                      <MessageCircle className="w-6 h-6" />
                      Klaim ke WhatsApp
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8">
                  <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-blue-400" /> Kenapa Trade-In di Sini?
                  </h4>
                  <div className="grid gap-6">
                    {[
                      { icon: <ShieldCheck className="w-5 h-5" />, title: 'Pengecekan Transparan', desc: 'Kami jelaskan secara detail jika ada potongan harga karena kondisi.' },
                      { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Backup Data Gratis', desc: 'Kami bantu pindahkan semua foto, chat WA, dan kontak ke HP baru.' },
                      { icon: <Smartphone className="w-5 h-5" />, title: 'Potongan Khusus Unit Baru', desc: 'Dapatkan diskon tambahan (cashback) jika kamu langsung upgrade ke unit ready.' }
                    ].map((feat, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 flex-shrink-0">{feat.icon}</div>
                        <div>
                          <h5 className="text-slate-200 font-bold text-xs">{feat.title}</h5>
                          <p className="text-slate-500 text-[10px] leading-relaxed mt-1">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
                <Smartphone className="w-20 h-20 text-slate-800 mb-8" />
                <h3 className="text-slate-400 text-xl font-black mb-3">Hasil Estimasi</h3>
                <p className="text-slate-600 text-sm max-w-xs">
                  Selesaikan Step 1 sampai 3 di samping untuk melihat penawaran terbaik dari kami.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
