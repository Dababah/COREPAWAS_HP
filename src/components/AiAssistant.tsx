"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  Send, 
  X, 
  Loader2, 
  Check, 
  AlertCircle,
  Package,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface AiAssistantProps {
  onFillProduct: (data: any) => void;
  onFillBlog: (data: any) => void;
}

export default function AiAssistant({ onFillProduct, onFillBlog }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [type, setType] = useState<'product' | 'blog'>('product');
  const [error, setError] = useState('');
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memproses AI. Pastikan API Key sudah terpasang.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (type === 'product') {
      onFillProduct(result);
    } else {
      onFillBlog(result);
    }
    setIsOpen(false);
    setResult(null);
    setPrompt('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 lg:bottom-10 lg:right-32 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-orange text-white flex items-center justify-center shadow-2xl shadow-brand-orange/20 hover:scale-110 active:scale-95 transition-all animate-bounce hover:rotate-6"
      >
        <Sparkles className="w-8 h-8" />
        <div className="absolute inset-0 rounded-2xl bg-brand-orange animate-ping opacity-10 pointer-events-none" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/40 backdrop-blur-sm">
      <div className="w-full max-w-[380px] bg-brand-navy-dark border border-white/10 rounded-[1.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header - Compact & Sharp */}
        <div className="p-4 bg-gradient-to-r from-brand-navy/10 to-brand-orange/10 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-[11px] tracking-wider uppercase">Neural Editor</h3>
              <p className="text-orange-400 text-[7px] uppercase font-black tracking-[0.2em]">Ready to Sync</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[85vh] overflow-y-auto scrollbar-hide">
          {!result ? (
            <div className="space-y-4">
              {/* Type Selector */}
              <div className="flex p-1 bg-brand-navy rounded-xl border border-white/5">
                <button
                  onClick={() => setType('product')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    type === 'product' ? 'bg-brand-orange text-white' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <Package className="w-3 h-3" /> Stok
                </button>
                <button
                  onClick={() => setType('blog')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    type === 'blog' ? 'bg-brand-orange text-white' : 'text-slate-500 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3 h-3" /> Blog
                </button>
              </div>

              {/* Prompt Input */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={type === 'product' ? "Sebutkan detail HP..." : "Ide artikel..."}
                  className="w-full bg-brand-navy/30 border border-white/5 rounded-2xl p-4 pr-12 text-white text-[11px] focus:border-brand-orange/40 focus:outline-none transition-all resize-none min-h-[100px] font-medium"
                />
                <button
                  onClick={toggleRecording}
                  className={`absolute right-3 bottom-3 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-brand-navy text-slate-400'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full py-3.5 rounded-xl bg-brand-orange text-white font-black text-[11px] flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20 hover:brightness-110 transition-all disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> Ignite AI</>}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Editable Fields for Product */}
              {type === 'product' && (
                <div className="space-y-3">
                  <div className="p-3 bg-brand-navy/30 rounded-xl border border-white/5 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Nama Produk</label>
                      <input 
                        className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] focus:border-brand-orange/40 outline-none"
                        value={result.name}
                        onChange={(e) => setResult({...result, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Harga</label>
                        <input 
                          type="number"
                          className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                          value={result.price}
                          onChange={(e) => setResult({...result, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Storage</label>
                        <input 
                          className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                          value={result.storage}
                          onChange={(e) => setResult({...result, storage: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Brand</label>
                        <select 
                          className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                          value={result.brand}
                          onChange={(e) => setResult({...result, brand: e.target.value})}
                        >
                          {["iPhone", "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme", "Other"].map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Kondisi</label>
                        <select 
                          className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                          value={result.condition}
                          onChange={(e) => setResult({...result, condition: e.target.value})}
                        >
                          {["Like New", "Very Good", "Good"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Editable Fields for Blog */}
              {type === 'blog' && (
                <div className="space-y-3">
                  <div className="p-3 bg-brand-navy/30 rounded-xl border border-white/5 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Judul Artikel</label>
                      <input 
                        className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                        value={result.title}
                        onChange={(e) => setResult({...result, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Kategori</label>
                      <select 
                        className="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-white text-[10px] outline-none"
                        value={result.category}
                        onChange={(e) => setResult({...result, category: e.target.value})}
                      >
                        {["Tips & Tricks", "Edukasi Teknis", "Panduan", "Berita"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                >
                  Ulangi
                </button>
                <button
                  onClick={handleApply}
                  className="flex-[2] py-3 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:brightness-110"
                >
                  Simpan ke Katalog & Sync <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-black/10 text-center border-t border-white/5">
          <p className="text-slate-600 text-[8px] font-bold uppercase tracking-[0.1em]">Neural Sync Active</p>
        </div>
      </div>
    </div>
  );
}
