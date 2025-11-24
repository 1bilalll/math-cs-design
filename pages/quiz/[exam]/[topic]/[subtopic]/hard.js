import { useState, useEffect, useRef } from "react";
import fs from "fs";
import path from "path";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

// Lottie Player'ı client-side olarak import et
const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function HardQuiz({
  exam,
  topic,
  subtopic,
  questions = [],
  maxQuestions = 5,
  passRate = 0.7,
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeUp, setTimeUp] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const limitedQuestions = questions.slice(0, maxQuestions);
  const question = limitedQuestions[current];

  useEffect(() => {
    setTimeLeft(60);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const handleSelect = (index) => {
    const newAnswers = [...answers];
    newAnswers[current] = index;
    setAnswers(newAnswers);
  };

  const handleTimeout = () => {
    clearInterval(intervalRef.current);
    setTimeUp(true);
    setShowAnswer(true);
    setTimeout(() => {
      nextQuestion();
      setTimeUp(false);
      setShowAnswer(false);
    }, 5000);
  };

  const nextQuestion = () => {
    clearInterval(intervalRef.current);
    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      if (current + 1 < limitedQuestions.length) {
        setCurrent(current + 1);
      } else {
        setFinished(true);
      }
    }, 1000);
  };

  const skipQuestion = () => {
    nextQuestion();
  };

  // Canvas tabanlı kum saati
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const canvasWidth = 25;
    const canvasHeight = 50;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const maxParticles = Math.round(canvasHeight / 2);
    const upperParticles = [];
    const lowerParticles = [];

    for (let i = 0; i < maxParticles; i++) {
      upperParticles.push({
        x: canvasWidth / 2 + Math.random() * 6 - 3,
        y: Math.random() * (canvasHeight / 2),
        radius: Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.15 + 0.05,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 6, 0);
      ctx.lineTo((canvasWidth / 6) * 5, 0);
      ctx.lineTo(canvasWidth / 2, canvasHeight / 2);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasWidth / 6, canvasHeight);
      ctx.lineTo((canvasWidth / 6) * 5, canvasHeight);
      ctx.lineTo(canvasWidth / 2, canvasHeight / 2);
      ctx.closePath();
      ctx.stroke();

      const ratio = timeLeft / 60;

      upperParticles.forEach((p, i) => {
        if (i / upperParticles.length < ratio) {
          p.y += p.speed;
          if (p.y > canvasHeight / 2) {
            lowerParticles.push({ x: p.x, y: canvasHeight / 2, radius: p.radius });
            p.y = Math.random() * (canvasHeight / 2);
            p.x = canvasWidth / 2 + Math.random() * 6 - 3;
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
        const progress = canvasHeight / 2 - ratio * (canvasHeight / 2);
        ctx.arc(p.x, canvasHeight / 2 + progress, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "goldenrod";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };
    draw();
  }, [timeLeft]);

  // Parabola grafiği
  const graphData = (() => {
    if (!question.graph || !question.graph.function) return null;
    const xLabels = [...Array(51).keys()].map((i) => i / 10);
    let fn = question.graph.function.replace("y =", "").trim();
    const dataPoints = xLabels.map((x) => {
      let f = fn.replace(/(\d)(x)/g, "$1*x").replace(/x\^2/g, "Math.pow(x,2)").replace(/x\^(\d+)/g, "Math.pow(x,$1)");
      try { 
        let y = eval(f); 
        if (y < 0) y = 0; 
        if (y > 5) y = 5; 
        return { x, y }; 
      } catch { 
        return { x, y: 0 }; 
      }
    });
    return { dataPoints, xMin: 0, xMax: 5, yMin: 0, yMax: 5 };
  })();

  if (finished) {
    const correctCount = limitedQuestions.reduce((acc, q, i) => (answers[i] === q.answer ? acc + 1 : acc), 0);
    const rate = correctCount / limitedQuestions.length;
    const passed = rate >= passRate;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-8">
        <h1 className={`text-3xl font-bold mb-4 text-transparent bg-clip-text ${passed ? "bg-gradient-to-r from-red-500 to-purple-500" : "bg-gradient-to-r from-gray-500 to-gray-600"}`}>
          {passed ? "Tebrikler! Hard Quiz’i Başarıyla Tamamladınız 🎉" : "Üzgünüm, Konuyu Tekrar Etmelisin 😔"}
        </h1>
        <p className="text-lg mb-6">
          Skorun: <span className="font-bold">{correctCount}</span> / {limitedQuestions.length} ({(rate * 100).toFixed(0)}%)
        </p>
        {passed && (
          <Link href={`/watch/${exam}/${topic}/${subtopic}`} className="px-6 py-3 bg-red-500 text-white rounded-xl shadow-md hover:scale-105 transition-transform">
            Diğer Quizlere Geç
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 py-10 px-6">
      {/* Başlık ve animasyon */}
      <div className="flex items-center gap-3 mb-8">
        <LottiePlayer autoplay loop src="/animations/skater.json" className="w-[95px] h-[95px] -ml-3" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
          {subtopic.toUpperCase()} Hard Quiz
        </h1>
      </div>

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        {/* Kum saati */}
        <div className="absolute top-4 right-4 flex flex-col items-center">
          <canvas ref={canvasRef} />
          <div className="text-xs text-gray-600 mt-1">{timeLeft}s</div>
        </div>

        {timeUp && (
          <div className="fixed top-20 right-6 bg-red-500 bg-opacity-90 text-white font-semibold px-4 py-2 rounded-lg shadow-lg z-50">
            Süre doldu, soru boş sayıldı!
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 mt-8">{question.question}</h2>

        {/* Grafik */}
        {graphData && (
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl shadow mb-6">
            <Line
              data={{
                datasets: [
                  {
                    label: question.graph.function,
                    borderWidth: 3,
                    tension: 0.1,
                    pointRadius: 0,
                    borderColor: "blue",
                    data: graphData.dataPoints,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  x: { type: "linear", min: graphData.xMin, max: graphData.xMax },
                  y: { type: "linear", min: graphData.yMin, max: graphData.yMax },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        )}

        {/* Seçenekler */}
        <div className="space-y-3 w-full">
          {question.options.map((opt, i) => {
            const isSelected = answers[current] === i;
            const isCorrect = showAnswer && i === question.answer;
            return (
              <button key={i} onClick={() => handleSelect(i)} className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${isCorrect ? "bg-green-500 text-white border-green-500" : isSelected ? "bg-blue-500 text-white border-blue-500" : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between w-full">
          <button onClick={skipQuestion} className="px-4 py-2 bg-gray-400 text-white rounded-xl shadow-md hover:scale-105 transition-transform">
            Boş Geç
          </button>
          <button onClick={nextQuestion} disabled={answers[current] === null && !showAnswer} className="px-6 py-2 bg-gradient-to-r from-red-500 to-purple-500 text-white rounded-xl shadow-md hover:scale-105 transition-transform disabled:opacity-50">
            {current + 1 === limitedQuestions.length ? "Bitir" : "Sonraki"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-gray-500 dark:text-gray-400">
        Soru {current + 1} / {limitedQuestions.length}
      </p>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam, topic, subtopic } = params;
  const quizPath = path.join(process.cwd(), "content", "exams", exam, topic, subtopic, "quiz-hard.json");

  if (!fs.existsSync(quizPath)) {
    return {
      props: {
        exam,
        topic,
        subtopic,
        questions: [
          {
            question: "Henüz bu konu için zor mod hazırlanmadı.",
            options: ["-"],
            answer: 0,
          },
        ],
      },
    };
  }

  const data = fs.readFileSync(quizPath, "utf8");
  const questions = JSON.parse(data);

  return { props: { exam, topic, subtopic, questions } };
}
