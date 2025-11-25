"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Tetrahedron() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x += 0.006;
    mesh.current.rotation.y += 0.008;
  });

  return (
    <mesh ref={mesh}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ff1493" wireframe />
    </mesh>
  );
}
