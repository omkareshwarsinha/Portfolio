import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ContactButton } from "./ContactButton";
import { SeamlessGlobeVideo } from "./SeamlessGlobeVideo";
import { HeroSpatial3D } from "./HeroSpatial3D";
import { GoogleFlowShader } from "./GoogleFlowShader";
import { Menu, X, Sparkles, Compass, Sun, Moon, ShieldCheck, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface HeroSectionProps {
  onOpenAdmin?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { theme, toggleTheme, customization } = useTheme();

  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Certificates", href: "#certificates" },
    { label: "Contact", href: "#contact" },
  ];

  // 3D PHYSICAL OBJECT & CAMERA SCROLL PHYSICS
  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) return;

    let animId: number;
    let targetProgress = 0;
    let currentProgress = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const heroHeight = panelRef.current?.offsetHeight || window.innerHeight || 800;
      const divisor = heroHeight * 0.95;
      const raw = divisor > 0 ? scrollY / divisor : 0;
      targetProgress = isNaN(raw) ? 0 : Math.min(Math.max(raw, 0), 1.2);
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / (window.innerWidth || 1)) - 0.5;
      const ny = (e.clientY / (window.innerHeight || 1)) - 0.5;
      targetMouseX = isNaN(nx) ? 0 : nx;
      targetMouseY = isNaN(ny) ? 0 : ny;
    };

    // Touch fallback for mobile
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const nx = (t.clientX / (window.innerWidth || 1)) - 0.5;
        const ny = (t.clientY / (window.innerHeight || 1)) - 0.5;
        targetMouseX = isNaN(nx) ? 0 : nx * 0.5;
        targetMouseY = isNaN(ny) ? 0 : ny * 0.5;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    onScroll();

    const updatePhysics = () => {
      animId = requestAnimationFrame(updatePhysics);

      const safeTarget = isNaN(targetProgress) ? 0 : targetProgress;
      currentProgress += (safeTarget - currentProgress) * 0.085;
      if (isNaN(currentProgress)) currentProgress = 0;

      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      if (isNaN(currentMouseX)) currentMouseX = 0;

      currentMouseY += (targetMouseY - currentMouseY) * 0.06;
      if (isNaN(currentMouseY)) currentMouseY = 0;

      setScrollProgress(currentProgress);
      setMousePos({ x: currentMouseX, y: currentMouseY });

      const panel = panelRef.current;
      if (!panel) return;

      // Camera receding motion on scroll
      const rotX = -currentProgress * 12.0;
      const transY = -currentProgress * 85;
      const transZ = -currentProgress * 160;
      const scale = Math.max(0.65, 1.0 - currentProgress * 0.065);
      const rotY = currentMouseX * 2.8 * (1 - currentProgress * 0.7);
      const pitchOffset = currentMouseY * -2.0 * (1 - currentProgress * 0.7);

      panel.style.transform = `perspective(1200px) translateY(${transY.toFixed(
        2
      )}px) translateZ(${transZ.toFixed(2)}px) rotateX(${(
        rotX + pitchOffset
      ).toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      const topRimAlpha = 0.12 + currentProgress * 0.25;
      const shadowSpread = 40 + currentProgress * 50;
      panel.style.boxShadow = `0 -1px 0 0 rgba(255, 255, 255, ${topRimAlpha.toFixed(
        2
      )}), 0 ${shadowSpread}px 100px -20px rgba(0, 0, 0, 0.95), 0 0 60px ${customization.primaryColor || "#00f0ff"}${Math.round(currentProgress * 25).toString(16).padStart(2, "0")}`;
    };

    animId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [customization.primaryColor]);

  const isLight = theme === "light";
  const primaryColor = customization.primaryColor || "#00f0ff";
  const secondaryColor = customization.secondaryColor || "#8b5cf6";

  return (
    <div
      ref={stageRef}
      id="hero"
      className="relative w-full overflow-visible bg-[#F8FAFC] dark:bg-[#050811] transition-colors duration-300"
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 30%",
      }}
    >
      {/* 
        PHYSICAL 3D PANEL:
        Tilts backward and lifts in space during scroll, behaving like a physical 3D architectural panel.
      */}
      <div
        ref={panelRef}
        className="relative min-h-screen w-full flex flex-col justify-between overflow-x-clip bg-slate-50 dark:bg-[#050811] select-none rounded-b-[20px] sm:rounded-b-[28px] border-b border-x border-slate-200 dark:border-white/[0.08] transition-colors duration-300"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "50% 88%",
          willChange: "transform, box-shadow",
        }}
      >
        {/* LAYER 1: Seamless Rotating Purple Dot-Matrix Globe Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-b-[24px]">
          <SeamlessGlobeVideo scrollProgress={scrollProgress} />
        </div>

        {/* LAYER 2: Google Flow Dynamic Fluid Shader (silky chromatic fluid currents) */}
        {customization.enableFlowShaders !== false && (
          <div className="absolute inset-0 z-1 pointer-events-none rounded-b-[24px] overflow-hidden">
            <GoogleFlowShader opacity={isLight ? 0.45 : 0.65} />
          </div>
        )}

        {/* LAYER 3: 3D Spatial Canvas (No ring lines - fluid flow particles & depth-projected labels) */}
        <HeroSpatial3D
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          isLight={isLight}
        />

        {/* Physical panel subtle surface sheen accent */}
        <div
          className="absolute inset-0 pointer-events-none rounded-b-[24px] transition-opacity duration-300 overflow-hidden z-2"
          style={{
            background:
              theme === "dark"
                ? `linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(5,8,17,0) 40%, ${secondaryColor}15 100%)`
                : `linear-gradient(180deg, ${primaryColor}10 0%, rgba(248,250,252,0) 50%, ${secondaryColor}10 100%)`,
            opacity: isNaN(scrollProgress)
              ? 0.85
              : Math.min(1, Math.max(0, 0.85 + scrollProgress * 0.15)),
          }}
        />

        {/* 1. Navbar: Clean visitor navigation with light/dark toggle & refined hover */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30 w-full px-4 sm:px-8 md:px-10 pt-5 sm:pt-6 md:pt-8 flex items-center justify-between"
        >
          {/* Brand identity */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className="flex items-center gap-2.5 group cursor-pointer text-slate-900 dark:text-[#D7E2EA] font-medium tracking-widest text-sm md:text-base uppercase"
            >
              <span
                className="w-2.5 h-2.5 rounded-full group-hover:scale-125 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  boxShadow: `0 0 12px ${primaryColor}80`,
                }}
              />
              <span className="font-semibold tracking-wider">Omnintell</span>
            </a>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[0.65rem] tracking-wider uppercase text-slate-700 dark:text-[#BBCCD7]">
              <Sparkles className="w-3 h-3" style={{ color: primaryColor }} />
              Technologies &amp; Labs
            </span>
          </div>

          {/* Desktop Nav Links with Google Flow Gradient Hover Micro-Interaction */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-slate-700 dark:text-[#D7E2EA] font-medium uppercase tracking-wider text-xs md:text-sm py-1 group transition-colors duration-200"
              >
                <span>{link.label}</span>
                <span
                  className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                    boxShadow: `0 0 8px ${primaryColor}`,
                  }}
                />
              </a>
            ))}
          </div>

          {/* Right Controls: Initiate Contact CTA + Light/Dark Toggle + Mobile Menu (Download option completely removed) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Contact / Inquiry Button */}
            <a
              href="#contact"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 hover:border-cyan-400 text-xs font-mono tracking-wider text-slate-800 dark:text-white transition-all shadow-sm active:scale-95 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>COLLABORATE</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-full border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle light and dark theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* Mobile menu toggle */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-800 dark:text-[#D7E2EA] hover:opacity-70 transition-opacity cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* Mobile Drawer Menu (Strictly NO download source code button) */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-0 right-0 z-40 bg-white/95 dark:bg-[#050811]/95 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl px-6 py-8 flex flex-col items-center gap-5 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-900 dark:text-[#D7E2EA] font-medium uppercase tracking-wider text-base hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
            <div className="w-full pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col gap-3">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-full text-white text-xs font-mono uppercase tracking-widest text-center flex items-center justify-center gap-2 font-semibold shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                }}
              >
                <span>Initiate Consultation &rarr;</span>
              </a>
            </div>
          </motion.div>
        )}

        {/* 
          2. CINEMATIC HERO TYPOGRAPHY CHOREOGRAPHY
          Google Flow typography with silky blur-to-sharp animation and metallic gradient
        */}
        <div
          className="w-full overflow-hidden text-center mt-3 sm:mt-1 md:mt-0 relative z-20 pointer-events-none px-4 transition-transform duration-100 ease-out"
          style={{
            transform: `translateY(${(-scrollProgress * 40).toFixed(1)}px) scale(${(
              1 - scrollProgress * 0.05
            ).toFixed(3)})`,
            opacity: Math.max(0.2, 1 - scrollProgress * 0.7),
          }}
        >
          <h1 className="flex flex-col items-center justify-center text-center">
            {/* Line 1: HEY */}
            <div className="overflow-hidden py-1">
              <motion.span
                initial={{ y: "110%", opacity: 0, filter: "blur(12px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 1.0,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block font-black uppercase tracking-tight text-[clamp(2.8rem,9vw,6.5rem)] leading-none select-none text-transparent bg-clip-text"
                style={{
                  backgroundImage: isLight
                    ? "linear-gradient(180deg, #0F172A 0%, #334155 100%)"
                    : "linear-gradient(180deg, #FFFFFF 20%, #94A3B8 100%)",
                }}
              >
                HEY
              </motion.span>
            </div>

            {/* Line 2: I'M OMKARESHWAR */}
            <div className="overflow-hidden py-1 mt-1 sm:mt-2">
              <motion.span
                initial={{ y: "115%", opacity: 0, filter: "blur(14px)" }}
                animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 1.1,
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block font-black uppercase tracking-tight text-[clamp(2.2rem,7.6vw,5.6rem)] leading-tight select-none text-transparent bg-clip-text"
                style={{
                  backgroundImage: isLight
                    ? `linear-gradient(180deg, #0F172A 10%, ${secondaryColor} 90%)`
                    : `linear-gradient(180deg, #FFFFFF 15%, #CBD5E1 70%, ${primaryColor} 100%)`,
                }}
              >
                I'M OMKARESHWAR
              </motion.span>
            </div>
          </h1>
        </div>

        {/* 3. Hero Center Viewport & Depth Spacer */}
        <div className="relative z-10 w-full flex-1 my-auto min-h-[160px] sm:min-h-[200px] md:min-h-[260px] flex items-center justify-center pointer-events-none" />

        {/* 4. Bottom bar & Hero Statement */}
        <div className="relative z-20 w-full px-4 sm:px-8 md:px-10 pb-6 sm:pb-8 md:pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          {/* Left identity & statement */}
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-2 max-w-xl"
          >
            <div className="flex flex-wrap items-center gap-2 text-[0.62rem] sm:text-xs font-mono uppercase tracking-widest text-slate-600 dark:text-[#BBCCD7]/90">
              <span className="text-slate-900 dark:text-white font-semibold flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                CEO &amp; FOUNDER — OMNINTELL TECHNOLOGIES
              </span>
              <span className="text-slate-400 dark:text-[#BBCCD7]/40">·</span>
              <span>CEO &amp; FOUNDER — OMNINTELL LABS</span>
            </div>

            <p
              style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.35rem)" }}
              className="text-slate-800 dark:text-[#D7E2EA] font-medium uppercase tracking-wide leading-snug"
            >
              &ldquo;Building intelligent technology for the real world.&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[0.65rem] sm:text-xs font-mono uppercase tracking-[2px] text-slate-500 dark:text-[#BBCCD7]/70">
              <span>AI AGENTS</span>
              <span className="text-slate-300 dark:text-white/30">•</span>
              <span>CYBERSECURITY</span>
              <span className="text-slate-300 dark:text-white/30">•</span>
              <span>3D SYSTEMS</span>
              <span className="text-slate-300 dark:text-white/30">•</span>
              <span>JARVIS AI</span>
              <span className="text-slate-300 dark:text-white/30">•</span>
              <span>OM AI</span>
              <span className="text-slate-300 dark:text-white/30">•</span>
              <span>AEGISV18</span>
            </div>
          </motion.div>

          {/* Right contact button & Location Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3.5"
          >
            <div className="hidden lg:flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-slate-600 dark:text-white/60 px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm">
              <Compass className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>Chhattisgarh, India</span>
            </div>
            <ContactButton href="#contact" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
