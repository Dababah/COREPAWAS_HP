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
  ArrowRight,
  MessageSquare,
  BarChart2,
  Cpu,
  User,
  Trash2
} from 'lucide-react';

interface AiAssistantProps {
  onFillProduct: (data: any) => void;
  onFillBlog: (data: any) => void;
  products: any[];
  blogPosts: any[];
  chatTemplates: any[];
  onUpdateTemplates: (data: any) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  type: 'chat' | 'fill_product' | 'fill_blog' | 'analyze' | 'update_templates';
  reply: string;
  data?: any;
  applied?: boolean;
}

export default function AiAssistant({ onFillProduct, onFillBlog, products, blogPosts, chatTemplates, onUpdateTemplates }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      type: 'chat',
      reply: 'Halo! Saya **COREPAWAS Neural Agent**. ⚡\n\nSaya adalah asisten AI multitasking kognitif Anda. Saya bisa:\n- **Diajak ngobrol & diskusi** strategi bisnis.\n- **Menganalisis stok barang** riil Anda (coba tanya: *"analisis stok saya"*).\n- **Menginput produk otomatis** (coba ketik: *"tambahkan iPhone 11 Pro 128GB harga 3.4 Juta mulus"*).\n- **Mengkustomisasi templat chat Anda lewat perintah AI!** (coba ketik: *"tambah templat chat nego sadis"* atau *"ubah templat Stage 1 pakai bahasa santai bro"*).\n\nAda yang bisa saya bantu hari ini?'
    }
  ]);
  
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, loading]);

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

  const handleSend = async () => {
    if (!prompt.trim() || loading) return;
    
    const userMessageText = prompt;
    setPrompt('');
    setLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'chat',
      reply: userMessageText
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMessageText, 
          history: messages.map(m => ({ sender: m.sender, reply: m.reply })),
          catalog: { products, blogPosts, chatTemplates }
        }),
      });

      const responseData = await res.json();
      if (responseData.error) throw new Error(responseData.error);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: responseData.type || 'chat',
        reply: responseData.reply || 'Data berhasil diproses.',
        data: responseData.data || null
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        type: 'chat',
        reply: `❌ **Gagal memproses AI**: ${err.message || 'Koneksi API bermasalah. Pastikan GOOGLE_AI_API_KEY Anda sudah terkonfigurasi dengan benar.'}`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAction = (msgId: string, type: 'product' | 'blog' | 'templates', data: any) => {
    if (type === 'product') {
      onFillProduct(data);
    } else if (type === 'blog') {
      onFillBlog(data);
    } else if (type === 'templates') {
      onUpdateTemplates(data);
    }

    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { 
          ...m, 
          applied: true,
          reply: m.reply + `\n\n✅ *Sukses! Data telah diterapkan dan disinkronisasikan.*`
        };
      }
      return m;
    }));
  };

  const handleClearChat = () => {
    if (confirm('Bersihkan semua riwayat percakapan?')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'ai',
          type: 'chat',
          reply: 'Halo! Saya kembali aktif. Ada yang ingin Anda diskusikan atau analisis stok hari ini? ⚡'
        }
      ]);
    }
  };

  // Simple Markdown Parser to format **bold** and newlines safely in bubble
  const parseBoldText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-extrabold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderFormattedMarkdown = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={i} className="list-disc list-inside ml-2 my-1 text-slate-300 text-xs font-medium leading-relaxed">
            {parseBoldText(trimmed.slice(2))}
          </li>
        );
      }
      return (
        <p key={i} className="my-1 text-slate-300 text-xs font-medium leading-relaxed">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 lg:bottom-10 lg:right-10 z-50 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-navy to-brand-orange text-white flex items-center justify-center shadow-2xl shadow-brand-orange/30 hover:scale-110 active:scale-95 transition-all animate-bounce hover:rotate-6 cursor-pointer"
        title="Open COREPAWAS Neural Agent Chat"
      >
        <Sparkles className="w-8 h-8" />
        <div className="absolute inset-0 rounded-2xl bg-brand-orange animate-ping opacity-15 pointer-events-none" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 w-[380px] h-[550px] z-50 bg-[#080c1b]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-fade-in-up">
      {/* Dynamic Header */}
      <div className="p-5 bg-gradient-to-r from-brand-navy/30 to-brand-orange/20 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-lg shadow-brand-orange/25">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-black text-xs tracking-wider uppercase">Neural Agent</h3>
            <span className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              <p className="text-slate-400 text-[8px] uppercase font-black tracking-widest">Cognitive Core Online</p>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearChat}
            className="w-8 h-8 rounded-xl bg-white/5 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-red-500/20"
            title="Hapus Percakapan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsOpen(false)} 
            className="w-8 h-8 rounded-xl bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-white/10"
            title="Minimize"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide bg-white/[0.01]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* AI Avatar */}
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex flex-shrink-0 items-center justify-center shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              </div>
            )}

            {/* Bubble Container */}
            <div className="max-w-[78%] flex flex-col gap-2.5">
              {/* Message text bubble */}
              <div className={`p-4 rounded-2xl text-xs shadow-inner relative border ${
                msg.sender === 'user'
                  ? 'bg-brand-orange border-brand-orange/20 text-white rounded-tr-none'
                  : 'bg-brand-navy border-white/5 text-slate-300 rounded-tl-none'
              }`}>
                <div className="space-y-1">
                  {renderFormattedMarkdown(msg.reply)}
                </div>
              </div>

              {/* Dynamic Interactive Cards for fill_product/fill_blog/update_templates */}
              {msg.sender === 'ai' && msg.data && !msg.applied && (
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-brand-orange/20 shadow-2xl space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-brand-orange text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      {msg.type === 'fill_product' ? <Package className="w-3.5 h-3.5" /> : msg.type === 'fill_blog' ? <BookOpen className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                      {msg.type === 'fill_product' ? 'Parsed Product' : msg.type === 'fill_blog' ? 'Parsed Article' : 'Proposed Chat Template'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                      Ready to Sync
                    </span>
                  </div>

                  {msg.type === 'fill_product' && (
                    <div className="space-y-2">
                      <div className="text-white text-xs font-bold">{msg.data.name}</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Brand</span><span className="text-slate-300 font-medium">{msg.data.brand}</span></div>
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Harga</span><span className="text-brand-orange font-bold">Rp {msg.data.price?.toLocaleString()}</span></div>
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Storage/RAM</span><span className="text-slate-300 font-medium">{msg.data.storage || '128GB'} / {msg.data.ram || '8GB'}</span></div>
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Kondisi</span><span className="text-emerald-400 font-semibold">{msg.data.condition || 'Like New'}</span></div>
                      </div>
                      <button
                        onClick={() => handleApplyAction(msg.id, 'product', msg.data)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-brand-orange/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Simpan ke Katalog & Sync
                      </button>
                    </div>
                  )}

                  {msg.type === 'fill_blog' && (
                    <div className="space-y-2">
                      <div className="text-white text-xs font-bold line-clamp-1">{msg.data.title}</div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Kategori</span><span className="text-slate-300 font-medium">{msg.data.category || 'Tips & Tricks'}</span></div>
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Estimasi Baca</span><span className="text-slate-300 font-medium">{msg.data.readTime || '5 menit'}</span></div>
                      </div>
                      <button
                        onClick={() => handleApplyAction(msg.id, 'blog', msg.data)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-brand-orange/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Terbitkan ke Blog & Sync
                      </button>
                    </div>
                  )}

                  {msg.type === 'update_templates' && (
                    <div className="space-y-2">
                      <div className="text-white text-xs font-bold">{msg.data.title}</div>
                      <div className="text-[10px] text-slate-400 italic bg-black/20 p-2 rounded-lg border border-white/5 line-clamp-2">
                        "{msg.data.message}"
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] mt-1">
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Tahap</span><span className="text-brand-orange font-medium">{msg.data.stage || 'Custom'}</span></div>
                        <div><span className="text-slate-500 font-bold uppercase block text-[7px] tracking-wider">Peringatan</span><span className="text-rose-400 font-semibold">{msg.data.warningTitle || 'Ciri Penipu'}</span></div>
                      </div>
                      <button
                        onClick={() => handleApplyAction(msg.id, 'templates', msg.data)}
                        className="w-full mt-2 py-2.5 rounded-xl bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-brand-orange/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Terapkan ke Templat Panel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center shadow-inner">
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
            )}

          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex flex-shrink-0 items-center justify-center shadow-inner">
              <Loader2 className="w-3.5 h-3.5 text-brand-orange animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-brand-navy border border-white/5 text-slate-500 text-xs rounded-tl-none font-bold uppercase tracking-widest flex items-center gap-2">
              Agent is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-white/5 bg-slate-950/20 flex items-center gap-2.5 flex-shrink-0">
        <div className="relative flex-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Tanya analisis, ajak ngobrol, tambah stok..."
            rows={1}
            className="w-full bg-[#080d1e]/80 border border-white/5 rounded-2xl py-3 px-4 pr-12 text-white text-[11px] font-medium placeholder-slate-600 focus:outline-none focus:border-brand-orange/40 transition-all resize-none shadow-inner"
          />
          <button
            onClick={toggleRecording}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
            title={isRecording ? "Mendengarkan..." : "Gunakan Suara (Speech to Text)"}
          >
            <Mic className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={loading || !prompt.trim()}
          className="w-10 h-10 rounded-2xl bg-brand-orange hover:bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-orange/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
          title="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
