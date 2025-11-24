"use client";
import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase"; // ⚠ pages/dashboard içinde olduğu için 1 klasör yukarı çıktık
import { collection, getDocs } from "firebase/firestore";

export default function WeeklyReport() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      // 📌 Haftalık rapor koleksiyonu
      const weeklyRef = collection(db, "users", user.uid, "statsWeekly");
      const snap = await getDocs(weeklyRef);

      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // 📌 En yeni hafta en üstte
      setReports(
        data.sort((a, b) => (a.weekStart < b.weekStart ? 1 : -1))
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-center mt-10">Yükleniyor...</p>;

  if (reports.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        📌 Henüz hiç haftalık rapor oluşmadı. Düzenli çalışmaya devam et!
      </p>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Haftalık Çalışma Raporun</h2>

      <div className="space-y-5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="border p-5 rounded shadow bg-white hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              📅 {r.weekStart} → {r.weekEnd}
            </h3>

            <p>🧠 Tamamlanan Görevler: <b>{r.tasksCompleted}</b></p>
            <p>📍 Aktif Gün Sayısı: <b>{r.activeDays}</b> / 7</p>
            <p>🏆 En Başarılı Gün: <b>{r.bestDay}</b></p>
            <p>⚡ Verimlilik: <b>%{r.productivity}</b></p>
          </div>
        ))}
      </div>
    </div>
  );
}
