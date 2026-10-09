import { useEffect, useState } from "react";
import { PortfolioData } from "./types";
import { useTheme } from "./context/ThemeContext";
import { HeroSection } from "./components/HeroSection";
import { MarqueeSection } from "./components/MarqueeSection";
import { AboutSection } from "./components/AboutSection";
import { ServicesSection } from "./components/ServicesSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { HorizontalShowcase } from "./components/HorizontalShowcase";
import { CertificatesSection } from "./components/CertificatesSection";
import { SkillsSection } from "./components/SkillsSection";
import { FooterSection } from "./components/FooterSection";
import { AdminModal } from "./components/AdminModal";
import { ImageLightbox } from "./components/ImageLightbox";
import { CustomCursor } from "./components/CustomCursor";

export default function App() {
  const [data, setData] = useState<PortfolioData>({
    userName: "Omkareshwar Sinha (Jack)",
    userTagline: "Founder & CEO — Omnintell Technologies · Founder — Omnintell Labs · 3D Creator & AI Architect",
    userBio: "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
    location: "Khamariya, Chhattisgarh, India",
    skills: [
      { id: 1, name: "3D Modeling & Hard Surface", level: 96, category: "3D & Motion" },
      { id: 2, name: "Photorealistic Rendering", level: 92, category: "3D & Motion" },
      { id: 3, name: "Motion Design & VFX", level: 90, category: "3D & Motion" },
      { id: 4, name: "Full Stack Web & React", level: 94, category: "Engineering" },
      { id: 5, name: "AI Architect & LLM Systems", level: 95, category: "Intelligence" },
      { id: 6, name: "Cybersecurity & Ethical Hacking", level: 88, category: "Security" },
      { id: 7, name: "Brand Identity & Design Systems", level: 91, category: "Creative" },
      { id: 8, name: "Automation & Python R&D", level: 89, category: "Engineering" },
    ],
    certificates: [
      {
        id: 1,
        title: "AI & Deep Learning Architecture",
        issuer: "Omnintell Labs / Advanced Research Program",
        date: "2024",
      },
      {
        id: 2,
        title: "Ethical Hacking & Web Penetration Testing",
        issuer: "Cyber Defense Initiative · MPS Khamariya",
        date: "2024",
      },
      {
        id: 3,
        title: "Advanced 3D Modeling & Cinematic Animation",
        issuer: "Global Motion & 3D Creators Guild",
        date: "2023",
      },
      {
        id: 4,
        title: "Full-Stack Enterprise Systems & Cloud Deployment",
        issuer: "Omnintell Technologies Technical Division",
        date: "2023",
      },
    ],
    projects: [],
  });

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const openLightbox = (images: string[], index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxUrl(images[index] || null);
  };

  const closeLightbox = () => {
    setLightboxUrl(null);
    setLightboxImages([]);
    setLightboxIndex(0);
  };

  const { theme, customization, updateCustomization } = useTheme();

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch("/api/portfolio?action=get_all");
      if (res.ok) {
        const json = await res.json();
        if (json && typeof json === "object") {
          setData((prev) => ({
            ...prev,
            ...json,
            skills: json.skills || prev.skills,
            certificates: json.certificates || prev.certificates,
            projects: json.projects || prev.projects,
          }));

          const remoteTheme = json.themeConfig || json.siteSettings?.themeConfig;
          if (remoteTheme && typeof remoteTheme === "object") {
            updateCustomization(remoteTheme);
          }
        }
      }
    } catch {
      // Fallback data remains active
    }
  };

  useEffect(() => {
    fetchPortfolioData();

    // Check ?admin parameter
    if (window.location.search.includes("admin")) {
      setIsAdminOpen(true);
    }

    // Secret shortcut to open admin: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-[#D7E2EA] font-['Kanit',sans-serif] overflow-x-clip relative selection:bg-[#0284c7]/30 dark:selection:bg-[#7621B0]/40 selection:text-slate-900 dark:selection:text-white transition-colors duration-300">
      {/* DESKTOP CONTEXT-SENSITIVE 3D CUSTOM CURSOR */}
      <CustomCursor />

      {/* 1. CINEMATIC HERO SECTION */}
      <HeroSection onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* MARQUEE TRANSITION */}
      <MarqueeSection />

      {/* 2. ABOUT SECTION */}
      <AboutSection bioText={data.userBio} />

      {/* 3. SERVICES SECTION (Core Capabilities & Enterprise Solutions) */}
      <ServicesSection />

      {/* 4. PROJECTS SECTION (Cinematic Case Studies from backend with 3D Core) */}
      <ProjectsSection
        dynamicProjects={data.projects}
        onOpenLightbox={(images, index) => openLightbox(images, index)}
      />

      {/* HORIZONTAL SPATIAL TIMELINE SHOWCASE */}
      <HorizontalShowcase />

      {/* 5. SKILLS SECTION (Categorized stack loaded from backend) */}
      <SkillsSection skills={data.skills} />

      {/* 6. CERTIFICATES SECTION (Horizontally scrollable with lightbox) */}
      <CertificatesSection
        certificates={data.certificates}
        onSelectImage={(url) => openLightbox([url], 0)}
        onOpenLightbox={(images, index) => openLightbox(images, index)}
      />

      {/* 7. CONTACT & FOOTER SECTION */}
      <FooterSection
        onOpenAdmin={() => setIsAdminOpen(true)}
        contacts={data.contacts}
        location={data.location}
      />

      {/* ADMIN PORTAL MODAL (Protected by PHP Session & Bcrypt) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onDataRefresh={fetchPortfolioData}
      />

      {/* IMAGE LIGHTBOX */}
      <ImageLightbox
        imageUrl={lightboxUrl}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        onClose={closeLightbox}
      />
    </div>
  );
}
