"use client";

import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function Footer() {
  const { language } = useContext(LanguageContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const texts = {
    en: {
      platform: "Interactive mathematics & computer science learning platform.",
      links: {
        about: "About",
        blog: "Blog",
        exams: "Exams",
        contact: "Contact",
      },
      modals: {
        about: "Math & CS is designed to make learning math and computer science interactive and fun. I am Bilal Arslan, a math teacher for 10 years and a computer engineering student. I designed this site to make learning easier and enjoyable for everyone.",
        blog: "Math & CS Blog: Here you will find updates, tips, and educational articles about math and computer science. Follow the blog for short guides and learning tips.",
        exams: "Practice Exams: Here you can test your knowledge in mathematics and computer science with interactive quizzes and sample exams. Questions are designed to improve your problem-solving skills and critical thinking. Suitable for beginners and advanced learners alike.",
        contact: "Contact me here! You can send your questions, suggestions, or collaboration proposals. Email: info@mathcs.com",
      },
    },
    tr: {
      platform: "Etkileşimli matematik ve bilgisayar bilimi öğrenme platformu.",
      links: {
        about: "Hakkımızda",
        blog: "Blog",
        exams: "Sınavlar",
        contact: "İletişim",
      },
      modals: {
        about: "Math & CS, matematik ve bilgisayar bilimlerini etkileşimli ve eğlenceli hale getirmek için tasarlanmış bir platformdur. Ben Bilal Arslan, 10 yıllık matematik öğretmeniyim ve aynı zamanda bilgisayar mühendisliği okuyorum. Bu siteyi öğrencilerin öğrenmeyi daha kolay ve eğlenceli hale getirmesi için tasarladım.",
        blog: "Math & CS Blog: Matematik ve bilgisayar bilimi ile ilgili güncellemeler, ipuçları ve öğretici makaleler burada yer alacak. Öğrenme sürecinizi destekleyecek kısa rehberler ve öneriler için blogu takip edebilirsiniz.",
        exams: "Sınavlar: Matematik ve bilgisayar bilimi bilgilerinizi interaktif quizler ve örnek sınavlarla test edebilirsiniz. Sorular, problem çözme ve eleştirel düşünme becerilerinizi geliştirmek için tasarlanmıştır. Hem yeni başlayanlar hem de ileri seviyedeki öğrenciler için uygundur.",
        contact: "Bana ulaşmak için buradan mesaj gönderebilirsiniz. Soru, öneri veya işbirliği teklifleri için her zaman açığım. Email: barslan2021@gtu.edu.tr",
      },
    },
  };

  const handleOpenModal = (type) => {
    setModalContent({ title: texts[language].links[type], text: texts[language].modals[type] });
    setOpenModal(true);
  };

  return (
    <footer className="w-full border-t bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-slate-600">
        <p className="font-semibold text-slate-700">Math & CS</p>
        <p className="text-sm mt-1">{texts[language].platform}</p>

        <div className="flex justify-center gap-6 mt-4 text-sm">
          <button onClick={() => handleOpenModal("about")} className="hover:underline">
            {texts[language].links.about}
          </button>
          <button onClick={() => handleOpenModal("blog")} className="hover:underline">
            {texts[language].links.blog}
          </button>
          <button onClick={() => handleOpenModal("exams")} className="hover:underline">
            {texts[language].links.exams}
          </button>
          <button onClick={() => handleOpenModal("contact")} className="hover:underline">
            {texts[language].links.contact}
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
  © {new Date().getFullYear()} Math & CS — All rights reserved.
</p>

<p className="text-[11px] text-slate-400 mt-1">
  Designed & Developed by{" "}
  <a
    href="https://github.com/1bilalll"
    target="_blank"
    className="font-medium text-slate-500 hover:text-slate-700 transition"
  >
    Bilal Arslan
  </a>
</p>

      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-slate-700">{modalContent.text}</p>
          </div>
        </div>
      )}
    </footer>
  );
}
