import React, { useState, useEffect, useRef } from "react";
import { Skill } from "../types";
import { FadeIn } from "./FadeIn";
import { Cpu, Terminal, Shield, Palette, Layers, Box, Sparkles, Orbit, Grid, Radio } from "lucide-react";

interface SkillsSectionProps {
  skills?: Skill[];
}

interface ConstellationNode {
  id: string;
  name: string;
  category: string;
  technologies: string[];
  description: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
  isCenter?: boolean;
}

const defaultConstellationNodes = [
  {
    id: "core",
    name: "OMNINTELL CORE",
    category: "Central Architecture",
    technologies: ["AI Models", "Agent Mesh", "Zero-Trust", "WebGL Engine"],
    description: "The unified operational kernel linking autonomous AI, cyber defense, and spatial interfaces.",
    color: "#00f0ff",
    isCenter: true,
  },
  {
    id: "ai",
    name: "AI SYSTEMS",
    category: "Neural Intelligence",
    technologies: ["PyTorch", "HuggingFace", "LangChain", "Transformer Architectures"],
    description: "Neural intent parsing, local model inference pipelines, and cognitive reasoning engines.",
    color: "#a855f7",
  },
  {
    id: "agents",
    name: "AUTONOMOUS AGENTS",
    category: "Agent Orchestration",
    technologies: ["Voice Synthesis", "Async Workers", "Daemon Processes", "Multi-Agent Protocol"],
    description: "Self-directing agentic routines that automate complex workflows and multimodal interactions.",
    color: "#38bdf8",
  },
  {
    id: "software",
    name: "SOFTWARE ARCHITECTURE",
    category: "Full Stack Engineering",
    technologies: ["TypeScript", "React", "Node.js", "Express", "Tailwind CSS"],
    description: "High-scale reactive web platforms, resilient microservices, and modern frontend engines.",
    color: "#6366f1",
  },
  {
    id: "cybersecurity",
    name: "CYBER DEFENSE",
    category: "Security Infrastructure",
    technologies: ["Zero-Trust", "Wireshark", "Burp Suite", "Packet Inspection", "Cryptography"],
    description: "Network hardening, air-gapped security protocols, vulnerability analysis, and penetration testing.",
    color: "#10b981",
  },
  {
    id: "automation",
    name: "SYSTEMS AUTOMATION",
    category: "Process Automation",
    technologies: ["Python 3", "AsyncIO", "NumPy", "OS Automation", "API Daemons"],
    description: "Autonomous task pipelines, background system monitors, and automated script engineering.",
    color: "#f59e0b",
  },
  {
    id: "rd",
    name: "OMNINTELL LABS R&D",
    category: "Experimental Research",
    technologies: ["Three.js", "GLSL Shaders", "Spatial Computing", "Mathematical Modeling"],
    description: "Advanced technological exploration into 3D spatial computing and next-generation frameworks.",
    color: "#ec4899",
  },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeNode, setActiveNode] = useState<any>(defaultConstellationNodes[0]);
  const [viewMode, setViewMode] = useState<"constellation" | "grid">("constellation");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const categories = [
    "All",
    "Intelligence",
    "Security",
    "3D & Motion",
    "Engineering",
    "Creative",
  ];

  const filteredSkills =
    selectedCategory === "All"
      ? skills
      : skills.filter((s) => (s.category || "Engineering") === selectedCategory);

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "3d & motion":
        return <Box className="w-4 h-4 text-[#7c3aed] dark:text-[#B600A8]" />;
      case "intelligence":
      case "ai & llms":
        return <Cpu className="w-4 h-4 text-[#0284c7] dark:text-[#00f0ff]" />;
      case "security":
      case "cybersecurity":
        return <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "creative":
      case "branding":
        return <Palette className="w-4 h-4 text-amber-600 dark:text-[#BE4C00]" />;
      case "engineering":
      case "programming":
      case "web development":
        return <Terminal className="w-4 h-4 text-[#6366f1] dark:text-[#7621B0]" />;
      default:
        return <Layers className="w-4 h-4 text-[#0284c7] dark:text-[#00f0ff]" />;
    }
  };

  // 3D Interactive Constellation Canvas Engine
  useEffect(() => {
    if (viewMode !== "constellation") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 460);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 900;
      height = canvas.height = 460;
    };
    window.addEventListener("resize", handleResize);

    // Initialize 3D Network nodes around OMNINTELL CORE
    const cx = width / 2;
    const cy = height / 2;

    const nodes: ConstellationNode[] = defaultConstellationNodes.map((item, idx) => {
      if (item.isCenter) {
        return {
          ...item,
          x: cx,
          y: cy,
          z: 0,
          vx: 0,
          vy: 0,
          radius: 14,
          connections: [1, 2, 3, 4, 5, 6],
        };
      }
      const angle = ((idx - 1) / (defaultConstellationNodes.length - 1)) * Math.PI * 2;
      const radiusDist = Math.min(width, height) * 0.36;
      return {
        ...item,
        x: cx + Math.cos(angle) * radiusDist,
        y: cy + Math.sin(angle) * (radiusDist * 0.75),
        z: Math.sin(angle * 2) * 20,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 8,
        connections: [0, idx === 1 ? 6 : idx - 1], // connected to core and peer
      };
    });

    let mousePos = { x: -1000, y: -1000 };
    let hoverIndex = -1;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleCanvasClick = () => {
      if (hoverIndex >= 0 && defaultConstellationNodes[hoverIndex]) {
        setActiveNode(defaultConstellationNodes[hoverIndex]);
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleCanvasClick);

    let time = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Faint coordinate grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const step = 45;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Orbital guide ellipse around core
      ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.min(width, height) * 0.36, Math.min(width, height) * 0.27, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Update positions
      hoverIndex = -1;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!n.isCenter) {
          n.x += n.vx;
          n.y += n.vy;

          // Gentle oscillation
          n.x += Math.sin(time + i) * 0.2;
          n.y += Math.cos(time + i * 1.3) * 0.2;

          // Mouse proximity check
          const distToMouse = Math.hypot(n.x - mousePos.x, n.y - mousePos.y);
          if (distToMouse < n.radius + 14) {
            hoverIndex = i;
          }
        } else {
          // Center core mouse check
          const distToCenter = Math.hypot(n.x - mousePos.x, n.y - mousePos.y);
          if (distToCenter < n.radius + 16) {
            hoverIndex = 0;
          }
        }
      }

      // Draw Connection Vectors
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (const j of n1.connections) {
          const n2 = nodes[j];
          if (!n2) continue;
          const isHighlit = hoverIndex === i || hoverIndex === j || activeNode?.name === n1.name || activeNode?.name === n2.name;

          ctx.strokeStyle = isHighlit ? "rgba(0, 240, 255, 0.7)" : "rgba(168, 85, 247, 0.2)";
          ctx.lineWidth = isHighlit ? 2.0 : 1.0;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();

          // Luminous pulse particle along active connection
          if (isHighlit) {
            const progress = (time * 1.5 + (i + j) * 0.4) % 1;
            const px = n1.x + (n2.x - n1.x) * progress;
            const py = n1.y + (n2.y - n1.y) * progress;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const isHovered = hoverIndex === i;
        const isSelected = activeNode?.name === n.name;

        // Glow
        const glowRadius = n.radius * (isHovered || isSelected ? 3.2 : 2.0);
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius);
        grad.addColorStop(0, isHovered || isSelected ? "rgba(0, 240, 255, 0.85)" : `${n.color}55`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node Solid Core
        ctx.fillStyle = isHovered || isSelected ? "#ffffff" : n.color;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * (isHovered ? 1.25 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Node Label
        ctx.font = n.isCenter ? 'bold 11px "Space Grotesk", sans-serif' : 'bold 9px "JetBrains Mono", monospace';
        ctx.fillStyle = isHovered || isSelected ? "#00f0ff" : "#D7E2EA";
        const textOffset = n.isCenter ? -18 : n.radius + 8;
        ctx.fillText(n.name, n.x - (n.isCenter ? ctx.measureText(n.name).width / 2 : -8), n.y + (n.isCenter ? textOffset : 4));
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [viewMode, activeNode]);

  return (
    <section
      id="skills"
      className="relative z-10 w-full bg-[#F8FAFC] dark:bg-[#080B11] py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-10 border-t border-slate-200 dark:border-white/5 overflow-hidden transition-colors duration-300"
    >
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#6366f1]/5 dark:bg-[#7621B0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#0284c7]/5 dark:bg-[#00f0ff]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <FadeIn delay={0} y={30}>
            <div>
              <span className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-[4px] text-[#0284c7] dark:text-[#00f0ff] flex items-center gap-1.5 mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                3D TECHNOLOGY NETWORK &amp; CORE ARCHITECTURE
              </span>
              <h2
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
                className="hero-heading font-black uppercase tracking-tight leading-none select-none text-slate-900 dark:text-white"
              >
                Technology Stack
              </h2>
            </div>
          </FadeIn>

          {/* View Mode Toggle: Constellation 3D vs Grid */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/70 dark:bg-white/5 border border-slate-300 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("constellation")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                  viewMode === "constellation"
                    ? "bg-[#0284c7] dark:bg-[#00f0ff] text-white dark:text-black font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Orbit className="w-3.5 h-3.5" />
                <span>3D Constellation</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                  viewMode === "grid"
                    ? "bg-[#0284c7] dark:bg-[#00f0ff] text-white dark:text-black font-semibold shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Capabilities Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. 3D CONSTELLATION VIEW */}
        {viewMode === "constellation" && (
          <div className="relative w-full rounded-[28px] sm:rounded-[36px] bg-white/80 dark:bg-[#090D16]/90 border border-slate-200 dark:border-white/10 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl mb-12 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 font-mono text-xs text-slate-500 dark:text-white/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                <span className="text-[#0284c7] dark:text-[#00f0ff] font-semibold">
                  OMNINTELL CORE 3D NETWORK
                </span>
              </div>
              <span className="hidden sm:inline">Click or hover nodes to inspect architecture</span>
            </div>

            <div className="relative w-full h-[460px] cursor-crosshair">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            {/* Active Node Floating Architecture Spec Card */}
            {activeNode && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-100/70 dark:bg-white/5 p-5 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl border shrink-0"
                    style={{
                      background: `${activeNode.color || "#00f0ff"}15`,
                      borderColor: `${activeNode.color || "#00f0ff"}40`,
                      color: activeNode.color || "#00f0ff",
                    }}
                  >
                    <Radio className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-base sm:text-lg">
                        {activeNode.name}
                      </h4>
                      <span className="text-[0.65rem] font-mono uppercase tracking-wider text-cyan-600 dark:text-[#00f0ff] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        {activeNode.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BBCCD7]/90 max-w-2xl mt-1 leading-relaxed">
                      {activeNode.description}
                    </p>
                  </div>
                </div>

                {activeNode.technologies && activeNode.technologies.length > 0 && (
                  <div className="flex flex-col gap-1.5 font-mono text-xs w-full md:w-auto">
                    <span className="text-[0.65rem] text-slate-400 uppercase tracking-widest">
                      Key Frameworks &amp; Protocols
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeNode.technologies.map((t: string) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-white dark:bg-black/40 border border-slate-200 dark:border-white/15 text-[0.68rem] text-slate-800 dark:text-white font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. CAPABILITIES GRID (No fake percentages, real skills and stacks) */}
        {viewMode === "grid" && (
          <div className="flex flex-col gap-6">
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white shadow-md font-semibold scale-105"
                        : "bg-white/80 dark:bg-white/5 text-slate-600 dark:text-[#BBCCD7]/70 hover:bg-slate-200/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSkills.map((skill, index) => (
                <div
                  key={skill.id || index}
                  className="group relative rounded-2xl sm:rounded-3xl bg-white/90 dark:bg-[#0F1626]/90 border border-slate-200 dark:border-white/10 hover:border-[#0284c7]/40 dark:hover:border-[#00f0ff]/40 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.7)] flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                        {getCategoryIcon(skill.category)}
                      </div>
                      <span className="text-[0.68rem] font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff] font-semibold">
                        {skill.category || "TECH"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 dark:text-white text-base tracking-tight mb-2 uppercase">
                      {skill.name}
                    </h3>

                    {skill.description && (
                      <p className="text-xs text-slate-600 dark:text-[#BBCCD7]/80 leading-relaxed mb-4">
                        {skill.description}
                      </p>
                    )}
                  </div>

                  {skill.technologies && skill.technologies.length > 0 && (
                    <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-1.5">
                      {skill.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[0.65rem] font-mono text-slate-700 dark:text-[#BBCCD7]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
