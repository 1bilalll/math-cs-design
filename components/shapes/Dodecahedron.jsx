"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Dodecahedron() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x += 0.004;
    mesh.current.rotation.y += 0.006;
  });

  return (
    <mesh ref={mesh}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#00ffff" wireframe />
    </mesh>
  );
}
