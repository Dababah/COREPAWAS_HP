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
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
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
    <div className="overflow-x-hidden bg-[#020617]">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-32 pb-24 px-4 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-pulse-slow opacity-20"
          />
          <div className="absolute inset-0 bg-[#020617]/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/20 via-transparent to-[#020617]" />
        </div>

        {/* Animated Glows (Habitline style) */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] glow-navy animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] glow-orange animate-pulse delay-1000" />

        <div className="relative z-10 max-w-6xl mx-auto text-center tilt-3d">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs sm:text-sm font-black mb-8 animate-fade-in-up">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <span className="tracking-widest uppercase">Halo Kak! Selamat Datang di Core Pawas</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
            Teman Setia Cari <br />
            <span className="text-gradient">Gadget Pilihan.</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Takut kena prank beli HP bekas? Tenang, di <b className="text-orange-400">COREPAWAS</b> nggak ada drama. 
            Kita siap jadi temen diskusi biar kamu dapet unit berkualitas dengan harga jujur!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/katalog"
              className="group relative px-10 py-5 rounded-[2rem] bg-brand-orange text-white font-black text-xl shadow-2xl shadow-brand-orange/40 hover:bg-orange-500 hover:-translate-y-2 transition-all duration-500 w-full sm:w-auto overflow-hidden"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <Smartphone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Lihat Katalog HP
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>

            <a
              href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20stok%20HP%20second.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 backdrop-blur-xl transition-all w-full sm:w-auto flex items-center gap-3 justify-center shadow-2xl"
            >
              <WhatsAppIcon className="w-6 h-6" />
              Tanya WhatsApp
            </a>
          </div>

          {/* Highlight Stats (Habitline Bento Style) */}
          <div className="mt-20 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md hover:border-brand-orange/30 transition-all">
              <div className="text-3xl sm:text-5xl font-black text-white">{readyCount}+</div>
              <div className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black mt-2">Ready</div>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md hover:border-brand-orange/30 transition-all">
              <div className="text-3xl sm:text-5xl font-black text-white">{soldCount}+</div>
              <div className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black mt-2">Terjual</div>
            </div>
            <div className="p-6 rounded-[2rem] bg-brand-orange/10 border border-brand-orange/20 backdrop-blur-md">
              <div className="text-3xl sm:text-5xl font-black text-brand-orange">100%</div>
              <div className="text-brand-orange/60 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black mt-2">Aman</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── USP / WHY CHOOSE (Bento Grid) ─── */}
      <section className="py-24 sm:py-32 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-navy/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-sm font-black uppercase tracking-widest mb-6">
              Kenapa COREPAWAS?
            </span>
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter">
              Bukan Sekedar Jual HP, <br />
              <span className="text-gradient">Kami Jual Ketenangan.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
              Modal kejujuran dan keahlian teknisi membuat kami berbeda dari penjual HP second pada umumnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspItems.map((item, i) => (
              <div
                key={i}
                className="bento-card p-8 group flex flex-col h-full"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-brand-orange/20 group-hover:border-brand-orange/30 group-hover:scale-110 transition-all duration-500">
                  {/* We need to update the icons to use brand colors */}
                  <div className="text-brand-orange">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-orange transition-colors tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium mb-4">{item.desc}</p>
                <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-6 h-6 text-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 sm:py-32 bg-white/5 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 gap-6">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-black uppercase tracking-widest mb-6">
                🔥 Unit Terlaris
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tighter">Ready Stock Sekarang</h2>
              <p className="text-slate-400 mt-4 text-lg font-medium">Unit-unit berikut sudah melalui inspeksi lengkap dan siap dimiliki.</p>
            </div>
            <Link href="/katalog"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:text-brand-orange font-black transition-all hover:bg-white/10"
            >
              Lihat Semua <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showFeaturedBadge />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
              <Smartphone className="w-16 h-16 mx-auto mb-6 opacity-20" />
              <p className="text-xl font-bold">Belum ada unit featured.</p>
            </div>
          )}
        </div>
      </section>

      <Testimonials />

      {/* ─── HOW IT WORKS (Timeline Bento) ─── */}
      <section className="py-24 sm:py-32 bg-[#020617]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter">Cara Beli di COREPAWAS</h2>
            <p className="text-slate-400 text-lg font-medium">Prosesnya mudah, aman, dan sangat transparan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="bento-card p-10 text-center h-full hover:bg-brand-navy-dark/80">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-orange to-white opacity-20 group-hover:opacity-40 transition-opacity mb-6">
                    {s.step}
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-orange transition-colors">{s.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER (Habitline Style) ─── */}
      <section className="py-24 sm:py-32 bg-[#020617] px-6">
        <div className="max-w-6xl mx-auto rounded-[3rem] bg-gradient-to-br from-brand-navy to-brand-navy-dark p-12 sm:p-24 text-center relative overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(11,53,94,0.5)]">
          <div className="absolute top-0 right-0 w-96 h-96 glow-orange opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 glow-navy opacity-40" />
          
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
              Siap Dapatkan <br />
              HP Impianmu?
            </h2>
            <p className="text-blue-100 text-lg sm:text-2xl mb-12 max-w-2xl mx-auto font-medium opacity-80">
              Stok terbatas. Hubungi sekarang untuk konsultasi gratis dan cek ketersediaan unit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/katalog"
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-white text-brand-navy font-black text-xl hover:bg-brand-orange hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
              >
                Lihat Katalog <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/${waNumber}?text=Halo%20Kak%20CORE%20PAWAS!%20Mau%20konsultasi%20budget%20dan%20spek%20HP%20dong`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-white/10 border border-white/20 text-white font-black text-xl hover:bg-white/20 transition-all backdrop-blur-xl flex items-center justify-center gap-3"
              >
                <WhatsAppIcon className="w-6 h-6" /> Chat Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CONSULTATION CTA ─── */}
      <section className="py-24 sm:py-32 bg-[#020617] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-24 h-24 rounded-3xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-brand-orange/10 animate-float-premium">
            <MessageSquare className="w-12 h-12 text-brand-orange" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-8 tracking-tighter">
            Masih Bingung Pilih yang Mana?
          </h2>
          <p className="text-slate-400 text-xl sm:text-2xl mb-12 italic font-medium leading-relaxed">
            "Mau sekadar tanya spek atau konsultasi budget? Chat aja dulu yuk, Kak, jangan sungkan!"
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Halo%20Kak%20CORE%20PAWAS!%20Mau%20tanya-tanya%20santai%20soal%20gadget%20dong`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 rounded-[2.5rem] bg-gradient-to-r from-brand-navy to-brand-orange text-white font-black text-2xl shadow-[0_20px_50px_rgba(240,90,40,0.3)] hover:scale-105 transition-all"
          >
            <WhatsAppIcon className="w-8 h-8" /> Chat Sekarang
          </a>
        </div>
      </section>
    </div>6" /> Chat Sekarang di WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
