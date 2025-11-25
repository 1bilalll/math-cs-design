import AnimatedCard from "/components/AnimatedCard";

export default function CalculusMain() {
  const subtopics = [
    {
      title: "Analitik Geometry",href: "/topics/geometry/analytic",shape: "icosa" },
  
    

  ];

  return (
    <div className="px-6 py-20 min-h-screen flex flex-col items-center">
    <h1
  className="
    text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 tracking-tight
    text-[#1f2d48] dark:text-[#e9eef7]
    relative
  "
>
  Calculus
  <span
    className="
      block mx-auto mt-3 h-[3px] w-16 sm:w-20
      bg-[#2e4a78] dark:bg-[#8fb2ff]
      rounded-full
    "
  ></span>
</h1>





      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl w-full">
        {subtopics.map((topic) => (
          <AnimatedCard
            key={topic.title}
            title={topic.title}
            href={topic.href}
            shape={topic.shape}   // <— önemli kısım
          />
        ))}
      </div>
    </div>
  );
}
