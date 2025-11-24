// ✅ pages/exams/index.js
import Link from "next/link";

export default function ExamsHome() {
  const exams = [
    { name: "TYT", slug: "tyt" },
    { name: "AYT", slug: "ayt" },
    { name: "LGS", slug: "lgs" },
    { name: "SAT", slug: "sat" },
    { name: "ACT", slug: "act" },
    { name: "BAC", slug: "bac" },
    { name: "AP CALCULUS BC", slug: "ap-calculus-bc" },
    { name: "ABİTUR", slug: "abitur" },
    { name: "A-LEVEL-MATHEMATİCS", slug: "a-level mathematics" },
    { name: "GRE", slug: "gre" },


  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-10">Sınavlar</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {exams.map((exam) => (
          <Link
            key={exam.slug}
            href={`/exams/${exam.slug}`}
            className="block p-6 bg-white dark:bg-gray-800 shadow rounded-lg hover:shadow-lg hover:scale-[1.02] transition-transform text-center"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {exam.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
