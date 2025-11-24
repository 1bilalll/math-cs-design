import fs from "fs";
import path from "path";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function WatchTopicPage({ videoUrl, summary, exam, topic }) {
  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900">
      {/* Başlık */}
      <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        {topic.toUpperCase()}
      </h1>

      {/* Video */}
      <div className="aspect-video mb-6 max-w-4xl mx-auto">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src={videoUrl}
          title={topic}
          frameBorder="0"
          allowFullScreen
        />
      </div>

      {/* Markdown özet */}
      <div className="prose dark:prose-invert max-w-4xl mx-auto mb-8">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>

      {/* Quiz Butonu */}
      <div className="max-w-4xl mx-auto text-center">
        <Link
          href={`/quiz/${exam}/${topic}/intro`}
          className="px-6 py-3 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all"
        >
          Quiz Başlat
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam, topic } = params;

  // Örn: content/exams/ayt/parabol
  const contentDir = path.join(process.cwd(), "content", "exams", exam, topic);

  // fallback: klasör yoksa boş dönüş
  if (!fs.existsSync(contentDir)) {
    return {
      props: {
        videoUrl: "",
        summary: "Bu konuya ait içerik henüz eklenmemiş 🚧",
        exam,
        topic,
      },
    };
  }

  // Dosyaları oku
  const videoUrl = fs.readFileSync(path.join(contentDir, "videoUrl.txt"), "utf8");
  const summary = fs.readFileSync(path.join(contentDir, "summary.md"), "utf8");

  return {
    props: {
      videoUrl,
      summary,
      exam,
      topic,
    },
  };
}

