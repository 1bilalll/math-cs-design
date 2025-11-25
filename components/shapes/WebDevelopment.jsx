"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function WebDevelopment() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.015;
    if (mesh.current) mesh.current.rotation.x += 0.015;
  });

  return (
    <mesh ref={mesh}>
      <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />
      <meshStandardMaterial color="#5555FF" />
    </mesh>
  );
}
