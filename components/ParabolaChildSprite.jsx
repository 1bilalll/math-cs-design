// components/ParabolaChildSprite.jsx
import { useRef, useEffect } from "react";

/**
 * ParabolaChildSprite.jsx
 * - Bekler: /public/sprites/run.png  (10 frames, 128x128 each)
 *           /public/sprites/jump.png (4 frames, 128x128)
 *           /public/sprites/slide.png(6 frames, 128x128)
 * - Responsive, path-following sprite animator with glow trail
 */

export default function ParabolaChildSprite({
  spriteBasePath = "/sprites",
  frameSize = 128,
  runFrames = 10,
  jumpFrames = 4,
  slideFrames = 6,
  devicePixelRatioSafe = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // scale for crisp rendering on high-dpi
    const DPR = devicePixelRatioSafe ? Math.max(1, window.devicePixelRatio || 1) : 1;

    // canvas sizing helper
    function resize() {
      const w = Math.max(300, canvas.parentElement.offsetWidth);
      const h = 160;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // logical px drawing
    }
    resize();
    window.addEventListener("resize", resize);

    // load images
    const loadImage = (src) =>
      new Promise((res, rej) => {
        const img = new Image();
        img.src = src;
        img.onload = () => res(img);
        img.onerror = rej;
      });

    let runImg, jumpImg, slideImg;
    let stopped = false;
    let animationFrame;

    (async () => {
      try {
        runImg = await loadImage(`${spriteBasePath}/run.png`);
        jumpImg = await loadImage(`${spriteBasePath}/jump.png`);
        slideImg = await loadImage(`${spriteBasePath}/slide.png`);
      } catch (e) {
        // if images fail, fallback silently to simple child placeholder (you can extend)
        console.error("Sprite load failed:", e);
      }

      if (stopped) return;

      // sprite metadata
      const SPR = {
        frameW: frameSize,
        frameH: frameSize,
        runCount: runFrames,
        jumpCount: jumpFrames,
        slideCount: slideFrames,
      };

      // physics / animation state
      let canvasW = canvas.parentElement.offsetWidth;
      let canvasH = 160;
      let x = -80; // start off-left
      let direction = 1; // 1 -> right, -1 -> left
      let state = "run"; // run -> jump -> slide
      let runFrame = 0;
      let jumpFrame = 0;
      let slideFrame = 0;
      let runElapsed = 0;
      let jumpElapsed = 0;
      let slideElapsed = 0;
      const runFPS = 12;
      const jumpFPS = 10;
      const slideFPS = 10;
      const runFrameDur = 1000 / runFPS;
      const jumpFrameDur = 1000 / jumpFPS;
      const slideFrameDur = 1000 / slideFPS;

      let tPrev = performance.now();

      // parabola function (tweak curve & height to taste)
      function parabola(px) {
        // center-based quadratic; constants tuned to frame size
        const cx = canvasW / 2;
        // curve coefficient: smaller magnitude -> wider parabola
        const a = -0.00185;
        const baseline = 118;
        return a * Math.pow(px - cx, 2) + baseline;
      }

      // glow-trail storage
      const glowPoints = [];

      // update canvasW on resize
      const onResizeUpdate = () => {
        canvasW = canvas.parentElement.offsetWidth;
        canvasH = 160;
      };
      window.addEventListener("resize", onResizeUpdate);

      // helper: draw sprite frame (optionally flipped)
      function drawSprite(img, frameIndex, px, py, flipped = false, scale = 1) {
        if (!img) {
          // fallback: draw simple child circle (very small)
          ctx.save();
          ctx.translate(px, py - 36);
          ctx.fillStyle = "#ffddb4";
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          return;
        }

        const fw = SPR.frameW;
        const fh = SPR.frameH;
        const sx = Math.floor(frameIndex % (img.width / fw)) * fw;
        const sy = Math.floor(frameIndex / (img.width / fw)) * fh;
        const drawW = fw * scale;
        const drawH = fh * scale;

        ctx.save();
        if (flipped) {
          ctx.translate(px, py);
          ctx.scale(-1, 1);
          ctx.drawImage(img, sx, sy, fw, fh, -drawW / 2, -drawH, drawW, drawH);
        } else {
          ctx.drawImage(img, sx, sy, fw, fh, px - drawW / 2, py - drawH, drawW, drawH);
        }
        ctx.restore();
      }

      // main loop
      function loop(tNow) {
        if (stopped) return;
        const dt = tNow - tPrev;
        tPrev = tNow;

        // clear
        ctx.clearRect(0, 0, canvasW, canvasH);

        // re-calc basic positions
        const baselineY = 118;

        // draw parabola path
        ctx.beginPath();
        ctx.strokeStyle = "rgba(30,180,120,0.25)";
        ctx.lineWidth = 2;
        ctx.moveTo(0, parabola(0));
        for (let i = 1; i <= canvasW; i += 4) {
          ctx.lineTo(i, parabola(i));
        }
        ctx.stroke();
        ctx.closePath();

        // state machine
        if (state === "run") {
          // advance run frames by dt
          runElapsed += dt;
          if (runElapsed >= runFrameDur) {
            runFrame = (runFrame + 1) % SPR.runCount;
            runElapsed = 0;
          }
          // movement: faster run, heading to trigger point
          const triggerX = canvasW * 0.14;
          x += 2.2; // running speed
          if (x >= triggerX) {
            state = "jump";
            jumpElapsed = 0;
            jumpFrame = 0;
          }
          // draw run sprite (not flipped)
          const y = baselineY;
          drawSprite(runImg, runFrame, x, y, false, 0.9);
        } else if (state === "jump") {
          // animate jump frames and position (sin ease)
          jumpElapsed += dt;
          if (jumpElapsed >= jumpFrameDur) {
            jumpFrame = Math.min(SPR.jumpCount - 1, jumpFrame + 1);
            jumpElapsed = 0;
          }
          // move forward a bit and arc up
          x += 2.2;
          // progress 0..1 across jump duration (we map frames to a progress approx)
          const jumpProgress = Math.min(1, (jumpFrame + jumpElapsed / jumpFrameDur) / SPR.jumpCount);
          const jumpAmp = 40; // how high
          const y = baselineY - Math.sin(jumpProgress * Math.PI) * jumpAmp;
          drawSprite(jumpImg, jumpFrame, x, y, false, 0.9);

          if (jumpProgress >= 1 - 1e-6) {
            state = "slide";
            slideElapsed = 0;
            slideFrame = 0;
          }
        } else if (state === "slide") {
          // follow parabola, push glow points, animate slide frames
          slideElapsed += dt;
          if (slideElapsed >= slideFrameDur) {
            slideFrame = (slideFrame + 1) % SPR.slideCount;
            slideElapsed = 0;
          }

          // position along parabola
          const y = parabola(x);
          x += direction * 1.4; // slide slower than run

          // glow point
          glowPoints.push({ x, y, alpha: 1.0, r: 8 });

          // bounds check -> reverse direction at ends
          const leftBound = 20;
          const rightBound = canvasW - 20;
          if (x >= rightBound) {
            direction = -1;
          } else if (x <= leftBound) {
            direction = 1;
          }

          // draw trail
          for (let i = glowPoints.length - 1; i >= 0; i--) {
            const p = glowPoints[i];
            ctx.beginPath();
            ctx.fillStyle = `rgba(16,185,129,${p.alpha * 0.6})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            p.alpha -= 0.03;
            p.r *= 0.99;
            if (p.alpha <= 0) glowPoints.splice(i, 1);
          }

          // flip sprite when direction is -1
          const flipped = direction === -1;
          drawSprite(slideImg, slideFrame, x, y + 6, flipped, 0.9);
        }

        animationFrame = requestAnimationFrame(loop);
      }

      // start loop
      tPrev = performance.now();
      animationFrame = requestAnimationFrame(loop);

      // cleanup on stop
      const stop = () => {
        stopped = true;
        cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", onResizeUpdate);
      };

      // attach to outer scope for cleanup
      (ref.current).__parabola_stop = stop;
    })();

    // cleanup when unmount
    return () => {
      if (ref.current && ref.current.__parabola_stop) ref.current.__parabola_stop();
    };
  }, [spriteBasePath, frameSize, runFrames, jumpFrames, slideFrames, devicePixelRatioSafe]);

  return (
    <div className="relative w-full h-[160px] flex justify-center items-center">
      <canvas ref={ref} />
    </div>
  );
}

