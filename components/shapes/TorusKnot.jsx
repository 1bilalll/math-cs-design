"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function TorusKnot() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.x = t * 0.4;
    ref.current.rotation.y = t * 0.25;
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.1, 0.35, 128, 32]} />
      <meshStandardMaterial color="#4aa8ff" metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

