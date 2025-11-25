"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Networking() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1, 0.2, 16, 100]} />
      <meshStandardMaterial color="#00FFAA" />
    </mesh>
  );
}
