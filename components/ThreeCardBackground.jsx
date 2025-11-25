"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

// Önceden hazırlanmış Shape componentleri
import TorusKnot from "./shapes/TorusKnot";
import Icosahedron from "./shapes/Icosahedron";
import Helix from "./shapes/Helix";
import SphereWave from "./shapes/SphereWave";
import Octahedron from "./shapes/Octahedron";
import Tetrahedron from "./shapes/Tetrahedron";
import KnotSpiral from "./shapes/KnotSpiral";
import Dodecahedron from "./shapes/Dodecahedron";
import AiMachineLearning from "./shapes/AiMachineLearning";
import ComputerSystems from "./shapes/ComputerSystems";
import DataStructures from "./shapes/DataStructures";
import Database from "./shapes/Database";
import Networking from "./shapes/Networking";
import Programming from "./shapes/Programming";
import Projects from "./shapes/Projects";
import WebDevelopment from "./shapes/WebDevelopment";

// shape string → component map
const shapeMap = {
  torus: TorusKnot,
  icosa: Icosahedron,
  helix: Helix,
  knot: KnotSpiral,
  dode: Dodecahedron,
  tetra: Tetrahedron,
  octa: Octahedron,
  ai: AiMachineLearning,
  systems: ComputerSystems,
  data: DataStructures,
  db: Database,
  network: Networking,
  prog: Programming,
  projects: Projects,
  web: WebDevelopment,
};

export default function ThreeCardBackground({ shape }) {
  const ShapeComponent = shapeMap[shape] || SphereWave;

  return (
    <Canvas
      key={shape} // Her kart için Canvas’in ayrı tutulmasını sağlar
      camera={{ position: [3, 2.5, 4.5], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Işıklandırma */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 4, 2]} intensity={2} />

      {/* 3D Shape */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <ShapeComponent /> {/* Shape artık sadece objeyi render ediyor */}
      </Float>

      {/* Kontroller */}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
