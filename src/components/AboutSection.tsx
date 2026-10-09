import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";
import { AnimatedText } from "./AnimatedText";
import { Building2, Sparkles, MapPin, Code2, Globe2, GraduationCap } from "lucide-react";

interface AboutSectionProps {
  bioText?: string;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ bioText }) => {
  const defaultText =
    "CEO & Founder of Omnintell Technologies and Omnintell Labs based in Chhattisgarh, India. 10th Grade Innovator from Mothers Pride School (MPS) Khamariya. Full stack developer, ethical hacker, and AI architect building intelligent technology for the real world — creator of Jarvis AI, Om AI, and Aegisv18 Elite.";

  const textToAnimate = bioText || defaultText;

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  // Physical 3D Architectural Unfolding Panel Transforms
  const panelRotateX = useTransform(smoothProgress, [0, 1], [16, 0]);
  const panelTranslateY = useTransform(smoothProgress, [0, 1], [90, 0]);
  const panelTranslateZ = useTransform(smoothProgress, [0, 1], [-120, 0]);
  const panelScale = useTransform(smoothProgress, [0, 1], [0.93, 1]);
  const panelOpacity = useTransform(smoothProgress, [0, 0.4, 1], [0.35, 0.85, 1]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-[#D7E2EA] px-4 sm:px-8 md:px-10 py-20 sm:py-28 overflow-hidden transition-colors duration-300"
      style={{
        perspective: "1400px",
      }}
    >
      {/* Subtle Background Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#7621B0]/10 via-[#00f0ff]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Decorative 3D floating accents positioned with spatial depth */}
      <div className="absolute top-[4%] left-[2%] md:left-[4%] z-10 pointer-events-none w-[60px] sm:w-[120px] md:w-[170px] opacity-60 sm:opacity-85">
        <FadeIn delay={0.1} x={-40} y={0} duration={0.9}>
          <div className="animate-[bounce_7s_ease-in-out_infinite] hover:rotate-12 transition-transform duration-500">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
              alt="3D Spatial Asset"
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(182,0,168,0.25)]"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>

      <div className="absolute top-[4%] right-[2%] md:right-[4%] z-10 pointer-events-none w-[60px] sm:w-[120px] md:w-[170px] opacity-60 sm:opacity-85">
        <FadeIn delay={0.15} x={40} y={0} duration={0.9}>
          <div className="animate-[bounce_8s_ease-in-out_infinite] hover:-rotate-12 transition-transform duration-500">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
              alt="3D Spatial Cube"
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(118,33,176,0.25)]"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-[6%] left-[3%] md:left-[6%] z-10 pointer-events-none w-[50px] sm:w-[95px] md:w-[150px] opacity-50 sm:opacity-75">
        <FadeIn delay={0.25} x={-40} y={0} duration={0.9}>
          <div className="animate-[pulse_6s_ease-in-out_infinite]">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
              alt="3D Shape Asset"
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-[6%] right-[3%] md:right-[6%] z-10 pointer-events-none w-[60px] sm:w-[110px] md:w-[170px] opacity-50 sm:opacity-75">
        <FadeIn delay={0.3} x={40} y={0} duration={0.9}>
          <div className="animate-[bounce_9s_ease-in-out_infinite]">
            <img
              src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
              alt="3D Cluster Asset"
              className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(182,0,168,0.2)]"
              loading="lazy"
            />
          </div>
        </FadeIn>
      </div>

      {/* Main Content: Spatial Architectural Unfolding Panel */}
      <motion.div
        style={{
          rotateX: panelRotateX,
          translateY: panelTranslateY,
          translateZ: panelTranslateZ,
          scale: panelScale,
          opacity: panelOpacity,
          transformStyle: "preserve-3d",
        }}
        className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full will-change-transform"
      >
        {/* Subtle Section Metadata Header */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono tracking-widest uppercase text-slate-500 dark:text-[#BBCCD7]/70 mb-4">
          <span className="flex items-center gap-1.5 text-[#0284c7] dark:text-[#00f0ff] font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            OMNINTELL TECHNOLOGIES
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            OMNINTELL LABS
          </span>
          <span>·</span>
          <span>CHHATTISGARH, INDIA</span>
        </div>

        {/* Big Typography with Spatial Presence */}
        <h2
          style={{ fontSize: "clamp(2.8rem, 10vw, 130px)" }}
          className="hero-heading font-black uppercase leading-none tracking-tight mb-8 sm:mb-12 select-none"
        >
          About me
        </h2>

        {/* 3D Physical Unfolded Architecture Card */}
        <div className="w-full max-w-[680px] mx-auto mb-10 sm:mb-12 rounded-[28px] sm:rounded-[36px] bg-white/90 dark:bg-[#0C111C]/90 border border-slate-200 dark:border-white/15 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl dark:shadow-[0_25px_80px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all duration-300">
          {/* Top cyan/violet luminous light streak */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0284c7]/50 dark:via-[#00f0ff]/60 to-transparent pointer-events-none" />

          {/* Clean header info row */}
          <div className="flex items-center justify-between gap-3 mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff]">
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D CREATIVE · AI ARCHITECT · ETHICAL HACKER</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.68rem] font-mono text-slate-500 dark:text-white/50">
              <Code2 className="w-3.5 h-3.5" />
              <span>EST. 2019</span>
            </div>
          </div>

          {/* Animated Bio Statement */}
          <AnimatedText
            text={textToAnimate}
            className="text-slate-800 dark:text-[#D7E2EA] font-medium text-center leading-relaxed text-[clamp(1.0rem,1.9vw,1.25rem)] mb-6"
          />

          {/* Credential summary */}
          <div className="pt-5 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-slate-600 dark:text-[#BBCCD7]/80">
            <span className="flex items-center gap-1 text-[#0284c7] dark:text-[#00f0ff] font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              10th Grade Innovator
            </span>
            <span>·</span>
            <span>School: MPS Khamariya</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-500" />
              Chhattisgarh, India
            </span>
          </div>

          {/* Engineered Systems Tags */}
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-center gap-2 font-mono text-[0.68rem]">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[#0284c7] dark:text-[#00f0ff] font-semibold">
              JARVIS AI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-purple-600 dark:text-[#B600A8] font-semibold">
              OM AI
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              AEGISV18 ELITE
            </span>
          </div>
        </div>

        {/* Physical Magnet Contact Button */}
        <ContactButton href="#contact" />
      </motion.div>
    </section>
  );
};
