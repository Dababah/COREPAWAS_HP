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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-brand-navy-dark border border-white/5 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col animate-fade-in-up tilt-3d">
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-brand-navy/30 to-brand-orange/30 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange flex items-center justify-center shadow-xl shadow-brand-orange/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight uppercase">AI Neural Core</h3>
              <p className="text-orange-400 text-[10px] uppercase font-black tracking-[0.2em]">Smart Admin Engine</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Type Selector (Bento Style) */}
          <div className="flex p-1.5 bg-brand-navy rounded-2xl border border-white/5">
            <button
              onClick={() => { setType('product'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === 'product' ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Stok
            </button>
            <button
              onClick={() => { setType('blog'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === 'blog' ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20' : 'text-slate-500 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </button>
          </div>

          {/* Prompt Input */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                type === 'product' 
                ? "Sebutkan detail HP: 'iPhone 13 Midnight 128GB mulus 5 juta BH 90% fullset box original...'" 
                : "Ide artikel: 'Tips merawat baterai iPhone agar tidak cepat drop...'"
              }
              className="w-full bg-brand-navy border border-white/5 rounded-3xl p-6 pr-16 text-white text-sm focus:border-brand-orange/50 focus:outline-none transition-all resize-none min-h-[160px] shadow-inner font-medium"
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-5 bottom-5 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-brand-navy-dark border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-5 rounded-3xl bg-brand-orange text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-brand-orange/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> Ignite AI</>}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-400 text-sm font-bold animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Result Preview (Neural Glass) */}
          {result && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3 text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">
                  <Check className="w-4 h-4" />
                  Neural Analysis Complete
                </div>
                <div className="bg-black/40 rounded-2xl p-4 text-[10px] font-mono text-slate-400 overflow-auto max-h-40 border border-white/5 scrollbar-hide">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-4 rounded-2xl bg-white text-brand-navy-dark font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-2xl"
              >
                Terapkan Data <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-black/20 text-center border-t border-white/5">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Tips: AI lebih akurat dengan detail spesifik.</p>
        </div>
      </div>
    </div>
  );
}
