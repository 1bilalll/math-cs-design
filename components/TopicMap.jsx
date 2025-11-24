"use client";
import { useState, useEffect, useMemo } from "react";

export default function TopicMap({ exam = "SINAV", topics = [], onUpdate, onStartQuiz, onStartFinal }) {
  const [localTopics, setLocalTopics] = useState([]);

  useEffect(() => {
    setLocalTopics(topics?.length ? topics.map(t => ({ ...t })) : []);
  }, [topics]);

  const calculateTopicProgress = (t) =>
    (t.completed ? 25 : 0) + (t.quiz ? 50 : 0) + (t.final ? 25 : 0);

  const overallProgress = useMemo(() => {
    if (!localTopics.length) return 0;
    const total = localTopics.reduce((acc, t) => acc + calculateTopicProgress(t), 0);
    return Number((total / (localTopics.length * 100) * 100).toFixed(1));
  }, [localTopics]);


  // 🔓 Sadece Son Test ≥ %65 olursa sonraki konu açılır
  const unlockNextTopic = (updated, index) => {
    if (updated[index].final && updated[index + 1]) {
      updated[index + 1].locked = false;
    }
  };


  // Konu (%25)
  const handleTopicComplete = (i) => {
    const updated = [...localTopics];
    if (!updated[i] || updated[i].locked || updated[i].completed) return;

    updated[i].completed = true;
    setLocalTopics(updated);
    onUpdate?.(updated);
  };


  return (
    <div className="p-5 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        📌 {exam?.toUpperCase() || "SINAV"} Konu İlerleme Haritası
      </h2>

      {/* Genel ilerleme */}
      <div className="mb-8">
        <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${overallProgress}%`,
              background:
                overallProgress < 50
                  ? "linear-gradient(90deg,#fcd34d,#fb923c)"
                  : overallProgress < 100
                  ? "linear-gradient(90deg,#60a5fa,#3b82f6)"
                  : "linear-gradient(90deg,#4ade80,#16a34a)"
            }}
          />
        </div>
        <p className="text-center mt-2 font-semibold">
          {overallProgress}% Tamamlandı 🎯
        </p>
      </div>


      {/* Konular */}
      {localTopics?.length ? (
        localTopics.map((topic, i) => {
          const prog = calculateTopicProgress(topic);

          return (
            <div
              key={topic.name}
              className="p-4 border rounded-lg shadow bg-gray-50 mb-4 hover:shadow-md transition"
            >

              <div className="flex justify-between mb-2">
                <span className="font-semibold text-lg">{topic.name}</span>
                {topic.locked && <span className="text-red-500">🔒 Kilitli</span>}
                {!topic.locked && prog === 100 && <span className="text-green-600">✔ Tamamlandı</span>}
              </div>

              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden mb-3 shadow-inner">
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${prog}%`,
                    background:
                      prog < 50 ? "#fdba74" :
                      prog < 100 ? "#60a5fa" : "#4ade80"
                  }}
                />
              </div>

              <div className="flex gap-2">

                {/* 📌 Konu */}
                <button
                  disabled={topic.locked || topic.completed}
                  onClick={() => handleTopicComplete(i)}
                  className={`px-3 py-1 rounded transition ${
                    topic.completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 hover:bg-gray-400"
                  } ${topic.locked ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Konu (%25)
                </button>

                {/* 🧠 Quiz */}
                <button
                  disabled={topic.locked || !topic.completed || topic.quiz}
                  onClick={() =>
                    onStartQuiz?.(topic.name, (score) => {
                      // score → % örn: 78
                      if (score >= 65) {
                        const updated = [...localTopics];
                        updated[i].quiz = true;
                        setLocalTopics(updated);
                        onUpdate?.(updated);
                      }
                    })
                  }
                  className={`px-3 py-1 rounded transition ${
                    topic.quiz ? "bg-indigo-500 text-white" : "bg-gray-300 hover:bg-gray-400"
                  } ${topic.locked || !topic.completed ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Quiz (%50)
                </button>

                {/* 🏁 Son Test */}
                <button
                  disabled={!topic.quiz || topic.final}
                  onClick={() =>
                    onStartFinal?.(topic.name, (score) => {
                      if (score >= 65) {
                        const updated = [...localTopics];
                        updated[i].final = true;
                        unlockNextTopic(updated, i);
                        setLocalTopics(updated);
                        onUpdate?.(updated);
                      }
                    })
                  }
                  className={`px-3 py-1 rounded transition ${
                    topic.final ? "bg-purple-600 text-white" : "bg-gray-300 hover:bg-gray-400"
                  } ${!topic.quiz ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Son Test (%25)
                </button>

              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">Henüz konu eklenmedi</p>
      )}
    </div>
  );
}
