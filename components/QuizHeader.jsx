"use client"; // çok önemli, en başa koy

import { Player } from "@lottiefiles/react-lottie-player";

export default function QuizHeader({ title }) {
  return (
    <div className="flex items-center space-x-4 mb-6 justify-center md:justify-start w-full">
      {/* Çocuk animasyonu */}
      <Player
        autoplay
        loop
        src="/animations/skater.json"
        className="w-[150px] h-[150px] select-none pointer-events-none"
      />

      {/* Başlık */}
      <h1 className="text-3xl md:text-4xl font-bold">
        {title.toUpperCase()} Quiz
      </h1>
    </div>
  );
}
