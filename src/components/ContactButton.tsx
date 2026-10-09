import React, { useRef, useState, useEffect } from "react";

interface ContactButtonProps {
  onClick?: () => void;
  href?: string;
  className?: string;
  label?: string;
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  onClick,
  href = "#contact",
  className = "",
  label = "Contact Me",
}) => {
  const btnRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Proximity magnetism
    const handleMouseMove = (e: MouseEvent) => {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      const threshold = 110;
      if (dist < threshold) {
        const pull = (threshold - dist) / threshold;
        const dx = (e.clientX - cx) * 0.28 * pull;
        const dy = (e.clientY - cy) * 0.28 * pull;
        setOffset({ x: dx, y: dy });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const buttonStyle: React.CSSProperties = {
    background: "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
    boxShadow: "0px 4px 18px rgba(181, 1, 167, 0.38), inset 0 0 16px rgba(119, 33, 177, 0.6)",
    outline: "2px solid rgba(255, 255, 255, 0.4)",
    outlineOffset: "-3px",
    transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0) scale(${
      isPressed ? 0.94 : 1
    })`,
    transition: isPressed
      ? "transform 0.1s ease-out"
      : "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
  };

  const content = (
    <span className="relative z-10 flex items-center justify-center gap-2 select-none">
      {label}
    </span>
  );

  const classes = `inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-white cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base active:scale-95 will-change-transform ${className}`;

  if (href && !onClick) {
    return (
      <a
        ref={btnRef as any}
        href={href}
        style={buttonStyle}
        className={classes}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={btnRef as any}
      type="button"
      onClick={onClick}
      style={buttonStyle}
      className={classes}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {content}
    </button>
  );
};
