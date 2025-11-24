"use client";
import { useEffect, useRef } from "react";

export default function LogoAnimation({ width = 70, height = 70 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let frame = 0;
    const nodes = [];
    const totalNodes = 38;

    const symbols = ["∑", "π", "∫", "√", "∞", "f(x)", "{}", "!=", "→", "1010"];
    const floatingSymbols = []; // animated formula symbols

    for (let i = 0; i < totalNodes; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      });
    }

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Glow background
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        4,
        width / 2,
        height / 2,
        width
      );
      gradient.addColorStop(0, "rgba(0, 180, 255, 0.12)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // SYMBOL GENERATION — new
      if (Math.random() < 0.05) {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        floatingSymbols.push({
          x: randomNode.x + (Math.random() * 6 - 3),
          y: randomNode.y + (Math.random() * 6 - 3),
          symbol: symbols[Math.floor(Math.random() * symbols.length)],
          alpha: 0,
          scale: 0.75 + Math.random() * 0.45,
          life: 0,
        });
      }

      // Draw nodes + movements
      nodes.forEach((n, i) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 220, 255, 0.9)";
        ctx.fill();

        for (let j = i + 1; j < totalNodes; j++) {
          const m = nodes[j];
          const dist = Math.hypot(n.x - m.x, n.y - m.y);
          if (dist < 38) {
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.22 - dist / 160})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      });

      // Draw floating formula symbols — new
      floatingSymbols.forEach((s, index) => {
        s.life += 1;
        if (s.life < 20) s.alpha += 0.04;
        else s.alpha -= 0.03;

        ctx.font = `${width * 0.14 * s.scale}px Poppins, sans-serif`;
        ctx.fillStyle = `rgba(0, 220, 255, ${s.alpha})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.symbol, s.x, s.y);

        s.y -= 0.23; // float effect

        if (s.alpha <= 0) floatingSymbols.splice(index, 1);
      });

      // Reveal MC text
      if (frame > 65) {
        ctx.font = `${width * 0.32}px Poppins, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(255, 255, 255, ${(frame - 65) / 50})`;
        ctx.fillText("MC", width / 2, height / 2);
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        width,
        height,
        borderRadius: "12px",
        display: "block",
      }}
    />
  );
}
