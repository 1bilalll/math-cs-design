import { useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function Coaching() {
  const { language } = useContext(LanguageContext);
  const whatsappNumber = "+90XXXXXXXXXX"; // Uluslararası formatta

  const extraFeatures = [
    { text: language === "en" ? "Quiz generation" : "Quiz üretme" },
    { text: language === "en" ? "Topic completion roadmap" : "Konu bitirme haritası" },
    { text: language === "en" ? "Discord community" : "Discord topluluğu" },
  ];

  const plans = {
    en: [
      {
        title: "Student",
        price: "$99",
        billing: "/month",
        description: "Best for beginners — fast improvement with weekly progress tracking.",
        features: [
          
          { text: "1 private lesson per month (exclusive benefit)", total: "" }, // added
          ...extraFeatures,
        ],
      },
      {
        title: "Standard",
        price: "$899",
        billing: "/month",
        popular: true,
        description: "Most popular — high performance with weekly & daily supervision.",
        features: [
          { text: "2 private lessons per week", total: "≈8 lessons/month" },
          { text: "Advanced coaching & accountability", total: "" },
          { text: "Daily study roadmap", total: "" },
          { text: "Monthly performance report", total: "" },
          { text: "PDF generation" ,total:"" },
          ...extraFeatures,
        ],
      },
      {
        title: "Premium",
        price: "$1499",
        billing: "/month",
        description: "Designed for ambitious students who want maximum support and speed.",
        features: [
          { text: "3 private lessons per week", total: "≈18 lessons/month" },
          { text: "Unlimited private coaching", total: "" },
          { text: "Daily performance supervision", total: "" },
          { text: "Full exam simulation system", total: "" },
          { text: "24/7 WhatsApp support", total: "" },
          { text: "Exclusive study resources", total: "" },
          { text: "Code analysis" ,total: "" },
          { text: "PDF generation" ,total:""},
          ...extraFeatures,
        ],
      },
    ],
    tr: [
      {
        title: "Student",
        price: "$99",
        billing: "/ay",
        description: "Yeni başlayanlar için — haftalık takip ile hızlı ilerleme.",
        features: [
          
          { text: "Ayda 1 özel ders (abonelik avantajı)", total: "" }, // added
          ...extraFeatures,
        ],
      },
      {
        title: "Standart",
        price: "$899",
        billing: "/ay",
        popular: true,
        description: "En çok tercih edilen — haftalık ve günlük takip ile yüksek performans.",
        features: [
          { text: "Haftada 2 özel ders", total: "≈8 ders/ay" },
          { text: "Gelişmiş koçluk ve takip", total: "" },
          { text: "Günlük çalışma planı", total: "" },
          { text: "Aylık performans raporu", total: "" },
          { text: "PDF üretme" ,total:""},
          ...extraFeatures,
        ],
      },
      {
        title: "Premium",
        price: "$1499",
        billing: "/ay",
        description: "Hedefi büyük öğrenciler için maksimum destek ve hız.",
        features: [
          { text: "Haftada 3 özel ders", total: "≈18 ders/ay" },
          { text: "Sınırsız birebir koçluk", total: "" },
          { text: "Günlük performans takibi", total: "" },
          { text: "Tam sınav simülasyon sistemi", total: "" },
          { text: "7/24 WhatsApp desteği", total: "" },
          { text: "Özel kaynaklar", total: "" },
          { text: "Kod analizi", total:"" },
          { text: "PDF üretme" ,total:""},
          ...extraFeatures,
        ],
      },
    ],
  };

  return (
    <div className="px-6 py-20 max-w-6xl mx-auto text-center text-slate-900">
      <h1 className="text-4xl font-bold mb-3">
        {language === "en" ? "Math Coaching + 1:1 Mentorship 🌍" : "Matematik + Birebir Koçluk 🌍"}
      </h1>
      <p className="text-gray-600 text-lg mb-14 max-w-3xl mx-auto">
        {language === "en"
          ? "Choose the program that matches your goals. 1:1 lessons + mentorship + study planning + accountability — designed for maximum results."
          : "Hedefine uygun paketi seç. Birebir ders + koçluk + çalışma planı + takip — maksimum sonuç için tasarlandı."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans[language].map((plan, index) => (
          <div
            key={index}
            className={`p-8 rounded-2xl border shadow-lg transition transform hover:-translate-y-2 hover:shadow-2xl relative bg-white ${
              plan.popular ? "border-blue-500 scale-[1.05]" : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg">
                {language === "en" ? "MOST POPULAR" : "EN POPÜLER"}
              </span>
            )}

            <h2 className="text-2xl font-bold">{plan.title}</h2>
            <p className="mt-2 text-gray-500">{plan.description}</p>

            <p className="mt-6 text-4xl font-extrabold text-blue-600">
              {plan.price}
              <span className="text-lg font-medium text-slate-500">{plan.billing}</span>
            </p>

            <ul className="mt-6 space-y-2 text-left">
              {plan.features.map((item, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-blue-600 font-bold">✔</span>
                  <span>{item.text}</span>
                  {item.total && <span className="text-gray-400">{item.total}</span>}
                </li>
              ))}
            </ul>

            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello! I am interested in the ${plan.title} coaching plan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {language === "en" ? "Contact via WhatsApp" : "WhatsApp ile İletişime Geç"}
            </a>
          </div>
        ))}
      </div>

      <p className="mt-14 text-sm text-gray-500">
        {language === "en"
          ? "🔒 100% satisfaction guarantee — cancel anytime."
          : "🔒 %100 memnuniyet garantisi — istediğin zaman iptal edebilirsin."}
      </p>
    </div>
  );
}
