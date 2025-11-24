// components/Badge.jsx
export default function Badge({
  progress = 0,
  totalXP = 0,
  userPlan = "free",
  variant = "chip", // "chip" | "card"
}) {
  // XP → Seviye
  const badgeLevel =
    totalXP >= 2000 ? "💎 Efsane" :
    totalXP >= 1000 ? "🔥 Usta" :
    totalXP >= 500  ? "⚡ Deneyimli" :
                      "🌱 Yeni Öğrenci";

  // Plan renkleri
  const planColors = {
    free: "bg-gray-300 text-gray-800",
    premium: "bg-blue-500 text-white",
    elite: "bg-purple-600 text-white",
  };

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  /* ──────────────────────────────
     🔹 1) KÜÇÜK ROZET (CHIP) GÖRÜNÜMÜ
  ────────────────────────────── */
  if (variant === "chip") {
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${planColors[userPlan]}`}
      >
        {badgeLevel} • {safeProgress}%
      </span>
    );
  }

  /* ──────────────────────────────
     🔹 2) TAM KART ROZET (CARD) GÖRÜNÜMÜ
  ────────────────────────────── */
  return (
    <div className="p-4 border rounded bg-white shadow-md space-y-2 text-center">
      <p className="font-bold text-lg">{badgeLevel}</p>
      <p className="text-sm text-gray-600">Seviye Rozeti</p>

      <p className="text-sm">
        ⭐ Toplam XP: <span className="font-semibold">{totalXP}</span>
      </p>
      <p className="text-sm">
        📈 İlerleme: <span className="font-semibold">{safeProgress}%</span>
      </p>

      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${safeProgress}%` }}
        ></div>
      </div>
    </div>
  );
}
