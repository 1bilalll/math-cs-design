"use client";

import { useState, useEffect, useRef } from "react";
import questionsData from "../content/quizQuestions.json";

export default function QuickQuiz() {
  const totalQuestions = 10;
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  // Soruları karıştır ve başlat
  useEffect(() => {
    const shuffled = [...questionsData]
      .sort(() => 0.5 - Math.random())
      .slice(0, totalQuestions)
      .map(q => ({
        ...q,
        options: q.options
          .map(opt => ({ opt, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(o => o.opt)
      }));
    setQuizQuestions(shuffled);
    setAnswers(Array(shuffled.length).fill(null));
  }, []);

  // Timer
  useEffect(() => {
    if (finished) return;
    setTimeLeft(10);
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
  if (t > 0) return t - 1;
  nextQuestion();   // zaman bittiğinde diğer soruya geç
  return 0;
});

    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [current, finished]);

  // Kum saati canvas
  useEffect(() => {
    if (!canvasRef.current || finished) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 25;
    const height = 50;
    canvas.width = width;
    canvas.height = height;

    const maxParticles = Math.round(height / 2);
    const upperParticles = [];
    const lowerParticles = [];

    for (let i = 0; i < maxParticles; i++) {
      upperParticles.push({
        x: width / 2 + Math.random() * 6 - 3,
        y: Math.random() * (height / 2),
        radius: Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.15 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 6, 0);
      ctx.lineTo((width / 6) * 5, 0);
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width / 6, height);
      ctx.lineTo((width / 6) * 5, height);
      ctx.lineTo(width / 2, height / 2);
      ctx.closePath();
      ctx.stroke();

      const ratio = timeLeft / 10;

      upperParticles.forEach((p, i) => {
        if (i / upperParticles.length < ratio) {
          p.y += p.speed;
          if (p.y > height / 2) {
            lowerParticles.push({ x: p.x, y: height / 2, radius: p.radius });
            p.y = Math.random() * (height / 2);
            p.x = width / 2 + Math.random() * 6 - 3;
            p.radius = Math.random() * 0.8 + 0.4;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = "goldenrod";
          ctx.fill();
        }
      });

      lowerParticles.forEach((p) => {
        ctx.beginPath();
        const progress = height / 2 - ratio * (height / 2);
        ctx.arc(p.x, height / 2 + progress, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "goldenrod";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };
    draw();
  }, [timeLeft, finished]);

  const handleSelect = (index) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (current + 1 < quizQuestions.length) {
      setCurrent(current + 1);
      setTimeLeft(10);
    } else {
      finishQuiz();
    }
  };

  const skipQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[current] = null;
    setAnswers(newAnswers);
    nextQuestion();
  };

  const finishQuiz = () => {
    clearInterval(intervalRef.current);
    setFinished(true);

    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem("quickQuizDate", today);
  };

  if (finished) {
    const correctCount = quizQuestions.reduce(
      (acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc),
      0
    );
    const rate = correctCount / quizQuestions.length;
    const passed = rate >= 0.7;

    return (
      <div className="bg-white p-6 rounded-xl shadow-md mt-4 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {passed ? "Tebrikler! 🎉" : "Üzgünüm 😔"}
        </h1>
        <p className="mb-4">
          Skorunuz: {correctCount} / {quizQuestions.length} ({(rate * 100).toFixed(0)}%)
        </p>
        <p className="mb-4">
          {passed
            ? "Başarıyla geçtiniz, üye olabilirsiniz."
            : "Başarısız, başka bir gün tekrar deneyin."}
        </p>
      </div>
    );
  }

  const question = quizQuestions[current];
  if (!question) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-4 w-full max-w-2xl relative">
      {/* Kum Saati sağ üst */}
      <div className="absolute top-4 right-4 flex flex-col items-center">
        <canvas ref={canvasRef} className="mb-1" />
        <span className="text-sm text-gray-500">{timeLeft}s</span>
      </div>

      <p className="mb-2 font-semibold text-lg">
        Soru {current + 1} / {quizQuestions.length}
      </p>
      <p className="mb-4">{question.question}</p>

      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isSelected = answers[current] === i;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`px-4 py-2 rounded text-left border ${
                isSelected
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-slate-100 hover:bg-slate-200 border-gray-300"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={skipQuestion}
          className="px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Boş Geç
        </button>

        <button
          onClick={nextQuestion}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {current + 1 === quizQuestions.length ? "Bitir" : "Sonraki"}
        </button>
      </div>
    </div>
  );
}
