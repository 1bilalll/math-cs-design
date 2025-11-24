import Link from "next/link";
//import QuizHeader from "../../../../../components/QuizHeader";

export default function QuizIntro({ exam, topic, subtopic }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-6">
      <QuizHeader title={subtopic} />

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        <span className="font-semibold">{exam.toUpperCase()}</span> /
        {` ${topic.toUpperCase()} `} kategorisinde yer alan{" "}
        <span className="font-semibold">{subtopic}</span> konusuna ait quiz’e hoş geldin!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href={`/quiz/${exam}/${topic}/${subtopic}/start`}
          className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
        >
          Başlat (Normal)
        </Link>

        <Link
          href={`/quiz/${exam}/${topic}/${subtopic}/hard`}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:scale-105 transition-transform"
        >
          Zor Mod
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { exam, topic, subtopic } = params;
  return { props: { exam, topic, subtopic } };
}
