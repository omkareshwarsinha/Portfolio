import React from "react";
import { ExternalLink } from "lucide-react";

interface LiveProjectButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  href,
  onClick,
  className = "",
  label = "Live Project",
}) => {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white dark:border-[#D7E2EA] dark:text-[#D7E2EA] dark:hover:bg-[#D7E2EA]/10 dark:hover:text-white font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 text-xs sm:text-sm md:text-base transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        <span>{label}</span>
        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );
};
