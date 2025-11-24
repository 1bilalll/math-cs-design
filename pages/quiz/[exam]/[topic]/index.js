import Link from "next/link";

export default function QuizIntro({ exam, topic }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-6">
      <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
        {topic.toUpperCase()} Quiz
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        {exam.toUpperCase()} sınavının{" "}
        <span className="font-semibold">{topic}</span> konusuna ait quiz’e hoş geldin!  
        Lütfen zorluk seviyeni seç:
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/quiz/${exam}/${topic}/start`}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
        >
          Normal Başlat
        </Link>
        <Link
          href={`/quiz/${exam}/${topic}/hard`}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
        >
          Zor Mod
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam, topic } = params;
  return { props: { exam, topic } };
}

