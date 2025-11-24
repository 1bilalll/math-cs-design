"use client";

export default function QuizResult({ result, restart, allowed = true }) {
  if (!result || !result.quiz || !result.answers) {
    return (
      <div className="p-6 bg-yellow-100 rounded shadow text-yellow-900">
        📌 Quiz çözmeden sonuç ekranına erişemezsiniz.
      </div>
    );
  }

  const { quiz, answers, correctCount, total, scorePercent } = result;

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">📊 Quiz Sonuçları</h2>

      <p className="text-lg">
        🎯 <strong>{correctCount}</strong> doğru / {total} soru – <strong>%{scorePercent}</strong> başarı
      </p>

      <hr />

      {quiz.map((q, idx) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correct;

        return (
          <div key={q.id} className="p-4 border rounded bg-gray-50 space-y-2">
            <p className="font-semibold">{idx + 1}. {q.question}</p>

            <p>
              📌 Senin cevabın:{" "}
              <span className={isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {userAnswer || "—"}
              </span>
            </p>

            {!isCorrect && (
              <p>✔ Doğru cevap: <span className="text-green-700 font-bold">{q.correct}</span></p>
            )}
          </div>
        );
      })}

      <button
        onClick={restart}
        className="px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
      >
        🔁 Yeni Quiz Başlat
      </button>
    </div>
  );
}
