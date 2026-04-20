"use client";
import { useState } from 'react';
import { Smartphone, RefreshCw, ChevronRight, Info, MessageCircle, ShieldCheck } from 'lucide-react';
import { useData } from '@/context/DataContext';

const BRANDS = ['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Google Pixel'];

const MODELS_DATA: Record<string, string[]> = {
  'iPhone': ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15', 'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 13 Pro Max', 'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 11'],
  'Samsung': ['Galaxy S24 Ultra', 'Galaxy S23 Ultra', 'Galaxy S22 Ultra', 'Galaxy Z Fold 5', 'Galaxy S21 Ultra'],
  'Google Pixel': ['Pixel 8 Pro', 'Pixel 7 Pro', 'Pixel 6 Pro', 'Pixel 7', 'Pixel 6'],
};

const CONDITIONS = [
  { label: 'Perfect (Like New)', desc: 'Mulus total, BH >90%, Fullset Ori, No Minus', factor: 1.0 },
  { label: 'Great', desc: 'Lecet halus pemakaian, BH 85-90%, Box Ori', factor: 0.9 },
  { label: 'Good', desc: 'Ada dent kecil, BH 80-85%, Berfungsi normal', factor: 0.8 },
  { label: 'Fair', desc: 'Lecet banyak, BH <80%, Pernah servis ringan', factor: 0.65 },
];

export default function TradeInPage() {
  const { waNumber } = useData();
  const [brand, setBrand] = useState('iPhone');
  const [model, setModel] = useState('');
  const [conditionIndex, setConditionIndex] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  // Mock pricing logic (In real app, fetch from DB)
  const estimatePrice = 8500000; // Base for iPhone 13 example
  const finalEstimate = Math.round((estimatePrice * CONDITIONS[conditionIndex].factor) / 10000) * 10000;

  const handleCalculate = () => {
    if (!model) return;
    setIsCalculated(true);
  };

  const waMessage = encodeURIComponent(
    `Halo COREPAWAS! Saya ingin Tukar Tambah HP.\n\nUnit: ${brand} ${model}\nKondisi: ${CONDITIONS[conditionIndex].label}\nEst. Harga: Rp ${finalEstimate.toLocaleString('id-ID')}\n\nApakah bisa diproses?`
  );

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">Kalkulator Tukar Tambah</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Dapatkan penawaran terbaik untuk HP lama kamu dan upgrade ke unit COREPAWAS berkualitas.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Pilih Brand</label>
              <div className="grid grid-cols-3 gap-2">
                {BRANDS.map(b => (
                  <button 
                    key={b}
                    onClick={() => { setBrand(b); setModel(''); setIsCalculated(false); }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      brand === b ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Pilih Model</label>
              <select 
                value={model}
                onChange={(e) => { setModel(e.target.value); setIsCalculated(false); }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none"
              >
                <option value="">-- Pilih Model --</option>
                {(MODELS_DATA[brand] || ['Model lainnya...']).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3">Kondisi Unit Sekarang</label>
              <div className="space-y-2">
                {CONDITIONS.map((c, i) => (
                  <button 
                    key={i}
                    onClick={() => { setConditionIndex(i); setIsCalculated(false); }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      conditionIndex === i ? 'bg-blue-500/10 border-blue-500/40' : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-bold ${conditionIndex === i ? 'text-blue-400' : 'text-slate-200'}`}>{c.label}</span>
                      {conditionIndex === i && <ShieldCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleCalculate}
              disabled={!model}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cek Estimasi Harga
            </button>
          </div>

          {/* Result Card */}
          <div className="flex flex-col gap-6">
            {isCalculated ? (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up">
                <div className="mb-6">
                  <div className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Estimasi Harga Beli Kami</div>
                  <div className="text-4xl sm:text-5xl font-black">Rp {finalEstimate.toLocaleString('id-ID')}</div>
                  <p className="text-blue-200 text-xs mt-3 leading-relaxed">
                    *Harga ini adalah estimasi awal. Penilaian final ditentukan setelah pengecekan fisik menyeluruh oleh teknisi kami di toko.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-4">
                    <Info className="w-6 h-6 text-blue-200" />
                    <p className="text-xs text-blue-50">Ingin lanjut upgrade? Hubungi kami untuk memilih unit pengganti dan dapatkan potongan spesial.</p>
                  </div>
                  
                  <a 
                    href={`https://wa.me/${waNumber}?text=${waMessage}`}
                    target="_blank"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-white text-blue-600 font-black text-lg transition-all hover:bg-blue-50 shadow-xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Klaim ke WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-dashed border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center opacity-60">
                <Smartphone className="w-16 h-16 text-slate-700 mb-6" />
                <h3 className="text-slate-400 font-bold mb-2">Belum ada estimasi</h3>
                <p className="text-slate-600 text-sm">Pilih brand, model, dan kondisi HP lama kamu untuk melihat estimasi harga tukar tambah.</p>
              </div>
            )}

            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-blue-400" /> Tahapan Tukar Tambah
              </h4>
              <div className="space-y-4">
                {[
                  { title: 'Data Backup', desc: 'Kami bantu backup data HP lama kamu ke unit baru gratis.' },
                  { title: 'Physical Check', desc: 'Teknisi akan cek layar, baterai, dan sensor dalam 15 menit.' },
                  { title: 'Instant Payment', desc: 'Sisa pembayaran bisa via Transfer, QRIS, atau Cash.' }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-blue-400 flex-shrink-0 mt-0.5">{i+1}</div>
                    <div>
                      <h5 className="text-slate-200 font-bold text-xs">{step.title}</h5>
                      <p className="text-slate-500 text-[10px]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
