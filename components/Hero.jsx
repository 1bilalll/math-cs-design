"use client";

import { useState, useContext, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";
import dynamic from "next/dynamic";
import quizQuestions from "../content/quizQuestions.json";
import monthQuestions from "../content/monthQuestion.json";

const QuickQuiz = dynamic(() => import("./QuickQuiz"), { ssr: false });
const MonthChallenge = dynamic(() => import("./MonthChallenge"), { ssr: false });
const ParabolaBall = dynamic(() => import("./ParabolaBall"), { ssr: false });

export default function Hero() {
  const { language } = useContext(LanguageContext);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [monthTimeLeft, setMonthTimeLeft] = useState(0);

   const texts = {
    en: {
      title1: "Mathematics & Computer Science",
      title2:"Modern, Interactive Learning", 
      desc:
        "Making mathematics simple, fun and understandable with questions, games and simulations.",
      quickQuiz: "Quick Quiz",
      monthChallenge: "A Month Challenge"
    },
    tr: {
      title1: "Matematik & Bilgisayar Bilimleri", 
      title2:"Modern ve Etkileşimli Öğrenme",
      desc:
        
        "Sorular, oyunlar ve simülasyonlarla matematiği kolay, eğlenceli ve anlaşılır hale getir.",
      quickQuiz: "Hızlı Quiz",
      monthChallenge: "Aylık Challenge"
    }
  };


  useEffect(() => {
    const today = new Date();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0);
    const remainingTime = Math.floor((monthEnd - today) / 1000);
    setMonthTimeLeft(remainingTime);

    const timer = setInterval(() => {
      setMonthTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
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
    <section
      className="
        w-full 
        max-w-7xl 
        mx-auto 
        flex flex-col md:flex-row 
        items-center 
        justify-center md:justify-between 
        gap-10 md:gap-6 
        pt-4 md:pt-6  <-- Navbar altındaki başlangıç boşluğunu buradan kontrol edin
        pb-10          <-- Alt boşluğu ayarlayın (gerekirse)
        px-4
      "
    >
      <div className="max-w-xl text-center md:text-left">
       <h1 className="text-3xl md:text-4xl font-normal leading-snug tracking-normal text-gray-900">
  {texts[language].title1}
  <br />
  <span className="text-cyan-500 text-2xl md:text-3xl font-light">
    {texts[language].title2}
  </span>
</h1>

<p className="mt-2 text-base md:text-lg font-light text-gray-700 leading-relaxed tracking-wide">
  {texts[language].desc}
</p>


        <div className="flex flex-wrap gap-4 mt-12 items-center justify-center md:justify-start">
          <button
            onClick={() => { setShowQuiz(true); setShowMonth(false); }}
            className="px-6 py-3 rounded-xl font-semibold transition bg-cyan-600 hover:bg-cyan-500 text-white shadow hover:shadow-lg"
          >
            {texts[language].quickQuiz}
          </button>

          <div className="relative">
            <button
              onClick={() => { setShowMonth(true); setShowQuiz(false); }}
              className="px-6 py-3 rounded-xl font-semibold transition bg-amber-500 hover:bg-amber-400 text-white shadow hover:shadow-lg"
            >
              {texts[language].monthChallenge}
            </button>

            <div className="absolute -top-7 right-0 bg-gray-100 px-3 py-1 rounded shadow text-sm font-medium text-gray-700">
              {formatTime(monthTimeLeft)}
            </div>
          </div>
        </div>

        {showQuiz && (
          <div className="mt-6">
            <QuickQuiz
              questions={quizQuestions}
              maxQuestions={10}
              maxTime={10}
              passRate={0.7}
              exam="quick"
              topic="quick"
              subtopic="quick"
            />
          </div>
        )}

        {showMonth && monthQuestions.length > 0 && (
          <div className="mt-6">
            <MonthChallenge question={monthQuestions[0]} maxTime={86400 * 30} />
          </div>
        )}
      </div>

      <div className="w-full sm:w-[340px] md:w-[380px] lg:w-[420px] xl:w-[500px] flex flex-col items-center gap-3 md:mt-10">
        <ParabolaBall />
      </div>
    </section>
  );
}
