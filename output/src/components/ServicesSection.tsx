import React from "react";
import { FadeIn } from "./FadeIn";
import { Sparkles, ArrowRight } from "lucide-react";

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    name: "3D Modeling & Systems",
    description:
      "Creation of detailed objects, characters, and spatial environments tailored to specific client needs, ideal for games, products, and interactive WebGL visualizations.",
  },
  {
    number: "02",
    name: "Photorealistic Rendering",
    description:
      "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring digital concepts to life.",
  },
  {
    number: "03",
    name: "Motion Design & VFX",
    description:
      "Dynamic animations and spatial motion graphics that add energy, precision, and immersive storytelling to brands, products, and digital experiences.",
  },
  {
    number: "04",
    name: "Autonomous AI & LLM Systems",
    description:
      "Architecting edge AI agents, multimodal workflows, and cognitive pipelines — powering tools like Jarvis AI and Om AI with real-world execution capabilities.",
  },
  {
    number: "05",
    name: "Cybersecurity & Defensive Mesh",
    description:
      "Zero-trust security architecture, automated intrusion defenses, and penetration audits inspired by the Aegisv18 Elite defensive framework.",
  },
  {
    number: "06",
    name: "Enterprise Full Stack Web",
    description:
      "Designing clean, modern, ultra-responsive web applications with fluid 3D graphics, optimized server pipelines, and conversion-focused architectures.",
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="relative z-0 w-full bg-[#FFFFFF] dark:bg-[#080B11] text-[#0C0C0C] dark:text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Tag */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff]">
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities &amp; Enterprise Solutions
          </span>
        </div>

        {/* Heading: "Services" */}
        <FadeIn delay={0} y={40}>
          <h2
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            className="font-black uppercase text-[#0C0C0C] dark:text-white text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-24"
          >
            Services
          </h2>
        </FadeIn>

        {/* Service items list */}
        <div className="flex flex-col divide-y divide-[#0C0C0C]/15 dark:divide-white/10 border-t border-b border-[#0C0C0C]/15 dark:border-white/10">
          {services.map((item, index) => (
            <FadeIn key={item.number} delay={index * 0.08} y={30}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-12 py-8 sm:py-10 md:py-12 group transition-all duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] px-3 sm:px-6 rounded-2xl">
                {/* Huge Number */}
                <div
                  style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
                  className="font-black leading-none text-[#0C0C0C]/80 dark:text-white/40 select-none sm:w-[220px] md:w-[280px] shrink-0 group-hover:translate-x-3 group-hover:text-[#7621B0] dark:group-hover:text-[#00f0ff] transition-all duration-300"
                >
                  {item.number}
                </div>

                {/* Name & Description */}
                <div className="flex flex-col gap-2.5 sm:gap-3 flex-1">
                  <h3
                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 2.1rem)" }}
                    className="font-medium uppercase tracking-wide text-[#0C0C0C] dark:text-white group-hover:text-[#0284c7] dark:group-hover:text-[#00f0ff] transition-colors"
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{ fontSize: "clamp(0.88rem, 1.5vw, 1.15rem)" }}
                    className="font-light leading-relaxed text-[#0C0C0C]/70 dark:text-[#BBCCD7]/70 max-w-2xl"
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Engagement Direct Action */}
        <div className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Ready to architect custom systems?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#BBCCD7]/80 mt-1">
              Direct consultation for 3D architecture, AI engineering, and cybersecurity deployments.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#7621B0] text-white font-medium text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 shadow-md"
          >
            <span>Initiate Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

