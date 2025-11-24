"use client";
import { Player } from "@lottiefiles/react-lottie-player";

export default function ParabolaChild() {
  return (
    <div className="flex justify-start w-full pl-6 mt-8">
      <Player
        autoplay
        loop
        src="/animations/skater.json"
        className="w-[150px] h-[150px] select-none pointer-events-none"
      />
    </div>
  );
}
