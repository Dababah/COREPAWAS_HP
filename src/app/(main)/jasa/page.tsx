"use client";
import Link from 'next/link';
import {
  Database,
  ShieldCheck,
  Cpu,
  Smartphone,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Lock,
  RefreshCw,
  Zap,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

const JASA_BG = 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=1400&q=80';

const services = [
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Migrasi Data',
    badge: 'FREE FOR BUYERS',
    price: 'Gratis / Rp 50.000',
    desc: 'Pindahkan semua data dari HP lama ke HP baru: kontak, foto, video, hingga WhatsApp dengan history chat lengkap.',
    features: [
      'Transfer foto & video resolusi penuh',
      'Migrasi WhatsApp + history chat',
      'Setup akun Google / iCloud',
      'Install ulang aplikasi penting',
    ],
    color: 'orange'
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Inspeksi & QC HP Second',
    badge: 'PUBLIC SERVICE',
    price: 'Rp 30.000',
    desc: 'Beli HP second dari seller lain? Bawa ke kami untuk inspeksi mendalam. Kami cek dengan 3uTools dan stress test.',
    features: [
      'Cek komponen original (3uTools)',
      'Battery health measurement',
      'AnTuTu benchmark & stress test',
      'Verifikasi IMEI & iCloud status',
    ],
    color: 'navy'
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: 'Edukasi Keamanan',
    badge: 'FREE FOR BUYERS',
    price: 'Gratis / Rp 25.000',
    desc: 'Setup keamanan HP kamu: aktifkan 2FA, enkripsi, Find My Device, dan tips privasi digital dari ahlinya.',
    features: [
      'Setup Two-Factor Authentication',
      'Aktifkan Find My Device / iPhone',
      'Konfigurasi backup otomatis',
      'Tips anti-phishing & privasi',
    ],
    color: 'orange'
  },
  {
    icon: <RefreshCw className="w-8 h-8" />,
    title: 'Flash & Install ROM',
    badge: 'ANDROID ONLY',
    price: 'Rp 75k – Rp 150k',
    desc: 'HP Android lemot, bootloop, atau kena virus? Kami flash ulang dengan ROM resmi pabrikan untuk performa optimal.',
    features: [
      'Flash ROM resmi / stock firmware',
      'Remove bloatware & malware',
      'Optimasi startup & performa',
      'Garansi 3 hari pasca flash',
    ],
    color: 'navy'
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: 'Konsultasi Beli HP',
    badge: 'FREE FOREVER',
    price: 'Gratis via WhatsApp',
    desc: 'Bingung pilih HP second? Konsultasikan kebutuhanmu, kami rekomendasikan unit terbaik sesuai budget.',
    features: [
      'Analisis kebutuhan penggunaan',
      'Rekomendasi spesifikasi ideal',
      'Informasi harga pasar wajar',
      'Tips negosiasi harga HP',
    ],
    color: 'orange'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Optimasi & Tune-up',
    badge: 'ALL BRANDS',
    price: 'Rp 40.000',
    desc: 'HP terasa lemot? Kami lakukan tune-up software: bersihkan cache dan optimasi agar HP smooth kembali.',
    features: [
      'Deep clean cache & junk files',
      'Optimasi baterai & charging',
      'Disable background app berlebih',
      'Update driver & firmware',
    ],
    color: 'navy'
  },
];

const faqs = [
  {
    q: 'Apakah ada garansi untuk HP yang dibeli di COREPAWAS?',
    a: 'Ya! Kami memberikan garansi personal 7 hari untuk masalah teknis yang tidak disebutkan saat penjualan.',
  },
  {
    q: 'Berapa lama proses migrasi data?',
    a: 'Tergantung jumlah data, biasanya 30 menit hingga 2 jam. Untuk data besar (>50GB) bisa lebih lama.',
  },
  {
    q: 'Apakah bisa inspeksi HP tanpa beli di sini?',
    a: 'Tentu! Jasa inspeksi tersedia untuk umum. Bawa HP second yang akan kamu beli dari seller manapun.',
  },
];

export default function Jasa() {
  const { waNumber } = useData();

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 px-6">
      {/* Hero Section */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 -z-10">
          <img src={JASA_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-background/80" />
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-navy/30 blur-[150px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-8">
            Technical Support
          </div>
          <h1 className="text-5xl sm:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            Value Added <br />
            <span className="text-gradient">Layanan Teknis.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
            Bukan hanya jual beli, kami memastikan Anda mendapat pengalaman terbaik dari gadget pilihan Anda melalui layanan teknis profesional.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={i}
              className="p-10 rounded-[3rem] bg-card border border-border hover:border-brand-orange/30 transition-all group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-8">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${service.color === 'orange' ? 'bg-brand-orange/10 text-brand-orange' : 'bg-brand-navy-dark text-white border border-white/10'}`}>
                  {service.icon}
                </div>
                <span className="px-3 py-1.5 rounded-full bg-white/5 text-muted-foreground text-[10px] font-black uppercase tracking-widest border border-white/5">
                  {service.badge}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-brand-orange transition-colors">{service.title}</h3>
              <p className="text-brand-orange font-black text-sm mb-6 uppercase tracking-widest italic">{service.price}</p>
              <p className="text-muted-foreground text-base leading-relaxed mb-8 font-medium">{service.desc}</p>

              <div className="space-y-3 mb-10 flex-1">
                {service.features.map((feature, fi) => (
                  <div key={fi} className="flex items-center gap-3 text-white/80 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5">
                <a
                  href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20layanan%20*${encodeURIComponent(service.title)}*.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group/link"
                >
                  <span className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-brand-orange" />
                    Chat Admin
                  </span>
                  <ArrowRight className="w-5 h-5 text-brand-orange group-hover/link:translate-x-2 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Pertanyaan Umum</h2>
          <p className="text-muted-foreground font-medium">Jawaban untuk pertanyaan yang paling sering ditanyakan.</p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-8 rounded-3xl bg-card border border-border">
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-6 h-6 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-black text-lg mb-3 tracking-tight">{faq.q}</h4>
                  <p className="text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-5xl mx-auto">
        <div className="p-12 sm:p-20 rounded-[4rem] bg-gradient-to-br from-brand-navy to-brand-navy-dark border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/10 blur-[100px] rounded-full" />
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter">Butuh Layanan Khusus?</h2>
          <p className="text-blue-100/60 text-lg sm:text-xl mb-12 max-w-xl mx-auto font-medium leading-relaxed">
            Hubungi teknisi kami sekarang untuk konsultasi gratis atau penjadwalan layanan servismu.
          </p>
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 px-12 py-6 rounded-3xl bg-brand-orange text-white font-black text-2xl shadow-2xl shadow-brand-orange/30 hover:scale-105 transition-all"
          >
            <WhatsAppIcon className="w-8 h-8" />
            Chat Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}

