import AnimatedCard from "/components/AnimatedCard";

export default function CalculusMain() {
  const subtopics = [
    { title: "AI Machine Learning", href: "/topics/computer-science/ai-machine-learning", shape: "ai" },
    { title: "Computer Systems", href: "/topics/computer-science/computer-systems", shape: "systems" },
    { title: "Data Structures", href: "/topics/computer-science/data-structures", shape: "data" },
    { title: "Database", href: "/topics/computer-science/database", shape: "db" },
    { title: "Networking", href: "/topics/computer-science/networking", shape: "network" },
    { title: "Programming", href: "/topics/computer-science/programming", shape: "prog" },
    { title: "Projects", href: "/topics/computer-science/projects", shape: "projects" },
    { title: "Web Development", href: "/topics/computer-science/web-development", shape: "web" },
  ];

  return (
    <div className="px-6 py-20 min-h-screen flex flex-col items-center">
      <h1
  className="
    text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-14 tracking-tight
    text-[#16243d] dark:text-[#e7ecf5]
    relative
  "
>
  Computer Science
  <span
    className="
      block mx-auto mt-4 h-[4px] w-24 sm:w-32
      bg-gradient-to-r from-[#009dff] to-[#00e5c2]
      rounded-full
    "
  ></span>
</h1>


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl w-full">
        {subtopics.map((topic) => (
          <AnimatedCard
            key={topic.title}
            title={topic.title}
            href={topic.href}
            shape={topic.shape}   // küçük harf ile düzelttik
          />
        ))}
      </div>
    </div>
  );
}
