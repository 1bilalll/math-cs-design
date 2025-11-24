import easy from "../content/userQuizQuestions/AYT/Parabol/easy.json";
import normal from "../content/userQuizQuestions/AYT/Parabol/normal.json";
import hard from "../content/userQuizQuestions/AYT/Parabol/hard.json";

const levels = { easy, normal, hard };

// removed = çıkarılan soru ID'leri
export const generateQuiz = (level, removed = []) => {
  const pool = levels[level]; 

  const available = pool.filter(q => !removed.includes(q.id));

  return available
    .sort(() => 0.5 - Math.random()) // rastgele soru seçme
    .slice(0, 10); // 10 soru seç
};

