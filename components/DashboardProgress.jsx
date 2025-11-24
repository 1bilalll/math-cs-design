"use client";
import { useState, useEffect } from "react";

export default function DashboardProgress({ progress }) {
  const [prevProgress, setPrevProgress] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    if (progress > prevProgress) {
      const newLevel = Math.floor(progress / 20) + 1; // her %20 = 1 seviye
      if (newLevel > level) {
        setLevelUp(true);
        setLevel(newLevel);

        setTimeout(() => setLevelUp(false), 4000);
      }
      setPrevProgress(progress);
    }
  }, [progress]);

  return (
    <div className="relative p-4 bg-white rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-2">📊 Genel İlerleme</h2>

      <div className="h-6 bg-gray-300 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-[1500ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 font-semibold text-gray-700">%{progress} tamamlandı</p>

      {levelUp && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded animate-fadeIn">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-500 drop-shadow">⚡ LEVEL {level}</div>
            <p className="mt-2 font-semibold text-lg text-gray-700">
              Bir sonraki animasyon için ilerlemeye devam et — sürpriz seni bekliyor 🔥
            </p>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s forwards;
          }
        `}
      </style>
    </div>
  );
}
