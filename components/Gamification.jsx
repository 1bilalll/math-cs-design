"use client";
import React from "react";

export default function Gamification({ totalXP, userPlan }) {
  // 🎯 Seviye hesaplama
  const level = Math.floor(totalXP / 150) + 1;

  // 🔥 Lig hesaplama
  let league;
  if (level >= 15) league = "👑 Efsanevi Lig";
  else if (level >= 10) league = "🥇 Altın Lig";
  else if (level >= 5) league = "🥈 Gümüş Lig";
  else league = "🥉 Bronz Lig";

  // ⚡ Kullanıcı planı gösterimi
  const planDisplay = {
    free: "🧱 Free",
    premium: "💎 Premium",
    elite: "🚀 Elite",
  }[userPlan] || "—";

  // 🔋 XP çubuğu
  const xpInLevel = totalXP % 150;
  const xpPercent = (xpInLevel / 150) * 100;

  return (
    <div className="bg-white p-6 rounded shadow mt-6 space-y-4">
      <h2 className="text-xl font-bold">🎮 Gamification Sistemi</h2>

      <div className="space-y-1">
        <p><strong>XP:</strong> {totalXP}</p>
        <p><strong>Seviye:</strong> {level}</p>
        <p><strong>Lig:</strong> {league}</p>
        <p><strong>Kullanıcı Planı:</strong> {planDisplay}</p>
      </div>

      {/* XP Progress Bar */}
      <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-5 rounded-full transition-all duration-500"
          style={{ width: `${xpPercent}%` }}
        ></div>
      </div>

      <p className="text-sm text-gray-700">
        Seviye ilerlemesi: {xpInLevel} / 150 XP
      </p>
    </div>
  );
}
