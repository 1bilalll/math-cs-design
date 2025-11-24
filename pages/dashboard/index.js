"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

import Gamification from "../../components/Gamification";
import DashboardProgress from "../../components/DashboardProgress";
import TopicMap from "../../components/TopicMap";
import ExamProgress from "../../components/ExamProgress";
import QuizRunner from "../../components/QuizRunner";
import QuizPage from "../../components/QuizPage";
import DailyRoadmap from "../../components/DailyRoadmap";
import WeeklyReport from "../../components/WeeklyReport";
import PremiumContent from "../../components/PremiumContent";
import ReportPDFButton from "../../components/ReportPDFButton";



// --- DEFAULT TOPICS ---
const DEFAULT_TOPICS = {
  AYT: [
  { name: "Fonksiyonlar1", exam: "AYT", completed: false, quiz: false, final: false, locked: false },
  { name: "Fonksiyonlar2", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Fonksiyonlar3", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Fonksiyonlar4", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Parabol1", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Parabol2", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Parabol3", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Limit", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Türev", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "İntegral", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Trigonometri", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Logaritma", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Karmaşık Sayılar", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Polinomlar", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Permütasyon - Kombinasyon - Olasılık", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Diziler", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "İndirgeme – Binom", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Rasyonel Sayılar ve Eşitsizlikler", exam: "AYT", completed: false, quiz: false, final: false, locked: true },
  
  
],

  TYT: [
  { name: "Temel Kavramlar1", exam: "TYT", completed: false, quiz: false, final: false, locked: false },
  { name: "Temel Kavramlar2", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Temel Kavramlar3", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Sayı Basamakları", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Bölme ve Bölünebilme", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "OBEB – OKEK", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Rasyonel Sayılar", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Ondalık Sayılar", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Kümeler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Üslü Sayılar", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Köklü Sayılar", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Çarpanlara Ayırma", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Oran – Orantı", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Denklemler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Problemler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Geometri – Üçgenler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Geometri – Çokgenler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Geometri – Dörtgenler ve Yamuk", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Geometri – Çember ve Daire", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
  { name: "Veri – İstatistik – Grafikler", exam: "TYT", completed: false, quiz: false, final: false, locked: true },
]

};

function ExclusiveContent() {
  return <PremiumContent />;
}

// --- ADMIN PANELİ ---
function UserApprovalList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => !u.active));
    };
    fetchUsers();
  }, []);

  const approveUser = async (id, plan, exam) => {
    await updateDoc(doc(db, "users", id), { active: true, plan, exam });
    setUsers(users.map(u => u.id === id ? { ...u, active: true, plan, exam } : u));
  };

  return (
    <div className="space-y-3">
      {users.map(u => (
        <div key={u.id} className="p-3 border rounded flex justify-between items-center">
          <span>{u.email}</span>
          <div className="flex gap-2">
            <select id={`plan-${u.id}`}>
              <option value="student">Student</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
            <select id={`exam-${u.id}`}>
              <option value="AYT">AYT</option>
              <option value="TYT">TYT</option>
            </select>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => {
                const planSelect = document.getElementById(`plan-${u.id}`);
                const examSelect = document.getElementById(`exam-${u.id}`);
                approveUser(u.id, planSelect.value, examSelect.value);
              }}
            >
              Onayla
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- DASHBOARD ---
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState("");
  const [xp, setXP] = useState(0);
  const [progress, setProgress] = useState(0);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [quizMode, setQuizMode] = useState(null);

  const calculateOverallProgress = (topicsArray) => {
    if (!topicsArray.length) return 0;
    const sum = topicsArray.reduce((acc, t) => {
      const p = (t.completed ? 25 : 0) + (t.quiz ? 50 : 0) + (t.final ? 25 : 0);
      return acc + p / 100;
    }, 0);
    return Math.round((sum / topicsArray.length) * 100);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return (window.location.href = "/login");

      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return alert("Kullanıcı bilgisi bulunamadı. Admin tarafından eklenmiş olmalı.");
      }

      const d = snap.data();

      if (!d.active) {
        await signOut(auth);
        setLoading(false);
        return alert("Henüz hesabınız aktif edilmedi. Lütfen admin bekleyin.");
      }

      const examKey = (d.exam || "").toUpperCase();
      setUser({ ...currentUser, exam: examKey });
      setPlan(d.plan || "student");
      setXP(d.xp || 0);
      setProgress(d.progress || 0);

      // --- DEFAULT TOPICS YÜKLEME (Güncellendi) ---
      if (!d.topics || !d.topics.length) {
        const initialTopics = DEFAULT_TOPICS[examKey] || [];
        setTopics(initialTopics);
        await updateDoc(doc(db, "users", currentUser.uid), { topics: initialTopics });
      } else {
        setTopics(d.topics.map(t => ({ ...t, exam: examKey })));
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleQuizFinish = async (result) => {
    if (!result) return;

    const updatedTopics = topics.map((t) => {
      if (t.name === result.topic) {
        const passed = result.percentage >= 75;
        return { ...t, quiz: passed };
      }
      return t;
    });

    const gainedXP = (result.correctCount ?? 0) * 10;
    const newXP = xp + gainedXP;
    const newProgress = calculateOverallProgress(updatedTopics);

    await updateDoc(doc(db, "users", user.uid), {
      xp: newXP,
      progress: newProgress,
      topics: updatedTopics,
    });

    setXP(newXP);
    setTopics(updatedTopics);
    setProgress(newProgress);

    alert(
      `🔥 Quiz tamamlandı! ${result.percentage}% başarı ile +${gainedXP} XP\n` +
        (result.percentage >= 75 ? "🎉 Tebrikler! Son teste geçebilirsiniz" : "😕 Quiz başarısız, tekrar deneyin")
    );

    setActivePage("topicMap");
    setSelectedTopic(null);
    setQuizMode(null);
  };

  const handleFinalFinish = async (result) => {
    if (!result) return;

    const updatedTopics = topics.map((t) => {
      if (t.name === result.topic) {
        const passed = result.percentage >= 65;
        return { ...t, final: passed, completed: passed };
      }
      return t;
    });

    for (let i = 0; i < updatedTopics.length - 1; i++) {
      if (updatedTopics[i]?.completed) {
        updatedTopics[i + 1] = { ...updatedTopics[i + 1], locked: false };
      }
    }

    const newProgress = calculateOverallProgress(updatedTopics);

    await updateDoc(doc(db, "users", user.uid), {
      topics: updatedTopics,
      progress: newProgress,
    });

    setTopics(updatedTopics);
    setProgress(newProgress);

    alert(
      `🏁 Son test tamamlandı! ${result.percentage}% başarı ile konu tamamlandı.\n` +
        (result.percentage >= 65 ? "🎉 Tebrikler! Bir sonraki konuya geçebilirsiniz" : "😕 Başarı oranı düşük, tekrar deneyin")
    );

    setActivePage("topicMap");
    setSelectedTopic(null);
    setQuizMode(null);
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  if (loading) return <p className="text-center mt-20">Yükleniyor...</p>;

  const menu = [
    { id: "home", text: "Ana Sayfa", roles: ["student", "standard", "premium", "admin"] },
    { id: "topicMap", text: "Konu Haritası", roles: ["student", "standard", "premium", "admin"] },
    { id: "quiz", text: "Quiz", roles: ["student", "standard", "premium", "admin"] },
    { id: "dailyRoadmap", text: "Günlük Çalışma Planı", roles: ["standard", "premium", "admin"] },
    { id: "premiumPlus", text: "Premium Özel", roles: ["premium", "admin"] },
    { id: "adminPanel", text: "Admin Panelı", roles: ["admin"] },
    { id: "weeklyReport", text: "Haftalık Rapor", roles: ["student", "standard", "premium", "admin"] },
  ];

  const renderPage = () => {
    if (quizMode && selectedTopic) {
      return (
        <QuizRunner
          exam={user?.exam}
          topic={selectedTopic}
          mode={quizMode}
          onFinish={quizMode === "quiz" ? handleQuizFinish : handleFinalFinish}
        />
      );
    }

    switch (activePage) {
      case "home":
        return (
          <>
            <h1 className="text-2xl font-bold mb-6">Hoş geldin {user.email} 👋</h1>
            <DashboardProgress progress={progress} />
            <Gamification totalXP={xp} userPlan={plan} />
            <ExamProgress topics={topics.filter(t => t.exam === user.exam)} />
            <ReportPDFButton userId={user.uid} plan={plan} />

          </>
        );
      case "weeklyReport":
        return <WeeklyReport />;
      case "topicMap":
        return (
          <>
            <h1 className="text-2xl font-bold mb-4">🧭 Konu Haritası</h1>
            <TopicMap
              exam={user.exam}
              topics={topics.filter(t => t.exam === user.exam)}
              onUpdate={async (updatedTopics) => {
                const mergedTopics = topics.map(t => {
                  const updated = updatedTopics.find(u => u.name === t.name);
                  return updated ? updated : t;
                });
                setTopics(mergedTopics);
                const newProgress = calculateOverallProgress(mergedTopics);
                setProgress(newProgress);
                await updateDoc(doc(db, "users", user.uid), {
                  topics: mergedTopics,
                  progress: newProgress,
                });
              }}
              onStartQuiz={(topicName) => {
                setSelectedTopic(topicName);
                setQuizMode("quiz");
              }}
              onStartFinal={(topicName) => {
                setSelectedTopic(topicName);
                setQuizMode("final");
              }}
            />
            <div className="mt-6">
              <ExamProgress topics={topics.filter(t => t.exam === user.exam)} />
            </div>
          </>
        );
      case "quiz":
        return <QuizPage allowed={true} onQuizFinish={handleQuizFinish} />;
      case "dailyRoadmap":
        return <DailyRoadmap />;
      case "premiumPlus":
        return <ExclusiveContent />;
      case "adminPanel":
        return <UserApprovalList />;
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {menu
          .filter((i) => i.roles.includes(plan))
          .map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActivePage(item.id);
                setQuizMode(null);
                setSelectedTopic(null);
              }}
              className={`block w-full text-left px-4 py-2 rounded transition ${
                activePage === item.id ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              {item.text}
            </button>
          ))}

        <button onClick={logout} className="mt-10 w-full bg-red-600 py-2 rounded hover:bg-red-700">
          Çıkış Yap
        </button>
      </aside>

      <main className="flex-1 p-10 bg-gray-100 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
