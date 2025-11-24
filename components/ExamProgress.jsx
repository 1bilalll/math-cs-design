"use client";
import { useEffect, useState } from "react";

export default function ExamProgress({ topics = [] }) {
  const [currentProgress, setCurrentProgress] = useState(0); 
  const [overallProgress, setOverallProgress] = useState(0); 
  const [activeTopicName, setActiveTopicName] = useState("");

  useEffect(() => {
    if (!topics.length) {
      setCurrentProgress(0);
      setOverallProgress(0);
      setActiveTopicName("Henüz konu yok");
      return;
    }

    const lastTopicIndex = topics.length - 1;
    const activeTopic = topics.find(t => !(t.map && t.quiz && t.test)) || topics[lastTopicIndex];

    const topicPercent =
      (activeTopic.map ? 25 : 0) +
      (activeTopic.quiz ? 50 : 0) +
      (activeTopic.final ? 25 : 0); // final yerine test kullanıyorsan 'activeTopic.test'

    setCurrentProgress(topicPercent);
    setActiveTopicName(activeTopic.name || "Konu");

    const totalPercent = topics.reduce((acc, t) => {
      const p = (t.map ? 25 : 0) + (t.quiz ? 50 : 0) + (t.final ? 25 : 0); // final yerine test kullanıyorsan 't.test'
      return acc + p / 100;
    }, 0);

    const overall = Math.round((totalPercent / topics.length) * 100);
    setOverallProgress(overall);
  }, [topics]);

  const getBarColor = (percent) => {
    if (percent < 25) return "bg-red-500";
    if (percent < 50) return "bg-orange-500";
    if (percent < 75) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">📊 Genel Sınav İlerlemesi</h2>
        <div className="w-full bg-gray-200 h-5 rounded overflow-hidden">
          <div
            className={`h-5 rounded transition-all duration-500 ${getBarColor(overallProgress)}`}
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-gray-600">{overallProgress}% tamamlandı</p>
      </div>

      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-2">🧩 Konu İlerlemesi ({activeTopicName})</h2>
        <div className="w-full bg-gray-200 h-5 rounded overflow-hidden">
          <div
            className={`h-5 rounded transition-all duration-500 ${getBarColor(currentProgress)}`}
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
        <p className="mt-1 text-gray-600">{currentProgress}% tamamlandı</p>
      </div>
    </div>
  );
}
