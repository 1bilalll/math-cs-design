"use client";

import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { Brain, Code, Target, Medal } from "lucide-react";

export default function WhyCards() {
  const { language } = useContext(LanguageContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const texts = {
    en: {
      heading: "Why Math & CS?",
      items: [
        {
          icon: <Brain size={32} />,
          title: "Critical Thinking",
          text: "Build strong analytical and problem-solving skills.",
          modalContent: {
            title: "Critical Thinking",
            video: "https://www.youtube.com/embed/Bry8J78Awq0",
            description: "Develop your logical reasoning and problem-solving skills through challenging exercises.",
            bullets: ["Analyze complex problems", "Improve decision making", "Critical reasoning skills"],
          },
        },
        {
          icon: <Code size={32} />,
          title: "Tech-Ready Skills",
          text: "Learn the fundamentals behind every modern technology.",
          modalContent: {
            title: "Tech-Ready Skills",
            video: "https://www.youtube.com/embed/VIDEO_ID_TECH",
            description: "Master coding and technology concepts to be ready for the modern tech industry.",
            bullets: ["Learn programming languages", "Understand tech fundamentals", "Build projects"],
          },
        },
        {
          icon: <Target size={32} />,
          title: "Real-World Applications",
          text: "Apply knowledge to science, engineering, economics and more.",
          modalContent: {
            title: "Real-World Applications",
            video: "https://www.youtube.com/embed/uZ73ZsBkcus",
            description: "Use your skills in real-world projects and gain practical experience.",
            bullets: ["Work on real projects", "Research applications", "Problem-solving in practice"],
          },
        },
        {
          icon: <Medal size={32} />,
          title: "Boost Your Career",
          text: "Gain high-demand skills for the future of work.",
          modalContent: {
            title: "Boost Your Career",
            video: "https://www.youtube.com/embed/-pdPxKMMg28",
            description: "Enhance your career with top skills demanded by employers in the tech and business world.",
            bullets: ["High-demand job skills", "Networking opportunities", "CV & portfolio tips"],
          },
        },
      ],
    },
    tr: {
      heading: "Neden Matematik & Bilgisayar Bilimi?",
      items: [
        {
          icon: <Brain size={32} />,
          title: "Eleştirel Düşünme",
          text: "Güçlü analitik ve problem çözme becerileri kazanın.",
          modalContent: {
            title: "Eleştirel Düşünme",
            video: "https://www.youtube.com/embed/Bry8J78Awq0",
            description: "Zorlu alıştırmalarla mantıksal düşünme ve problem çözme becerilerinizi geliştirin.",
            bullets: ["Karmaşık problemleri analiz et", "Karar verme becerilerini geliştir", "Eleştirel düşünme becerileri"],
          },
        },
        {
          icon: <Code size={32} />,
          title: "Teknolojiye Hazır Beceriler",
          text: "Her modern teknolojinin temelini öğrenin.",
          modalContent: {
            title: "Teknolojiye Hazır Beceriler",
            video: "https://www.youtube.com/embed/VIDEO_ID_TECH",
            description: "Modern teknoloji endüstrisine hazır olmak için kodlama ve teknoloji kavramlarını öğrenin.",
            bullets: ["Programlama dillerini öğren", "Teknoloji temellerini anla", "Projeler oluştur"],
          },
        },
        {
          icon: <Target size={32} />,
          title: "Gerçek Dünya Uygulamaları",
          text: "Bilgiyi bilim, mühendislik, ekonomi ve daha fazlasına uygulayın.",
          modalContent: {
            title: "Gerçek Dünya Uygulamaları",
            video: "https://www.youtube.com/embed/uZ73ZsBkcus",
            description: "Becerilerinizi gerçek dünya projelerinde kullanın ve deneyim kazanın.",
            bullets: ["Gerçek projelerde çalış", "Araştırma uygulamaları", "Pratik problem çözme"],
          },
        },
        {
          icon: <Medal size={32} />,
          title: "Kariyerinizi Güçlendirin",
          text: "Geleceğin iş dünyası için yüksek talep gören beceriler kazanın.",
          modalContent: {
            title: "Kariyerinizi Güçlendirin",
            video: "https://www.youtube.com/embed/-pdPxKMMg28",
            description: "İş dünyasında talep gören üst düzey beceriler kazanarak kariyerinizi güçlendirin.",
            bullets: ["Yüksek talep gören iş becerileri", "Networking fırsatları", "CV & portföy ipuçları"],
          },
        },
      ],
    },
  };

  const handleCardClick = (item) => {
    setModalData(item.modalContent);
    setOpenModal(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 text-center">{texts[language].heading}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {texts[language].items.map((item) => (
          <div
            key={item.title}
            onClick={() => handleCardClick(item)}
            className="bg-white rounded-xl shadow p-6 text-center hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="flex justify-center text-blue-600 mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-slate-600 mt-2">{item.text}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openModal && modalData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">

            {/* Close button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{modalData.title}</h2>

            {/* YouTube Video */}
            {modalData.video && (
              <iframe
                src={modalData.video}
                className="w-full rounded-lg aspect-video mb-4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            <p className="mb-4 text-slate-700">{modalData.description}</p>

            {modalData.bullets && (
              <ul className="list-disc pl-5 text-slate-600">
                {modalData.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
