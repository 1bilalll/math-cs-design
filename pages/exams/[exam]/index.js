// ✅ pages/exams/[exam]/index.js

import fs from "fs";
import path from "path";
import Link from "next/link";

export default function ExamPage({ exam, topics }) {
  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center uppercase">{exam} Konuları</h1>

      {topics.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Henüz bu sınava ait konu bulunamadı 🚧
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {topics.map((topic) => (
            <Link
           key={topic}
         href={`/exams/${exam}/${topic}`}
         className="block p-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg hover:scale-[1.02] transition-transform"
>

              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {topic.toUpperCase()}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam } = params; // exam = 'tyt' veya 'ayt'

  const examDir = path.join(process.cwd(), "content", "exams", exam);

  // Eğer dizin yoksa boş liste dön
  if (!fs.existsSync(examDir)) {
    return {
      props: { exam, topics: [] },
    };
  }

  // Sınava ait konu klasörlerini al
  const topics = fs
    .readdirSync(examDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return {
    props: {
      exam,
      topics,
    },
  };
}
