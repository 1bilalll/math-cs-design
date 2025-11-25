// components/shapes/AiMachineLearning.jsx
"use client";

import { useRef, useEffect, useState } from "react";

export default function AiMachineLearning() {
  const pointsRef = useRef();
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const temp = [];
    for (let i = 0; i < 500; i++) {
      temp.push((Math.random() - 0.5) * 4);
      temp.push((Math.random() - 0.5) * 4);
      temp.push((Math.random() - 0.5) * 4);
    }
    setPositions(new Float32Array(temp));
  }, []);

  if (positions.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="cyan" size={0.05} />
    </points>
  );
}
