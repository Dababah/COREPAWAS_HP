"use client";
import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useData } from '@/context/DataContext';
import { Product, defaultProducts } from '@/data/products';
import { BlogPost, defaultBlogPosts } from '@/data/blog';
import { seedDatabase } from '@/lib/seed';
import AiAssistant from '@/components/AiAssistant';


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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
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
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file terlalu besar (maks 10MB). Foto galeri HP biasanya berukuran besar.');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          throw new Error('Izin ditolak (RLS Violation). Pastikan bucket "product-images" sudah memiliki policy Public.');
        }
        throw error;
      };

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      set('image', publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError('Gagal upload: ' + (err.message || 'Error tidak diketahui'));
    } finally {
      setUploading(false);
    }
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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
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

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Foto Produk *</label>
            <div className="space-y-3">
              {/* Preview */}
              {form.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-700 bg-slate-800">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => set('image', '')}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="relative flex flex-col items-center justify-center w-full h-full min-h-[100px] border-2 border-dashed border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer group">
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        <span className="text-slate-400 text-xs">Mengupload...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 p-4">
                        <Upload className="w-6 h-6 text-slate-500 group-hover:text-blue-500 transition-colors" />
                        <span className="text-slate-400 text-xs font-medium">Klik untuk upload foto</span>
                        <span className="text-slate-600 text-[10px]">PNG, JPG up to 2MB</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" />
                  </label>
                </div>
                
                <div className="flex-1">
                  <div className="text-[10px] text-slate-500 mb-1 font-medium uppercase tracking-widest">Atau gunakan URL</div>
                  <input 
                    type="text" 
                    value={form.image} 
                    onChange={(e) => set('image', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    placeholder="https://google.com/image.jpg" 
                  />
                </div>
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
              { key: 'hasUBL', label: 'UBL Aktif' },
              { key: 'isRooted', label: 'Rooted' },
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
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
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

  const handleAiFillProduct = (data: any) => {
    setEditingProduct({
      ...emptyProduct,
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    });
    setActiveTab('produk');
  };

  const handleAiFillBlog = (data: any) => {
    setEditingBlog({
      id: Date.now().toString(),
      slug: data.title?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      date: new Date().toISOString().split('T')[0],
      author: 'Tim COREPAWAS',
      ...data,
    });
    setActiveTab('blog');
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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Nav */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-sm">COREPAWAS</span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-medium uppercase">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Lihat Web</span>
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden sm:flex flex-col w-52 bg-slate-900 border-r border-slate-800 p-3 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Mobile Tab Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex z-40">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
                  { label: 'Total Produk', value: products.length, icon: <Package className="w-5 h-5 text-blue-400" />, color: 'blue' },
                  { label: 'Ready Stock', value: readyCount, icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, color: 'emerald' },
                  { label: 'Terjual', value: soldCount, icon: <TrendingUp className="w-5 h-5 text-purple-400" />, color: 'purple' },
                  { label: 'Total Artikel', value: blogPosts.length, icon: <BookOpen className="w-5 h-5 text-cyan-400" />, color: 'cyan' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-slate-400 text-xs font-medium">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Value card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30 mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300 text-sm font-medium">Total Nilai Stok Ready</span>
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  {formatPrice(totalValue)}
                </div>
              </div>

              {/* Recent Products */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                  <h3 className="text-white font-bold">Produk Terbaru</h3>
                  <button onClick={() => setActiveTab('produk')} className="text-blue-400 text-sm hover:text-blue-300">Lihat Semua</button>
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black text-white">Kelola Produk</h1>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Produk
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              {/* Table */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Produk</th>
                        <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Harga</th>
                        <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Kondisi</th>
                        <th className="text-left px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="text-right px-4 py-3 text-slate-400 text-xs font-medium uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{p.name}</p>
                                <p className="text-slate-500 text-xs">{p.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-white text-sm font-semibold">{formatPrice(p.price)}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-slate-300 text-sm">{p.condition}</span>
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black text-white">Kelola Blog</h1>
                <button
                  onClick={() => setEditingBlog(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Artikel
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>

              <div className="space-y-3">
                {filteredBlog.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                    <img src={post.image} alt={post.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{post.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-purple-400 text-xs">{post.category}</span>
                        <span className="text-slate-500 text-xs">·</span>
                        <span className="text-slate-500 text-xs">{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => setEditingBlog(post)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBlog(post.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredBlog.length === 0 && (
                  <div className="text-center py-12 text-slate-500">Tidak ada artikel ditemukan.</div>
                )}
              </div>
            </div>
          )}

          {/* ─── Pengaturan ─── */}
          {activeTab === 'pengaturan' && (
            <div>
              <h1 className="text-xl font-black text-white mb-6">Pengaturan</h1>

              <div className="space-y-5 max-w-lg">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400" />
                    WhatsApp
                  </h3>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Nomor WhatsApp (tanpa +)</label>
                    <input
                      type="text"
                      value={settingsWa}
                      onChange={(e) => setSettingsWa(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="6281234567890"
                    />
                    <p className="text-slate-500 text-xs mt-1">Format: 628xxxxxxxxxx (tanpa spasi atau tanda +)</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    Informasi Toko
                  </h3>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Alamat Toko</label>
                    <textarea
                      value={settingsAddr}
                      onChange={(e) => setSettingsAddr(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Google Maps
                  </h3>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Google Maps API Key</label>
                    <input
                      type="password"
                      value={settingsMapKey}
                      onChange={(e) => setSettingsMapKey(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="AIza..."
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      Dibutuhkan untuk performa map yang stabil. Jika dikosongkan, akan menggunakan mode gratis (mungkin tidak stabil).
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Direct Google Maps Link (Share Link)</label>
                    <input
                      type="text"
                      value={settingsMapUrl}
                      onChange={(e) => setSettingsMapUrl(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
                      placeholder="https://maps.app.goo.gl/..."
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      Gunakan link share dari Google Maps (seperti short link) untuk tombol navigasi lokasi.
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider">Manual Embed URL (Standard Iframe Src)</label>
                    <textarea
                      value={settingsMapEmbed}
                      onChange={(e) => setSettingsMapEmbed(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 resize-none font-mono"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      Masukkan URL `src` dari kode iframe Google Maps. Metode ini paling stabil dan tidak memerlukan API key.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity"
                >
                  <Save className="w-4 h-4" />
                  {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
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

                <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                  <p className="text-slate-400 text-sm mb-4">Reset semua data produk dan blog ke kondisi awal (demo data).</p>
                  <button onClick={handleResetData} className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors">
                    Reset ke Data Default
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
