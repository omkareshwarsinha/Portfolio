import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface RollingBox3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  rollAngle?: number;
  slideDirection?: "up" | "left" | "right";
  glowEffect?: "none" | "cyan" | "purple" | "subtle";
  interactiveTilt?: boolean;
}

export const RollingBox3D: React.FC<RollingBox3DProps> = ({
  children,
  className = "",
  depth = 60,
  rollAngle = 22,
  slideDirection = "up",
  glowEffect = "subtle",
  interactiveTilt = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure scroll progress of this box relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring physics for silky rolling movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.8,
  });

  // 3D Rolling Transform:
  // As element enters from bottom (0): tilted forward (rotateX > 0) and pushed back in Z
  // At center of viewport (0.5): flat (rotateX = 0, translateZ = 0)
  // As element exits out top (1.0): tilts backward (rotateX < 0) and pushed into depth
  const rotateX = useTransform(
    smoothProgress,
    [0, 0.35, 0.65, 1],
    [rollAngle, 0, 0, -rollAngle * 0.8]
  );

  const rotateY = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    slideDirection === "left" ? [-12, 0, 8] : slideDirection === "right" ? [12, 0, -8] : [0, 0, 0]
  );

  const translateZ = useTransform(
    smoothProgress,
    [0, 0.35, 0.65, 1],
    [-depth, 0, 0, -depth * 0.7]
  );

  const translateY = useTransform(
    smoothProgress,
    [0, 0.4, 0.6, 1],
    [50, 0, 0, -40]
  );

  const rawOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0.2, 1, 1, 0.3]
  );
  const opacity = useTransform(rawOpacity, (val) => (typeof val === "number" && !isNaN(val) ? val : 1));

  // Glow shadow based on style
  const getGlowClass = () => {
    switch (glowEffect) {
      case "cyan":
        return "box-glow-cyan border-cyan-500/20 hover:border-[#00F0FF]/40";
      case "purple":
        return "box-glow-purple border-purple-500/20 hover:border-[#B600A8]/40";
      case "subtle":
        return "border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-black/60";
      default:
        return "";
    }
  };

  return (
    <div
      ref={containerRef}
      className="perspective-1200 will-change-transform"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateZ,
          translateY,
          opacity,
          transformStyle: "preserve-3d",
        }}
        whileHover={
          interactiveTilt
            ? {
                scale: 1.015,
                translateZ: 18,
                transition: { duration: 0.3 },
              }
            : undefined
        }
        className={`preserve-3d transition-colors duration-300 ${getGlowClass()} ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
