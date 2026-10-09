import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Sparkles, ArrowRight, Shield, Cpu, Box, Terminal, Layers } from "lucide-react";

interface ShowcaseItem {
  id: string;
  tag: string;
  title: string;
  category: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: any;
  color: string;
  image: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    id: "labs-jarvis",
    tag: "OMNINTELL LABS · R&D",
    title: "Jarvis AI Autonomous Core",
    category: "Neural Intelligence",
    description: "Multimodal voice reasoning system engineered with local LLM pipelines, autonomous execution daemons, and system-level neural bridges.",
    metric: "< 24ms",
    metricLabel: "Response Latency",
    icon: Cpu,
    color: "#00f0ff",
    image: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
  },
  {
    id: "labs-omai",
    tag: "OMNINTELL TECHNOLOGIES",
    title: "Om AI Cognitive Framework",
    category: "Generative Systems",
    description: "Proprietary generative intelligence engine designed for edge execution, mathematical synthesis, and structured code generation.",
    metric: "4.8x",
    metricLabel: "Inference Efficiency",
    icon: Sparkles,
    color: "#a855f7",
    image: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
  },
  {
    id: "labs-aegis",
    tag: "OMNINTELL CYBER DEFENSE",
    title: "Aegisv18 Elite Defensive Grid",
    category: "Zero-Trust Security",
    description: "Enterprise defensive mesh engineered with automated network packet inspection, air-gapped cryptographic protocols, and anomaly mitigation.",
    metric: "0-Trust",
    metricLabel: "Architectural Hardening",
    icon: Shield,
    color: "#10b981",
    image: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
  },
  {
    id: "labs-spatial",
    tag: "OMNINTELL STUDIO",
    title: "Spatial 3D Shader Architecture",
    category: "WebGL & Spatial",
    description: "Real-time mathematical surface shaders, GLSL lighting equations, kinetic typography, and fluid physical scroll transforms.",
    metric: "60 FPS",
    metricLabel: "Hardware Render Rate",
    icon: Box,
    color: "#f59e0b",
    image: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85",
  },
  {
    id: "labs-automation",
    tag: "OMNINTELL AUTOMATION",
    title: "Autonomous Systems Pipeline",
    category: "Automation Engineering",
    description: "Fault-tolerant background job orchestration, self-healing server architectures, and asynchronous Python worker daemons.",
    metric: "99.99%",
    metricLabel: "Execution Resiliency",
    icon: Terminal,
    color: "#3b82f6",
    image: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85",
  },
];

export const HorizontalShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  // Vertical scroll drives horizontal track translation
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section
      ref={containerRef}
      id="showcase"
      className="relative z-10 w-full h-[280vh] bg-[#F8FAFC] dark:bg-[#080B11] transition-colors duration-300"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-4 sm:px-8 md:px-12">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#00f0ff]/5 dark:bg-[#00f0ff]/8 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="max-w-6xl w-full mx-auto mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-[4px] text-[#0284c7] dark:text-[#00f0ff] font-semibold flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5" />
              HORIZONTAL SPATIAL TIMELINE
            </span>
            <h2
              style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)" }}
              className="hero-heading font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white"
            >
              Omnintell Labs R&amp;D
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-white/60">
            <span>Scroll vertically to navigate</span>
            <ArrowRight className="w-4 h-4 text-[#00f0ff] animate-pulse" />
          </div>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full overflow-hidden">
          <motion.div
            style={{ x }}
            className="flex gap-6 sm:gap-8 items-stretch w-max select-none will-change-transform"
          >
            {showcaseItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  data-cursor="explore"
                  className="w-[300px] sm:w-[380px] md:w-[440px] shrink-0 rounded-[28px] sm:rounded-[36px] bg-white/95 dark:bg-[#0D121F]/95 border border-slate-200 dark:border-white/15 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-300 hover:border-cyan-400/50"
                >
                  {/* Top Color Sheen */}
                  <div
                    className="absolute top-0 inset-x-0 h-1"
                    style={{ background: item.color }}
                  />

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="p-2.5 rounded-xl border backdrop-blur-md"
                        style={{
                          background: `${item.color}15`,
                          borderColor: `${item.color}40`,
                          color: item.color,
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[0.62rem] font-mono tracking-widest uppercase text-slate-500 dark:text-white/50">
                        {String(idx + 1).padStart(2, "0")} / 05
                      </span>
                    </div>

                    <span className="text-[0.65rem] font-mono tracking-wider uppercase text-cyan-600 dark:text-[#00f0ff] font-semibold block mb-1">
                      {item.tag}
                    </span>

                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BBCCD7]/80 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {/* Card Visual / Media Preview */}
                  <div className="w-full h-36 sm:h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 relative my-3 group/img">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-white text-[0.68rem] font-mono uppercase tracking-wider">
                        Spatial Inspection
                      </span>
                    </div>
                  </div>

                  {/* Card Metric Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[0.6rem] font-mono uppercase tracking-wider text-slate-400 block">
                        {item.metricLabel}
                      </span>
                      <span
                        className="text-base sm:text-lg font-black font-mono tracking-tight"
                        style={{ color: item.color }}
                      >
                        {item.metric}
                      </span>
                    </div>
                    <span className="text-[0.65rem] font-mono uppercase tracking-wider text-slate-500 dark:text-white/60 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
