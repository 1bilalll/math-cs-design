import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WatchSubtopicPage() {
  const router = useRouter();
  const { exam, topic, subtopic } = router.query;

  const [videoURL, setVideoURL] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!exam || !topic || !subtopic) return;

    const base = `/api/getfile?exam=${exam}&topic=${topic}&subtopic=${subtopic}`;

    // 🎥 video
    fetch(`${base}&file=videourl.txt`)
      .then((r) => r.text())
      .then((url) => {
        if (!url) return setVideoURL(null);
        url = url.trim();

        if (url.includes("watch?v=")) url = url.replace("watch?v=", "embed/");
        if (url.includes("&")) url = url.split("&")[0];

        setVideoURL(url);
      })
      .catch(() => setVideoURL(null));

    // 📘 summary → önce PDF dene → sonra DOCX → sonra MD
    fetch(`${base}&file=summary.pdf`)
      .then((r) => {
        if (!r.ok) throw new Error();
        setSummary({ type: "pdf", url: `${base}&file=summary.pdf` });
      })
      .catch(() => {
        fetch(`${base}&file=summary.docx`)
          .then((r) => r.text())
          .then((html) => setSummary({ type: "docx", html }))
          .catch(() => {
            fetch(`${base}&file=summary.md`)
              .then((r) => r.text())
              .then((text) => setSummary({ type: "md", text: text.trim() }))
              .catch(() => setSummary(null));
          });
      });
  }, [exam, topic, subtopic]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 uppercase">
          {exam} / {topic} / {subtopic}
        </h1>

        {/* 🎥 video */}
        <div className="aspect-w-16 aspect-h-9 mb-6">
          {videoURL ? (
            <iframe
              key={videoURL}
              src={videoURL}
              title={`${subtopic} video`}
              className="w-full h-[400px] rounded-xl shadow-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center w-full h-[400px] bg-gray-300 rounded-xl dark:bg-gray-700">
              Video bulunamadı
            </div>
          )}
        </div>

        {/* 📘 summary */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Konu Özeti
          </h2>

          {summary ? (
            summary.type === "pdf" ? (
              <>
                <iframe
                  src={summary.url}
                  className="w-full h-[800px] rounded-lg"
                />
                <a
                  href={summary.url}
                  download
                  className="block mt-3 text-blue-600 dark:text-blue-400 underline text-center"
                >
                  PDF'yi indir 📥
                </a>
              </>
            ) : summary.type === "docx" ? (
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: summary.html }}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {summary.text}
              </pre>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Bu konu için özet eklenmemiş.
            </p>
          )}
        </div>

        {/* 🧠 Quiz */}
        <div className="text-center">
          <Link
            href={`/quiz/${exam}/${topic}/${subtopic}/start`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Quiz’e Başla 🧩
          </Link>
        </div>
      </div>
    </div>
  );
}
