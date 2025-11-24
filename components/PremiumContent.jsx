"use client";
import { useState } from "react";

export default function PremiumContent() {
  const [activeTab, setActiveTab] = useState("notes");

  const tabs = [
    { id: "notes", label: "📚 PDF & Notlar" },
    { id: "videos", label: "🎥 Video Dersler" },
    { id: "questions", label: "🧠 Özel Soru Bankası" },
    { id: "bonus", label: "🚀 Bonus Kaynaklar" },
  ];

  // TIKLANINCA PDF / LİNK / VİDEO açma
  const openContent = (url) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">💎 Premium Özel İçerikler</h1>
      <p className="text-gray-600">Premium üyeler için özel hazırlanmış kaynaklar</p>

      {/* TAB MENÜSÜ */}
      <div className="flex gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded transition ${
              activeTab === t.id ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB İÇERİKLERİ */}
      <div className="mt-4 p-5 border rounded bg-gray-50">
        {activeTab === "notes" && (
          <ul className="space-y-3">
            <li
              onClick={() => openContent("/content/premium/pdf/ayt_matematik_ozet.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              📄 AYT Matematik Özet Notlar (PDF)
            </li>
            <li
              onClick={() => openContent("/content/premium/pdf/tyt_geometri_formul.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              📄 TYT Geometri Formül Seti (PDF)
            </li>
            <li
              onClick={() => openContent("/content/premium/pdf/soru_tipi_rehber.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              📄 Soru Tipleri Rehberi — 2025
            </li>
          </ul>
        )}

        {activeTab === "videos" && (
          <ul className="space-y-3">
            <li
              onClick={() => openContent("https://youtu.be/xxxx")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🎥 Limit & Türev Full Kamp — 6 Saat Video
            </li>
            <li
              onClick={() => openContent("https://youtu.be/yyyy")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🎥 Problemler & Sayı Problemleri Özel Eğitim
            </li>
            <li
              onClick={() => openContent("https://youtu.be/zzzz")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🎥 Trigonometri Hızlandırılmış Tekrar
            </li>
          </ul>
        )}

        {activeTab === "questions" && (
          <ul className="space-y-3">
            <li
              onClick={() => openContent("/content/premium/questions/ayt_200.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🧠 200 Soruluk AYT Çıkabilecekler Paketi
            </li>
            <li
              onClick={() => openContent("/content/premium/questions/tyt_150.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🧠 TYT Yeni Nesil Problem Seti — 150 Soru
            </li>
            <li
              onClick={() => openContent("/content/premium/questions/trigo_80.pdf")}
              className="p-3 rounded bg-white shadow cursor-pointer hover:bg-gray-100"
            >
              🧠 Trigonometri Seviye Atlatan Set — 80 Soru
            </li>
          </ul>
        )}

        {activeTab === "bonus" && (
          <div className="space-y-4">
            <div
              onClick={() => openContent("/content/premium/bonus/kamp_takvim.pdf")}
              className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
            >
              🔥 Hızlı Tekrar Kampı Takvim Planı
            </div>
            <div
              onClick={() => openContent("/content/premium/bonus/kesin_konular.pdf")}
              className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
            >
              🎯 2025 Çıkması Kesin Konular Listesi
            </div>
            <div
              onClick={() => openContent("https://chat.whatsapp.com/XXXX")}
              className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
            >
              💬 Premium WhatsApp Grup Daveti (Sabit Rehberlik)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
