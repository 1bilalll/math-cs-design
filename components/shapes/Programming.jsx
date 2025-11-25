"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Programming() {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) mesh.current.rotation.x += 0.01;
    if (mesh.current) mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#FF5555" />
    </mesh>
  );
}
