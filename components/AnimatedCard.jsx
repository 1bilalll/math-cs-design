"use client";

import ThreeCardBackground from "./ThreeCardBackground";

export default function AnimatedCard({ title, href, shape }) {
  return (
    <a
      href={href}
      className="
        relative block w-full h-24 sm:h-32 lg:h-40
        rounded-xl overflow-hidden cursor-pointer
        transform transition-all duration-300
        hover:-translate-y-2
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.45)]
        active:scale-[0.97]
      "
    >
      {/* 3D Animasyon */}
      <div className="absolute inset-0 w-full h-full">
        <ThreeCardBackground shape={shape} key={shape} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/70" />

      {/* Başlık */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-3xl sm:text-4xl font-semibold drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]">
          {title}
        </span>
      </div>
    </a>
  );
}
