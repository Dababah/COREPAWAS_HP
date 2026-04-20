"use client";
import Link from 'next/link';
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
  MessageSquare,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';

const HERO_BG = 'https://images.unsplash.com/photo-1697545806245-9795b6056141?w=1400&q=80';
const TECHNICIAN_IMG = 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=800&q=80';

const uspItems = [
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
    title: 'Kejujuran adalah Koentji',
    desc: 'Kami percaya hubungan baik dimulai dari keterbukaan. Kalau ada lecet dikit atau fungsi yang kurang maksimal, pasti langsung kami infoin di depan. Gak ada drama!',
  },
  {
    icon: <Lock className="w-6 h-6 text-cyan-400" />,
    title: 'QC Ketat, Hati Tenang',
    desc: 'Tiap unit sudah kami "manjakan" dengan pengecekan total. Mulai dari layar sampai lubang charger, semua dipastikan normal dan siap pakai buat harian.',
  },
  {
    icon: <Database className="w-6 h-6 text-purple-400" />,
    title: 'Pindah Data Gratis, Kak!',
    desc: 'Beli HP di sini gak perlu repot. Kami bantu pindahin data dari HP lama ke HP baru Kakak sampai tuntas: kontak, foto, sampai chat WhatsApp.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    title: 'Ngobrol Santai & Edukatif',
    desc: 'Bingung pilih tipe yang mana? Atau takut soal keamanan? Tenang Kak, kita bisa diskusi santai pakai bahasa sehari-hari. Anggap aja lagi ngobrol sama teman!',
  },
];

const steps = [
  { step: '01', title: 'Pilih Unit', desc: 'Pilih unit impianmu dari katalog kami di Jogja, sesuaikan dengan budget dan kebutuhan.' },
  { step: '02', title: 'Cek Transparansi', desc: 'Kami tunjukkan semua detail: status fisik, baterai, dan fungsi hardware secara jujur.' },
  { step: '03', title: 'Konsultasi WA', desc: 'Tanya apa saja, kami akan jawab dengan sejujur-jujurnya sesuai kondisi unit asli.' },
  { step: '04', title: 'Cod Jogja / Kirim', desc: 'Bisa langsung cek unit di lokasi kami di Jogja atau kirim aman ke seluruh Indonesia.' },
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
    <div className="overflow-x-hidden bg-slate-950">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 pb-24 px-4 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_BG} 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105 animate-pulse-slow opacity-40" 
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
        </div>

        {/* Animated Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-bold mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            HALO KAK! SELAMAT DATANG DI CORE PAWAS JOGJA
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
            Teman Setia Cari <br />
            <span className="text-gradient">Gadget Pilihan.</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Kami tahu banget rasanya pengen ganti HP tapi sering ragu sama kondisi barang bekas. 
            Di sini, kami bukan cuma sekadar jualan, tapi ingin jadi <b>teman diskusi</b> yang bisa kasih solusi buat kebutuhan gadget Kakak.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/katalog"
              className="group relative px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center gap-2">
                <Smartphone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Lihat Katalog HP
              </div>
            </Link>
            
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20stok%20HP%20second.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 backdrop-blur-md transition-all w-full sm:w-auto flex items-center gap-2 justify-center"
            >
              Tanya via WhatsApp
            </a>
          </div>

          {/* Highlight Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white">{readyCount}+</div>
              <div className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Ready</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white">{soldCount}+</div>
              <div className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Terjual</div>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-blue-400">100%</div>
              <div className="text-blue-500/60 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Aman</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── USP / WHY CHOOSE ─── */}
      <section className="py-12 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-3">
              Kenapa COREPAWAS?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4">
              Bukan Sekedar Jual HP, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Kami Jual Ketenangan Pikiran
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Modal kejujuran dan keahlian teknisi membuat kami berbeda dari penjual HP second pada umumnya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
      <section className="py-12 sm:py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-3">
                🍞 Roti Tawar — Ready Stock
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Unit Tersedia Sekarang</h2>
              <p className="text-slate-400 mt-1">Unit-unit berikut sudah melalui inspeksi lengkap dan siap dimiliki.</p>
            </div>
            <Link href="/katalog"
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <Link href="/katalog"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              Lihat Semua Katalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-12 sm:py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Cara Beli di COREPAWAS</h2>
            <p className="text-slate-400">Prosesnya mudah dan transparan.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
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
      <section className="py-12 sm:py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img src={TECHNICIAN_IMG} alt="Teknisi COREPAWAS" className="w-full h-80 object-cover" />
                <img src={TECHNICIAN_IMG} alt="COREPAWAS Jogja" className="w-full h-80 object-cover" />
              </div>
              {/* Badge floating */}
              <div className="absolute -bottom-5 -right-5 bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Terpercaya di Jogja</div>
                    <div className="text-slate-400 text-xs">Amanah & Transparan</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                Prinsip Kejujuran
              </span>
              <h2 className="text-3xl font-black text-white mb-5">
                Kondisi Unit{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Apa Adanya
                </span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Kami tidak suka berlebihan. Di COREPAWAS Jogja, kami melaporkan setiap lecet, kondisi baterai, dan minus fitur 
                secara detail sebelum kamu membeli. Kami percaya kejujuran adalah kunci hubungan jangka panjang.
              </p>

              <ul className="space-y-3">
                {[
                  'Laporan fisik unit yang sangat detail (jujur)',
                  'Cek kesehatan baterai secara transparan',
                  'Status software (UBL/Root) diinformasikan jelas',
                  'Pengecekan fungsi hardware menyeluruh',
                  'Gratis bantuan pindah data dan setup',
                  'Bisa COD atau cek langsung di lokasi Jogja',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link href="/katalog"
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
      <section className="py-12 sm:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6 sm:mb-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-3">
                Edukasi & Tips
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Biar Gak Ketipu Beli HP Second</h2>
            </div>
            <Link href="/edukasi"
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
            >
              Semua Artikel <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.id} href={`/edukasi/${post.slug}`} className="group">
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
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Siap Dapatkan HP Impianmu?</h2>
          <p className="text-blue-100 mb-8">
            Stok terbatas. Hubungi sekarang untuk konsultasi gratis dan cek ketersediaan unit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link 
              href="/katalog"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 group"
            >
              Lihat Katalog Unit <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20Kak%20CORE%20PAWAS!%20Mau%20konsultasi%20budget%20dan%20spek%20HP%20dong`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" /> Chat Santai Dulu, Yuk!
            </a>
          </div>
        </div>
      </section>
      <section className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
            Masih Bingung Pilih yang Mana?
          </h2>
          <p className="text-slate-400 text-lg mb-8 italic">
            "Mau sekadar tanya spek atau konsultasi budget? Chat aja dulu yuk, Kak, jangan sungkan!"
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Halo%20Kak%20CORE%20PAWAS!%20Mau%20tanya-tanya%20santai%20soal%20gadget%20dong`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xl shadow-2xl shadow-blue-500/25 hover:scale-105 transition-all"
          >
            <MessageSquare className="w-6 h-6" /> Chat Sekarang di WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
