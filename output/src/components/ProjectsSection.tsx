import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Project } from "../types";
import { LiveProjectButton } from "./LiveProjectButton";
import { FadeIn } from "./FadeIn";
import { Sparkles, ArrowUpRight, Layers } from "lucide-react";

interface ProjectsSectionProps {
  dynamicProjects?: Project[];
  onOpenLightbox?: (images: string[], index?: number) => void;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  totalCards: number;
  onOpenLightbox?: (images: string[], index?: number) => void;
}

const defaultProjects: Project[] = [
  {
    id: 1,
    title: "Jarvis AI Autonomous System",
    category: "AI Agent & Voice Core",
    description: "Multimodal autonomous assistant system with natural language reasoning, automated workflows, and system-level neural integrations.",
    url: "https://omnintell.tech",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
    ],
  },
  {
    id: 2,
    title: "Om AI Cognitive Framework",
    category: "LLM & Neural Engine",
    description: "Omnintell Labs proprietary generative intelligence engine designed for edge execution, low-latency reasoning, and complex tasks.",
    url: "https://omnintell.tech",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85",
    ],
  },
  {
    id: 3,
    title: "Aegisv18 Elite Defensive Grid",
    category: "Cybersecurity & Zero-Trust",
    description: "Enterprise cyber defensive mesh engineered with automated threat detection, packet inspection, and air-gapped cryptography.",
    url: "https://omnintell.tech",
    images: [
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
    ],
  },
];

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards, onOpenLightbox }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouseHover, setMouseHover] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 22,
    mass: 0.8,
  });

  // Physical 3D sticky stack transforms
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [14, 0, -6]);
  const translateZ = useTransform(smoothProgress, [0, 0.5, 1], [-70, 0, -35]);
  const targetScale = 1 - (totalCards - 1 - index) * 0.035;
  const scale = useTransform(smoothProgress, [0, 1], [0.94, targetScale]);
  const rawOpacity = useTransform(smoothProgress, [0, 0.2, 1], [0.4, 1, 1]);
  const opacity = useTransform(rawOpacity, (val) => (typeof val === "number" && !isNaN(val) ? val : 1));

  const numStr = String(index + 1).padStart(2, "0");
  const topOffset = index * 26;

  const rawImages =
    project.images && project.images.length > 0
      ? project.images
      : project.imageUrl || project.image
      ? [project.imageUrl || project.image!]
      : defaultProjects[index % 3].images || [];

  const images = rawImages.length > 0 ? rawImages : defaultProjects[index % 3].images!;

  // 3D Card Hover Physics
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseHover({ x: nx, y: ny, active: true });
  };

  const handleMouseLeave = () => {
    setMouseHover({ x: 0, y: 0, active: false });
  };

  const rotTiltX = mouseHover.active ? -mouseHover.y * 6.5 : 0;
  const rotTiltY = mouseHover.active ? mouseHover.x * 6.5 : 0;
  const lightX = ((mouseHover.x + 0.5) * 100).toFixed(1);
  const lightY = ((mouseHover.y + 0.5) * 100).toFixed(1);

  return (
    <div
      ref={containerRef}
      data-cursor="project"
      className="project-card min-h-[75vh] sm:min-h-[82vh] md:h-[86vh] flex items-center justify-center sticky top-20 sm:top-24 md:top-28 py-4 sm:py-6"
      style={{
        top: `calc(4.5rem + ${topOffset}px)`,
        perspective: "1400px",
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          scale,
          rotateX,
          translateZ,
          opacity,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: rotTiltX,
          rotateY: rotTiltY,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 24,
        }}
        className="w-full max-w-6xl rounded-[28px] sm:rounded-[44px] md:rounded-[56px] border-2 border-slate-200 dark:border-white/15 hover:border-[#0284c7]/50 dark:hover:border-[#00f0ff]/50 bg-white/95 dark:bg-[#0C101A]/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col justify-between transition-colors duration-300 relative group select-none will-change-transform"
      >
        {/* LIGHT LAYER Z:70 (Cursor-following luminous glow) */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-30"
          style={{
            background: mouseHover.active
              ? `radial-gradient(circle 380px at ${lightX}% ${lightY}%, rgba(0, 240, 255, 0.12), transparent 70%)`
              : "none",
            opacity: mouseHover.active ? 1 : 0,
            transform: "translateZ(70px)",
          }}
        />

        {/* GLASS / SURFACE LAYER Z:20 (Top rim streak) */}
        <div
          className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#0284c7]/50 dark:via-[#00f0ff]/50 to-transparent pointer-events-none"
          style={{ transform: "translateZ(20px)" }}
        />

        {/* TOP ROW: CONTENT & METADATA LAYER Z:35 to Z:55 */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-white/10"
          style={{ transform: "translateZ(35px)" }}
        >
          <div className="flex items-center gap-3 sm:gap-6 md:gap-8">
            <span
              style={{
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                transform: "translateZ(45px)",
              }}
              className="font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-900 dark:from-white via-slate-600 dark:via-[#D7E2EA] to-slate-400 dark:to-white/30"
            >
              {numStr}
            </span>

            <div className="flex flex-col">
              <span
                style={{ transform: "translateZ(55px)" }}
                className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff] flex items-center gap-1.5 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {project.category || "ENGINEERED SYSTEM"}
              </span>

              <h3
                style={{ transform: "translateZ(48px)" }}
                className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold uppercase text-slate-900 dark:text-white tracking-tight group-hover:text-[#0284c7] dark:group-hover:text-[#00f0ff] transition-colors"
              >
                {project.title}
              </h3>

              {project.description && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BBCCD7]/80 line-clamp-2 max-w-2xl mt-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-2 sm:gap-3"
            style={{ transform: "translateZ(60px)" }}
          >
            {project.url && <LiveProjectButton href={project.url} />}
          </div>
        </div>

        {/* BOTTOM ROW: IMAGE VISUAL LAYER Z:0 to Z:25 */}
        <div
          className="relative pt-4 sm:pt-6"
          style={{ transform: "translateZ(20px)" }}
        >
          {images.length === 1 ? (
            /* Single Image Showcase */
            <div
              onClick={() => onOpenLightbox?.(images, 0)}
              className="cursor-pointer group/img"
            >
              <div className="w-full rounded-[20px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-white/10 h-[220px] sm:h-[300px] md:h-[400px] relative">
                <img
                  src={images[0]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-4 sm:p-6">
                  <div className="text-white text-xs sm:text-sm font-mono flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-[#00f0ff]" /> Click to expand full screen
                  </div>
                </div>
              </div>
            </div>
          ) : images.length === 2 ? (
            /* Dual Images Side-by-Side */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6 items-stretch">
              {images.slice(0, 2).map((img, i) => (
                <div
                  key={i}
                  onClick={() => onOpenLightbox?.(images, i)}
                  className="w-full rounded-[20px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-white/10 h-[200px] sm:h-[260px] md:h-[360px] group/img relative cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${project.title} Preview ${i + 1}`}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-mono">View detail</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Multi-Image Grid (3+ images) */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 md:gap-6 items-stretch">
              {/* Left Column: 2 stacked images */}
              <div className="md:col-span-5 flex flex-col gap-3 sm:gap-4 md:gap-6">
                <div
                  onClick={() => onOpenLightbox?.(images, 0)}
                  style={{ height: "clamp(120px, 16vw, 210px)" }}
                  className="w-full rounded-[20px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-white/10 group/img relative cursor-pointer"
                >
                  <img
                    src={images[0]}
                    alt={`${project.title} Detail 1`}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                </div>
                <div
                  onClick={() => onOpenLightbox?.(images, 1)}
                  style={{ height: "clamp(130px, 20vw, 280px)" }}
                  className="w-full rounded-[20px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-white/10 group/img relative cursor-pointer"
                >
                  <img
                    src={images[1]}
                    alt={`${project.title} Detail 2`}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Right Column: 1 tall main hero image */}
              <div
                onClick={() => onOpenLightbox?.(images, 2)}
                className="md:col-span-7 rounded-[20px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-slate-100 dark:bg-[#161616] border border-slate-200 dark:border-white/10 min-h-[220px] sm:min-h-[280px] md:min-h-[380px] group/img relative cursor-pointer"
              >
                <img
                  src={images[2]}
                  alt={`${project.title} Main Perspective`}
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute bottom-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/20 backdrop-blur-md font-mono text-[0.68rem] text-white/95 hidden sm:flex items-center gap-1.5 shadow-lg">
                  <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Architecture Gallery</span>
                  {images.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-bold">
                      +{images.length - 3}
                    </span>
                  )}
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#00f0ff]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  dynamicProjects,
  onOpenLightbox,
}) => {
  const projectsToDisplay =
    dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : defaultProjects;

  return (
    <section
      id="projects"
      className="relative z-10 w-full bg-[#F8FAFC] dark:bg-[#080B11] rounded-t-[32px] sm:rounded-t-[48px] md:rounded-t-[60px] -mt-8 sm:-mt-12 md:-mt-14 pt-16 sm:pt-20 pb-28 sm:pb-36 px-3 sm:px-6 md:px-10 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto mb-12 sm:mb-20 text-center">
        <FadeIn delay={0} y={35}>
          <span className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-[4px] text-[#0284c7] dark:text-[#00f0ff] block mb-2 font-semibold">
            Omnintell Technologies &amp; Labs Portfolios
          </span>
          <h2
            style={{ fontSize: "clamp(2.8rem, 10vw, 130px)" }}
            className="hero-heading font-black uppercase leading-none tracking-tight select-none"
          >
            Projects
          </h2>
        </FadeIn>
      </div>

      {/* 3D Physical Stacking Cards */}
      <div className="relative">
        {projectsToDisplay.map((proj, idx) => (
          <ProjectCard
            key={proj.id || idx}
            project={proj}
            index={idx}
            totalCards={projectsToDisplay.length}
            onOpenLightbox={onOpenLightbox}
          />
        ))}
      </div>
    </section>
  );
};
