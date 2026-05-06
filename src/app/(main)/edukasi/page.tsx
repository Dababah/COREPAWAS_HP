"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

const categories = ['Semua', 'Tips & Tricks', 'Edukasi Teknis', 'Panduan'];

export default function Edukasi() {
  const { blogPosts } = useData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');

  const filtered = blogPosts.filter((post) => {
    const matchSearch =
      !search ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Semua' || post.category === category;
    return matchSearch && matchCategory;
  });

  const featured = blogPosts[0];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 px-6">
      {/* Header Section */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-8">
            Knowledge Center
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Belajar Biar <br />
            <span className="text-gradient">Nggak Tertipu.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
            Tips, panduan, dan edukasi teknis seputar gadget second langsung dari teknisi berpengalaman COREPAWAS.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Featured Post */}
        {featured && (
          <Link href={`/edukasi/${featured.slug}`} className="group block mb-16 sm:mb-24">
            <div className="grid lg:grid-cols-2 gap-0 rounded-[3.5rem] overflow-hidden border border-border bg-card hover:border-brand-orange/30 transition-all duration-500 shadow-2xl">
              <div className="h-64 sm:h-96 lg:h-auto overflow-hidden relative">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:hidden" />
              </div>
              <div className="p-8 sm:p-14 flex flex-col justify-center relative">
                <div className="absolute top-10 right-10 w-20 h-20 bg-brand-orange/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest">
                    FEATURED STORY
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                    {featured.category}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white group-hover:text-brand-orange transition-colors mb-6 leading-tight tracking-tighter">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-medium line-clamp-3">{featured.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center gap-6 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    <span>{formatDate(featured.date)}</span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-orange" />
                      {featured.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-2 text-brand-orange text-sm font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read More <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 items-center">
          <div className="w-full lg:flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-brand-orange transition-colors" />
            <input
              type="text"
              placeholder="Cari artikel edukasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-card border border-border text-white placeholder-slate-600 focus:outline-none focus:border-brand-orange/50 transition-all shadow-xl"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex-shrink-0 border ${
                  category === cat
                    ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/20'
                    : 'bg-card border-border text-muted-foreground hover:border-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link key={post.id} href={`/edukasi/${post.slug}`} className="group h-full">
                <div className="h-full rounded-[2.5rem] overflow-hidden border border-border bg-card hover:border-brand-orange/30 transition-all duration-500 hover:-translate-y-2 shadow-xl flex flex-col">
                  <div className="h-56 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-4 text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-orange" />
                        {post.readTime}
                      </span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-brand-orange transition-colors leading-tight mb-4 flex-1 line-clamp-2 tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-2 mb-8 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                      <span className="text-brand-orange text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                        View Article <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-card rounded-[4rem] border-2 border-dashed border-border flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8">
              <BookOpen className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-white text-3xl font-black mb-4 tracking-tighter">Artikel Tidak Ditemukan</h3>
            <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto font-medium">Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
            <button
              onClick={() => { setSearch(''); setCategory('Semua'); }}
              className="px-10 py-4 rounded-xl bg-brand-orange text-white font-black uppercase tracking-widest text-xs"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

