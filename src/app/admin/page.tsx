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
  BarChart3,
  TrendingUp,
  Package,
  MessageSquare,
  MapPin,
  Database,
  RefreshCw,
  Upload,
  Loader2,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { Product, defaultProducts } from '@/data/products';
import { BlogPost, defaultBlogPosts } from '@/data/blog';
import { seedDatabase } from '@/lib/seed';
import AiAssistant from '@/components/AiAssistant';
import { addWatermark } from '@/lib/watermark';


type Tab = 'dashboard' | 'produk' | 'blog' | 'pengaturan';

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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin COREPAWAS</h1>
          <p className="text-slate-400 text-sm mt-1">Silakan masuk dengan akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-500 text-xs mb-1.5 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="admin@corepawas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-slate-500 text-xs mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-navy to-brand-orange text-white font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-brand-orange/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk ke Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/" className="text-orange-400 hover:text-white text-sm font-bold transition-colors">
            ← Kembali ke Website
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-white font-bold text-lg">{product ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Nama Produk *</label>
            <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
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

        <div className="flex gap-3 p-5 border-t border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors">
            Batal
          </button>
          <button onClick={handleSave}
            disabled={!form.name || !form.price || !form.image}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Simpan
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
    { id: 'pengaturan', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Top Nav */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight">COREPAWAS</span>
            <span className="ml-3 px-2 py-0.5 rounded-md bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" target="_blank" className="text-slate-300 hover:text-white text-sm font-bold transition-all flex items-center gap-2 group">
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Lihat Web</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-red-400 text-sm font-bold transition-all group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden sm:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                startTransition(() => {
                  setActiveTab(tab.id);
                });
              }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all text-left border ${
                activeTab === tab.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20 scale-[1.02]'
                  : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`${activeTab === tab.id ? 'text-white' : 'text-slate-500'}`}>
                {tab.icon}
              </div>
              {tab.label}
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
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 text-xs font-medium transition-colors ${
                activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'
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
              <h1 className="text-xl font-black text-white mb-6">Overview</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Produk', value: products.length, icon: <Package className="w-6 h-6 text-blue-400" />, color: 'blue' },
                  { label: 'Ready Stock', value: readyCount, icon: <CheckCircle className="w-6 h-6 text-emerald-400" />, color: 'emerald' },
                  { label: 'Terjual', value: soldCount, icon: <TrendingUp className="w-6 h-6 text-purple-400" />, color: 'purple' },
                  { label: 'Total Artikel', value: blogPosts.length, icon: <BookOpen className="w-6 h-6 text-cyan-400" />, color: 'cyan' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                      <div className="p-2 rounded-xl bg-slate-800 group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-4xl font-black text-white tracking-tight">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Value card */}
               <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 mb-10 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-blue-100 text-xs font-black uppercase tracking-[0.2em]">Total Nilai Stok Ready</span>
                  </div>
                  <div className="text-5xl font-black text-white tracking-tighter drop-shadow-sm">
                    {formatPrice(totalValue)}
                  </div>
                </div>
              </div>

              {/* Recent Products */}
               <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm">Produk Terbaru</h3>
                  <button onClick={() => setActiveTab('produk')} className="text-blue-400 text-xs font-black uppercase tracking-widest hover:text-blue-300 transition-colors">Lihat Semua</button>
                </div>
                <div className="divide-y divide-slate-800">
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Ready'
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
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Kelola Produk</h1>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Produk
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari nama produk atau brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner font-medium"
                />
              </div>

              {/* Table */}
              <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-800/50 border-b border-slate-700">
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Info Produk</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden sm:table-cell">Harga Jual</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hidden md:table-cell">Kondisi Fisik</th>
                        <th className="text-left px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Status Stok</th>
                        <th className="text-right px-6 py-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative group">
                                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-700 shadow-lg group-hover:scale-105 transition-transform" />
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
                            <span className="text-slate-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">{p.condition}</span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleStatus(p.id)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                                p.status === 'Ready'
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
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              {deleteConfirm === p.id ? (
                                <div className="flex gap-1">
                                  <button onClick={() => handleDeleteProduct(p.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs font-bold">Ya</button>
                                  <button onClick={() => setDeleteConfirm(null)} className="px-2 py-1 rounded bg-slate-700 text-slate-300 text-xs">Batal</button>
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
                <h1 className="text-2xl font-black text-white tracking-tight uppercase">Kelola Blog</h1>
                <button
                  onClick={() => setEditingBlog(null)}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Artikel
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari judul artikel..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner font-medium"
                />
              </div>

              <div className="space-y-4">
                {filteredBlog.map((post) => (
                  <div key={post.id} className="flex items-center gap-6 p-5 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all group shadow-xl">
                    <img src={post.image} alt={post.title} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-800 shadow-lg group-hover:scale-105 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-base truncate tracking-tight mb-2 uppercase">{post.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">{post.category}</span>
                        <span className="text-slate-600 text-xs font-bold">·</span>
                        <span className="text-slate-500 text-xs font-bold">{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button onClick={() => setEditingBlog(post)} className="p-2.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-500/20">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteBlog(post.id)} className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBlog.length === 0 && (
                  <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 text-slate-500 font-bold">Tidak ada artikel ditemukan.</div>
                )}
              </div>
            </div>
          )}

          {/* ─── Pengaturan ─── */}
          {activeTab === 'pengaturan' && (
            <div>
              <h1 className="text-2xl font-black text-white mb-8 tracking-tight uppercase">Pengaturan Toko</h1>

              <div className="space-y-6 max-w-2xl">
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                    Integrasi WhatsApp
                  </h3>
                  <div className="space-y-4">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">Nomor Tujuan Konsultasi</label>
                    <input
                      type="text"
                      value={settingsWa}
                      onChange={(e) => setSettingsWa(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="6281234567890"
                    />
                    <div className="flex gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                      <Info className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <p className="text-slate-500 text-[10px] leading-relaxed font-bold">Format harus menggunakan kode negara tanpa tanda + (cth: 628...). Nomor ini akan digunakan untuk semua tombol "Tanya via WA".</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    Identitas Toko
                  </h3>
                  <div className="space-y-4">
                    <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest">Alamat Lengkap Operasional</label>
                    <textarea
                      value={settingsAddr}
                      onChange={(e) => setSettingsAddr(e.target.value)}
                      rows={3}
                      className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-bold focus:outline-none focus:border-blue-500 resize-none transition-all"
                    />
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
                  <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-red-500 rounded-full" />
                    Konfigurasi Google Maps
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Google Maps API Key</label>
                      <input
                        type="password"
                        value={settingsMapKey}
                        onChange={(e) => setSettingsMapKey(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-mono focus:border-blue-500 outline-none"
                        placeholder="AIza..."
                      />
                      <p className="text-slate-500 text-[10px] mt-2 font-bold italic">
                        *Dibutuhkan untuk performa map yang stabil.
                      </p>
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Direct Google Maps Link</label>
                      <input
                        type="text"
                        value={settingsMapUrl}
                        onChange={(e) => setSettingsMapUrl(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-sm font-bold focus:border-blue-500 outline-none"
                        placeholder="https://maps.app.goo.gl/..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Manual Embed URL (Iframe Src)</label>
                      <textarea
                        value={settingsMapEmbed}
                        onChange={(e) => setSettingsMapEmbed(e.target.value)}
                        rows={3}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white text-[11px] font-mono focus:border-blue-500 resize-none outline-none"
                        placeholder="https://www.google.com/maps/embed?..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-[2rem] bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  {saved ? 'DATA BERHASIL DISIMPAN!' : 'SIMPAN SEMUA PERUBAHAN'}
                </button>

                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                  <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database Sync
                  </h3>
                  <p className="text-slate-400 text-sm mb-5">
                    Gunakan fitur ini untuk memindahkan data awal (Produk & Blog) dari sistem ke database Supabase Anda jika tabel masih kosong.
                  </p>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      syncing 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : syncSuccess
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Memindahkan Data...' : syncSuccess ? 'Data Terkirim!' : 'Sync Data ke Supabase'}
                  </button>
                </div>

                <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/20">
                  <h3 className="text-red-500 font-black uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Zona Bahaya
                  </h3>
                  <p className="text-slate-500 text-[11px] mb-6 font-bold leading-relaxed">Menghapus semua data kustom Anda dan mengembalikan sistem ke kondisi awal (demo data). Tindakan ini tidak dapat dibatalkan.</p>
                  <button onClick={handleResetData} className="px-6 py-3 rounded-xl border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Reset Database ke Default
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
      <AiAssistant onFillProduct={handleAiFillProduct} onFillBlog={handleAiFillBlog} />
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginScreen onLogin={() => setIsAuth(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
