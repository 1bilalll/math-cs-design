"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function KnotSpiral() {
  const mesh = useRef();
  useFrame(() => {
    mesh.current.rotation.x += 0.008;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1, 0.1, 30, 200]} />
      <meshStandardMaterial color="#7fff00" wireframe />
    </mesh>
  );
}
