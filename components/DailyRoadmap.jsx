"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

export default function DailyRoadmap() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [plan, setPlan] = useState("none");

  const DEFAULT_TASKS = [
    { id: 1, label: "📘 30 dk konu tekrar (Fonksiyonlar)", done: false },
    { id: 2, label: "🧠 10 soru quiz çöz", done: false },
    { id: 3, label: "🎥 1 video ders izle", done: false },
    { id: 4, label: "📝 5 soru final tekrar", done: false },
    { id: 5, label: "💧 10 dk mola — su & nefes", done: false },
  ];

  // 🔄 Görev sıfırlama kontrolü
  const checkDailyReset = async (userRef, d) => {
    const today = new Date().toDateString();
    if (d.lastReset !== today) {
      await updateDoc(userRef, {
        dailyTasks: DEFAULT_TASKS,
        lastReset: today,
      });
      setTasks(DEFAULT_TASKS);
    } else {
      setTasks(d.dailyTasks || DEFAULT_TASKS);
    }
  };

  // 📊 Haftalık istatistik kontrolü
  const checkWeeklyStats = async (uid) => {
    const statRef = doc(db, "users", uid, "stats", "weekly");
    const statSnap = await getDoc(statRef);

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // haftanın ilk günü (Pazar)

    if (!statSnap.exists()) {
      await setDoc(statRef, {
        completedDays: 0,
        weekStart: weekStart.toDateString(),
      });
      return;
    }

    const data = statSnap.data();
    if (data.weekStart !== weekStart.toDateString()) {
      await updateDoc(statRef, {
        completedDays: 0,
        weekStart: weekStart.toDateString(),
      });
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return setLoading(false);
      const d = snap.data();
      setPlan(d.plan || "none");

      // 🔄 günlük sıfırlama
      await checkDailyReset(userRef, d);

      // 📊 haftalık rapor oluştur
      await checkWeeklyStats(user.uid);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="text-center mt-10">Yükleniyor...</p>;

  if (plan === "none" || plan === "student")
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">
        🔒 Bu özellik Standard ve Premium üyeler içindir.
      </p>
    );

  const toggleDone = async (id) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasks(updated);

    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
    const statRef = doc(db, "users", user.uid, "stats", "weekly");

    // Kaydet
    await updateDoc(userRef, { dailyTasks: updated });

    // 📌 Eğer tüm görevler tamamlandıysa haftalık sayaç 1 artır
    if (updated.every((t) => t.done)) {
      await updateDoc(statRef, {
        completedDays: increment(1),
      });
    }
  };

  const progress = Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5 text-center">📅 Günlük Çalışma Planın</h1>

      <p className="text-lg font-semibold text-green-600 text-center mb-6">
        🔥 Bugün %{progress} tamamlandı
      </p>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex justify-between items-center p-3 border rounded transition ${
              task.done ? "bg-green-200" : "hover:bg-gray-100"
            }`}
          >
            <span className={`text-lg ${task.done ? "line-through" : ""}`}>
              {task.label}
            </span>

            <button
              onClick={() => toggleDone(task.id)}
              className={`px-3 py-1 rounded text-white transition ${
                task.done ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {task.done ? "Geri Al" : "Tamamla"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
