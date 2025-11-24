"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../lib/firebase";

export default function QuizPage() {
  const router = useRouter();
  const { topic, mode } = router.query; // mode: 'quiz' veya 'final'

  const [quizData, setQuizData] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userExam, setUserExam] = useState(null); // ← sınav türü (tyt / ayt)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) return router.push("/login");
      setUser(u);

      // kullanıcı sınav bilgisini Firestore'dan al
      const ref = doc(db, "users", u.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserExam(snap.data().exam); // "tyt" veya "ayt"
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    // userExam olmadan fetch çalışmasın
    if (!topic || !mode || !userExam) return;

    const fetchQuiz = async () => {
      try {
        const fileName =
          mode === "quiz" ? `${topic}.json` : `${topic}_final.json`;

        const res = await fetch(`/content/quizData/${userExam}/${fileName}`); // ← dinamik hale getirildi
        const data = await res.json();
        setQuizData(data.questions);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [topic, mode, userExam]);

  const handleAnswer = (idx, ans) => {
    setAnswers({ ...answers, [idx]: ans });
  };

  const handleSubmit = async () => {
    if (!user) return;

    let correctCount = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] === q.correct) correctCount++;
    });

    const score = (correctCount / quizData.length) * 100;
    alert(`✅ Başarı: ${score.toFixed(0)}%`);

    if (!topic || !mode) return;

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const topics = snap.data().topics.map((t) => {
      if (t.name !== topic) return t;

      if (mode === "quiz" && score >= 60) {
        return { ...t, quiz: true, final: false, finalUnlocked: true };
      }
      if (mode === "final" && score >= 60) {
        return { ...t, final: true, completed: true, quiz: true };
      }
      return t;
    });

    await updateDoc(ref, { topics });

    if (mode === "quiz") {
      alert("🔥 Quiz tamamlandı! Son test aktif edildi.");
      router.push(`/dashboard`);
    }
    if (mode === "final") {
      alert("🎉 Konu başarıyla tamamlandı! Bir sonraki konu açıldı.");
      router.push(`/dashboard`);
    }
  };

  if (loading || !userExam) return <p>Yükleniyor...</p>;
  if (!quizData.length) return <p>Quiz bulunamadı.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {mode === "quiz" ? "Quiz" : "Son Test"}: {topic}
      </h1>

      <div className="space-y-6">
        {quizData.map((q, idx) => (
          <div key={idx} className="p-4 border rounded">
            <p className="mb-2 font-semibold">
              {idx + 1}. {q.question}
            </p>
            <div className="space-x-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(idx, opt)}
                  className={`px-3 py-1 rounded border ${
                    answers[idx] === opt
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {mode === "quiz" ? "Quiz'i Bitir" : "Son Testi Bitir"}
      </button>
    </div>
  );
}
