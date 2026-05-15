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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/60 backdrop-blur-md">
      <div className="w-full max-w-md bg-brand-navy-dark border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header - More Compact */}
        <div className="p-5 bg-gradient-to-r from-brand-navy/20 to-brand-orange/20 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide uppercase">AI Neural Core</h3>
              <p className="text-orange-400 text-[8px] uppercase font-black tracking-[0.2em]">Smart Admin Engine</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Type Selector - Sleeker */}
          <div className="flex p-1 bg-brand-navy rounded-xl border border-white/5">
            <button
              onClick={() => { setType('product'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                type === 'product' ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Package className="w-3 h-3" />
              Stok
            </button>
            <button
              onClick={() => { setType('blog'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                type === 'blog' ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Blog
            </button>
          </div>

          {/* Prompt Input - More focused */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                type === 'product' 
                ? "Sebutkan detail HP..." 
                : "Ide artikel blog..."
              }
              className="w-full bg-brand-navy/50 border border-white/5 rounded-2xl p-5 pr-14 text-white text-xs focus:border-brand-orange/40 focus:outline-none transition-all resize-none min-h-[120px] font-medium leading-relaxed"
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-4 bottom-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-brand-navy-dark border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-4 rounded-2xl bg-brand-orange text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Ignite AI</>}
          </button>

          {/* Result Preview - Optimized height */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-[9px] uppercase tracking-widest mb-3">
                  <Check className="w-3 h-3" />
                  Neural Analysis Complete
                </div>
                <div className="bg-black/30 rounded-xl p-3 text-[9px] font-mono text-slate-400 overflow-auto max-h-32 border border-white/5 scrollbar-hide">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3.5 rounded-xl bg-white text-brand-navy-dark font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-lg"
              >
                Terapkan Data <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-black/10 text-center border-t border-white/5">
          <p className="text-slate-600 text-[9px] font-medium uppercase tracking-[0.1em]">Tekan Ignite untuk memproses data.</p>
        </div>
      </div>
  );
}
