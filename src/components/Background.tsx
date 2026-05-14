"use client";
import React from 'react';

const Background = () => {
  // Collection of premium gadget/workspace images for the background collage
  const images = [
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1200&auto=format&fit=crop', // iPhone black
    'https://images.unsplash.com/photo-1556656793-062ff987b50d?q=80&w=1200&auto=format&fit=crop', // Gadgets
    'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1200&auto=format&fit=crop', // Minimalist desk
    'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?q=80&w=1200&auto=format&fit=crop', // Tech setup
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop', // Smartphone focus
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop', // MacBook
  ];

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-white pointer-events-none">
      {/* Background Photo Collage/Grid Style */}
      <div className="absolute inset-0 z-0 opacity-[0.15] grayscale saturate-0 grid grid-cols-2 lg:grid-cols-3 gap-0">
        {images.map((src, idx) => (
          <div key={idx} className="relative h-full w-full border-[0.5px] border-slate-900/5">
            <img 
              src={src} 
              alt={`Premium Aesthetic ${idx}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modern Gradient Overlays to keep UI clean - Softened for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/40 to-white/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,140,22,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_70%)]" />

      {/* Dynamic Animated Blobs (Very Subtle) */}
      <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-blue-100/20 blur-[150px] animate-blob opacity-40" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[70vw] h-[70vw] rounded-full bg-orange-100/20 blur-[180px] animate-blob animation-delay-2000 opacity-30" />
      
      {/* Subtle Technical Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a03_1px,transparent_1px),linear-gradient(to_bottom,#0f172a03_1px,transparent_1px)] bg-[size:120px_120px]" />
      
      {/* Central Brand Watermark (Logo from public) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02] pointer-events-none flex items-center justify-center">
        <img src="/watermark-logo.png" alt="Corepawas Logo" className="w-full h-full object-contain grayscale invert opacity-30" />
      </div>

      {/* Noise Texture for that premium grainy feel */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
    </div>
  );
};

export default Background;
