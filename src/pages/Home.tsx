import { Link } from 'react-router';
import {
  ShieldCheck,
  Cpu,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Lock,
  Database,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

const HERO_BG = 'https://images.unsplash.com/photo-1697545806245-9795b6056141?w=1400&q=80';
const TECHNICIAN_IMG = 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=800&q=80';

const uspItems = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
    title: 'Deep Inspection Teknisi',
    desc: 'Setiap unit dicek dengan 3uTools, Antutu, dan stress test 30 menit. Kami verifikasi keaslian komponen: layar, baterai, kamera.',
  },
  {
    icon: <Lock className="w-6 h-6 text-cyan-400" />,
    title: 'Cek UBL & Root Status',
    desc: 'Kami transparan soal status Unlock Bootloader dan Root. Kamu berhak tahu kondisi asli HP sebelum beli.',
  },
  {
    icon: <Database className="w-6 h-6 text-purple-400" />,
    title: 'Gratis Migrasi Data',
    desc: 'Beli HP di sini, pindah semua data lama kamu gratis: kontak, foto, WhatsApp, hingga setup akun.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Edukasi Keamanan HP',
    desc: 'Setiap pembeli mendapat edukasi cara mengamankan HP baru: aktifkan 2FA, setup Find My Device, dan tips privasi.',
  },
];

const steps = [
  { step: '01', title: 'Pilih Unit', desc: 'Browse katalog kami, filter berdasarkan budget dan brand pilihanmu.' },
  { step: '02', title: 'Lihat Laporan Inspeksi', desc: 'Setiap unit dilengkapi transparency report: screenshot 3uTools dan hasil benchmark.' },
  { step: '03', title: 'Tanya via WhatsApp', desc: 'Hubungi kami, tanya kondisi lebih detail atau minta video call untuk lihat unit langsung.' },
  { step: '04', title: 'Deal & Migrasi', desc: 'Transaksi aman, langsung dapat layanan gratis migrasi data di tempat.' },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function Home() {
  const { products, blogPosts, waNumber } = useData();
  const featuredProducts = products.filter((p) => p.isFeatured);
  const readyCount = products.filter((p) => p.status === 'Ready').length;
  const soldCount = products.filter((p) => p.status === 'Sold').length;

  return (
    <div className="overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* BG */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-blue-950/80" />
        </div>

        {/* Floating glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center py-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium mb-6">
            <Cpu className="w-4 h-4" />
            Inspeksi Level Teknisi — No Tipu-Tipu
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Gadget Second{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Kualitas Teknisi.
            </span>{' '}
            <br />
            Deep Inspection,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              No Tipu-Tipu.
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Jual beli HP second dengan standar inspeksi teknisi berpengalaman. Setiap unit dicek 3uTools, Antutu
            benchmark, dan stress test. Transparansi adalah prioritas kami.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="text-center">
              <div className="text-3xl font-black text-white">{readyCount}+</div>
              <div className="text-slate-400 text-sm">Unit Ready</div>
            </div>
            <div className="w-px bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">{soldCount}+</div>
              <div className="text-slate-400 text-sm">Unit Terjual</div>
            </div>
            <div className="w-px bg-slate-700 hidden sm:block" />
            <div className="text-center">
              <div className="text-3xl font-black text-white">100%</div>
              <div className="text-slate-400 text-sm">Transparan</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/katalog"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-xl shadow-blue-500/30 flex items-center gap-2 justify-center"
            >
              <Smartphone className="w-5 h-5" />
              Lihat Katalog HP
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20stok%20HP%20second.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-lg hover:bg-slate-700 transition-colors flex items-center gap-2 justify-center"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── USP / WHY CHOOSE ─── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-3">
              Kenapa COREPAWAS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Bukan Sekedar Jual HP, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Kami Jual Ketenangan Pikiran
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Modal kejujuran dan keahlian teknisi membuat kami berbeda dari penjual HP second pada umumnya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspItems.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-3">
                🍞 Roti Tawar — Ready Stock
              </span>
              <h2 className="text-3xl font-black text-white">Unit Tersedia Sekarang</h2>
              <p className="text-slate-400 mt-1">Unit-unit berikut sudah melalui inspeksi lengkap dan siap dimiliki.</p>
            </div>
            <Link
              to="/katalog"
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showFeaturedBadge />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Belum ada unit featured. Cek katalog untuk semua stok.</p>
            </div>
          )}

          <div className="mt-8 sm:hidden text-center">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              Lihat Semua Katalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Cara Beli di COREPAWAS</h2>
            <p className="text-slate-400">Prosesnya mudah dan transparan.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-blue-500/50 to-transparent z-0" />
                )}
                <div className="relative p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECHNICIAN TRUST SECTION ─── */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img src={TECHNICIAN_IMG} alt="Teknisi COREPAWAS" className="w-full h-80 object-cover" />
              </div>
              {/* Badge floating */}
              <div className="absolute -bottom-5 -right-5 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">3uTools Verified</div>
                    <div className="text-slate-400 text-xs">Semua unit dicek</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                Transparansi Laporan
              </span>
              <h2 className="text-3xl font-black text-white mb-5">
                Kami Tunjukkan{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Semua Buktinya
                </span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Tidak hanya bilang "kondisi bagus", kami sertakan bukti nyata. Setiap produk dilengkapi transparency
                report berupa screenshot 3uTools yang menunjukkan keaslian komponen.
              </p>

              <ul className="space-y-3">
                {[
                  'Screenshot 3uTools — verifikasi komponen original',
                  'Hasil benchmark Antutu — performa CPU/GPU riil',
                  'Stress test 30 menit — tidak throttle berlebihan',
                  'Status UBL dan Root dicantumkan jelas',
                  'Battery health diukur akurat dengan tools',
                  'Cek iCloud OFF untuk iPhone',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to="/katalog"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
                >
                  Lihat Contoh Detail Produk <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─── */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-3">
                Edukasi & Tips
              </span>
              <h2 className="text-3xl font-black text-white">Biar Gak Ketipu Beli HP Second</h2>
            </div>
            <Link
              to="/edukasi"
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              Semua Artikel <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.id} to={`/edukasi/${post.slug}`} className="group">
                <div className="rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all bg-slate-900 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="text-slate-500 text-xs">{post.readTime} baca</span>
                    </div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Siap Dapatkan HP Impianmu?</h2>
          <p className="text-blue-100 mb-8">
            Stok terbatas. Hubungi sekarang untuk konsultasi gratis dan cek ketersediaan unit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/katalog"
              className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Lihat Semua Katalog
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20mau%20konsultasi%20beli%20HP%20second.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition-colors"
            >
              Chat Sekarang
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
