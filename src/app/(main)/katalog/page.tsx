"use client";
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Smartphone, ChevronRight, ArrowRight, Filter, SortAsc } from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';

const BRANDS = ['Semua', 'iPhone', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Realme', 'Other'];
const CONDITIONS = ['Semua', 'Like New', 'Very Good', 'Good'];
const STATUSES = ['Semua', 'Ready', 'Sold'];
const PRICE_RANGES = [
  { label: 'Semua Harga', min: 0, max: Infinity },
  { label: 'Di bawah Rp 2 juta', min: 0, max: 2000000 },
  { label: 'Rp 2 – 3 juta', min: 2000000, max: 3000000 },
  { label: 'Rp 3 – 4 juta', min: 3000000, max: 4000000 },
  { label: 'Rp 4 – 5 juta', min: 4000000, max: 5000000 },
  { label: 'Di atas Rp 5 juta', min: 5000000, max: Infinity },
];

export default function Katalog() {
  const { products, loading } = useData();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('Semua');
  const [condition, setCondition] = useState('Semua');
  const [status, setStatus] = useState('Semua');
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.chipset.toLowerCase().includes(q)
      );
    }

    if (brand !== 'Semua') result = result.filter((p) => p.brand === brand);
    if (condition !== 'Semua') result = result.filter((p) => p.condition === condition);
    if (status !== 'Semua') result = result.filter((p) => p.status === status);

    const range = PRICE_RANGES[priceRange];
    result = result.filter((p) => p.price >= range.min && p.price <= range.max);

    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'battery':
        result.sort((a, b) => b.batteryHealth - a.batteryHealth);
        break;
    }

    return result;
  }, [products, search, brand, condition, status, priceRange, sortBy]);

  const readyCount = filtered.filter((p) => p.status === 'Ready').length;

  function resetFilters() {
    setSearch('');
    setBrand('Semua');
    setCondition('Semua');
    setStatus('Semua');
    setPriceRange(0);
    setSortBy('newest');
  }

  const hasActiveFilters =
    search || brand !== 'Semua' || condition !== 'Semua' || status !== 'Semua' || priceRange !== 0;

  return (
    <div className="min-h-screen bg-background pt-24 sm:pt-32 pb-24">
      {/* Header Section */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Explore Collection
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
            Katalog <span className="text-gradient">Unit Pilihan.</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl leading-relaxed">
            Daftar unit berkualitas yang sudah melalui inspeksi teknisi kami. <span className="text-white font-black italic">"{readyCount} unit tersedia untuk Anda."</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
            <input
              type="text"
              placeholder="Cari iPhone, Samsung, atau tipe lainnya..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-card border border-border text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all shadow-xl"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 py-5 rounded-2xl border font-black uppercase tracking-widest text-xs transition-all flex-shrink-0 shadow-xl ${
                showFilters || hasActiveFilters
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-card border-border text-muted-foreground hover:border-white/20'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters {hasActiveFilters && `(${[brand, condition, status, priceRange].filter(x => x !== 'Semua' && x !== 0).length + (search ? 1 : 0)})`}
            </button>

            <div className="relative flex-shrink-0">
               <SortAsc className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
               <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-10 py-5 rounded-2xl bg-card border border-border text-white font-black uppercase tracking-widest text-[10px] focus:outline-none focus:border-brand-orange/50 cursor-pointer shadow-xl appearance-none"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="battery">Battery Terbaik</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-12 p-10 rounded-[3rem] bg-card border border-border shadow-2xl animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand Filter */}
              <div>
                <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-6">Brand / Merk</label>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        brand === b
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-6">Kondisi Fisik</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        condition === c
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-6">Status Unit</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        status === s
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] mb-6">Rentang Harga</label>
                <div className="space-y-2">
                  {PRICE_RANGES.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setPriceRange(i)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                        priceRange === i
                          ? 'bg-brand-orange border-brand-orange text-white'
                          : 'bg-white/5 border-white/5 text-muted-foreground hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-3 text-slate-500 hover:text-brand-orange text-xs font-black uppercase tracking-widest transition-all group"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count & Active Badge */}
        <div className="flex items-center justify-between mb-10">
          <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">
            Showing <span className="text-white">{filtered.length}</span> Results
          </p>
          {hasActiveFilters && (
             <span className="text-[10px] font-black text-brand-orange bg-brand-orange/10 px-4 py-1.5 rounded-full border border-brand-orange/20 uppercase tracking-widest animate-pulse">
              Active Filters Applied
            </span>
          )}
        </div>

        {/* Product Grid */}
        <div className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-card rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10">
                <Smartphone className="w-12 h-12 text-slate-700" />
              </div>
              <h3 className="text-white text-3xl font-black mb-4 tracking-tighter">Unit Tidak Ditemukan</h3>
              <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto font-medium">Sepertinya unit yang kamu cari belum ada di stok kami. Coba reset filter atau hubungi admin.</p>
              <button
                onClick={resetFilters}
                className="px-12 py-5 rounded-2xl bg-brand-orange text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-brand-orange/20"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

