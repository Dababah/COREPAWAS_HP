"use client";

export default function ProductSkeleton() {
  return (
    <div className="bento-card tilt-3d h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-brand-navy-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
          <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/5 rounded-lg" />
          <div className="h-6 w-16 bg-white/5 rounded-lg" />
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-12 bg-white/5 rounded-lg" />
            <div className="h-6 w-24 bg-white/5 rounded-lg" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}
