// components/TopicsGrid3D.jsx
"use client";

import React, { useContext, useRef } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial, Sphere, Box, Torus } from "@react-three/drei";
import { LanguageContext } from "../context/LanguageContext";

// ---- 3D Animations ----
function AnimatedMesh({ type, color }) {
  const groupRef = useRef();
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 1.2;
      meshRef.current.rotation.x = t * 0.45;
      meshRef.current.scale.set(1.32, 1.32, 1.32);
    }

    if (groupRef.current && (type === "sorting" || type === "linkedlist")) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 2 + i) * 0.26;
      });
    }
  });

  switch (type) {
    case "sphere":
      return (
        <Sphere ref={meshRef} args={[1.4, 32, 32]}>
          <MeshDistortMaterial color={color} distort={0.38} speed={1.9} />
        </Sphere>
      );

    case "torus":
      return (
        <Torus ref={meshRef} args={[1.35, 0.45, 16, 100]}>
          <MeshDistortMaterial color={color} distort={0.33} speed={1.8} />
        </Torus>
      );

    case "sorting":
      return (
        <group ref={groupRef}>
          {[...Array(5)].map((_, i) => (
            <Box key={i} args={[0.38, 1.5, 0.38]} position={[i * 0.52 - 1.05, 0, 0]}>
              <MeshDistortMaterial color={color} distort={0.18} speed={1.3} />
            </Box>
          ))}
        </group>
      );

    case "linkedlist":
      return (
        <group ref={groupRef}>
          {[...Array(7)].map((_, i) => (
            <Box key={i} args={[0.40, 0.40, 0.40]} position={[i * 0.44 - 1.2, 0, 0]}>
              <MeshDistortMaterial color={color} distort={0.2} speed={1.4} />
            </Box>
          ))}
        </group>
      );

    case "exam":
      return (
        <group ref={meshRef}>
          <Box args={[1.45, 1.75, 0.06]} position={[0, 0, 0]}>
            <MeshDistortMaterial color={color} distort={0.15} speed={1.2} />
          </Box>
          <Box args={[0.16, 1.6, 0.16]} position={[0.68, 0, 0.22]}>
            <MeshDistortMaterial color={color} distort={0.18} speed={1.45} />
          </Box>
        </group>
      );

    default:
      return null;
  }
}

export default function TopicsGrid3D() {
  const { language } = useContext(LanguageContext);

  const topics = {
    en: [
      { name: "Analytics", desc: "Understand data trends.", href: "/topics/analytics", type: "sphere", color: "#1ea4ff" },
      { name: "Calculus", desc: "Derivatives & integrals.", href: "/topics/calculus", type: "torus", color: "#29cfff" },
      { name: "Discrete Math", desc: "Graph theory & logic.", href: "/topics/discrete-mathematics", type: "sphere", color: "#46e8ff" },
      { name: "Algorithms", desc: "Efficient problem solving.", href: "/topics/algorithms", type: "sorting", color: "#2dc0ff" },
      { name: "Data Structures", desc: "Organize data efficiently.", href: "/topics/data-structures", type: "linkedlist", color: "#33dbff" },
      { name: "Exam", desc: "Test your knowledge.", href: "/exams", type: "exam", color: "#14b3ff" },
    ],
    tr: [
      { name: "Analitik", desc: "Veri eğilimlerini anlamak.", href: "/topics/analytics", type: "sphere", color: "#1ea4ff" },
      { name: "Kalkülüs", desc: "Türev & integral.", href: "/topics/calculus", type: "torus", color: "#29cfff" },
      { name: "Ayrık Matematik", desc: "Graf teorisi & mantık.", href: "/topics/discrete-mathematics", type: "sphere", color: "#46e8ff" },
      { name: "Algoritmalar", desc: "Verimli problem çözümü.", href: "/topics/algorithms", type: "sorting", color: "#2dc0ff" },
      { name: "Veri Yapıları", desc: "Veriyi etkili yönetme.", href: "/topics/data-structures", type: "linkedlist", color: "#33dbff" },
      { name: "Sınav", desc: "Kendini test et.", href: "/exams", type: "exam", color: "#14b3ff" },
    ],
  }[language];

  return (
    <div className="py-6 -mt-8 bg-[#F5F7FB] dark:bg-[#0E111A]">
      <h2 className="text-center text-4xl font-extrabold mb-12 text-[#0d2c3a] dark:text-white">
        {language === "en" ? "Explore our topics" : "Konuları Keşfedin"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
        {topics.map((topic) => (
          <Link key={topic.name} href={topic.href}>
            <div
              className="
                rounded-2xl p-3 flex flex-col items-center transition-all duration-300 cursor-pointer
                bg-[#FAFBFD] dark:bg-[#0F131C]
                border border-[#E6ECF1] dark:border-[#1B212C]
                hover:scale-[1.02]    /* sadece hafif büyüme efekti */
              "
              style={{ height: "145px" }}
            >
              <div className="w-full h-[108px] mb-1">
                <Canvas>
                  <ambientLight intensity={1.5} />
                  <directionalLight position={[2, 4, 2]} intensity={1.9} />
                  <AnimatedMesh type={topic.type} color={topic.color} />
                  <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
                </Canvas>
              </div>

              <h3 className="text-[15px] font-extrabold text-center text-[#0d2c3a] dark:text-white">
                {topic.name}
              </h3>
              <p className="text-[11.5px] font-medium text-center text-[#2e5663] dark:text-[#9db8c6] opacity-90">
                {topic.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
