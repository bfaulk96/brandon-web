import { useEffect, useRef } from 'react';

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tone: string;
};

const colors = ['#75f06a', '#8f96a3', '#1d2a55', '#4da342'];

export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let animationId = 0;
    let dots: Dot[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.max(28, Math.min(76, Math.floor(window.innerWidth / 22)));
      dots = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        tone: colors[index % colors.length],
      }));
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = '#292d2f';
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const dot of dots) {
        dot.x += dot.vx;
        dot.y += dot.vy;

        if (dot.x < -20) dot.x = window.innerWidth + 20;
        if (dot.x > window.innerWidth + 20) dot.x = -20;
        if (dot.y < -20) dot.y = window.innerHeight + 20;
        if (dot.y > window.innerHeight + 20) dot.y = -20;
      }

      for (let index = 0; index < dots.length; index += 1) {
        const dot = dots[index];
        for (let next = index + 1; next < dots.length; next += 1) {
          const other = dots[next];
          const distance = Math.hypot(dot.x - other.x, dot.y - other.y);
          if (distance > 145) continue;

          const opacity = ((145 - distance) / 145) * 0.34;
          context.strokeStyle = `rgba(117, 240, 106, ${opacity})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }

        const pulse = 1 + Math.sin(frame / 28 + index) * 0.35;
        context.fillStyle = dot.tone;
        context.globalAlpha = 0.55;
        context.beginPath();
        context.arc(dot.x, dot.y, 1.8 * pulse, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="background-canvas" ref={canvasRef} aria-hidden="true" />;
}
