"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Icosahedron() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.45;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.3, 0]} />
      <meshStandardMaterial color="#e56bff" metalness={0.4} roughness={0.3} />
    </mesh>
  );
}

