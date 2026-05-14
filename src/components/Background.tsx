"use client";
import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-white pointer-events-none">
      {/* 
          High-End Graphic Design Collage using local assets (bg.jpeg & bg1.jpeg)
          - Arranged for maximum visual impact and professional balance.
          - High opacity (0.5) for clear visibility.
      */}
      <div className="absolute inset-0 z-0 opacity-[0.5]">
        {/* Main Background Canvas (bg.jpeg) */}
        <div className="absolute top-[-5%] left-0 w-full h-[110%]">
          <img 
            src="/bg.jpeg" 
            alt="Main Background" 
            className="w-full h-full object-cover grayscale saturate-[0.5] opacity-60"
          />
        </div>

        {/* Secondary Artistic Layer (bg1.jpeg) - Floating Accent */}
        <div className="absolute top-[15%] right-[-5%] w-[60%] h-[70%] rotate-[-3deg]">
          <div className="w-full h-full rounded-[4rem] overflow-hidden border border-slate-200/50 shadow-2xl">
            <img 
              src="/bg1.jpeg" 
              alt="Secondary Background" 
              className="w-full h-full object-cover saturate-[1.2]"
            />
          </div>
        </div>

        {/* Floating Mirror Layer for Depth (bg1.jpeg mirrored) */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] rotate-[5deg] opacity-80">
          <div className="w-full h-full rounded-[4rem] overflow-hidden border border-slate-200/50 shadow-2xl">
            <img 
              src="/bg1.jpeg" 
              alt="Mirror Background" 
              className="w-full h-full object-cover grayscale brightness-110"
            />
          </div>
        </div>
      </div>

      {/* 
          Strategic UI Overlays 
          - Very light to ensure local assets shine through
          - Studio lighting effects
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.6),transparent_70%)]" />
      
      {/* Structural Minimalist Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      {/* Vibrant Brand Glows (Orange & Navy) */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-brand-orange/10 blur-[150px] rounded-full animate-blob" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-brand-navy/5 blur-[150px] rounded-full animate-blob animation-delay-2000" />
      
      {/* Central Watermark (subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] flex items-center justify-center">
        <img src="/watermark-logo.png" alt="Corepawas Logo" className="w-full h-full object-contain grayscale invert" />
      </div>

      {/* Premium Texture Grain */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
    </div>
  );
};

export default Background;
