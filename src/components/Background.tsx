"use client";
import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#001224] pointer-events-none">
      {/* Dynamic Animated Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-brand-navy/40 blur-[120px] animate-blob opacity-60" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-brand-orange/10 blur-[150px] animate-blob animation-delay-2000 opacity-40" />
      <div className="absolute top-[30%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-brand-navy/20 blur-[100px] animate-blob animation-delay-4000 opacity-50" />
      <div className="absolute bottom-[20%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-brand-orange/5 blur-[80px] animate-blob animation-delay-3000 opacity-30" />
      
      {/* High Fidelity Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Technical Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" />
      
      {/* Scanline Effect (Subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-20" />

      {/* Depth Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,8,16,0.5)_100%)]" />
    </div>
  );
};

export default Background;
