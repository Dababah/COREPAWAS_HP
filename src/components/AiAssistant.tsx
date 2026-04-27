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
        className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all animate-bounce"
      >
        <Sparkles className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-black">AI Admin Assistant</h3>
              <p className="text-purple-300 text-[10px] uppercase font-bold tracking-widest">Powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selector */}
          <div className="flex p-1 bg-slate-800 rounded-2xl">
            <button
              onClick={() => { setType('product'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                type === 'product' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Input Stok
            </button>
            <button
              onClick={() => { setType('blog'); setResult(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                type === 'blog' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Tulis Blog
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
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pr-14 text-white text-sm focus:border-purple-500 focus:outline-none transition-all resize-none min-h-[120px]"
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-4 bottom-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black flex items-center justify-center gap-2 shadow-xl shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Proses dengan AI</>}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Result Preview */}
          {result && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <Check className="w-4 h-4" />
                  AI Berhasil Memahami Data
                </div>
                <div className="bg-slate-950/50 rounded-xl p-3 text-[11px] font-mono text-slate-300 overflow-auto max-h-32">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3 rounded-xl bg-white text-slate-900 font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
              >
                Terapkan ke Form <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-950/50 text-center">
          <p className="text-slate-500 text-[10px]">Tips: Gunakan voice note untuk input data lebih cepat!</p>
        </div>
      </div>
    </div>
  );
}
