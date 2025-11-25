import AnimatedCard from "/components/AnimatedCard";

export default function CalculusMain() {
  const subtopics = [
    {
      title: "Preliminaries",href: "/topics/calculus/preliminaries",shape: "torus" },
    { title: "Limits", href: "/topics/calculus/limits", shape: "sphere" },
    { title: "Continuity", href: "/topics/calculus/continuity", shape: "icosa" },
    { title: "Differentiation", href: "/topics/calculus/differentiation", shape: "helix" },
    { title: "Transcendental Functions", href: "/topics/calculus/transcendental functions", shape: "dode" },
    { title: "More Applications of Differentiation", href: "/topics/calculus/more applications of differentiation", shape: "knot" },
    { title: "Integration", href: "/topics/calculus/integration", shape: "sphere" },
     { title: "Techniques of Integration", href: "/topics/calculus/techniques of ıntegration", shape: "tetra" },
    { title: "Applications of Integration", href: "/topics/calculus/applications of ıntegration", shape: "octa" },
    { title: "Conics, Parametric Curves and Polar Curves", href: "/topics/calculus/conics, parametric curves and polar curves", shape: "octa" },
    { title: "Sequences, Series and Power Series", href: "/topics/calculus/sequences, series and power series", shape: "dode" },
    { title: "Vector Functions and Curves", href: "/topics/calculus/vector functions and curves", shape: "helix" },
    

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
