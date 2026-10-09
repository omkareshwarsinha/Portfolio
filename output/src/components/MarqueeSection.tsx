import React, { useEffect, useRef, useState } from "react";

const allGifs: string[] = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const row1Gifs = allGifs.slice(0, 11);
const row2Gifs = allGifs.slice(11);

const row1Tripled = [...row1Gifs, ...row1Gifs, ...row1Gifs];
const row2Tripled = [...row2Gifs, ...row2Gifs, ...row2Gifs];

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const calculated = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(calculated);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translateRight = offset - 200;
  const translateLeft = -(offset - 200);

  return (
    <section
      ref={sectionRef}
      id="marquee"
      className="relative bg-[#F8FAFC] dark:bg-[#080B11] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden select-none transition-colors duration-300"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Moves RIGHT on scroll */}
        <div className="w-full overflow-hidden">
          <div
            className="flex gap-3 will-change-transform"
            style={{
              transform: `translateX(${translateRight}px)`,
            }}
          >
            {row1Tripled.map((url, i) => (
              <div
                key={`r1-${i}`}
                className="flex-shrink-0 w-[300px] h-[190px] sm:w-[360px] sm:h-[230px] md:w-[420px] md:h-[270px] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#181818] border border-slate-300 dark:border-white/5 shadow-md dark:shadow-2xl"
              >
                <img
                  src={url}
                  alt={`3D Animation Showcase ${(i % 11) + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moves LEFT on scroll */}
        <div className="w-full overflow-hidden">
          <div
            className="flex gap-3 will-change-transform"
            style={{
              transform: `translateX(${translateLeft}px)`,
            }}
          >
            {row2Tripled.map((url, i) => (
              <div
                key={`r2-${i}`}
                className="flex-shrink-0 w-[300px] h-[190px] sm:w-[360px] sm:h-[230px] md:w-[420px] md:h-[270px] rounded-2xl overflow-hidden bg-slate-200 dark:bg-[#181818] border border-slate-300 dark:border-white/5 shadow-md dark:shadow-2xl"
              >
                <img
                  src={url}
                  alt={`3D Motion Reel ${(i % 10) + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
