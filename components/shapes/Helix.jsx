"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Helix() {
  const ref = useRef();
  const points = [];
  for (let i = 0; i < 100; i++) {
    const t = i / 6;
    points.push(new THREE.Vector3(Math.sin(t), t * 0.03, Math.cos(t)));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 200, 0.15, 8, false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.3;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#76ff7a" metalness={0.25} roughness={0.45} />
    </mesh>
  );
}

