"use client";

import Link from "next/link";
import { useState, useContext, useRef, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import LogoAnimation from "../components/LogoAnimation";

export default function Header() {
  const router = useRouter();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);

  const [shrink, setShrink] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const [showExams, setShowExams] = useState(false);
  const examsTimer = useRef(null);

  const logoRef = useRef(null);
  const symbols = ["∑", "π", "∫", "f(x)", "!=", "< >", "0", "1"];

  const spawnAroundLogo = () => {
    const rect = logoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 14; i++) {
      const el = document.createElement("div");
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.position = "fixed";
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      el.style.fontSize = "18px";
      el.style.fontWeight = "600";
      el.style.pointerEvents = "none";
      el.style.color = "rgba(60, 60, 60, 0.9)";
      el.style.transition = "transform 1.3s ease-out, opacity 1.3s ease-out";
      document.body.appendChild(el);
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 60;
      requestAnimationFrame(() => {
        el.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(${1 + Math.random() * 0.4})`;
        el.style.opacity = "0";
      });
      setTimeout(() => el.remove(), 1300);
    }
  };

  const exams = [
    { name: "TYT", slug: "tyt", topics: ["temel kavramlar", "sayı basamakları","asal çarpanlara ayırma","ebob-ekok","1.dereceden denklemler","basit eşitsizlikler","mutlak değer","üslü sayılar","köklü sayılar"] },
    {
      name: "AYT",
      slug: "ayt",
      topics: [
        "fonksiyonlar",
        "polinomlar",
        "çarpanlara ayırma",
        "2-dereceden-denklem",
        "parabol",
        "eşitsizlikler",
        "logaritma",
        "diziler",
        "limit",
        "turev",
        "integral",
      ],
    },
    { name: "LGS", slug: "lgs", topics: ["çarpanlar ve katlar","üslü ifadeler","kareköklü ifadeler","veri analizi","basit olayların olasılığı","cebirsel ifadeler ve özdeşlikler","doğrusal denklemler","eşitsizlikler"] },
    { name: "SAT", slug: "sat", topics: ["hearth of algebra","problem solving&data analysis","passport to advanced math","additional topics in math"] },
    { name: "ACT", slug: "act", topics: ["algebra","functions","geometry","number & quantity","statistic & probability"] },
    { name: "BAC", slug: "bac", topics: [] },
    { name: "AP CALCULUS BC", slug: "ap-calculus-bc", topics: [] },
    { name: "ABITUR", slug: "abitur", topics: [] },
    { name: "A-LEVEL-MATHEMATİCS", slug: "a-level mathematics", topics:[] },
    { name: "GRE", slug: "gre", topics:[] },



  ];

  useEffect(() => {
    const onScroll = () => setShrink(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const searchIndex = exams.flatMap((exam) => [
    { name: exam.name, url: `/exams/${exam.slug}` },
    ...exam.topics.map((topic) => ({
      name: `${exam.name} → ${topic}`,
      url: `/exams/${exam.slug}/${topic}`,
    })),
  ]);

  const handleSearch = (value) => {
    setQuery(value);
    if (!value.trim()) return setResults([]);
    setResults(
      searchIndex.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const goToResult = (url) => {
    setQuery("");
    setResults([]);
    router.push(url);
  };

  return (
    <header
      className={`w-full border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        shrink ? "py-0" : "py-1"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* LOGO */}
        <div ref={logoRef} onMouseEnter={spawnAroundLogo}>
          <Link href="/" className="flex items-center">
            <LogoAnimation width={shrink ? 46 : 60} height={shrink ? 46 : 60} />
          </Link>
        </div>

        {/* NAV */}
        <nav className="hidden md:flex gap-6 font-medium text-slate-700 dark:text-slate-300 text-[15px]">
          <Link href="/">{language === "en" ? "Home" : "Ana Sayfa"}</Link>
          <Link href="/coaching">{language === "en" ? "Coaching" : "Koçluk"}</Link>

          {/* UPDATED EXAMS MENU */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(examsTimer.current);
              setShowExams(true);
            }}
            onMouseLeave={() => {
              examsTimer.current = setTimeout(() => setShowExams(false), 300);
            }}
          >
            <span className="cursor-pointer select-none">
              {language === "en" ? "Exams" : "Sınavlar"}
            </span>

            <div
              className={`
                absolute top-full left-0 mt-2 bg-white dark:bg-gray-800
                border dark:border-gray-700 shadow-lg rounded-lg
                p-2 w-56 flex flex-col gap-1 z-50 transition-all duration-200
                ${showExams ? "opacity-100 visible" : "opacity-0 invisible"}
              `}
              onMouseEnter={() => clearTimeout(examsTimer.current)}
              onMouseLeave={() => {
                examsTimer.current = setTimeout(() => setShowExams(false), 300);
              }}
            >
              {exams.map((exam) => (
                <div key={exam.slug} className="relative group/item">
                  <Link
                    href={`/exams/${exam.slug}`}
                    className="block px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-gray-700 rounded whitespace-nowrap"
                  >
                    {exam.name}
                  </Link>

                  {exam.topics.length > 0 && (
                    <div
                      className="
                        absolute top-0 left-full translate-x-2 bg-white dark:bg-gray-800
                        border dark:border-gray-700 shadow-lg rounded-lg
                        p-2 w-56 flex flex-col gap-1 z-50
                        opacity-0 invisible transition-all duration-200
                        group-hover/item:opacity-100 group-hover/item:visible
                      "
                    >
                      {exam.topics.map((topic) => (
                        <Link
                          key={topic}
                          href={`/exams/${exam.slug}/${topic}`}
                          className="block px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-gray-700 rounded whitespace-nowrap"
                        >
                          {topic}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>

        {/* RIGHT PANEL */}
        <div className="flex items-center gap-3 relative">
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={language === "en" ? "Search exams..." : "Sınav ara..."}
            className={`border rounded-full transition-all duration-300 px-3 py-1 text-sm outline-none w-32 focus:w-64 dark:border-gray-600 dark:bg-gray-800 ${
              query !== "" ? "w-64" : ""
            }`}
          />

          {results.length > 0 && (
            <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md w-72 max-h-64 overflow-y-auto z-50">
              {results.map((item) => (
                <div
                  key={item.url}
                  onClick={() => goToResult(item.url)}
                  className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => toggleLanguage(language === "tr" ? "en" : "tr")}
            className="px-2 py-1 border rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-gray-700"
          >
            {language === "en" ? "TR" : "EN"}
          </button>

          {user ? (
            <>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm font-medium hover:text-blue-600"
              >
                {language === "en" ? "My Page" : "Sayfam"}
              </button>
              <button
                onClick={async () => {
                  await signOut(auth);
                  router.push("/");
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                {language === "en" ? "Logout" : "Çıkış"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium">
                {language === "en" ? "Sign In" : "Giriş"}
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                {language === "en" ? "Sign Up" : "Kayıt Ol"}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
