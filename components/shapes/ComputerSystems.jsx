"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ComputerSystems() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.5, 1, 0.5]} />
      <meshStandardMaterial color="#FFAA00" />
    </mesh>
  );
}
