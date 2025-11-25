// pages/index.js
import Head from "next/head";
import Hero from "../components/Hero";
import TopicsGrid from "../components/TopicsGrid";
import TodayLesson from "../components/TodayLesson";
import WhyCards from "../components/WhyCards";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Math & CS — Home</title>
        <meta
          name="description"
          content="Explore topics and interactive lessons on analytic geometry, calculus, computer science and more."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8F9FD] text-slate-900">
        <main className="w-full max-w-6xl mx-auto px-6 md:px-8 flex-1">
          <Hero />

          <section className="mt-14">
            <TopicsGrid />
          </section>

          <section className="mt-14">
            <TodayLesson />
          </section>

          

          <section className="mt-20">
            <WhyCards />
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
