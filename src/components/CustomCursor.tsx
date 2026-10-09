import React, { useEffect, useState, useRef } from "react";

type CursorMode = "default" | "project" | "link" | "explore" | "click";

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const targetPosRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable completely on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      const newX = e.clientX;
      const newY = e.clientY;
      targetPosRef.current = { x: newX, y: newY };
      setTargetPos({ x: newX, y: newY });

      // Determine context state based on target element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const closestLink = target.closest("a");
      const closestBtn = target.closest("button");
      const closestProject = target.closest("[data-cursor='project'], .project-card, #projects");
      const closest3D = target.closest("[data-cursor='explore'], canvas, .interactive-3d, #hero");

      if (closestProject && !closestLink && !closestBtn) {
        setMode("project");
      } else if (closest3D && !closestLink && !closestBtn) {
        setMode("explore");
      } else if (closestLink) {
        setMode("link");
      } else if (closestBtn) {
        setMode("click");
      } else {
        setMode("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth animation frame interpolation
    let animId: number;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      const current = posRef.current;
      const target = targetPosRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      // Smooth lag interpolation
      const nextX = current.x + dx * 0.22;
      const nextY = current.y + dy * 0.22;
      posRef.current = { x: nextX, y: nextY };
      setPos({ x: nextX, y: nextY });
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  if (isTouch || !isVisible) return null;

  const getLabel = () => {
    switch (mode) {
      case "project":
        return "VIEW";
      case "link":
        return "OPEN ↗";
      case "explore":
        return "EXPLORE";
      case "click":
        return "CLICK";
      default:
        return "";
    }
  };

  const isExpanded = mode !== "default";
  const label = getLabel();

  return (
    <aside
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      {/* 1. Small high-precision center cursor dot */}
      <div
        className="absolute w-2 h-2 -ml-1 -mt-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] transition-transform duration-75"
        style={{
          transform: `translate3d(${targetPos.x}px, ${targetPos.y}px, 0) scale(${isExpanded ? 0 : 1})`,
        }}
      />

      {/* 2. Soft outer light ring that smoothly follows and morphs */}
      <div
        className={`absolute rounded-full border border-cyan-400/50 backdrop-blur-[2px] flex items-center justify-center transition-all duration-200 ease-out ${
          isExpanded
            ? "w-16 h-16 -ml-8 -mt-8 bg-cyan-500/15 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            : "w-8 h-8 -ml-4 -mt-4 bg-cyan-400/10 border-cyan-400/30"
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        {isExpanded && label && (
          <span className="text-[0.62rem] font-mono tracking-widest text-cyan-200 font-bold select-none">
            {label}
          </span>
        )}
      </div>
    </aside>
  );
};
