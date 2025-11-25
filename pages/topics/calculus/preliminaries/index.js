import Link from "next/link";

export default function PreliminariesPage() {
  const lessons = [
    { id: "1", title: "Preliminaries 1" },
    { id: "2", title: "Preliminaries 2" },
  ];

  return (
    <div className="px-6 py-20 min-h-screen flex flex-col items-center">
      {/* Başlık */}
      <h1 className="text-6xl font-bold mb-16 tracking-wide text-[#0e2431] dark:text-white">
        Preliminaries
      </h1>

      {/* Butonlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl w-full">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/topics/calculus/preliminaries/${lesson.id}`}
            className="
              block text-center text-2xl font-medium
              px-10 py-8
              rounded-xl
              border border-[#1e3a55]
              bg-[#152836]
              text-[#dbe9ff]

              shadow-[0_3px_8px_rgba(0,0,0,0.25)]
              transition-all duration-300

              hover:-translate-y-[4px]
              hover:shadow-[0_6px_14px_rgba(0,0,0,0.35)]
              active:scale-[0.98]
            "
          >
            {lesson.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
