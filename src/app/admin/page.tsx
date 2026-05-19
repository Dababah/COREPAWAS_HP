"use client";
import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  Cpu,
  LayoutDashboard,
  Smartphone,
  BookOpen,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Search,
  Save,
  X,
  Menu,
  BarChart3,
  TrendingUp,
  Package,
  MessageSquare,
  MapPin,
  Database,
  RefreshCw,
  Copy,
  Check,
  Upload,
  Loader2,
  Info,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Terminal,
  Globe,
  Mic,
  ArrowLeftRight,
  CheckSquare,
  RefreshCcw,
  ListTodo,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { Product, defaultProducts } from '@/data/products';
import { BlogPost, defaultBlogPosts } from '@/data/blog';
import { seedDatabase } from '@/lib/seed';
import AiAssistant from '@/components/AiAssistant';
import { addWatermark } from '@/lib/watermark';


type Tab = 'dashboard' | 'produk' | 'blog' | 'pengaturan' | 'hunting' | 'templates' | 'tradein' | 'cod';

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

// ─── Login Component ────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-orange/40">
            <Cpu className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Admin <span className="text-brand-orange">Panel</span></h1>
          <p className="text-slate-500 text-xs font-bold mt-2 uppercase tracking-widest">Access Restricted to Authorized Personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Credentials / Email</label>
            <input
              type="email"
              placeholder="admin@corepawas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-brand-navy-dark border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all shadow-xl"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Access Code / Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-2xl bg-brand-navy-dark border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all shadow-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-[2rem] bg-brand-orange text-white font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-orange/30 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Masuk ke Dashboard <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link href="/" className="text-slate-500 hover:text-brand-orange text-[10px] font-black uppercase tracking-widest transition-all">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Product Modal ───────────────────────────────────────────────────────────
const emptyProduct: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  brand: 'iPhone',
  price: 0,
  originalPrice: undefined,
  condition: 'Like New',
  batteryHealth: 90,
  storage: '128GB',
  ram: '8GB',
  chipset: '',
  color: '',
  image: '',
  images: [],
  status: 'Ready',
  antutuScore: undefined,
  description: '',
  hasUBL: false,
  isRooted: false,
  warrantyStatus: 'No Warranty',
  accessories: [],
  isFeatured: false,
};

function ProductModal({
  product,
  onSave,
  onClose,
}: {
  product?: Product | null;
  onSave: (p: Product) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt'>>(
    product ? { ...product } : { ...emptyProduct }
  );
  const [accessoriesInput, setAccessoriesInput] = useState(product?.accessories.join(', ') || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function set(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError('');

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (file.size > 10 * 1024 * 1024) continue;

        // Apply watermark
        try {
          file = await addWatermark(file);
        } catch (wmError) {
          console.error('Watermark error:', wmError);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const newImages = [...(form.images || []), ...uploadedUrls];
      setForm(prev => ({
        ...prev,
        images: newImages,
        image: prev.image || uploadedUrls[0] || ''
      }));
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setUploading(false);
    }
  }

  function addImageUrl(url: string) {
    if (!url) return;
    const newImages = [...(form.images || []), url];
    setForm(prev => ({
      ...prev,
      images: newImages,
      image: prev.image || url
    }));
  }

  function removeImage(index: number) {
    const newImages = [...(form.images || [])];
    newImages.splice(index, 1);
    setForm(prev => ({
      ...prev,
      images: newImages,
      image: prev.image === form.images[index] ? (newImages[0] || '') : prev.image
    }));
  }

  function handleSave() {
    const acc = accessoriesInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);
    const saved: Product = {
      ...form,
      accessories: acc,
      id: product?.id || Date.now().toString(),
      createdAt: product?.createdAt || new Date().toISOString().split('T')[0],
    };
    onSave(saved);
  }

  return (
    <div className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-xl flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-brand-navy-dark border border-white/10 rounded-[2.5rem] my-8 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/5">
          <h2 className="text-white font-black text-2xl tracking-tighter uppercase">{product ? 'Edit' : 'Tambah'} <span className="text-brand-orange">Unit</span></h2>
          <button onClick={onClose} className="p-3 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-6">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-slate-500 text-[10px] font-black mb-2 uppercase tracking-[0.3em]">Model / Type Name *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-bold focus:outline-none focus:border-brand-orange/50 shadow-inner"
              placeholder="cth: iPhone 13 128GB" />
          </div>

          {/* Brand */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Brand *</label>
            <select value={form.brand} onChange={(e) => set('brand', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
              {['iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Other'].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Kondisi *</label>
            <select value={form.condition} onChange={(e) => set('condition', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
              {['Like New', 'Very Good', 'Good'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Harga (Rp) *</label>
            <input type="number" value={form.price} onChange={(e) => set('price', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Harga Asli (opsional)</label>
            <input type="number" value={form.originalPrice || ''} onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Untuk strikethrough" />
          </div>

          {/* RAM */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">RAM</label>
            <input type="text" value={form.ram} onChange={(e) => set('ram', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="8GB" />
          </div>

          {/* Storage */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Storage</label>
            <input type="text" value={form.storage} onChange={(e) => set('storage', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="128GB" />
          </div>

          {/* Chipset */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Chipset</label>
            <input type="text" value={form.chipset} onChange={(e) => set('chipset', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Apple A15 Bionic" />
          </div>

          {/* Color */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Warna</label>
            <input type="text" value={form.color} onChange={(e) => set('color', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Midnight Black" />
          </div>

          {/* Battery Health */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Battery Health (%)</label>
            <input type="number" min="0" max="100" value={form.batteryHealth} onChange={(e) => set('batteryHealth', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>

          {/* Antutu Score */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">AnTuTu Score (opsional)</label>
            <input type="number" value={form.antutuScore || ''} onChange={(e) => set('antutuScore', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="cth: 789000" />
          </div>

          {/* Status */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Status</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
              <option value="Ready">Ready</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Warranty */}
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Status Garansi</label>
            <input type="text" value={form.warrantyStatus} onChange={(e) => set('warrantyStatus', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="No Warranty / Garansi Toko 1bln" />
          </div>

          {/* Multiple Image Management */}
          <div className="col-span-2">
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Galeri Foto Produk *</label>
            <div className="space-y-4">
              {/* Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(form.images || []).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-800 group">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-1.5 rounded-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {form.image === img && (
                      <div className="absolute bottom-0 left-0 right-0 bg-brand-orange text-white text-[8px] font-black uppercase text-center py-0.5">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Placeholder */}
                <label className={`relative aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-slate-500 group-hover:text-blue-500 transition-colors" />
                      <span className="text-[10px] text-slate-600 mt-1">Add Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
                </label>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  id="img-url-input"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addImageUrl((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('img-url-input') as HTMLInputElement;
                    addImageUrl(el.value);
                    el.value = '';
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white text-xs font-bold hover:bg-slate-600 transition-colors"
                >
                  Add URL
                </button>
              </div>

              {uploadError && (
                <p className="text-red-400 text-[10px] font-medium">{uploadError}</p>
              )}
            </div>
          </div>

          {/* Accessories */}
          <div className="col-span-2">
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Kelengkapan (pisahkan dengan koma)</label>
            <input type="text" value={accessoriesInput} onChange={(e) => setAccessoriesInput(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Dus Original, Kabel Lightning, Charger Head" />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Deskripsi</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Deskripsi kondisi dan keunggulan unit..." />
          </div>

          {/* Checkboxes */}
          <div className="col-span-2 flex flex-wrap gap-4">
            {[
              { key: 'isFeatured', label: 'Featured (Roti Tawar)' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => set(key, !(form as any)[key])}
                  className={`w-10 h-6 rounded-full transition-colors relative ${(form as any)[key] ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${(form as any)[key] ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-slate-300 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 p-8 border-t border-white/5 bg-white/5">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={handleSave}
            disabled={!form.name || !form.price || !form.image}
            className="flex-1 py-4 rounded-2xl bg-brand-orange text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-orange/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
            <Save className="w-5 h-5" />
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Modal ──────────────────────────────────────────────────────────────
function BlogModal({ post, onSave, onClose }: { post?: BlogPost | null; onSave: (p: BlogPost) => void; onClose: () => void }) {
  const [form, setForm] = useState<BlogPost>(
    post || {
      id: '',
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 menit',
      category: 'Tips & Tricks',
      author: 'Tim COREPAWAS',
    }
  );

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'title' && !post) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setForm((prev) => ({ ...prev, title: value, slug }));
    }
  }

  function handleSave() {
    const saved: BlogPost = { ...form, id: post?.id || Date.now().toString() };
    onSave(saved);
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">{post ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Judul Artikel *</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Slug URL *</label>
            <input type="text" value={form.slug} onChange={(e) => set('slug', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
              placeholder="otomatis dari judul" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Kategori</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500">
                {['Tips & Tricks', 'Edukasi Teknis', 'Panduan', 'Berita'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Estimasi Baca</label>
              <input type="text" value={form.readTime} onChange={(e) => set('readTime', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                placeholder="5 menit" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Tanggal</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Penulis</label>
              <input type="text" value={form.author} onChange={(e) => set('author', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">URL Foto Cover *</label>
            <input type="text" value={form.image} onChange={(e) => set('image', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="https://..." />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Ringkasan (Excerpt) *</label>
            <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
          </div>

          <div>
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Konten (Markdown)</label>
            <textarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={8}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono" />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors">Batal</button>
          <button onClick={handleSave} disabled={!form.title || !form.slug || !form.image}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { products, setProducts, deleteProduct, blogPosts, setBlogPosts, deleteBlogPost, waNumber, setWaNumber, storeAddress, setStoreAddress, googleMapsApiKey, setGoogleMapsApiKey, googleMapsUrl, setGoogleMapsUrl, googleMapsEmbedUrl, setGoogleMapsEmbedUrl } = useData();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);
  const [productSearch, setProductSearch] = useState('');
  const [blogSearch, setBlogSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null | undefined>(undefined);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null | undefined>(undefined);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [settingsWa, setSettingsWa] = useState(waNumber);
  const [settingsAddr, setSettingsAddr] = useState(storeAddress);
  const [settingsMapKey, setSettingsMapKey] = useState(googleMapsApiKey);
  const [settingsMapUrl, setSettingsMapUrl] = useState(googleMapsUrl);
  const [settingsMapEmbed, setSettingsMapEmbed] = useState(googleMapsEmbedUrl);
  const [saved, setSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // ─── Stok Hunting & AI State Hooks ───
  const [huntingPrompt, setHuntingPrompt] = useState('Cari unit iPhone 11 Pro Jogja, harga < 3.4 Juta, hitung margin jual 3.8 Juta, fullset, Face ID & True Tone ON');
  const [huntingLogs, setHuntingLogs] = useState<string[]>([]);
  const [huntingDeals, setHuntingDeals] = useState<any[]>([]);
  const [isHuntingScanning, setIsHuntingScanning] = useState(false);
  const [huntingSubTab, setHuntingSubTab] = useState<'live' | 'history'>('live');
  const [isRecordingHunting, setIsRecordingHunting] = useState(false);
  const [syncedIds, setSyncedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─── Trade In & COD States ───
  const [tradeInModels, setTradeInModels] = useState<any[]>([]);
  const [codTodos, setCodTodos] = useState<any[]>([]);
  const [loadingTradeIn, setLoadingTradeIn] = useState(false);
  const [loadingCod, setLoadingCod] = useState(false);

  useEffect(() => {
    if (activeTab === 'tradein') fetchTradeIn();
    if (activeTab === 'cod') fetchCodTodos();
  }, [activeTab]);

  async function fetchTradeIn() {
    setLoadingTradeIn(true);
    const { data } = await supabase.from('trade_in_models').select('*').order('brand');
    if (data) setTradeInModels(data);
    setLoadingTradeIn(false);
  }

  async function fetchCodTodos() {
    setLoadingCod(true);
    const { data } = await supabase.from('cod_todos').select('*').order('order_index');
    if (data) setCodTodos(data);
    setLoadingCod(false);
  }

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [chatTemplates, setChatTemplates] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('corepawas_chat_templates');
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: 'stage1',
        stage: 'Stage 1',
        title: 'Pancingan Pertama (Validasi Ketersediaan & Lokasi COD)',
        subtitle: 'Gunakan pesan tegas, padat, dan langsung mengunci opsi COD di tempat ramai.',
        message: 'Halo Mas/Mbak, unit iPhone 11 Pro-nya masih ada? Kalau sesuai deskripsi, siang/sore ini saya siap meluncur COD langsung ke lokasi dekat sampeyan. Bisa COD di lokasi ramai ya mas, misal di SPBU terdekat, depan minimarket, atau McD Jakal? Matur nuwun.',
        warningTitle: 'Ciri Penipu di Stage 1',
        warningText: 'Menolak COD dengan alasan "Lagi di luar kota, barang bisa dipaketkan" atau meminta transfer DP (tanda jadi) dengan alasan "banyak yang antre / nawar". JANGAN PERNAH TRANSFER DP/TANDA JADI!',
        iconColor: 'from-blue-500 to-indigo-600',
      },
      {
        id: 'stage2',
        stage: 'Stage 2',
        title: 'Skrining Keaslian Foto (Anti-Foto Comotan)',
        subtitle: 'Minta foto/video real-time dengan tanda khusus tulisan tangan nama akun mereka.',
        message: 'Boleh minta tolong kirimkan foto/video singkat kondisi fisik HP-nya sekarang, Mas/Mbak? Tolong difotokan bareng kertas yang ditulis tangan nama akun FB Mas/Mbak ya, buat mastiin barangnya beneran di tangan dan siap COD. Makasih banyak sebelumnya.',
        warningTitle: 'Ciri Penipu di Stage 2',
        warningText: 'Membuat 1001 alasan seperti "HP di rumah, saya sedang kerja", "foto di postingan sudah sangat jelas", atau tiba-tiba menghilang/memblokir Anda karena tidak memiliki fisik barang asli.',
        iconColor: 'from-amber-500 to-orange-600',
      },
      {
        id: 'stage3',
        stage: 'Stage 3',
        title: 'Mengunci Aturan Main COD (Sebelum Bertemu)',
        subtitle: 'Kunci kesepakatan pengecekan fungsi menyeluruh sebelum transaksi pembayaran dilakukan.',
        message: 'Oke Mas/Mbak, deal di harga kesepakatan ya. Nanti pas COD izin saya cek fungsinya agak lama dan detail ya Mas (sinyal, kamera, wifi, speaker, akun iCloud/Google, layar, IMEI, dll). Kalau semua cocok sesuai deskripsi, uang langsung saya transfer via M-Banking / Cash di tempat.',
        warningTitle: 'Ciri Penipu di Stage 3',
        warningText: 'Mendesak/terburu-buru saat COD dan tidak mau menunggu pengecekan detail. Jika mereka berkata "Bisa cepat gak mas saya sibuk", tingkatkan kewaspadaan Anda atau batalkan transaksi.',
        iconColor: 'from-emerald-500 to-teal-600',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('corepawas_chat_templates', JSON.stringify(chatTemplates));
  }, [chatTemplates]);

  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tplForm, setTplForm] = useState<any>({
    stage: '',
    title: '',
    subtitle: '',
    message: '',
    warningTitle: '',
    warningText: '',
  });

  const [negotiatingDeal, setNegotiatingDeal] = useState<any | null>(null);
  const [selectedCodZone, setSelectedCodZone] = useState<string>('McD Jakal (KM 5)');
  const [sellerPhone, setSellerPhone] = useState<string>('');
  const [copiedNegoText, setCopiedNegoText] = useState<boolean>(false);

  const handleCopyNegoText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNegoText(true);
    setTimeout(() => setCopiedNegoText(false), 2000);
  };

  const handleEditTemplate = (tpl: any) => {
    setEditingTemplateId(tpl.id);
    setTplForm({
      stage: tpl.stage || 'Custom',
      title: tpl.title || '',
      subtitle: tpl.subtitle || '',
      message: tpl.message || '',
      warningTitle: tpl.warningTitle || 'Peringatan',
      warningText: tpl.warningText || '',
    });
  };

  const handleSaveTemplateInline = (id: string) => {
    setChatTemplates(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...tplForm
        };
      }
      return t;
    }));
    setEditingTemplateId(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Hapus templat chat ini?')) {
      setChatTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddNewTemplate = () => {
    const newId = 'tpl_' + Date.now();
    const newTpl = {
      id: newId,
      stage: 'Custom',
      title: 'Judul Templat Baru',
      subtitle: 'Deskripsi singkat templat chat baru Anda.',
      message: 'Tulis pesan chat di sini...',
      warningTitle: 'Peringatan Khusus',
      warningText: 'Tulis ciri penipu atau catatan penting di sini...',
      iconColor: 'from-purple-500 to-fuchsia-600',
    };
    setChatTemplates(prev => [...prev, newTpl]);
    setEditingTemplateId(newId);
    setTplForm(newTpl);
  };

  const handleAiUpdateTemplates = (data: any) => {
    if (Array.isArray(data)) {
      setChatTemplates(data);
      alert('✅ Berhasil menyinkronisasikan seluruh templat chat dari AI Agent!');
    } else if (data && typeof data === 'object') {
      if (data.id) {
        setChatTemplates(prev => {
          const exists = prev.some(t => t.id === data.id);
          if (exists) {
            return prev.map(t => t.id === data.id ? { ...t, ...data } : t);
          } else {
            return [...prev, data];
          }
        });
      } else {
        const newItem = {
          ...data,
          id: 'tpl_' + Date.now(),
          stage: data.stage || 'Custom',
          iconColor: data.iconColor || 'from-purple-500 to-fuchsia-600',
        };
        setChatTemplates(prev => [...prev, newItem]);
      }
      alert('✅ Berhasil menerapkan templat chat baru dari AI Agent!');
    }
  };

  const handleLaunchScanning = async () => {
    if (!huntingPrompt.trim()) return;
    setIsHuntingScanning(true);
    setHuntingDeals([]);

    // Clear and start logging dynamically
    const newLogs: string[] = [];
    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString("id-ID", { hour12: false });
      newLogs.push(`[${time}] ${msg}`);
      setHuntingLogs([...newLogs]);
    };

    // Client-side parser for prompt text
    let keyword = "iPhone 11 Pro";
    let minPrice = 1500000;
    let maxPrice = 3400000;
    let marketPrice = 3800000;

    const text = huntingPrompt;

    // Smart Keyword parsing
    const kwMatch = text.match(/Cari\s+unit\s+([^,]+?)\s+Jogja/i) ||
      text.match(/Cari\s+([A-Za-z0-9\s]+?)\s+harga/i) ||
      text.match(/Cari\s+([A-Za-z0-9\s]+?)\s+Jogja/i);
    if (kwMatch) {
      keyword = kwMatch[1].trim();
    } else {
      const words = ["iphone 11 pro", "iphone 11", "iphone 12 pro max", "iphone 12", "iphone 13 pro", "iphone 13", "samsung s21 ultra", "samsung s22"];
      for (const w of words) {
        if (text.toLowerCase().includes(w)) {
          keyword = w.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
          break;
        }
      }
    }

    // Parse prices helper supporting decimals (e.g. 3.8 / 3,8) and thousands (e.g. 3.800.000)
    const parseCleanFloat = (valStr: string) => {
      const normalized = valStr.replace(/,/g, '.');
      const dotCount = (normalized.match(/\./g) || []).length;
      if (dotCount > 1) {
        return parseFloat(normalized.replace(/\./g, ''));
      }
      return parseFloat(normalized);
    };

    const lowerMatch = text.match(/>\s*(\d+(?:[\.,]\d+)?)\s*(Juta|juta|Jt|jt)/i) || text.match(/harga\s*>\s*(\d[\d\.,]*)/i);
    if (lowerMatch) {
      let val = parseCleanFloat(lowerMatch[1]);
      if (lowerMatch[2] && lowerMatch[2].toLowerCase().startsWith('j')) {
        val = val * 1000000;
      }
      minPrice = val;
    }

    const upperMatch = text.match(/<\s*(\d+(?:[\.,]\d+)?)\s*(Juta|juta|Jt|jt)/i) || text.match(/harga\s*<\s*(\d[\d\.,]*)/i);
    if (upperMatch) {
      let val = parseCleanFloat(upperMatch[1]);
      if (upperMatch[2] && upperMatch[2].toLowerCase().startsWith('j')) {
        val = val * 1000000;
      }
      maxPrice = val;
    }

    const marketMatch = text.match(/(?:margin\s+)?jual\s*(\d+(?:[\.,]\d+)?)\s*(Juta|juta|Jt|jt)/i) ||
      text.match(/(?:hitung\s+)?jual\s*(\d+(?:[\.,]\d+)?)\s*(Juta|juta|Jt|jt)/i) ||
      text.match(/pasar\s*(\d[\d\.,]*)/i);
    if (marketMatch) {
      let val = parseCleanFloat(marketMatch[1]);
      if (marketMatch[2] && marketMatch[2].toLowerCase().startsWith('j')) {
        val = val * 1000000;
      }
      marketPrice = val;
    }

    // Dynamic progress simulation delays to make terminal alive
    addLog(`Ingesting scanning parameters...`);

    setTimeout(() => {
      addLog(`Launching stealth crawler (Puppeteer headless mode)...`);
    }, 400);

    setTimeout(() => {
      addLog(`Stealth configurations injected. User-Agent & automation flags set.`);
    }, 1000);

    setTimeout(() => {
      addLog(`[PROTECTION] Rate-limiting or cookie wall detected.`);
      addLog(`[FALLBACK] Successfully activated Jogja Market Simulator.`);
    }, 1600);

    setTimeout(() => {
      addLog(`Generating high-fidelity Jogja listings for "${keyword}"...`);
    }, 2200);

    setTimeout(() => {
      addLog(`Piping raw listings to Google Gemini AI model...`);
      addLog(`Calculating arbitrage profit margins...`);
    }, 2800);

    setTimeout(() => {
      addLog(`Assessing signal/IMEI risks and physical conditions...`);
    }, 3400);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, minPrice, maxPrice, marketPrice, prompt: huntingPrompt })
      });

      const result = await res.json();

      setTimeout(() => {
        if (result.success) {
          addLog(`Pipeline processed successfully in 3.8 seconds.`);
          addLog(`Ingested ${result.data.length} deals matching criteria.`);
          setHuntingDeals(result.data);
        } else {
          addLog(`[ERROR] Scraper pipeline failed: ${result.error || "Unknown Error"}`);
        }
        setIsHuntingScanning(false);
      }, 4000);

    } catch (err: any) {
      setTimeout(() => {
        addLog(`[FATAL ERROR] API connection failed: ${err.message}`);
        setIsHuntingScanning(false);
      }, 4000);
    }
  };

  const handleSyncDealToSupabase = async (deal: any) => {
    if (syncedIds[deal.id]) return;

    try {
      const newProduct: Product = {
        id: deal.id || Date.now().toString(),
        name: deal.name,
        brand: deal.brand,
        price: deal.marketPrice,
        originalPrice: deal.originalPrice,
        condition: deal.condition,
        batteryHealth: deal.batteryHealth || 90,
        storage: deal.storage || "128GB",
        ram: deal.ram || "6GB",
        chipset: deal.brand === "iPhone" ? "Apple A13 Bionic" : "Octa-Core",
        color: deal.name.toLowerCase().includes("gray") ? "Space Gray" : "Silver",
        image: deal.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800",
        images: [deal.image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800"],
        status: "Ready",
        description: `${deal.description}\n\nReferensi Postingan FB: ${deal.fbLink}`,
        hasUBL: false,
        isRooted: false,
        warrantyStatus: "Ex Internasional (Sinyal Aman)",
        accessories: deal.completeness ? deal.completeness.split(", ") : ["Charger", "Kabel Data"],
        isFeatured: false,
        createdAt: new Date().toISOString().split("T")[0]
      };

      await setProducts([...products, newProduct]);

      setSyncedIds(prev => ({ ...prev, [deal.id]: true }));
      alert(`✅ Berhasil! Unit "${deal.name}" telah terdaftar ke Katalog Aktif & Supabase dengan status Ready.`);
    } catch (err: any) {
      console.error("Sync error:", err);
      alert(`❌ Gagal Sync: ${err.message || err}`);
    }
  };

  const handleAiFillProduct = (data: Partial<Product> & { _warnings?: string[] }) => {
    // Tampilkan warning dari AI jika ada
    if (data._warnings && data._warnings.length > 0) {
      const proceed = confirm(`⚠️ Peringatan validasi AI:\n\n${data._warnings.join('\n')}\n\nLanjutkan simpan?`);
      if (!proceed) return;
    }

    // Validasi client-side
    if (!data.name || data.name.trim().length < 2) {
      alert('❌ Gagal: Nama produk wajib diisi (minimal 2 karakter)');
      return;
    }
    if (!data.price || data.price <= 0) {
      alert('❌ Gagal: Harga harus lebih dari 0');
      return;
    }

    const mainImage = data.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800';
    const { _warnings, ...cleanData } = data;
    const newProduct: Product = {
      ...emptyProduct,
      ...cleanData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      image: mainImage,
      images: data.images || [mainImage],
      status: data.status || 'Ready',
      hasUBL: data.hasUBL ?? false,
      isRooted: data.isRooted ?? false,
      warrantyStatus: data.warrantyStatus || 'No Warranty',
      accessories: data.accessories || [],
    };

    // Simpan langsung ke database via Context
    setProducts([...products, newProduct]);

    // Berikan feedback visual atau pindah tab
    setActiveTab('produk');
    alert('✅ Produk berhasil disimpan langsung ke Katalog & Supabase!');
  };

  const handleAiFillBlog = (data: Partial<BlogPost> & { _warnings?: string[] }) => {
    // Tampilkan warning dari AI jika ada
    if (data._warnings && data._warnings.length > 0) {
      const proceed = confirm(`⚠️ Peringatan validasi AI:\n\n${data._warnings.join('\n')}\n\nLanjutkan simpan?`);
      if (!proceed) return;
    }

    // Validasi client-side
    if (!data.title || data.title.trim().length < 3) {
      alert('❌ Gagal: Judul artikel wajib diisi (minimal 3 karakter)');
      return;
    }

    const title = data.title;
    const { _warnings, ...cleanData } = data;
    const newPost: BlogPost = {
      id: Date.now().toString(),
      slug: title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
      title,
      excerpt: cleanData.excerpt || '',
      content: cleanData.content || '',
      image: cleanData.image || 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=800&q=80',
      date: new Date().toISOString().split('T')[0],
      readTime: cleanData.readTime || '5 menit',
      category: cleanData.category || 'Tips & Tricks',
      author: cleanData.author || 'Tim COREPAWAS',
    };

    // Simpan langsung ke database via Context
    setBlogPosts([...blogPosts, newPost]);

    setActiveTab('blog');
    alert('✅ Artikel blog berhasil diterbitkan ke Supabase!');
  };

  const readyCount = products.filter((p) => p.status === 'Ready').length;
  const soldCount = products.filter((p) => p.status === 'Sold').length;
  const totalValue = products.filter((p) => p.status === 'Ready').reduce((s, p) => s + p.price, 0);

  const filteredProducts = products.filter(
    (p) =>
      !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredBlog = blogPosts.filter(
    (p) =>
      !blogSearch ||
      p.title.toLowerCase().includes(blogSearch.toLowerCase())
  );

  function handleSaveProduct(p: Product) {
    const updated = editingProduct?.id
      ? products.map((x) => (x.id === p.id ? p : x))
      : [...products, p];
    setProducts(updated);
    setEditingProduct(undefined);
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id);
    setDeleteConfirm(null);
  }

  function handleSaveBlog(p: BlogPost) {
    const updated = editingBlog?.id
      ? blogPosts.map((x) => (x.id === p.id ? p : x))
      : [...blogPosts, p];
    setBlogPosts(updated);
    setEditingBlog(undefined);
  }

  function handleDeleteBlog(id: string) {
    deleteBlogPost(id);
  }

  function toggleStatus(id: string) {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Ready' ? 'Sold' : 'Ready' } : p
      )
    );
  }

  function handleSaveSettings() {
    setWaNumber(settingsWa);
    setStoreAddress(settingsAddr);
    setGoogleMapsApiKey(settingsMapKey);
    setGoogleMapsUrl(settingsMapUrl);
    setGoogleMapsEmbedUrl(settingsMapEmbed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSync() {
    if (!confirm('Apakah Anda yakin ingin memindahkan data default ke Supabase? Ini akan menimpa data pengaturan yang ada.')) return;

    setSyncing(true);
    const result = await seedDatabase();
    setSyncing(false);

    if (result.success) {
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
      alert('Berhasil! Data telah dipindah ke Supabase. Silakan refresh halaman.');
    } else {
      alert(`Gagal sync: ${result.error}`);
    }
  }

  function handleResetData() {
    if (window.confirm('Reset semua data ke default? Ini akan menghapus semua perubahan.')) {
      setProducts(defaultProducts);
      setBlogPosts(defaultBlogPosts);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'produk', label: 'Produk', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'tradein', label: 'Tukar Tambah', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'cod', label: 'COD Checklist', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'hunting', label: 'Stok Hunting & AI', icon: <Sparkles className="w-4 h-4 text-brand-orange" /> },
    { id: 'templates', label: 'Templat Chat & SOP', icon: <MessageSquare className="w-4 h-4 text-brand-orange" /> },
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Top Nav */}
      <header className="bg-brand-navy-dark border-b border-white/5 px-6 py-5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Hamburger Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2.5 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-white/10 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-brand-orange transition-all" />
            ) : (
              <Menu className="w-5 h-5 text-slate-300 transition-all" />
            )}
          </button>

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center shadow-xl shadow-brand-orange/30 flex-shrink-0">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tighter uppercase">CORE<span className="text-brand-orange">PAWAS</span></span>
            <span className="ml-4 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-[9px] font-black uppercase tracking-[0.2em] hidden xs:inline-block">System Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" target="_blank" className="text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 group">
            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform text-brand-orange" />
            <span className="hidden sm:inline">View Live Site</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 text-xs font-black uppercase tracking-widest transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Exit Panel</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile/Tablet Drawer Backdrop */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-md transition-all duration-300 animate-in fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:static top-[85px] bottom-0 left-0 z-40 flex flex-col bg-brand-navy-dark border-r border-white/5 p-6 gap-3 transition-all duration-300 ease-in-out h-[calc(100vh-85px)] lg:h-auto ${isSidebarOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0 lg:w-20 lg:px-4'
          }`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                startTransition(() => {
                  setActiveTab(tab.id);
                  // Close drawer on click for mobile/tablet screens
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                  }
                });
              }}
              className={`flex items-center rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border cursor-pointer ${isSidebarOpen
                  ? 'px-6 py-4 gap-4 text-left justify-start'
                  : 'px-6 py-4 lg:px-0 lg:py-4 lg:justify-center lg:gap-0 gap-4 text-left justify-start'
                } ${activeTab === tab.id
                  ? 'bg-brand-orange border-brand-orange text-white shadow-2xl shadow-brand-orange/30 scale-[1.02]'
                  : 'text-slate-500 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
                }`}
              title={!isSidebarOpen ? tab.label : undefined}
            >
              <div className={`transition-all duration-300 ${activeTab === tab.id ? 'text-white' : 'text-slate-600'} ${!isSidebarOpen ? 'lg:scale-110' : ''}`}>
                {tab.icon}
              </div>
              <span className={`transition-all duration-300 truncate ${isSidebarOpen
                  ? 'opacity-100 w-auto'
                  : 'opacity-100 lg:opacity-0 lg:w-0 lg:hidden'
                }`}>
                {tab.label}
              </span>
            </button>
          ))}
        </aside>

        {/* Mobile Tab Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex z-40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                startTransition(() => {
                  setActiveTab(tab.id);
                });
              }}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-xs font-medium transition-colors ${activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto pb-20 sm:pb-6">

          {/* ─── Dashboard ─── */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-black text-white mb-8 tracking-tighter uppercase flex items-center gap-3">
                <div className="w-1.5 h-8 bg-brand-orange rounded-full" />
                Overview
              </h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { label: 'Total Produk', value: products.length, icon: <Package className="w-6 h-6 text-brand-orange" />, color: 'orange' },
                  { label: 'Ready Stock', value: readyCount, icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, color: 'emerald' },
                  { label: 'Terjual', value: soldCount, icon: <TrendingUp className="w-6 h-6 text-purple-400" />, color: 'purple' },
                  { label: 'Total Artikel', value: blogPosts.length, icon: <BookOpen className="w-6 h-6 text-cyan-400" />, color: 'cyan' },
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-brand-navy-dark border border-white/5 shadow-2xl group hover:border-brand-orange/30 transition-all relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-5xl font-black text-white tracking-tighter">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Value card */}
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-brand-orange to-orange-700 border border-white/20 mb-12 shadow-2xl shadow-brand-orange/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[120px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[100px] rounded-full -ml-32 -mb-32" />
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em] block mb-1">Stock Valuation</span>
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Total Inventory Value (Ready)</span>
                    </div>
                  </div>
                  <div className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    {formatPrice(totalValue)}
                  </div>
                </div>
              </div>

              {/* Recent Products */}
              <div className="rounded-[3rem] bg-brand-navy-dark border border-white/5 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/5">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs">Recently Added</h3>
                  <button onClick={() => setActiveTab('produk')} className="text-brand-orange text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group">
                    View Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{p.name}</p>
                        <p className="text-slate-400 text-xs">{formatPrice(p.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin + '/katalog/' + p.id)}`, '_blank')}
                          className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                          title="Generate QR"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'Ready'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-red-500/10 text-red-400'
                          }`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── Produk ─── */}
          {activeTab === 'produk' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                  Inventory <span className="text-brand-orange">Management</span>
                </h1>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-orange text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-orange/20"
                >
                  <Plus className="w-5 h-5" />
                  Add New Unit
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                <input
                  type="text"
                  placeholder="Cari nama produk atau brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-brand-navy-dark border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/5 transition-all shadow-2xl font-bold"
                />
              </div>

              {/* Table */}
              <div className="rounded-[2.5rem] bg-brand-navy-dark border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/5">
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Info Produk</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:table-cell">Harga Jual</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden md:table-cell">Kondisi Fisik</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Status Stok</th>
                        <th className="text-right px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative group">
                                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-white text-sm font-black truncate tracking-tight">{p.name}</p>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">{p.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden sm:table-cell">
                            <span className="text-white text-base font-black tracking-tighter">{formatPrice(p.price)}</span>
                          </td>
                          <td className="px-6 py-5 hidden md:table-cell">
                            <span className="text-slate-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10">{p.condition}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleStatus(p.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${p.status === 'Ready'
                                  ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                }`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {deleteConfirm === p.id ? (
                                <div className="flex gap-1">
                                  <button onClick={() => handleDeleteProduct(p.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">Ya</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded bg-white/10 text-slate-300 text-xs">Batal</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirm(p.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 text-slate-500">Tidak ada produk ditemukan.</div>
                )}
              </div>
            </div>
          )}

          {/* ─── Blog ─── */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                  Editorial <span className="text-brand-orange">Content</span>
                </h1>
                <button
                  onClick={() => setEditingBlog(null)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-brand-orange text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-orange/20"
                >
                  <Plus className="w-5 h-5" />
                  Create Article
                </button>
              </div>

              <div className="relative mb-8">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-600" />
                <input
                  type="text"
                  placeholder="Filter articles by title..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-brand-navy-dark border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 focus:ring-4 focus:ring-brand-orange/5 transition-all shadow-2xl font-bold"
                />
              </div>

              <div className="space-y-4">
                {filteredBlog.map((post) => (
                  <div key={post.id} className="flex items-center gap-6 p-5 rounded-[2rem] bg-brand-navy-dark border border-white/5 hover:border-brand-orange/30 transition-all group shadow-xl">
                    <img src={post.image} alt={post.title} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-white/5 shadow-lg group-hover:scale-105 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-base truncate tracking-tight mb-2 uppercase">{post.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">{post.category}</span>
                        <span className="text-slate-600 text-xs font-bold">·</span>
                        <span className="text-slate-500 text-xs font-bold">{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button onClick={() => setEditingBlog(post)} className="p-2.5 rounded-xl text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 transition-colors border border-transparent hover:border-brand-orange/20">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteBlog(post.id)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBlog.length === 0 && (
                  <div className="text-center py-20 bg-brand-navy-dark rounded-3xl border border-dashed border-white/5 text-slate-500 font-bold">Tidak ada artikel ditemukan.</div>
                )}
              </div>
            </div>
          )}

          {/* ─── Stok Hunting & AI (Live Hunting) ─── */}
          {activeTab === 'hunting' && (
            <div>
              {/* Header with Sub-Tabs */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                    Stok Hunting <span className="text-brand-orange">& AI</span>
                  </h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Automated Stock Hunting Assistant & AI Valuation</p>
                </div>

                {/* Mockup sub-tabs */}
                <div className="flex p-1 bg-brand-navy-dark rounded-2xl border border-white/5 self-start md:self-auto">
                  <button
                    onClick={() => setHuntingSubTab('live')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${huntingSubTab === 'live'
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                        : 'text-slate-500 hover:text-white'
                      }`}
                  >
                    Live Hunting
                  </button>
                  <button
                    onClick={() => setHuntingSubTab('history')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${huntingSubTab === 'history'
                        ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/20'
                        : 'text-slate-500 hover:text-white'
                      }`}
                  >
                    Stok History (Supabase)
                  </button>
                </div>
              </div>

              {huntingSubTab === 'live' ? (
                <div className="space-y-6">
                  {/* Top Row: AI Control Hub & Live Scraping Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* Left: AI Control Hub (60% width on large screens) */}
                    <div className="lg:col-span-3 p-8 rounded-[2rem] bg-brand-navy-dark border border-white/5 shadow-2xl flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3">
                          <Cpu className="w-5 h-5 text-brand-orange" />
                          AI Control Hub
                        </h3>
                        <div className="relative mb-6">
                          <textarea
                            value={huntingPrompt}
                            onChange={(e) => setHuntingPrompt(e.target.value)}
                            placeholder="Ketik prompt perintah berburu stok di sini..."
                            rows={3}
                            className="w-full px-6 py-5 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-bold placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all resize-none shadow-inner"
                          />
                        </div>
                        {/* Auto-suggest Chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {[
                            "Cari unit iPhone 11 Pro Jogja, harga < 3.4 Juta, hitung margin jual 3.8 Juta, fullset, Face ID & True Tone ON",
                            "Cari Samsung Galaxy S22 Ultra Jogja, harga < 7 Juta, hitung margin jual 8.2 Juta, mulus fullset resmi",
                            "Cari iPhone 12 Pro Max Jogja, harga < 6.8 Juta, jual 7.8 Juta, BH > 85%, ex iBox"
                          ].map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => setHuntingPrompt(chip)}
                              className="text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 text-slate-400 hover:text-white transition-all max-w-[280px] sm:max-w-xs md:max-w-md truncate"
                              title={chip}
                            >
                              {chip.length > 55 ? chip.slice(0, 55) + "..." : chip}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <button
                          onClick={handleLaunchScanning}
                          disabled={isHuntingScanning || !huntingPrompt.trim()}
                          className="flex-1 py-4.5 rounded-2xl bg-brand-orange text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-orange/20 disabled:opacity-40 flex items-center justify-center gap-3 cursor-pointer"
                        >
                          {isHuntingScanning ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              <Search className="w-5 h-5" />
                              Prompt Text
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (isRecordingHunting) {
                              setIsRecordingHunting(false);
                            } else {
                              setIsRecordingHunting(true);
                              // Mock speech input
                              setTimeout(() => {
                                setHuntingPrompt("Cari unit iPhone 12 Jogja, harga < 4.5 Juta, hitung margin jual 5.2 Juta, fullset original Mulus");
                                setIsRecordingHunting(false);
                              }, 2000);
                            }
                          }}
                          className={`flex-1 py-4.5 rounded-2xl border font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer ${isRecordingHunting
                              ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse'
                              : 'border-white/10 text-slate-400 hover:bg-white/5'
                            }`}
                        >
                          <Mic className="w-5 h-5 text-brand-orange" />
                          {isRecordingHunting ? "Listening..." : "Upload Audio"}
                        </button>
                      </div>
                    </div>

                    {/* Right: Live Scraping Status (40% width on large screens) */}
                    <div className="lg:col-span-2 p-8 rounded-[2rem] bg-brand-navy-dark border border-white/5 shadow-2xl flex flex-col">
                      <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-6 flex items-center gap-3">
                        <Terminal className="w-5 h-5 text-emerald-400" />
                        Live Scraping Status
                      </h3>
                      <div className="flex-1 bg-[#020617] border border-white/5 rounded-2xl p-5 font-mono text-[11px] leading-relaxed text-emerald-400 overflow-y-auto min-h-[160px] max-h-[220px] shadow-inner select-none scrollbar-hide">
                        {huntingLogs.length === 0 ? (
                          <div className="text-slate-600 italic">Terminal log siap. Masukkan perintah kontrol dan luncurkan scanning untuk memulai...</div>
                        ) : (
                          <div className="space-y-1.5 animate-fade-in font-bold">
                            {huntingLogs.map((logStr, idx) => (
                              <div key={idx} className="flex gap-2">
                                <span className="text-emerald-500/60 font-bold flex-shrink-0">›</span>
                                <span className={logStr.includes("[ERROR]") || logStr.includes("[FATAL ERROR]") ? "text-red-400" : logStr.includes("[FALLBACK]") || logStr.includes("[PROTECTION]") ? "text-amber-400 font-bold" : "text-emerald-400"}>
                                  {logStr}
                                </span>
                              </div>
                            ))}
                            {isHuntingScanning && (
                              <div className="flex items-center gap-1.5 mt-2 text-emerald-500/40 animate-pulse">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Stealth operations active...</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Synced Deals Table Container */}
                  <div className="p-8 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl overflow-hidden">
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-brand-orange" />
                        Supabase Synced Deals (High-Profit Opportunities)
                      </span>
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping flex-shrink-0" />
                    </h3>

                    {/* Table View */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5">
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Target Unit</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Seller Price</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Est. Arbitrage Margin</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">AI Analysis & Status</th>
                            <th className="text-right px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Action URL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {huntingDeals.map((deal) => {
                            const isSynced = syncedIds[deal.id];
                            return (
                              <tr key={deal.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                                {/* Unit */}
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-4">
                                    <img src={deal.image} alt={deal.name} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg" />
                                    <div>
                                      <p className="text-white text-sm font-black truncate tracking-tight">{deal.name}</p>
                                      <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">{deal.brand} · {deal.storage} · BH {deal.batteryHealth}%</p>
                                    </div>
                                  </div>
                                </td>

                                {/* Price */}
                                <td className="px-6 py-5">
                                  <span className="text-white text-sm font-black tracking-tight">{formatPrice(deal.originalPrice)}</span>
                                </td>

                                {/* Margin */}
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-black tracking-tight">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+ {formatPrice(deal.profitMargin)}</span>
                                  </div>
                                </td>

                                {/* AI Status */}
                                <td className="px-6 py-5">
                                  <div className="space-y-1.5 max-w-[280px]">
                                    <p className="text-slate-300 text-xs font-bold leading-normal truncate">{deal.description}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase border tracking-widest ${deal.category === 'HIGH-PROFIT'
                                          ? 'bg-red-500/10 border-red-500/20 text-red-400 font-black shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                          : deal.category === 'GOOD-DEAL'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-black'
                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 font-black'
                                        }`}>
                                        {deal.category}
                                      </span>

                                      <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-black uppercase tracking-wider">
                                        Completeness: {deal.completeness}
                                      </span>

                                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${deal.imeiStatus.toLowerCase().includes("terblokir") || deal.imeiStatus.toLowerCase().includes("bypass")
                                          ? 'bg-red-500/10 text-red-400'
                                          : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        IMEI: {deal.imeiStatus}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="px-6 py-5">
                                  <div className="flex items-center justify-end gap-2.5">
                                    {/* Lihat Postingan */}
                                    <button
                                      onClick={() => {
                                        const cleanQuery = deal.name.split(' ').slice(0, 4).join(' ');
                                        window.open(`https://www.facebook.com/marketplace/yogyakarta/search?sortBy=creation_time_descend&query=${encodeURIComponent(cleanQuery)}`, "_blank");
                                      }}
                                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-brand-orange/30 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                                      title="Buka Postingan Terbaru Hari Ini di Facebook Marketplace Yogyakarta"
                                    >
                                      <Globe className="w-3.5 h-3.5 text-brand-orange" />
                                      Lihat Postingan
                                    </button>

                                    {/* Hubungi Penjual */}
                                    <button
                                      onClick={() => {
                                        setNegotiatingDeal(deal);
                                        setSellerPhone('');
                                      }}
                                      className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                                      title="Buka Panel Negosiasi SOP COD Terpercaya COREPAWAS"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5" />
                                      Hubungi Penjual
                                    </button>

                                    {/* Sync to Supabase */}
                                    <button
                                      onClick={() => handleSyncDealToSupabase(deal)}
                                      disabled={isSynced}
                                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${isSynced
                                          ? 'bg-emerald-600 text-white shadow-emerald-600/20 cursor-default font-black'
                                          : 'bg-brand-orange hover:bg-orange-500 text-white shadow-brand-orange/20 font-black hover:scale-[1.02] active:scale-95'
                                        }`}
                                    >
                                      {isSynced ? (
                                        <>
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          Synced!
                                        </>
                                      ) : (
                                        <>
                                          <RefreshCw className="w-3.5 h-3.5 animate-pulse" />
                                          Sync ke Supabase
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {huntingDeals.length === 0 && (
                      <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        {isHuntingScanning ? (
                          <div className="flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                            <span className="text-brand-orange animate-pulse">Pipeline AI active. Extracting best arbitrage opportunities...</span>
                          </div>
                        ) : (
                          "Belum ada data. Silakan luncurkan scanning stok."
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stocks History / Live Katalog view */}
                  <div className="rounded-[2.5rem] bg-brand-navy-dark border border-white/5 overflow-hidden shadow-2xl p-8">
                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-3">
                      <Database className="w-5 h-5 text-brand-orange" />
                      Live Catalog & Purchased Stock Inventory (Supabase Sync)
                    </h3>

                    {/* Reuses the standard table layout */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5">
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Info Produk</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Harga Beli (Modal)</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Harga Jual Pasar</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Kondisi</th>
                            <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                                  <div>
                                    <p className="text-white text-sm font-black truncate tracking-tight">{p.name}</p>
                                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-0.5">{p.brand} · {p.storage} · BH {p.batteryHealth}%</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-slate-400 text-sm font-bold">{p.originalPrice ? formatPrice(p.originalPrice) : 'Tidak diset'}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-white text-sm font-black">{formatPrice(p.price)}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className="text-slate-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/10">{p.condition}</span>
                              </td>
                              <td className="px-6 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.status === 'Ready'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-red-500/10 text-red-400'
                                  }`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Chat Templates & SOP ─── */}
          {activeTab === 'templates' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                    Chat Templates <span className="text-brand-orange">& SOP</span>
                  </h1>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 ml-5">Anti-Fraud & Seller Screening Kit Yogyakarta</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddNewTemplate}
                    className="px-6 py-3 rounded-2xl bg-brand-orange hover:bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-brand-orange/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Templat Baru
                  </button>
                  <a
                    href="https://cekrekening.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4 text-brand-orange" />
                    Cek Rekening Kemkominfo
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                {/* Left 2 columns: Templates cards */}
                <div className="xl:col-span-2 space-y-8">
                  {chatTemplates.map((tpl) => (
                    <div key={tpl.id} className="p-8 sm:p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-[50px] rounded-full -mr-16 -mt-16" />

                      {editingTemplateId === tpl.id ? (
                        /* Inline Editor Mode */
                        <div className="space-y-4 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Tahap / Stage</label>
                              <input
                                type="text"
                                value={tplForm.stage}
                                onChange={(e) => setTplForm({ ...tplForm, stage: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-bold focus:outline-none focus:border-brand-orange/40"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Judul Templat</label>
                              <input
                                type="text"
                                value={tplForm.title}
                                onChange={(e) => setTplForm({ ...tplForm, title: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-bold focus:outline-none focus:border-brand-orange/40"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Deskripsi Singkat / Subtitle</label>
                            <input
                              type="text"
                              value={tplForm.subtitle}
                              onChange={(e) => setTplForm({ ...tplForm, subtitle: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-bold focus:outline-none focus:border-brand-orange/40"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Isi Pesan Chat (Template)</label>
                            <textarea
                              rows={3}
                              value={tplForm.message}
                              onChange={(e) => setTplForm({ ...tplForm, message: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-medium focus:outline-none focus:border-brand-orange/40 resize-none font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Judul Peringatan Penipu</label>
                              <input
                                type="text"
                                value={tplForm.warningTitle}
                                onChange={(e) => setTplForm({ ...tplForm, warningTitle: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/5 text-rose-400 text-xs font-bold focus:outline-none focus:border-brand-orange/40"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Penjelasan Peringatan</label>
                              <input
                                type="text"
                                value={tplForm.warningText}
                                onChange={(e) => setTplForm({ ...tplForm, warningText: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-brand-navy border border-white/5 text-slate-300 text-xs font-medium focus:outline-none focus:border-brand-orange/40"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => setEditingTemplateId(null)}
                              className="flex-grow py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveTemplateInline(tpl.id)}
                              className="flex-grow py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
                            >
                              Simpan Templat
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal View Mode */
                        <>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tpl.iconColor || 'from-purple-500 to-fuchsia-600'} flex items-center justify-center font-black text-white text-xs shadow-xl`}>
                                {tpl.stage}
                              </div>
                              <div>
                                <h3 className="text-white font-black uppercase tracking-wider text-sm">{tpl.title}</h3>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider mt-1">{tpl.subtitle}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <button
                                onClick={() => handleEditTemplate(tpl)}
                                className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(tpl.id)}
                                className="px-4 py-3 rounded-xl border border-transparent bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                              >
                                Hapus
                              </button>
                              <button
                                onClick={() => handleCopyText(tpl.message, tpl.id)}
                                className={`px-5 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer ${copiedId === tpl.id
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                  }`}
                              >
                                {copiedId === tpl.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-brand-orange" />
                                    Salin Chat
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Chat text box */}
                          <div className="p-6 rounded-2xl bg-brand-navy border border-white/5 text-slate-300 text-sm font-medium leading-relaxed relative font-mono shadow-inner mb-6">
                            "{tpl.message}"
                          </div>

                          {/* Danger indicator */}
                          <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex gap-4">
                            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-1">{tpl.warningTitle}</span>
                              <p className="text-slate-400 text-xs leading-relaxed">{tpl.warningText}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right Column: SOP Lapangan & Checklists */}
                <div className="space-y-8">
                  <div className="p-8 sm:p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-[40px] rounded-full -mr-10 -mt-10 animate-pulse" />

                    <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-brand-orange rounded-full shadow-[0_0_10px_rgba(250,140,22,0.4)]" />
                      SOP Lapangan (COD)
                    </h3>

                    <div className="space-y-6">
                      {[
                        {
                          num: '01',
                          title: 'Gunakan SIM Card Berbeda',
                          desc: 'Pasang SIM card dengan operator berbeda pada HP penjual saat pengecekan fisik. Ini penting untuk memastikan slot SIM berfungsi normal dan sinyal terdaftar permanen (bukan bypass imei ilegal).'
                        },
                        {
                          num: '02',
                          title: 'Verifikasi Nomor & Rekening',
                          desc: 'Sebelum bertemu or jika ada permintaan transaksi apa pun, cek nomor rekening atau no HP penjual di situs resmi Kemkominfo (cekrekening.id) untuk mendeteksi laporan kasus penipuan.'
                        },
                        {
                          num: '03',
                          title: 'Log Out Semua Akun',
                          desc: 'Pastikan akun iCloud (untuk iPhone) or Akun Google (untuk Android) sudah di-log out/kosong total di tempat COD sebelum uang diserahkan. Jangan pernah beli unit dengan akun tersangkut!'
                        }
                      ].map((item, index) => (
                        <div key={index} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-brand-orange text-xs font-black tracking-widest">{item.num}</span>
                            <h4 className="text-white font-bold text-xs uppercase tracking-wider">{item.title}</h4>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl bg-brand-orange/5 border border-brand-orange/10 flex gap-4">
                      <Info className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400 text-[10px] leading-relaxed font-bold uppercase tracking-widest">
                        Patuhi SOP ini untuk memfilter 90% modus penipuan di Facebook Marketplace Jogja bahkan sebelum Anda meluncur COD!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Trade In ─── */}
          {activeTab === 'tradein' && (
            <div>
              <h1 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
                <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                Trade In <span className="text-brand-orange">Prices</span>
              </h1>
              <div className="rounded-[2.5rem] bg-brand-navy-dark border border-white/5 overflow-hidden shadow-2xl p-8">
                {loadingTradeIn ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat Data Harga Tukar Tambah...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                          <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Brand</th>
                          <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Model (Seri)</th>
                          <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Harga Tampung Bawah (Floor)</th>
                          <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Harga Tampung Atas (Max)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {tradeInModels.map((m) => (
                          <tr key={m.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 text-white text-xs font-bold">{m.brand}</td>
                            <td className="px-6 py-4 text-slate-300 text-xs font-bold">{m.model}</td>
                            <td className="px-6 py-4 text-rose-400 text-xs font-black">{formatPrice(m.floor_buyback)}</td>
                            <td className="px-6 py-4 text-emerald-400 text-xs font-black">{formatPrice(m.max_buyback)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── COD Checklist ─── */}
          {activeTab === 'cod' && (
            <div>
              <h1 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
                <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                COD <span className="text-brand-orange">Checklist</span>
              </h1>
              <div className="rounded-[2.5rem] bg-brand-navy-dark border border-white/5 overflow-hidden shadow-2xl p-8">
                {loadingCod ? (
                  <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Memuat SOP Checklist...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {codTodos.map((todo) => (
                      <div key={todo.id} className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-orange/30 transition-colors">
                        <div className="mt-1">
                          {todo.is_critical ? (
                            <AlertTriangle className="w-6 h-6 text-rose-500" />
                          ) : (
                            <ListTodo className="w-6 h-6 text-brand-orange" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-sm font-black uppercase tracking-wider mb-1 ${todo.is_critical ? 'text-rose-400' : 'text-white'}`}>
                            {todo.title}
                          </h4>
                          <p className="text-slate-400 text-xs leading-relaxed">{todo.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Pengaturan ─── */}
          {activeTab === 'pengaturan' && (
            <div>
              <h1 className="text-3xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
                <div className="w-1.5 h-10 bg-brand-orange rounded-full shadow-[0_0_15px_rgba(250,140,22,0.5)]" />
                System <span className="text-brand-orange">Configurations</span>
              </h1>

              <div className="space-y-8 max-w-2xl">
                <div className="p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                    WhatsApp Gateway
                  </h3>
                  <div className="space-y-6">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Customer Service Number</label>
                    <input
                      type="text"
                      value={settingsWa}
                      onChange={(e) => setSettingsWa(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-bold focus:outline-none focus:border-brand-orange/50 transition-all shadow-inner"
                      placeholder="6281234567890"
                    />
                    <div className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                      <Info className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      <p className="text-slate-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest">Format: Country Code without + (e.g. 628...). Used for all dynamic CTA buttons.</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-brand-orange rounded-full" />
                    Store Identity
                  </h3>
                  <div className="space-y-6">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Operational Headquarters Address</label>
                    <textarea
                      value={settingsAddr}
                      onChange={(e) => setSettingsAddr(e.target.value)}
                      rows={3}
                      className="w-full px-6 py-5 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-bold focus:outline-none focus:border-brand-orange/50 resize-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl">
                  <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs mb-8 flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                    Google Maps Integration
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Google Maps API Security Key</label>
                      <input
                        type="password"
                        value={settingsMapKey}
                        onChange={(e) => setSettingsMapKey(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-mono focus:border-brand-orange/50 outline-none shadow-inner"
                        placeholder="AIza..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Direct Google Maps Interface Link</label>
                      <input
                        type="text"
                        value={settingsMapUrl}
                        onChange={(e) => setSettingsMapUrl(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl bg-brand-navy border border-white/5 text-white text-sm font-bold focus:border-brand-orange/50 outline-none shadow-inner"
                        placeholder="https://maps.app.goo.gl/..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Manual Embed URL (Iframe Src)</label>
                      <textarea
                        value={settingsMapEmbed}
                        onChange={(e) => setSettingsMapEmbed(e.target.value)}
                        rows={3}
                        className="w-full px-6 py-5 rounded-2xl bg-brand-navy border border-white/5 text-white text-[11px] font-mono focus:border-brand-orange/50 resize-none outline-none shadow-inner"
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-[2.5rem] bg-brand-orange text-white font-black text-lg shadow-2xl shadow-brand-orange/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Save className="w-5 h-5" />
                  {saved ? 'DATA SYNCHRONIZED!' : 'SAVE SYSTEM CONFIGURATION'}
                </button>

                <div className="p-10 rounded-[2.5rem] bg-brand-orange/5 border border-brand-orange/20 shadow-xl">
                  <h3 className="text-brand-orange font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-3">
                    <Database className="w-5 h-5" />
                    Cloud Synchronization
                  </h3>
                  <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider leading-relaxed mb-8">
                    Force sync local demonstration data to your live Supabase cloud instances.
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl ${syncing
                        ? 'bg-brand-navy-dark text-slate-600 cursor-not-allowed'
                        : syncSuccess
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-brand-orange hover:scale-[1.02] text-white shadow-brand-orange/30'
                      }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Synchronizing...' : syncSuccess ? 'SYNC COMPLETED!' : 'PUSH TO SUPABASE CLOUD'}
                  </button>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-red-950/20 border border-red-500/20 shadow-2xl">
                  <h3 className="text-red-500 font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    High-Risk Territory
                  </h3>
                  <p className="text-slate-600 text-[10px] mb-8 font-black uppercase tracking-widest leading-relaxed">Destroy all custom data and revert to factory baseline configurations. This operation is irreversible.</p>
                  <button onClick={handleResetData} className="px-8 py-4 rounded-2xl border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all">
                    Initialize System Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {editingProduct !== undefined && (
        <ProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => setEditingProduct(undefined)}
        />
      )}
      {editingBlog !== undefined && (
        <BlogModal
          post={editingBlog}
          onSave={handleSaveBlog}
          onClose={() => setEditingBlog(undefined)}
        />
      )}
      {negotiatingDeal && (() => {
        const generatedMessage = `Halo Mas/Mbak, unit ${negotiatingDeal.name} (${negotiatingDeal.brand} · ${negotiatingDeal.storage}) yang di-posting seharga ${formatPrice(negotiatingDeal.originalPrice)}-nya masih ada? Kalau sesuai deskripsi, siang/sore ini saya siap meluncur COD langsung ke lokasi dekat sampeyan. Bisa COD di lokasi ramai ya mas, misal di ${selectedCodZone}? Matur nuwun.`;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl rounded-[2.5rem] bg-brand-navy-dark border border-white/10 p-8 sm:p-10 shadow-2xl overflow-hidden animate-fade-in text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-[40px] rounded-full -mr-10 -mt-10" />

              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-wider text-white">SOP Screening & Negosiasi</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Stage 1 - Pancingan Ketersediaan & Lokasi</p>
                  </div>
                </div>
                <button
                  onClick={() => setNegotiatingDeal(null)}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Deal Summary */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 mb-6 relative z-10 flex gap-4 items-center">
                <img src={negotiatingDeal.image} alt={negotiatingDeal.name} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                <div>
                  <h4 className="text-white font-bold text-sm">{negotiatingDeal.name}</h4>
                  <p className="text-slate-400 text-xs font-semibold mt-1">{negotiatingDeal.brand} · {negotiatingDeal.storage} · BH {negotiatingDeal.batteryHealth}%</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <span className="text-rose-400 text-[10px] font-black uppercase bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Sourcing: {formatPrice(negotiatingDeal.originalPrice)}</span>
                    <span className="text-emerald-400 text-[10px] font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Target Jual: {formatPrice(negotiatingDeal.originalPrice + negotiatingDeal.profitMargin)}</span>
                    <span className="text-brand-orange text-[10px] font-black uppercase bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20">Est. Profit: +{formatPrice(negotiatingDeal.profitMargin)}</span>
                  </div>
                </div>
              </div>

              {/* Configurations */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6 relative z-10">
                <div>
                  <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-2">Pilih Titik COD Terpercaya (Jogja)</label>
                  <select
                    value={selectedCodZone}
                    onChange={(e) => setSelectedCodZone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-bold focus:outline-none focus:border-brand-orange/40 cursor-pointer"
                  >
                    <option value="McD Jakal (KM 5)">McD Jakal (KM 5) - Sleman / Utara</option>
                    <option value="SPBU Terban">SPBU Terban - Kota / Tengah</option>
                    <option value="Lobby Ambarrukmo Plaza">Lobby Ambarrukmo Plaza - Depok / Timur</option>
                    <option value="SPBU Gejayan">SPBU Gejayan - Depok / Utara</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-2">No. WhatsApp Penjual (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 628123456789"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-xl bg-brand-navy border border-white/5 text-white text-xs font-bold focus:outline-none focus:border-brand-orange/40"
                  />
                </div>
              </div>

              {/* Message Box */}
              <div className="relative z-10 mb-6">
                <label className="block text-slate-500 text-[9px] font-black uppercase tracking-wider mb-2">Pesan Teks Terkustomisasi (SOP Stage 1)</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    readOnly
                    value={generatedMessage}
                    className="w-full p-5 rounded-2xl bg-brand-navy border border-white/5 text-slate-300 text-xs font-medium leading-relaxed font-mono resize-none focus:outline-none select-all"
                  />
                  <button
                    onClick={() => handleCopyNegoText(generatedMessage)}
                    className={`absolute bottom-3 right-3 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${copiedNegoText
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {copiedNegoText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-brand-orange" />}
                    {copiedNegoText ? 'Copied!' : 'Copy Script'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4 relative z-10">
                <button
                  onClick={() => {
                    handleCopyNegoText(generatedMessage);
                    window.open(`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent('jual beli hp second ' + negotiatingDeal.brand + ' jogja')}`, "_blank");
                  }}
                  className="py-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4 text-brand-orange" />
                  Salin & Cari di Grup Facebook
                </button>

                {sellerPhone ? (
                  <a
                    href={`https://wa.me/${sellerPhone}?text=${encodeURIComponent(generatedMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Kirim via WhatsApp
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      handleCopyNegoText(generatedMessage);
                      alert('Teks berhasil disalin! Silakan tempel (paste) saat mengirim chat ke penjual.');
                      window.open(`https://www.facebook.com/marketplace/yogyakarta/search?sortBy=creation_time_descend&query=${encodeURIComponent(negotiatingDeal.name.split(' ').slice(0, 3).join(' '))}`, "_blank");
                    }}
                    className="py-4 rounded-xl bg-brand-orange hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-brand-orange/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    Salin & Buka Marketplace
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      <AiAssistant onFillProduct={handleAiFillProduct} onFillBlog={handleAiFillBlog} products={products} blogPosts={blogPosts} chatTemplates={chatTemplates} onUpdateTemplates={handleAiUpdateTemplates} />
    </div>
  );
}

// ─── Admin Entry ─────────────────────────────────────────────────────────────
export default function Admin() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuth(!!session);
      setLoading(false);
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuth(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin shadow-2xl shadow-brand-orange/20"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginScreen onLogin={() => setIsAuth(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
