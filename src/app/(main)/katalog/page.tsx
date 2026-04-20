"use client";
import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Smartphone } from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
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
  const { products } = useData();
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
    <div className="min-h-screen bg-slate-950 pt-14 sm:pt-16 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Katalog HP Second</h1>
          <p className="text-slate-400">
            {readyCount} unit ready ·{' '}
            <span className="text-blue-400">Semua sudah diinspeksi teknisi</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-5 sm:mt-8">
        {/* Search + controls */}
        <div className="flex flex-col gap-3 mb-5 sm:mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama HP, brand, atau chipset..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all flex-shrink-0 ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              )}
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer text-sm"
          >
            <option value="newest">Urutkan: Terbaru</option>
            <option value="price_asc">Harga: Terendah</option>
            <option value="price_desc">Harga: Tertinggi</option>
            <option value="battery">Battery Terbaik</option>
          </select>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6 p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Brand */}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Brand</label>
                <div className="flex flex-wrap gap-1.5">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        brand === b
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Kondisi</label>
                <div className="flex flex-wrap gap-1.5">
                  {CONDITIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        condition === c
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Status</label>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        status === s
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Harga</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
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
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <>
            <p className="text-slate-500 text-sm mb-4">{filtered.length} produk ditemukan</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Smartphone className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <h3 className="text-slate-400 font-semibold mb-2">Tidak ada produk ditemukan</h3>
            <p className="text-slate-500 text-sm mb-6">Coba ubah filter atau kata kunci pencarianmu.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
