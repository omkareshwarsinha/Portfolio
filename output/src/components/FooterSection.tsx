import React, { useState, useRef } from "react";
import {
  Mail,
  Instagram,
  MapPin,
  Linkedin,
  Github,
  Facebook,
  Twitter,
  MessageSquare,
  Phone,
  Globe,
  ExternalLink,
  Send,
  CheckCircle,
  Building2,
  GraduationCap,
  Download,
  FileCode,
} from "lucide-react";
import { ContactButton } from "./ContactButton";
import { RollingBox3D } from "./RollingBox3D";
import { ContactLink } from "../types";

interface FooterSectionProps {
  onOpenAdmin: () => void;
  contacts?: ContactLink[];
  location?: string;
  institutionLocation?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenAdmin,
  contacts = [],
  location = "Chhattisgarh, India",
  institutionLocation = "Khamariya, Chhattisgarh, India",
}) => {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Hidden admin click counter on the brand text
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleBrandHiddenClick = () => {
    onOpenAdmin();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) return;
    setFormSubmitting(true);
    try {
      const res = await fetch("/api/portfolio?action=submit_contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          message: formMessage,
        }),
      });
      if (res.ok) {
        setFormSuccess(true);
        setFormName("");
        setFormEmail("");
        setFormMessage("");
      }
    } catch {
      setFormSuccess(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const renderPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-[#0077b5] shrink-0" />;
      case "instagram":
        return <Instagram className="w-4 h-4 text-[#E1306C] shrink-0" />;
      case "github":
        return <Github className="w-4 h-4 text-slate-800 dark:text-white shrink-0" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-[#1877f2] shrink-0" />;
      case "twitter":
      case "x":
        return <Twitter className="w-4 h-4 text-[#1da1f2] shrink-0" />;
      case "reddit":
        return <MessageSquare className="w-4 h-4 text-[#ff4500] shrink-0" />;
      case "email":
      case "mail":
        return <Mail className="w-4 h-4 text-[#6366f1] dark:text-[#7621B0] shrink-0" />;
      case "phone":
        return <Phone className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <Globe className="w-4 h-4 text-[#0284c7] dark:text-[#00f0ff] shrink-0" />;
    }
  };

  const defaultContacts: ContactLink[] = [
    {
      id: 1,
      platform: "instagram",
      label: "@jarvisom18",
      url: "https://instagram.com/jarvisom18",
      isPrimary: true,
    },
    {
      id: 2,
      platform: "instagram",
      label: "@om__01037",
      url: "https://instagram.com/om__01037",
      isPrimary: true,
    },
    {
      id: 3,
      platform: "email",
      label: "omkareshwarsinha6@gmail.com",
      url: "mailto:omkareshwarsinha6@gmail.com",
      isPrimary: true,
    },
    {
      id: 4,
      platform: "linkedin",
      label: "LinkedIn Profile",
      url: "https://www.linkedin.com/in/omkareshwar-sinha",
      isPrimary: false,
    },
    {
      id: 5,
      platform: "github",
      label: "GitHub",
      url: "https://github.com/omkareshwarsinha",
      isPrimary: false,
    },
  ];

  const displayContacts: ContactLink[] =
    contacts && contacts.length > 0 ? contacts : defaultContacts;

  return (
    <footer
      id="contact"
      className="relative z-20 w-full bg-[#F8FAFC] dark:bg-[#06090F] border-t border-slate-200 dark:border-white/10 pt-20 sm:pt-28 pb-12 px-4 sm:px-8 md:px-12 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {/* Top Floating Glass Terminal Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Call to Action Statement */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <span className="text-[0.65rem] sm:text-xs font-mono uppercase tracking-[4px] text-[#0284c7] dark:text-[#00f0ff] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              OMNINTELL COMMUNICATIONS
            </span>

            <h2
              style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
              className="hero-heading font-black uppercase tracking-tight leading-none text-slate-900 dark:text-white"
            >
              Let&rsquo;s Connect &amp; Build
            </h2>

            <p className="text-slate-600 dark:text-[#D7E2EA]/80 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Have an ambitious AI product, 3D interactive web system, or cybersecurity architecture to develop? Connect directly with Omkareshwar Sinha and the engineering team at Omnintell Technologies &amp; Omnintell Labs.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <ContactButton href="mailto:omkareshwarsinha6@gmail.com" label="Send Email Inquiry" />
            </div>
          </div>

          {/* Right 3D Floating Terminal Glass Panel */}
          <div className="lg:col-span-5 w-full">
            <RollingBox3D depth={35} rollAngle={14} glowEffect="cyan">
              <div className="w-full rounded-[28px] sm:rounded-[36px] bg-white/95 dark:bg-[#0C111C]/95 border border-slate-200 dark:border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden transition-colors duration-300">
                <div className="flex items-center justify-between mb-5 border-b border-slate-200 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2 font-mono text-[0.68rem] text-[#0284c7] dark:text-[#00f0ff] uppercase tracking-wider font-semibold">
                    <Send className="w-3.5 h-3.5" />
                    <span>Direct Communication Node</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {formSuccess ? (
                  <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                    <CheckCircle className="w-12 h-12 text-emerald-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transmission Sent</h3>
                    <p className="text-xs text-slate-600 dark:text-[#BBCCD7]/80 max-w-xs">
                      Thank you. Your message has been logged directly into Omkareshwar&#39;s priority inbox.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSuccess(false)}
                      className="mt-2 text-xs font-mono text-[#0284c7] dark:text-[#00f0ff] underline cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContact} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase tracking-wider text-slate-600 dark:text-[#BBCCD7]/70 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Dr. Alex Vance"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00f0ff] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase tracking-wider text-slate-600 dark:text-[#BBCCD7]/70 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="alex@enterprise.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00f0ff] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[0.68rem] font-mono uppercase tracking-wider text-slate-600 dark:text-[#BBCCD7]/70 mb-1">
                        Project Scope / Inquiry
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        placeholder="Describe your vision, system requirements, or inquiry..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 text-sm focus:outline-none focus:border-[#0284c7] dark:focus:border-[#00f0ff] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full mt-1 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white font-medium text-xs font-mono uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {formSubmitting ? (
                        <span>Encrypting &amp; Transmitting...</span>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </RollingBox3D>
          </div>
        </div>

        {/* Middle Metadata Grid */}
        <div className="pt-12 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Ventures (HIDDEN ADMIN TRIGGER VIA MULTI-CLICK) */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                onClick={handleBrandHiddenClick}
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white uppercase font-mono text-left select-none cursor-pointer transition-colors focus:outline-none"
              >
                Omnintell Technologies
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-[0.62rem] tracking-wider uppercase text-slate-700 dark:text-[#BBCCD7]">
                Official Ventures
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#D7E2EA]/70 max-w-md leading-relaxed">
              Omnintell Technologies &amp; Omnintell Labs. Pioneering 3D digital experiences, next-generation AI architectures, cyber defense systems, and modern software innovations.
            </p>
            <div className="flex flex-col gap-1.5 text-xs text-slate-700 dark:text-[#BBCCD7]/90 font-mono mt-2">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0284c7] dark:text-[#00f0ff]" />
                Omkareshwar Sinha — CEO &amp; Founder
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <GraduationCap className="w-3.5 h-3.5 text-[#6366f1] dark:text-[#B600A8]" />
                Mothers Pride School (MPS) Khamariya (Educational Institution Context)
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-white/60 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" /> {location || "Chhattisgarh, India"}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Index */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff] mb-1 font-semibold">
              Index
            </h4>
            <a href="#hero" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Home
            </a>
            <a href="#about" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              About
            </a>
            <a href="#services" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Services
            </a>
            <a href="#projects" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Projects
            </a>
            <a href="#skills" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Skills
            </a>
            <a href="#certificates" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Certificates
            </a>
            <a href="#contact" className="text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors">
              Contact
            </a>
          </div>

          {/* Col 3: Direct Connect & Dynamic Social Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#0284c7] dark:text-[#00f0ff] mb-1 font-semibold">
              Connect &amp; Socials
            </h4>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              {displayContacts.map((contact) => (
                <a
                  key={contact.id}
                  href={contact.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-[#D7E2EA] hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors break-all group"
                >
                  {renderPlatformIcon(contact.platform)}
                  <span className="truncate">{contact.label || contact.url}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 dark:text-white/30 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright & Clean Source Download */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-white/40">
          <p className="select-none text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span
              onClick={handleBrandHiddenClick}
              className="text-slate-800 dark:text-white/80 font-mono select-none cursor-pointer hover:text-[#00f0ff] transition-colors"
              title="Omnintell Technologies"
            >
              Omnintell Technologies
            </span>{" "}
            &amp; Omnintell Labs. All rights reserved.
          </p>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-slate-600 dark:text-white/60 hover:text-[#0284c7] dark:hover:text-[#00f0ff] transition-colors cursor-pointer ml-2"
            >
              <span>Back to top</span>
              <span className="text-[0.7rem]">&uarr;</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
