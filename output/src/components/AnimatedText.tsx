import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface CharSpanProps {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

const CharSpan: React.FC<CharSpanProps> = ({ char, progress, start, end }) => {
  const safeStart = typeof start === "number" && !isNaN(start) ? Math.max(0, Math.min(0.95, start)) : 0;
  const safeEnd = typeof end === "number" && !isNaN(end) ? Math.max(safeStart + 0.05, Math.min(1, end)) : 1;
  const rawOpacity = useTransform(progress, [safeStart, safeEnd], [0.2, 1]);
  const opacity = useTransform(rawOpacity, (val) => {
    return typeof val === "number" && !isNaN(val) ? Math.min(1, Math.max(0.2, val)) : 1;
  });

  return (
    <span className="relative inline-block whitespace-pre">
      <span className="opacity-0">{char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute left-0 top-0 text-slate-800 dark:text-[#D7E2EA]"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const chars = (text || "").split("");
  const total = Math.max(1, chars.length);

  return (
    <p ref={containerRef} className={`relative flex flex-wrap justify-center ${className}`}>
      {chars.map((char, index) => {
        const start = index / total;
        const end = Math.min(1, Math.max(start + 0.05, (index + 2) / total));
        return (
          <CharSpan
            key={`${char}-${index}`}
            char={char}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
};
