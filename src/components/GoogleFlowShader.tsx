import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface GoogleFlowShaderProps {
  className?: string;
  opacity?: number;
}

export const GoogleFlowShader: React.FC<GoogleFlowShaderProps> = ({
  className = "",
  opacity = 0.65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { customization, theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width * 0.5;
    let mouseY = height * 0.4;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const onResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Parse hex colors for dynamic fluid blending
    const hexToRgb = (hex: string) => {
      const clean = hex.replace("#", "");
      if (clean.length === 3) {
        return {
          r: parseInt(clean[0] + clean[0], 16),
          g: parseInt(clean[1] + clean[1], 16),
          b: parseInt(clean[2] + clean[2], 16),
        };
      }
      return {
        r: parseInt(clean.substring(0, 2), 16) || 0,
        g: parseInt(clean.substring(2, 4), 16) || 240,
        b: parseInt(clean.substring(4, 6), 16) || 255,
      };
    };

    let time = 0;
    const isDark = theme === "dark";

    const render = () => {
      animId = requestAnimationFrame(render);

      if (isReduced) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const speedFactor =
        customization.flowSpeed === "fast" ? 0.025 : customization.flowSpeed === "slow" ? 0.008 : 0.015;
      time += speedFactor;

      ctx.clearRect(0, 0, width, height);

      const rgb1 = hexToRgb(customization.primaryColor || "#00f0ff");
      const rgb2 = hexToRgb(customization.secondaryColor || "#8b5cf6");

      // Layer 1: Ambient moving radial light pool linked to mouse
      const gradRadius = Math.max(width, height) * 0.45;
      const radialGrad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        20,
        mouseX,
        mouseY,
        gradRadius
      );
      const alphaBase = isDark ? 0.22 : 0.12;
      radialGrad.addColorStop(
        0,
        `rgba(${rgb1.r}, ${rgb1.g}, ${rgb1.b}, ${alphaBase})`
      );
      radialGrad.addColorStop(
        0.5,
        `rgba(${rgb2.r}, ${rgb2.g}, ${rgb2.b}, ${alphaBase * 0.5})`
      );
      radialGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Layer 2: Google Flow Fluid Spline Ribbons
      const ribbonCount = 4;
      const step = 20;

      for (let r = 0; r < ribbonCount; r++) {
        const ribbonOffset = (r * Math.PI * 2) / ribbonCount;
        const colorMix = r / (ribbonCount - 1);
        const cr = Math.round(rgb1.r * (1 - colorMix) + rgb2.r * colorMix);
        const cg = Math.round(rgb1.g * (1 - colorMix) + rgb2.g * colorMix);
        const cb = Math.round(rgb1.b * (1 - colorMix) + rgb2.b * colorMix);

        ctx.beginPath();
        let first = true;

        for (let x = -50; x <= width + 50; x += step) {
          const normX = x / width;
          // Harmonic wave computation
          const wave1 = Math.sin(normX * 3.5 + time + ribbonOffset) * 45;
          const wave2 = Math.cos(normX * 2.2 - time * 0.8 + ribbonOffset) * 35;
          const mouseDist = Math.hypot(x - mouseX, height * 0.5 - mouseY);
          const mouseEffect = Math.sin(mouseDist * 0.008 - time * 2) * Math.max(0, 50 - mouseDist * 0.08);

          const y = height * (0.35 + r * 0.1) + wave1 + wave2 + mouseEffect;

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        const ribbonAlpha = isDark ? (0.12 - r * 0.02) : (0.07 - r * 0.012);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.max(0.02, ribbonAlpha)})`;
        ctx.lineWidth = 14 + r * 6;
        ctx.lineCap = "round";
        ctx.stroke();

        // High-intensity core filament line
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.max(0.04, ribbonAlpha * 1.8)})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [customization, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none select-none ${className}`}
      style={{ opacity }}
    />
  );
};
