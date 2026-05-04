"use client";
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Smartphone, ChevronRight, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Product } from '@/data/products';

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
    <div className="min-h-screen bg-[#020617] pt-24 sm:pt-32 pb-24">
      {/* Header */}
      <div className="relative py-12 sm:py-20 overflow-hidden reveal">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] glow-navy opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 tilt-3d">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-6">
            Explore Collection
          </div>
          <h1 className="text-4xl sm:text-7xl font-black text-white mb-4 tracking-tighter">
            Katalog <span className="text-gradient">Unit Pilihan.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl">
            {readyCount} unit ready · <span className="text-white font-black italic">"Kualitas teknisi, harga teman."</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Search + controls (Bento Style) */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 reveal">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-brand-orange transition-colors" />
            <input
              type="text"
              placeholder="Cari nama HP, brand, atau chipset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-3xl bg-brand-navy-dark border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all shadow-2xl"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 py-5 rounded-3xl border font-black uppercase tracking-widest text-xs transition-all flex-shrink-0 shadow-2xl ${
                showFilters || hasActiveFilters
                  ? 'bg-brand-orange text-white border-brand-orange'
                  : 'bg-brand-navy-dark border-white/5 text-slate-400 hover:border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter {hasActiveFilters && `(${[brand, condition, status, priceRange].filter(x => x !== 'Semua' && x !== 0).length + (search ? 1 : 0)})`}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-5 rounded-3xl bg-brand-navy-dark border border-white/5 text-slate-400 font-black uppercase tracking-widest text-[10px] focus:outline-none focus:border-brand-orange/50 cursor-pointer shadow-2xl appearance-none pr-12 relative"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.2em' }}
            >
              <option value="newest">Terbaru</option>
              <option value="price_asc">Harga Terendah</option>
              <option value="price_desc">Harga Tertinggi</option>
              <option value="battery">Battery Terbaik</option>
            </select>
          </div>
        </div>

        {/* Filters panel (Bento Grid) */}
        {showFilters && (
          <div className="mb-12 p-8 sm:p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 shadow-2xl animate-fade-in-up reveal active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Brand</label>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        brand === b
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Kondisi</label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        condition === c
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        status === s
                          ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Harga</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300 text-sm font-bold focus:outline-none focus:border-brand-orange/50 appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                >
                  {PRICE_RANGES.map((r, i) => (
                    <option key={i} value={i}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-3 text-slate-500 hover:text-brand-orange text-xs font-black uppercase tracking-widest transition-all"
                >
                  <X className="w-4 h-4" />
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <div className="reveal">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">
                  <span className="text-white">{filtered.length}</span> Unit Ditemukan
                </p>
                {hasActiveFilters && (
                   <span className="text-[10px] font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20 animate-pulse">
                    Filter Aktif
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-32 bg-brand-navy-dark rounded-[3rem] border-2 border-dashed border-white/5">
              <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mx-auto mb-8">
                <Smartphone className="w-12 h-12 text-slate-700" />
              </div>
              <h3 className="text-white text-2xl font-black mb-4 tracking-tight">Unit Tidak Ditemukan</h3>
              <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">Sepertinya unit yang kamu cari belum ada di stok kami saat ini.</p>
              <button
                onClick={resetFilters}
                className="px-10 py-4 rounded-[2rem] bg-brand-orange text-white font-black uppercase tracking-widest text-sm hover:bg-orange-500 transition-all shadow-2xl shadow-brand-orange/20"
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
