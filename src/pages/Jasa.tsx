import { Link } from 'react-router';
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
} from 'lucide-react';
import { useData } from '../context/DataContext';

const JASA_BG = 'https://images.unsplash.com/photo-1633997011021-0254baa23289?w=1400&q=80';

const services = [
  {
    icon: <Database className="w-7 h-7 text-blue-400" />,
    title: 'Migrasi Data',
    badge: 'GRATIS untuk pembeli',
    price: 'Gratis / Rp 50.000',
    desc: 'Pindahkan semua data dari HP lama ke HP baru: kontak, foto, video, dokumen, hingga WhatsApp dengan history chat lengkap.',
    features: [
      'Backup & restore kontak',
      'Transfer foto & video resolusi penuh',
      'Migrasi WhatsApp + history chat',
      'Setup akun Google / iCloud',
      'Install ulang aplikasi penting',
    ],
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
    title: 'Inspeksi & QC HP Second',
    badge: 'Tersedia untuk umum',
    price: 'Rp 30.000',
    desc: 'Beli HP second dari seller lain? Bawa ke kami untuk inspeksi mendalam sebelum deal. Kami cek dengan 3uTools, AnTuTu, dan stress test.',
    features: [
      'Cek komponen original (3uTools)',
      'Battery health measurement',
      'AnTuTu benchmark & stress test',
      'Cek status UBL & Root',
      'Verifikasi IMEI & iCloud status',
    ],
  },
  {
    icon: <Lock className="w-7 h-7 text-purple-400" />,
    title: 'Edukasi Keamanan HP',
    badge: 'GRATIS untuk pembeli',
    price: 'Gratis / Rp 25.000',
    desc: 'Setup keamanan HP kamu bersama teknisi kami: aktifkan 2FA, enkripsi, Find My Device, dan tips privasi digital.',
    features: [
      'Setup Two-Factor Authentication',
      'Aktifkan Find My Device / Find My iPhone',
      'Konfigurasi backup otomatis',
      'Tips anti-phishing & keamanan digital',
      'Setup password manager',
    ],
  },
  {
    icon: <RefreshCw className="w-7 h-7 text-cyan-400" />,
    title: 'Flash & Install Ulang ROM',
    badge: 'Android Only',
    price: 'Rp 75.000 – Rp 150.000',
    desc: 'HP Android lemot, bootloop, atau kena virus? Kami flash ulang dengan ROM resmi dari pabrikan untuk performa optimal.',
    features: [
      'Flash ROM resmi / stock firmware',
      'Remove bloatware & malware',
      'Optimasi startup & performa',
      'Backup data sebelum flash (jika memungkinkan)',
      'Garansi 3 hari pasca flash',
    ],
  },
  {
    icon: <Cpu className="w-7 h-7 text-yellow-400" />,
    title: 'Konsultasi Beli HP Second',
    badge: 'GRATIS',
    price: 'Gratis via WhatsApp',
    desc: 'Bingung pilih HP second yang tepat sesuai budget? Konsultasikan kebutuhan kamu dengan teknisi kami, kami rekomendasikan unit terbaik.',
    features: [
      'Analisis kebutuhan penggunaan',
      'Rekomendasi spesifikasi ideal',
      'Informasi harga pasar wajar',
      'Tips negosiasi harga HP second',
      'Daftar cek sebelum beli',
    ],
  },
  {
    icon: <Zap className="w-7 h-7 text-orange-400" />,
    title: 'Optimasi & Tune-up HP',
    badge: 'Untuk semua brand',
    price: 'Rp 40.000',
    desc: 'HP terasa lemot? Kami lakukan tune-up software: bersihkan cache, optimasi baterai, dan setup agar HP berjalan smooth kembali.',
    features: [
      'Deep clean cache & junk files',
      'Optimasi baterai & charging health',
      'Disable background app berlebihan',
      'Update driver & firmware',
      'Tips perawatan HP agar awet',
    ],
  },
];

const faqs = [
  {
    q: 'Apakah ada garansi untuk HP yang dibeli di COREPAWAS?',
    a: 'Kami memberikan garansi personal 7 hari untuk masalah yang tidak disebutkan saat penjualan. Jika ada yang tidak sesuai deskripsi, kami siap membantu resolusi.',
  },
  {
    q: 'Berapa lama proses migrasi data?',
    a: 'Tergantung jumlah data, biasanya 30 menit hingga 2 jam. Untuk data besar (>50GB foto) bisa lebih lama.',
  },
  {
    q: 'Apakah bisa inspeksi HP tanpa beli di COREPAWAS?',
    a: 'Tentu! Jasa inspeksi tersedia untuk umum. Bawa HP second yang akan kamu beli dari seller mana saja, kami cek secara objektif.',
  },
  {
    q: 'Bagaimana cara pesan layanan?',
    a: 'Hubungi kami via WhatsApp untuk booking jadwal. Kami akan konfirmasi ketersediaan dan perkiraan waktu pengerjaan.',
  },
];

export default function Jasa() {
  const { waNumber } = useData();

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={JASA_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/80" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Jasa & Servis
          </span>
          <h1 className="text-4xl font-black text-white mb-4">
            Value Added untuk{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Pengalaman Terbaik
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Bukan hanya jual beli, kami juga menyediakan berbagai layanan teknis yang memastikan kamu mendapat
            pengalaman terbaik dari HP second kamu.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all group hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium uppercase tracking-wider">
                  {service.badge}
                </span>
              </div>

              <h3 className="text-white font-bold text-lg mb-1">{service.title}</h3>
              <p className="text-blue-400 font-semibold text-sm mb-3">{service.price}</p>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.desc}</p>

              <ul className="space-y-2">
                {service.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-slate-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-5 border-t border-slate-800">
                <a
                  href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20tanya%20tentang%20layanan%20*${encodeURIComponent(service.title)}*.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Tanya / Pesan Layanan
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-white mb-2">Pertanyaan Umum</h2>
          <p className="text-slate-400">Jawaban untuk pertanyaan yang sering ditanyakan.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/10 border border-blue-500/30">
          <Smartphone className="w-10 h-10 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-3">Siap Mulai?</h3>
          <p className="text-slate-400 mb-6">
            Hubungi kami sekarang untuk konsultasi gratis atau jadwalkan layanan.
          </p>
          <a
            href={`https://wa.me/${waNumber}?text=Halo%20COREPAWAS!%20Saya%20ingin%20konsultasi%20tentang%20layanan%20servis.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-colors shadow-lg shadow-green-600/30"
          >
            <MessageCircle className="w-5 h-5" />
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
