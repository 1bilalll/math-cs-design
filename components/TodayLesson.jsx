"use client";
import Link from "next/link";
import { Play, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useContext, useState } from "react";
import { LanguageContext } from "../context/LanguageContext";

export default function TodayLesson() {
  const { language } = useContext(LanguageContext);

  const content = [
    {
      slug: "https://www.youtube.com/watch?v=U-7THjkQdbg&list=LL&index=3",
      title: { en: "What is the Future of Education?", tr: "Eğitim Geleceği Nedir? " },
      desc: {
        en: "What will the future of education look like in a world increasingly shaped by AI? ",
        tr: "Yapay zekanın giderek daha fazla şekillendirdiği bir dünyada eğitimin geleceği nasıl olacak?",
      },
      tag: { en: "Education", tr: "Eğitim" },
      label: { en: "Watch video →", tr: "Videoyu izle →" },
      videoLabel: "Education",
    },
    {
      slug: "https://www.youtube.com/watch?v=wJsnlSiyH3Y&list=LL&index=1&t=51s",
      title: { en: "AI is revolutionizing education No Teacher No Homework", tr: "Yapay zeka eğitimi dönüştürüyor Öğretmen Yok Ödev Yok" },
      desc: {
        en: "Latest tech report on how AI is shaping personal learning systems.",
        tr: "Yapay zekanın kişisel eğitim sistemlerini nasıl şekillendirdiğine dair teknoloji raporu.",
      },
      tag: { en: "Tech News", tr: "Teknoloji Haberi" },
      label: { en: "Watch video →", tr: "Videoyu izle →" },
      videoLabel: "Tech News",
    },
    {
      slug: "/lessons/limit",
      title: { en: "Understanding Limits", tr: "Limit Konusuna Giriş" },
      desc: {
        en: "A key concept for calculus and continuity.",
        tr: "Analizin ve sürekliliğin temel kavramı.",
      },
      tag: { en: "Today's Lesson", tr: "Günün Dersi" },
      label: { en: "Continue lesson →", tr: "Derse devam et →" },
      videoLabel: "lim x→∞",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const next = () => setCurrent((prev) => (prev + 1) % content.length);
  const prev = () => setCurrent((prev) => (prev - 1 + content.length) % content.length);

  const item = content[current];
  const isYoutube = item.slug.startsWith("http");

  // YouTube video ID ve embed URL
  const youtubeId = isYoutube ? item.slug.split("v=")[1].split("&")[0] : null;
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : null;
  const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;

  return (
    <>
      <div className="relative flex justify-center items-center w-full">
        <div className="w-full max-w-6xl">
          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
            
            {/* TEXT */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-600">{item.tag[language]}</p>
              <h3 className="text-2xl font-bold mt-2">{item.title[language]}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed">{item.desc[language]}</p>

              {isYoutube ? (
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-block mt-5 text-blue-600 font-semibold hover:underline"
                >
                  {item.label[language]}
                </button>
              ) : (
                <Link
                  href={item.slug}
                  className="inline-block mt-5 text-blue-600 font-semibold hover:underline"
                >
                  {item.label[language]}
                </Link>
              )}
            </div>

            {/* VIDEO BOX (Thumbnail + Play Button) */}
            <div
              className="flex-1 rounded-2xl overflow-hidden relative cursor-pointer hover:brightness-110 transition h-52 md:h-64 w-full"
              onClick={() => isYoutube && setShowVideo(true)}
            >
              {isYoutube && thumbnailUrl ? (
                <img src={thumbnailUrl} alt="video thumbnail" className="w-full h-full object-cover" />
              ) : (
                <div className="bg-slate-800 w-full h-full flex justify-center items-center">
                  <Play size={64} className="text-white opacity-90" />
                </div>
              )}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                <Play size={64} className="text-white opacity-90" />
              </div>
              <span className="absolute bottom-5 right-6 text-white font-semibold text-lg">
                {item.videoLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ARROWS */}
        <button
          onClick={prev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-slate-900/75 text-white p-2 rounded-full hover:bg-black transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-slate-900/75 text-white p-2 rounded-full hover:bg-black transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* VIDEO POPUP */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
          <div className="relative bg-black rounded-2xl w-full max-w-4xl aspect-video">
            <iframe
              className="w-full h-full rounded-2xl"
              src={embedUrl}
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>

            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-10 right-0 text-white bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
