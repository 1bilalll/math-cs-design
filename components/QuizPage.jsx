"use client";
import { useState } from "react";
import QuizSelector from "./QuizSelector";
import QuizBuilder from "./QuizBuilder";
import QuizResult from "./QuizResult";

export default function QuizPage({ allowed = true, onQuizFinish }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  if (!allowed) {
    return (
      <div className="p-4 bg-red-50 rounded border border-red-200 text-red-700 mb-4">
        🔒 Bu içerik planınıza dahil değil. Lütfen planınızı yükseltin.
      </div>
    );
  }

  const handleFinish = (quizResult) => {
    setResult(quizResult);
    if (onQuizFinish) onQuizFinish(quizResult);
  };

  if (result) {
    return (
      <QuizResult
        result={result}
        restart={() => { setResult(null); setSelected(null); }}
      />
    );
  }

  if (!selected) return <QuizSelector onSelect={setSelected} />;

  return <QuizBuilder selected={selected} onFinish={handleFinish} />;
}
