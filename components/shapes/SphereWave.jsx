"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SphereWave() {
  const ref = useRef();
  const geometry = new THREE.SphereGeometry(1.1, 48, 48);
  const position = geometry.attributes.position;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);
      position.setXYZ(i, x + Math.sin(t + x * 3) * 0.02, y, z);
    }
    position.needsUpdate = true;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#ffcf4a" metalness={0.35} roughness={0.35} />
    </mesh>
  );
}

