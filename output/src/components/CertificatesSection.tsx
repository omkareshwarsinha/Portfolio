import React, { useRef, useState, useEffect } from "react";
import { Certificate } from "../types";
import { FadeIn } from "./FadeIn";
import { RollingBox3D } from "./RollingBox3D";
import { Award, ChevronLeft, ChevronRight, ExternalLink, Calendar, ShieldCheck, Sparkles } from "lucide-react";

interface CertificatesSectionProps {
  certificates: Certificate[];
  onSelectImage?: (url: string) => void;
  onOpenLightbox?: (images: string[], index?: number) => void;
}

export const CertificatesSection: React.FC<CertificatesSectionProps> = ({
  certificates,
  onSelectImage,
  onOpenLightbox,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScroll = () => {
    if (!scrollerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [certificates]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollerRef.current) return;
    const distance = 360;
    scrollerRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollerRef.current.offsetLeft);
    setScrollLeft(scrollerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section
      id="certificates"
      className="relative z-10 w-full bg-[#F8FAFC] dark:bg-[#080B11] py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-10 overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading and Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <FadeIn delay={0} y={30}>
            <div>
              <span className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-[4px] text-[#0284c7] dark:text-[#00f0ff] flex items-center gap-1.5 mb-2 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                VERIFIED CREDENTIALS &amp; RESEARCH HONORS
              </span>
              <h2
                style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
                className="hero-heading font-black uppercase tracking-tight leading-none"
              >
                Certificates
              </h2>
            </div>
          </FadeIn>

          {/* Nav Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? "text-slate-800 dark:text-white bg-white/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 hover:border-[#0284c7]/50 dark:hover:border-[#00f0ff]/50 cursor-pointer shadow-md"
                  : "text-slate-300 dark:text-white/20 border-slate-200 dark:border-white/5 cursor-not-allowed opacity-40"
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center transition-all ${
                canScrollRight
                  ? "text-slate-800 dark:text-white bg-white/80 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 hover:border-[#0284c7]/50 dark:hover:border-[#00f0ff]/50 cursor-pointer shadow-md"
                  : "text-slate-300 dark:text-white/20 border-slate-200 dark:border-white/5 cursor-not-allowed opacity-40"
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Box Carousel: Auto-adjusts for mobile and desktop */}
        <div
          ref={scrollerRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-5 sm:gap-6 overflow-x-auto pb-8 pt-4 scrollbar-none select-none cursor-grab active:cursor-grabbing ${
            isDown ? "scroll-auto" : "scroll-smooth"
          }`}
          style={{
            scrollSnapType: isDown ? "none" : "x mandatory",
            touchAction: "pan-x pan-y",
          }}
        >
          {certificates.map((cert, idx) => {
            const certImages = cert.images && cert.images.length > 0 ? cert.images : (cert.imageUrl || cert.image ? [cert.imageUrl || cert.image!] : []);
            const displayImg = certImages[0] || null;
            const hasMultipleImages = certImages.length > 1;

            const handleCardClick = () => {
              if (certImages.length > 0) {
                if (onOpenLightbox) {
                  onOpenLightbox(certImages, 0);
                } else if (onSelectImage && displayImg) {
                  onSelectImage(displayImg);
                }
              }
            };

            return (
              <div
                key={cert.id || idx}
                style={{ scrollSnapAlign: "start" }}
                className="flex-shrink-0 w-[270px] sm:w-[330px] md:w-[370px]"
              >
                <RollingBox3D
                  depth={35}
                  rollAngle={15}
                  glowEffect={idx % 2 === 0 ? "cyan" : "purple"}
                  className="h-full"
                >
                  <div className="rounded-[24px] sm:rounded-[32px] bg-white/90 dark:bg-[#0F1626]/90 border border-slate-200 dark:border-white/10 hover:border-[#0284c7]/40 dark:hover:border-white/30 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-lg dark:shadow-xl group h-full">
                    {/* Certificate image preview */}
                    <div
                      onClick={handleCardClick}
                      className="w-full aspect-[16/10] rounded-[18px] sm:rounded-[22px] bg-slate-100 dark:bg-[#1a1a1f] overflow-hidden mb-4 relative cursor-pointer group/img border border-slate-200 dark:border-white/5"
                    >
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-white/40 bg-gradient-to-br from-slate-100 dark:from-white/5 to-transparent">
                          <Award className="w-9 h-9 text-[#0284c7] dark:text-[#00f0ff]" />
                          <span className="text-[0.65rem] font-mono uppercase tracking-wider text-slate-500 dark:text-white/50">Verified Credential</span>
                        </div>
                      )}

                      {/* Multi-image indicator badge */}
                      {hasMultipleImages && (
                        <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[0.65rem] font-mono text-white flex items-center gap-1 shadow-md">
                          <span>+{certImages.length} images</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono tracking-widest uppercase text-white gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#00f0ff]" /> {hasMultipleImages ? "Inspect Gallery" : "Click to Inspect"}
                      </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[0.65rem] font-mono text-[#0284c7] dark:text-[#00f0ff] uppercase tracking-wider font-semibold">
                        <span>OMNINTELL CERTIFIED</span>
                        {cert.date && (
                          <span className="flex items-center gap-1 text-slate-500 dark:text-[#BBCCD7]/60">
                            <Calendar className="w-3 h-3" /> {cert.date}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-medium text-slate-900 dark:text-white tracking-tight group-hover:text-[#0284c7] dark:group-hover:text-[#00f0ff] transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-[#D7E2EA]/60 font-light line-clamp-2">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Footer link */}
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff] group-hover:text-slate-900 dark:group-hover:text-white flex items-center gap-1.5 transition-colors">
                        View Certificate <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[0.65rem] font-mono text-slate-400 dark:text-white/30">ID #{cert.id}</span>
                    </div>
                  </div>
                </RollingBox3D>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
