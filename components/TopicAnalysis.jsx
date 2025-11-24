"use client";

export default function TopicAnalysis({ result, allowed = true }) {
  if (!allowed) return null;

  if (!result || !result.quiz || !result.answers) {
    return (
      <div className="p-4 bg-yellow-100 rounded mt-4 text-yellow-900">
        📌 Analiz yapılabilmesi için önce quiz çözmelisin.
      </div>
    );
  }

  const { quiz, answers } = result;

  const stats = {
    total: quiz.length,
    correct: 0,
    wrong: 0,
    subtopics: {},
    types: {},
    difficulty: {},
  };

  quiz.forEach((q) => {
    const userAnswer = answers[q.id];
    const correctAnswer = q.correct;

    const isCorrect = userAnswer === correctAnswer;
    if (isCorrect) stats.correct++;
    else stats.wrong++;

    // Alt konu (subtopic) kontrolü
    const subtopic = q.subtopic || "Genel";
    if (!stats.subtopics[subtopic]) stats.subtopics[subtopic] = { correct: 0, wrong: 0 };
    stats.subtopics[subtopic][isCorrect ? "correct" : "wrong"]++;

    // Soru tipi (type) kontrolü
    const type = q.type || "Genel";
    if (!stats.types[type]) stats.types[type] = { correct: 0, wrong: 0 };
    stats.types[type][isCorrect ? "correct" : "wrong"]++;

    // Zorluk seviyesi kontrolü
    const difficultyLevel = q.difficulty || "unknown";
    if (!stats.difficulty[difficultyLevel]) stats.difficulty[difficultyLevel] = { correct: 0, wrong: 0 };
    stats.difficulty[difficultyLevel][isCorrect ? "correct" : "wrong"]++;
  });

  const weakSubtopics = Object.entries(stats.subtopics)
    .filter(([_, v]) => v.wrong > v.correct)
    .map(([k]) => k);

  const weakTypes = Object.entries(stats.types)
    .filter(([_, v]) => v.wrong > v.correct)
    .map(([k]) => k);

  return (
    <div className="p-6 bg-white rounded shadow space-y-6 mt-6">
      <h2 className="text-2xl font-bold">📊 Konu Analizi (İstatistiksel)</h2>

      <p className="text-lg">
        🎯 Başarı: <strong>{stats.correct}</strong> doğru / {stats.total} soru
      </p>

      <hr />

      <div>
        <h3 className="text-xl font-semibold mb-2">📌 Alt Konular</h3>
        {Object.entries(stats.subtopics).map(([sub, v]) => (
          <p key={sub}>🔹 {sub}: {v.correct} doğru / {v.wrong} yanlış</p>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📌 Soru Tipleri</h3>
        {Object.entries(stats.types).map(([type, v]) => (
          <p key={type}>🔹 {type}: {v.correct} doğru / {v.wrong} yanlış</p>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📌 Zorluk Seviyeleri</h3>
        {Object.entries(stats.difficulty).map(([dif, v]) => (
          <p key={dif}>🔹 {dif}: {v.correct} doğru / {v.wrong} yanlış</p>
        ))}
      </div>

      <hr />

      <div>
        <h3 className="text-xl font-semibold text-red-600">
          📌 Önerilen Tekrar Edilecek Konular
        </h3>

        {weakSubtopics.length === 0 && weakTypes.length === 0 && (
          <p className="text-green-600 font-medium">Harika! Belirgin bir zayıf alan yok 👏</p>
        )}

        {weakSubtopics.length > 0 && (
          <p>❗ Zorlandığın alt konular: <strong>{weakSubtopics.join(", ")}</strong></p>
        )}

        {weakTypes.length > 0 && (
          <p>⚠ Zorlandığın soru tipleri: <strong>{weakTypes.join(", ")}</strong></p>
        )}
      </div>
    </div>
  );
}
