import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

interface SeamlessGlobeVideoProps {
  className?: string;
  scrollProgress?: number;
}

const LOCAL_VIDEO_SRC = "/assets/globe_revolving.mp4";
const CDN_VIDEO_SRC = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER_SRC = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

export const SeamlessGlobeVideo: React.FC<SeamlessGlobeVideoProps> = ({
  className = "",
  scrollProgress = 0,
}) => {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property enforcement for cross-browser autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");

    const playVideo = () => {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => {
          // In case browser policy temporarily blocked autoplay before user interaction
        });
      }
    };

    // Attempt initial playback immediately
    playVideo();

    const onPlaying = () => setIsPlaying(true);
    const onCanPlay = () => playVideo();
    const onLoadedData = () => playVideo();

    // Zero-lag continuous loop boundary handling
    const onEnded = () => {
      video.currentTime = 0;
      playVideo();
    };

    // If browser pauses video during power-save or tab switch, resume immediately
    const onPause = () => {
      if (!document.hidden) {
        playVideo();
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) {
        playVideo();
      }
    };

    // Kickstart playback on the very first user interaction if browser policy withheld autoplay
    const kickstart = () => {
      playVideo();
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("ended", onEnded);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibilityChange);

    window.addEventListener("pointerdown", kickstart, { passive: true });
    window.addEventListener("pointermove", kickstart, { once: true, passive: true });
    window.addEventListener("scroll", kickstart, { passive: true });
    window.addEventListener("touchstart", kickstart, { passive: true });
    window.addEventListener("keydown", kickstart, { once: true, passive: true });

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      window.removeEventListener("pointerdown", kickstart);
      window.removeEventListener("pointermove", kickstart);
      window.removeEventListener("scroll", kickstart);
      window.removeEventListener("touchstart", kickstart);
      window.removeEventListener("keydown", kickstart);
    };
  }, []);

  // Parallax depth scale / fade on scroll
  const safeProgress = isNaN(scrollProgress) ? 0 : Math.min(Math.max(scrollProgress, 0), 1.2);
  const depthScale = Math.max(0.68, 1.0 - safeProgress * 0.22);
  const depthOpacity = Math.max(0.25, 1.0 - safeProgress * 0.7);

  const isLight = theme === "light";

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      role="img"
      aria-label="Revolving high-definition Earth globe rendered against cosmic deep space"
      style={{
        transform: `scale(${depthScale.toFixed(3)})`,
        opacity: depthOpacity,
        transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
      }}
    >
      {/* Radiant ambient glow to heighten color brightness and cosmic luminescence */}
      {isLight ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(147,51,234,0.18)_0%,rgba(182,0,168,0.12)_35%,transparent_70%)] pointer-events-none" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(182,0,168,0.55)_0%,rgba(147,51,234,0.35)_32%,rgba(0,240,255,0.15)_54%,transparent_76%)] pointer-events-none mix-blend-screen" />
      )}

      {/* Continuously Revolving Background Earth Globe Video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover object-[51%_8%] transition-opacity duration-500 ease-out opacity-100 ${
          isLight ? "mix-blend-multiply" : ""
        }`}
        style={{
          filter: isLight
            ? "invert(1) hue-rotate(180deg) brightness(1.12) contrast(1.35) saturate(1.45)"
            : "brightness(1.75) contrast(1.32) saturate(1.45)",
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        poster={POSTER_SRC}
      >
        <source src={LOCAL_VIDEO_SRC} type="video/mp4" />
        <source src={CDN_VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Radial vignette overlay to blend seamlessly into background */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLight
            ? "bg-[radial-gradient(circle_at_50%_38%,transparent_35%,rgba(248,250,252,0.85)_75%,#F8FAFC_100%)]"
            : "bg-[radial-gradient(circle_at_50%_38%,transparent_28%,rgba(8,11,17,0.75)_70%,#080B11_100%)]"
        }`}
      />
    </div>
  );
};
