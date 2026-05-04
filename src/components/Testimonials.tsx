"use client";
import { Star, Quote, Instagram, MessageCircle, CheckCircle } from 'lucide-react';

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
    <section className="py-24 bg-[#020617] overflow-hidden relative">
      {/* Premium Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] glow-navy opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] glow-orange opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 tilt-3d">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-[0.3em] mb-6">
            <MessageCircle className="w-4 h-4" />
            Customer Stories
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter">
            Kepercayaan yang <br />
            <span className="text-gradient">Terus Bertumbuh</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Kepuasan pelanggan adalah standar tertinggi kami. Berikut adalah pengalaman tulus mereka bersama <span className="text-white font-black">COREPAWAS</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div 
              key={i}
              className="group relative p-10 rounded-[2.5rem] bg-brand-navy-dark border border-white/5 hover:border-brand-orange/30 transition-all duration-700 hover:-translate-y-3 shadow-2xl flex flex-col tilt-3d"
            >
              <div className="absolute top-8 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-16 h-16 text-brand-orange" />
              </div>

              <div className="flex gap-1.5 mb-8">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange shadow-lg shadow-brand-orange/20" />
                ))}
              </div>

              <p className="text-slate-300 text-lg mb-10 italic leading-relaxed relative z-10 font-medium">
                "{t.content}"
              </p>

              <div className="mt-auto flex items-center gap-5 border-t border-white/5 pt-8">
                <div className="relative">
                   <img 
                    src={t.avatar} 
                    alt={t.name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-orange/20 shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-orange flex items-center justify-center border-2 border-brand-navy-dark">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-black text-base tracking-tight">{t.name}</h4>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{t.role}</p>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="px-3 py-1 rounded-lg bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black text-brand-orange uppercase tracking-[0.2em]">
                  {t.unit}
                </div>
                <a 
                  href={`https://instagram.com/${t.social.replace('@', '')}`}
                  target="_blank"
                  className="text-[10px] text-slate-500 font-bold hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  {t.social}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Community Badge (Habitline Style) */}
        <div className="mt-20 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-brand-navy-dark border border-white/5 shadow-2xl">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div 
                  key={i} 
                  className={`w-10 h-10 rounded-full border-2 border-brand-navy-dark bg-slate-800 flex items-center justify-center overflow-hidden shadow-xl`}
                >
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-brand-navy-dark bg-brand-orange flex items-center justify-center text-white text-[10px] font-black shadow-xl">
                +150
              </div>
            </div>
            <p className="text-slate-400 text-sm font-medium">
              Join <span className="text-white font-black">150+ Happy Users</span> in Jogja Community
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
