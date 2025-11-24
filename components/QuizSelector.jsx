"use client";
import { useState, useEffect } from "react";

export default function QuizSelector({ onSelect }) {
  const [plan, setPlan] = useState(null);
  const [exams, setExams] = useState([]);

  const subjects = {
    Math: {
      TYT: [ "Temel Kavramlar","Sayı Basamakları","Bölme-Bölünebilme","Üslü Sayılar", "Mutlak Değer","Köklü Sayılar"],
      AYT: ["Fonksiyonlar","Polinomlar","İkinci Dereceden Denklemler","Parabol","Eşitsizlikler","Logaritma","Limit","İntegral", "Trigonometri", ],
      SAT: ["Functions", "Probability"]
    },
    CS: {
      Midterm: ["Algorithms", "Data Structures"],
      Final: ["Operating Systems", "DBMS", "Network"]
    }
  };

  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const storedPlan = localStorage.getItem("userPlan"); // signup sonrası plan
    setPlan(storedPlan);
  }, []);

  const filteredSubjects = Object.keys(subjects).filter((sub) => {
    if (plan === "student") return sub === "Math";
    if (plan === "standard") return ["Math", "CS"].includes(sub);
    return true;
  });

  const difficultyOptions = plan === "standard" ? ["easy", "normal"] : ["easy", "normal", "hard"];

  useEffect(() => {
    if (!subject) return;
    setExams(Object.keys(subjects[subject] || {}));
    setExam("");
    setTopic("");
  }, [subject]);

  const handleSubmit = () => {
    if (!subject || !exam || !topic || !difficulty) {
      alert("Lütfen tüm seçimleri tamamla!");
      return;
    }
    onSelect({ subject, exam, topic, difficulty });
  };

  if (!plan) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-red-600 text-xl font-semibold">Bu bölüme erişim izniniz yok.</h2>
        <p>Quiz seçebilmek için bir paket atanmalıdır.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded shadow mb-4 space-y-4">
      <h2 className="text-xl font-bold">📌 Quiz Alanı Seçimi</h2>

      <select className="border p-2 rounded w-full" onChange={(e) => { setSubject(e.target.value); setExam(""); setTopic(""); }}>
        <option value="">Ders Seç</option>
        {filteredSubjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
      </select>

      <select className="border p-2 rounded w-full" disabled={!subject} onChange={(e) => { setExam(e.target.value); setTopic(""); }}>
        <option value="">Sınav Seç</option>
        {exams.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
      </select>

      <select className="border p-2 rounded w-full" disabled={!exam} onChange={(e) => setTopic(e.target.value)}>
        <option value="">Konu Seç</option>
        {subject && exam && subjects[subject][exam]?.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select className="border p-2 rounded w-full" onChange={(e) => setDifficulty(e.target.value)}>
        <option value="">Zorluk Seç</option>
        {difficultyOptions.map((dif) => <option key={dif} value={dif}>{dif}</option>)}
      </select>

      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded w-full hover:bg-blue-700">
        Devam Et → Quiz Oluştur
      </button>
    </div>
  );
}
