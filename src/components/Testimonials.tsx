"use client";
import { Star, Quote, Instagram, MessageCircle } from 'lucide-react';

const testimonials = [
  {
    name: "Rizky Ramadhan",
    role: "Trader & Mahasiswa",
    content: "Paling suka sama transparansi COREPAWAS. Baru kali ini beli HP second tapi dikasih liat skor Antutu sama screenshot 3uTools langsung. Kondisi unit bener-bener sesuai deskripsi!",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
    rating: 5,
    unit: "iPhone 13 Pro Max",
    social: "@rizkyrmdn_"
  },
  {
    name: "Siska Amelia",
    role: "Graphic Designer",
    content: "Tadinya ragu beli online, tapi setelah video call liat unit dan penjelasannya detail banget, jadi yakin. Bonus pindah data gratisnya ngebantu banget buat saya yang gaptek. Rejeki banget dapet unit mulus!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    rating: 5,
    unit: "S23 Ultra 5G",
    social: "@siska.amel"
  },
  {
    name: "Budi Santoso",
    role: "IT Specialist",
    content: "Sebagai orang IT, saya kritis banget soal hardware. COREPAWAS satu-satunya seller yang berani transparan soal status UBL dan Root. Technician verified-nya bukan cuma gimmick. Sangat direkomendasikan!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 5,
    unit: "Google Pixel 7 Pro",
    social: "@budi_tech"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-slate-950 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-4 uppercase tracking-widest">
            Customer Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Kepercayaan yang <br />
            <span className="text-gradient">Terus Bertumbuh</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Kepuasan pelanggan adalah standar tertinggi kami. Berikut adalah pengalaman mereka bersama COREPAWAS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-blue-400" />
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-slate-300 mb-8 italic leading-relaxed relative z-10">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-slate-800 pt-6">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-sm leading-tight">{t.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{t.role}</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-blue-400 uppercase">{t.unit}</div>
                  <a 
                    href={`https://instagram.com/${t.social.replace('@', '')}`}
                    target="_blank"
                    className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 mt-1 transition-colors"
                  >
                    <Instagram className="w-3 h-3" />
                    {t.social}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 p-2 pr-6 rounded-full bg-slate-900 border border-slate-800">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 animate-pulse`} style={{ animationDelay: `${i*200}ms` }} />
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-white font-bold">150+</span> Orang telah bergabung di komunitas kami
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
