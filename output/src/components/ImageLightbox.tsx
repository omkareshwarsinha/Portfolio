import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  imageUrl?: string | null;
  images?: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  imageUrl,
  images = [],
  initialIndex = 0,
  onClose,
}) => {
  const allImages = images.length > 0 ? images : imageUrl ? [imageUrl] : [];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, imageUrl]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length, currentIndex]);

  if (allImages.length === 0) return null;

  const currentImg = allImages[currentIndex] || allImages[0];

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl cursor-zoom-out select-none"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Close image preview"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Counter indicator if multiple images */}
      {allImages.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-mono">
          {currentIndex + 1} / {allImages.length}
        </div>
      )}

      {/* Main Image Container with Arrows */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[80vh] flex items-center justify-center cursor-default"
      >
        {allImages.length > 1 && (
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-2 sm:-left-12 z-20 p-2 sm:p-3 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#0e0e11] max-h-[75vh]">
          <img
            src={currentImg}
            alt={`Preview ${currentIndex + 1}`}
            className="w-full h-full object-contain max-h-[72vh] rounded-2xl"
          />
        </div>

        {allImages.length > 1 && (
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-2 sm:-right-12 z-20 p-2 sm:p-3 rounded-full bg-black/60 sm:bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails strip if multiple images */}
      {allImages.length > 1 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-4 flex items-center gap-2 overflow-x-auto max-w-xl py-2 px-3 rounded-2xl bg-black/50 border border-white/10 z-20"
        >
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                currentIndex === idx
                  ? "border-[#00f0ff] scale-105 opacity-100 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                  : "border-white/20 opacity-50 hover:opacity-80"
              }`}
            >
              <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
