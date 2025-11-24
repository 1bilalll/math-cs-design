"use client";

import { useState, useEffect } from "react";
import monthQuestionData from "../content/monthQuestion.json"; // Aylık soru burada olacak

export default function MonthChallenge() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0);
    const remainingTime = Math.floor((monthEnd - today) / 1000);
    setTimeLeft(remainingTime);

    // Soru yükle
    if (monthQuestionData.length > 0) {
      setQuestion(monthQuestionData[0]); // Ayın sorusu
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-4 w-full max-w-2xl relative">
      <h2 className="text-xl font-bold mb-4">A Month Challenge</h2>

      {question && (
        <div className="mb-4">
          <p className="font-medium">{question.question}</p>
          <p className="text-sm text-gray-500 mt-2">Cevabınızı e-posta ile gönderiniz.</p>
        </div>
      )}

      {/* Sağ üst köşede süre */}
      <div className="absolute top-4 right-4 p-2 bg-gray-100 rounded-lg shadow flex flex-col items-center">
        <p className="text-sm font-medium">Kalan Süre</p>
        <p className="text-sm text-gray-700">{formatTime(timeLeft)}</p>
      </div>
    </div>
  );
}
