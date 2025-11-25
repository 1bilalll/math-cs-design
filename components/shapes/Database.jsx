"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Database() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.z += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[0.7, 0.7, 1.5, 32]} />
      <meshStandardMaterial color="#AA00FF" />
    </mesh>
  );
}
