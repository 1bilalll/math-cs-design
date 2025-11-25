"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Octahedron() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x += 0.005;
    mesh.current.rotation.y += 0.007;
  });

  return (
    <mesh ref={mesh}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffa500" wireframe />
    </mesh>
  );
}
