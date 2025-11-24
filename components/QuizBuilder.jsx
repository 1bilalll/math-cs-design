"use client";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { updateProgress } from "../lib/progressTracker";

export default function QuizBuilder({ selected, onFinish, userPlan }) {
  const { subject, exam, topic, difficulty } = selected;
  const [pool, setPool] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const loadQuestions = async () => {
      if (!subject || !exam || !topic || !difficulty) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/quiz/${subject}/${exam}/${topic}/${difficulty}`);
        if (!res.ok) throw new Error("Quiz not found");
        const data = await res.json();

        const normalized = data.map((q) => ({
          ...q,
          correct: q.correct || q.answer,
        }));

        setPool(normalized);
        setQuiz(shuffle(normalized).slice(0, 10));
      } catch (err) {
        console.error(err);
        setPool([]);
        setQuiz([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [subject, exam, topic, difficulty]);

  const chooseAnswer = (qId, answer) =>
    setAnswers((p) => ({ ...p, [qId]: answer }));

  const replaceQuestion = (index) => {
    const removed = quiz[index];
    const remainingPool = pool.filter((q) => q.id !== removed.id);
    const randomNew = remainingPool[Math.floor(Math.random() * remainingPool.length)];
    let updated = quiz.filter((_, i) => i !== index);
    if (randomNew) updated.push(randomNew);

    const updatedAnswers = { ...answers };
    delete updatedAnswers[removed.id];

    setAnswers(updatedAnswers);
    setPool(remainingPool);
    setQuiz(updated);
  };

  const downloadPDF = () => {
    if (!quiz.length) return;

    const doc = new jsPDF();
    const isPremium = userPlan === "premium";
    const isStandard = userPlan === "standard";

    // Title
    doc.setFontSize(16);
    doc.text(`Quiz — ${subject} / ${topic} (${difficulty})`, 14, 14);

    // Membership Badge
    if (isPremium) {
      doc.setTextColor(180, 0, 0);
      doc.setFontSize(26);
      doc.text("★ PREMIUM MEMBER ★", 105, 12, { align: "right" });
    } else if (isStandard) {
      doc.setTextColor(0, 70, 200);
      doc.setFontSize(18);
      doc.text("STANDARD MEMBER", 105, 12, { align: "right" });
    }

    doc.setTextColor(0, 0, 0);

    const tableRows = quiz.map((q, index) => [
      `${index + 1}. ${q.question}`,
      q.options.map((o) => `• ${o}`).join("\n"),
    ]);

    autoTable(doc, {
      head: [["Soru", "Şıklar"]],
      body: tableRows,
      startY: isPremium || isStandard ? 26 : 22,
      styles: { cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 95 }, 1: { cellWidth: 95 } },
    });

    if (isPremium) {
      doc.setFontSize(60);
      doc.setTextColor(240, 0, 0, 30);
      doc.text("PREMIUM", 55, 150, { angle: 35 });
    }

    doc.save(`${subject}_${topic}_${difficulty}_Quiz.pdf`);
  };

  const finishQuiz = () => {
    const correctCount = quiz.filter((q) => answers[q.id] === q.correct).length;
    const total = quiz.length;
    const scorePercent = Math.round((correctCount / total) * 100);

    updateProgress(subject, topic, scorePercent);

    if (onFinish)
      onFinish({
        quiz,
        answers,
        correctCount,
        total,
        scorePercent,
        score: correctCount,
      });
  };

  if (loading) return <p className="text-center">⏳ Sorular yükleniyor...</p>;
  if (!quiz.length) return <p className="text-center text-red-600">❌ Seçilen konu için soru bulunamadı.</p>;

  return (
    <div className="relative p-4 bg-white rounded shadow space-y-6">

      {/* PDF butonu yalnızca quiz yüklendiyse ve premium/standard kullanıcıysa */}
      {quiz.length > 0 && (userPlan === "premium" || userPlan === "standard") && (
        <button
          onClick={downloadPDF}
          className="absolute top-3 right-3 px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 shadow"
        >
          📄 PDF İndir
        </button>
      )}

      <h2 className="text-xl font-bold mb-2">
        🧠 Quiz — {subject} / {topic} ({difficulty})
      </h2>

      {quiz.map((q, i) => (
        <div key={q.id} className="p-3 border rounded bg-gray-50 space-y-2">
          <p className="font-semibold">{i + 1}. {q.question}</p>
          {q.options.map((opt, idx) => (
            <label key={idx} className="block cursor-pointer">
              <input
                type="radio"
                name={`q-${q.id}`}
                className="mr-2"
                checked={answers[q.id] === opt}
                onChange={() => chooseAnswer(q.id, opt)}
              />
              {opt}
            </label>
          ))}

          <button
            onClick={() => replaceQuestion(i)}
            className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Soruyu Kaldır & Yenisi Gelsin 🔄
          </button>
        </div>
      ))}

      <button
        onClick={finishQuiz}
        disabled={Object.keys(answers).length < quiz.length}
        className="px-4 py-2 bg-green-600 text-white rounded w-full hover:bg-green-700 disabled:bg-gray-300"
      >
        🏁 Quiz’i Bitir ve Sonuçları Gör
      </button>
    </div>
  );
}
