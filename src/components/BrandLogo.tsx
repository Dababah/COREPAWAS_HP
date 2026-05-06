"use client";
import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function BrandLogo({ className = "", showText = true, size = 'md' }: BrandLogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', subtext: 'text-[8px]' },
    md: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl', subtext: 'text-[12px]' },
    xl: { icon: 'w-24 h-24', text: 'text-5xl', subtext: 'text-[16px]' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-4 ${className} group`}>
      {/* Logo Icon - CP Phone Logo */}
      <div className={`relative ${currentSize.icon} transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
          {/* Smartphone Outline (Tilted) */}
          <g transform="rotate(-15 60 60)">
            <rect x="35" y="15" width="50" height="90" rx="10" stroke="#002140" strokeWidth="6" />
            <rect x="55" y="100" width="10" height="2" rx="1" fill="#002140" />
            
            {/* Letter C (Navy Blue) */}
            <path 
              d="M45 40 C35 40, 30 45, 30 55 C30 65, 35 70, 45 70" 
              stroke="#002140" 
              strokeWidth="12" 
              strokeLinecap="round" 
            />
            
            {/* Letter P (Orange) */}
            <path 
              d="M60 40 V75 M60 40 H75 C82 40, 85 45, 85 52.5 C85 60, 82 65, 75 65 H60" 
              stroke="#fa8c16" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </g>
        </svg>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="leading-tight">
          <div className={`flex items-center font-black tracking-tighter uppercase ${currentSize.text}`}>
            <span className="text-white">CORE</span>
            <span className="text-brand-orange ml-1.5">PAWAS</span>
          </div>
          <div className={`${currentSize.subtext} font-black uppercase tracking-[0.5em] text-brand-orange/80 mt-0.5 flex items-center gap-2`}>
            <div className="flex-1 h-[1px] bg-white/10" />
            JUAL BELI HP
            <div className="flex-1 h-[1px] bg-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}
