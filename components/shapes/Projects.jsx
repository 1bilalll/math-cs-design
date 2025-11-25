"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Projects() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.z += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial color="#55FF55" />
    </mesh>
  );
}
