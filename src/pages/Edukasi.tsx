import { useState } from 'react';
import { Link } from 'react-router';
import { Search, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';

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
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Edukasi & Blog
          </span>
          <h1 className="text-4xl font-black text-white mb-3">
            Belajar Biar{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Gak Tertipu
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Tips, panduan, dan edukasi teknis seputar jual beli HP second dari teknisi berpengalaman.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Featured Post */}
        {featured && (
          <Link to={`/edukasi/${featured.slug}`} className="group block mb-12">
            <div className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-slate-800 hover:border-blue-500/40 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <div className="h-64 lg:h-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 bg-slate-900 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                    Artikel Terbaru
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                    {featured.category}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-slate-400 mb-5 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <span>{formatDate(featured.date)}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featured.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                    Baca Selengkapnya <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} to={`/edukasi/${post.slug}`} className="group">
                <div className="h-full rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50 flex flex-col">
                  <div className="h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500 text-xs">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors leading-snug mb-2 flex-1">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <span className="text-slate-500 text-xs">{formatDate(post.date)}</span>
                      <span className="text-blue-400 text-xs font-medium flex items-center gap-1">
                        Baca <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-14 h-14 text-slate-700 mx-auto mb-4" />
            <h3 className="text-slate-400 font-semibold mb-2">Artikel tidak ditemukan</h3>
            <p className="text-slate-500 text-sm">Coba cari dengan kata kunci lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
