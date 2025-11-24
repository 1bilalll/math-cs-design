"use client";
import { useState } from "react";

export default function WeeklyMissions() {
  const [missions, setMissions] = useState([
    { id: 1, text: "Günde 20 soru çöz", done: false },
    { id: 2, text: "Bir konu tekrarı yap", done: false },
    { id: 3, text: "Bir mini quiz bitir", done: false },
  ]);

  const toggle = (id) => {
    setMissions(missions.map(m => m.id === id ? { ...m, done: !m.done } : m));
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-3">Haftalık Görevler</h2>
      {missions.map(m => (
        <div key={m.id} className="flex justify-between items-center mb-2">
          <span className={m.done ? "line-through text-gray-500" : ""}>{m.text}</span>
          <button onClick={() => toggle(m.id)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
            {m.done ? "Geri Al" : "Tamamla"}
          </button>
        </div>
      ))}
    </div>
  );
}

