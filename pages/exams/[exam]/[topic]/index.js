import fs from "fs";
import path from "path";
import Link from "next/link";

export default function TopicPage({ exam, topic, subtopics }) {
  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">{topic} Alt Başlıkları</h1>

      {subtopics.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Henüz bu konuya ait alt başlık bulunamadı 🚧
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {subtopics.map((subtopic) => (
            <Link
              key={subtopic}
              href={`/watch/${exam}/${topic}/${subtopic}`}
              className="block p-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg hover:scale-[1.02] transition-transform"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {subtopic.replace(/-/g, " ").toUpperCase()}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam, topic } = params;
  const topicDir = path.join(process.cwd(), "content", "exams", exam, topic);

  if (!fs.existsSync(topicDir)) {
    return { props: { exam, topic, subtopics: [] } };
  }

  const subtopics = fs
    .readdirSync(topicDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return { props: { exam, topic, subtopics } };
}
