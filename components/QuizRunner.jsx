"use client";
import { useEffect, useState } from "react";

export default function QuizRunner({ exam, topic, mode = "quiz", onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!exam || !topic) {
        setError("❌ Sınav veya konu bilgisi eksik");
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/load-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folder: mode === "quiz" ? "quizData" : "finalTests",
            exam,
            topic: mode === "quiz" ? topic : `${topic}_final`
          })
        });

        const json = await res.json();

        if (!json.success) throw new Error(json.message || "Quiz yüklenemedi");

        const data = Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.data?.questions)
          ? json.data.questions
          : null;

        if (!data || !data.length) throw new Error("Quiz formatı hatalı veya boş");

        setQuestions(data);
        setAnswers({});
        setResult(null);
      } catch (err) {
        console.error(err);
        setError(err.message || "❌ Quiz yüklenirken bir hata oluştu");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [exam, topic, mode]);

  const selectAnswer = (qIndex, option) => {
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const finish = () => {
    if (!questions.length) return;

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });

    const percentage = Math.round((correct / questions.length) * 100);
    setResult({ correct, percentage });

    if (onFinish && typeof onFinish === "function") {
      onFinish({
        topic,
        correctCount: correct,
        percentage,
        total: questions.length,
        mode
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Yükleniyor...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!questions.length) return <p className="text-center mt-10">❌ Quiz bulunamadı</p>;

  if (result)
    return (
      <div className="p-6 bg-white rounded-xl shadow max-w-xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-bold">
          {mode === "quiz"
            ? result.percentage >= 75
              ? "🎉 Tebrikler! Son teste geçebilirsiniz"
              : "😕 Tekrar dene"
            : result.percentage >= 65
            ? "🎉 Tebrikler! Bir sonraki konuya geçebilirsiniz"
            : "😕 Başarı düşük"}
        </h2>
        <p className="text-lg font-semibold">%{result.percentage} başarı</p>
        <button
          onClick={() => onFinish?.({ ...result, topic, mode })}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Tamamla
        </button>
      </div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">
        {topic} — {mode === "quiz" ? "Quiz" : "Son Test"} ({questions.length} soru)
      </h2>

      {questions.map((q, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <p className="font-semibold">{index + 1}) {q.question}</p>
          <div className="grid gap-2">
            {q.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(index, opt)}
                className={`p-2 rounded border ${
                  answers[index] === opt ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        disabled={Object.keys(answers).length !== questions.length}
        onClick={finish}
        className="w-full py-3 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Bitir
      </button>
    </div>
  );
}
