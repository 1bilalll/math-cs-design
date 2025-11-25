"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function DataStructures() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[0.5, 0.5, 2, 16]} />
      <meshStandardMaterial color="#00AAFF" />
    </mesh>
  );
}
