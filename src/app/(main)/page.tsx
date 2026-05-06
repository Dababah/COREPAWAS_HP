"use client";
import Link from 'next/link';
import { 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Star, 
  MessageSquare,
  Lock,
  Database,
  ChevronRight,
  TrendingUp,
  Cpu,
  Trophy,
  Users
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import Testimonials from '@/components/Testimonials';

const HERO_BG = 'https://images.unsplash.com/photo-1697545806245-9795b6056141?w=1400&q=80';

const uspItems = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Kejujuran adalah Koentji',
    desc: 'Hubungan baik dimulai dari keterbukaan. Jika ada lecet atau fungsi kurang maksimal, kami infokan di depan. No drama!',
    color: 'orange'
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'QC Ketat, Hati Tenang',
    desc: 'Tiap unit melalui pengecekan total 50+ titik inspeksi. Dari layar sampai sensor, dipastikan siap pakai harian.',
    color: 'navy'
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Pindah Data Gratis',
    desc: 'Beli HP di sini gak perlu repot. Kami bantu pindahkan kontak, foto, sampai chat WhatsApp sampai tuntas.',
    color: 'orange'
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: 'Diskusi Edukatif',
    desc: 'Bingung pilih tipe? Tenang Kak, kita bisa diskusi santai. Anggap aja lagi ngobrol sama teman ahli gadget!',
    color: 'navy'
  },
];

export default function Home() {
  const { products, waNumber, loading } = useData();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);
  const readyCount = products.filter((p) => p.status === 'Ready').length;
  const soldCount = products.filter((p) => p.status === 'Sold').length;

  return (
    <div className="overflow-x-hidden bg-background">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-48 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-navy/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-orange/10 blur-[150px] rounded-full animate-pulse delay-1000" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 text-left mt-10 lg:mt-0">
              {/* Badge - Premium Capsule Style */}
              <div className="inline-flex items-center gap-4 p-2 pr-8 rounded-full bg-slate-950/40 backdrop-blur-xl border border-white/5 mb-10 animate-fade-in group/badge">
                <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center shadow-inner shadow-brand-orange/20 group-hover/badge:scale-110 transition-transform">
                  <Trophy className="w-5 h-5 text-brand-orange" />
                </div>
                <div className="flex flex-col">
                  <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.3em] mb-0.5">Premium Gadget</span>
                  <span className="text-white text-xs sm:text-sm font-black uppercase tracking-[0.1em] italic">The Most Trusted Gadget Partner</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white mb-10 leading-[0.95] tracking-tighter">
                Teman Setia <br />
                <span className="text-brand-orange drop-shadow-[0_0_30px_rgba(250,140,22,0.3)]">Cari Gadget.</span>
              </h1>

              <p className="text-muted-foreground text-xl sm:text-2xl mb-14 max-w-2xl leading-relaxed font-medium">
                Takut kena prank beli HP bekas? Di <b className="text-brand-orange">COREPAWAS</b> nggak ada drama. 
                Unit pilihan, inspeksi teknisi, dan transparansi 100%.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/katalog"
                  className="group px-12 py-6 rounded-[2.5rem] bg-brand-orange text-white font-black text-xl shadow-[0_20px_50px_rgba(250,140,22,0.3)] hover:shadow-[0_25px_60px_rgba(250,140,22,0.4)] transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-4 overflow-hidden relative"
                >
                  <Smartphone className="w-7 h-7" />
                  Lihat Katalog HP
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>

                <a
                  href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20konsultasi%20stok%20HP%20terbaik.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-12 py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-4 backdrop-blur-xl hover:scale-105 active:scale-95"
                >
                  <WhatsAppIcon className="w-7 h-7" />
                  Konsultasi Unit
                </a>
              </div>
              
              {/* Trust Stats */}
              <div className="mt-16 flex flex-wrap gap-8">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-brand-navy border border-brand-orange/20 flex items-center justify-center">
                     <Users className="w-6 h-6 text-brand-orange" />
                   </div>
                   <div>
                     <div className="text-xl font-black text-white leading-none">1000+</div>
                     <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Loyal Users</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-xl bg-brand-navy border border-brand-orange/20 flex items-center justify-center">
                     <Star className="w-6 h-6 text-brand-orange" />
                   </div>
                   <div>
                     <div className="text-xl font-black text-white leading-none">4.9/5.0</div>
                     <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Reviews</div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Floating Card Visual */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative animate-float-premium">
                <div className="absolute inset-0 bg-brand-orange/20 blur-[100px] rounded-full" />
                <div className="relative glass-premium p-4 rounded-[3rem] border border-white/10 rotate-3 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&q=80" 
                    alt="Premium Device" 
                    className="rounded-[2.5rem] w-full h-[500px] object-cover"
                  />
                  <div className="absolute -bottom-6 -left-6 glass-premium p-6 rounded-3xl border border-white/10 -rotate-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-black text-sm">Full Warranty</div>
                        <div className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Technician Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── USP SECTION (Bento Grid) ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-brand-orange text-xs font-black uppercase tracking-[0.4em] mb-4 block">Our Commitment</span>
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">Bukan Sekadar Jual HP.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uspItems.map((item, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-card border border-border hover:border-brand-orange/30 transition-all duration-500 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-orange/5 blur-3xl rounded-full group-hover:bg-brand-orange/20 transition-all" />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${item.color === 'orange' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-navy-dark text-white border border-white/10'} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-24 px-6 bg-white/5 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
                <span className="text-brand-orange text-xs font-black uppercase tracking-widest">Ready Stock</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">Unit Terlaris Minggu Ini</h2>
            </div>
            <Link href="/katalog" className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-brand-orange transition-all">
              Semua Katalog <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─── SERVICES BENTO ─── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
           <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
              {/* Big Bento Card: Trade In */}
              <div className="lg:col-span-8 group relative rounded-[3rem] bg-gradient-to-br from-brand-navy to-brand-navy-dark border border-white/10 overflow-hidden p-10 sm:p-16 flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-orange/5 blur-[120px]" />
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-orange/20 flex items-center justify-center text-brand-orange mb-8">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
                    Mau Tukar <br />Tambah HP?
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md font-medium">
                    Bawa HP lamamu, kami hargai dengan harga jujur (bakul) untuk dipotong ke HP impianmu selanjutnya.
                  </p>
                </div>
                <Link href="/tukar-tambah" className="mt-12 inline-flex items-center gap-4 text-xl font-black text-white group-hover:text-brand-orange transition-colors">
                  Cek Estimasi Harga <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>

              {/* Small Bento Card: Jasa */}
              <div className="lg:col-span-4 group relative rounded-[3rem] bg-card border border-border p-10 flex flex-col justify-between hover:border-brand-orange/30 transition-all">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Teknisi & Jasa</h3>
                  <p className="text-muted-foreground font-medium">
                    Flash ROM, migrasi data, hingga inspeksi unit dari seller lain.
                  </p>
                </div>
                <Link href="/jasa" className="mt-8 flex items-center gap-2 font-black text-brand-orange group-hover:gap-4 transition-all">
                  Lihat Layanan <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
           </div>
        </div>
      </section>

      <Testimonials />

      {/* ─── CTA BANNER ─── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[4rem] bg-brand-orange p-12 sm:p-24 text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(250,140,22,0.4)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                Dapatkan Unit <br />Terbaik Anda.
              </h2>
              <p className="text-white/90 text-lg sm:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                Stok bergerak cepat setiap harinya. Jangan sampai unit impianmu diambil orang lain!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-white text-brand-navy font-black text-xl hover:scale-105 transition-transform flex items-center justify-center gap-3"
                >
                  Buka Katalog
                </Link>
                <a
                  href={`https://wa.me/${waNumber}`}
                  className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-brand-navy text-white font-black text-xl hover:bg-brand-navy-dark transition-colors flex items-center justify-center gap-3"
                >
                  Chat Admin Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL FOOTER CTA ─── */}
      <section className="py-24 px-6 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto">
           <div className="mb-10 flex justify-center">
             <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 flex items-center justify-center animate-bounce">
                <MessageSquare className="w-10 h-10 text-brand-orange" />
             </div>
           </div>
           <h2 className="text-4xl font-black text-white mb-6">Masih Bingung?</h2>
           <p className="text-muted-foreground text-xl mb-12 italic font-medium">
             "Mau tanya spek atau konsultasi budget? Chat aja dulu yuk Kak, gratis kok!"
           </p>
           <a
             href={`https://wa.me/${waNumber}`}
             className="inline-flex items-center gap-4 px-12 py-6 rounded-3xl bg-white text-brand-navy font-black text-2xl hover:bg-brand-orange hover:text-white transition-all shadow-2xl"
           >
             <WhatsAppIcon className="w-8 h-8" /> Chat WA Sekarang
           </a>
        </div>
      </section>
    </div>
  );
}

