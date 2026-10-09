import React, { useState, useEffect } from "react";
import {
  PortfolioData,
  Skill,
  Certificate,
  Project,
  Service,
  ContactLink,
  FailedLoginsRecord,
  ThemeCustomization,
} from "../types";
import { useTheme, THEME_PRESETS } from "../context/ThemeContext";
import {
  X,
  Lock,
  User,
  Cpu,
  Award,
  FolderGit2,
  ShieldCheck,
  KeyRound,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  UploadCloud,
  Share2,
  Globe,
  Mail,
  ExternalLink,
  Linkedin,
  Instagram,
  Github,
  Sparkles,
  Search,
  Sliders,
  Terminal,
  Box,
  Layers,
  Palette,
  Eye,
  Check,
} from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onDataRefresh: () => void;
}

type AdminTab =
  | "dashboard"
  | "theme"
  | "hero"
  | "about"
  | "services"
  | "skills"
  | "projects"
  | "certs"
  | "contact"
  | "seo"
  | "security"
  | "settings";

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  data,
  onDataRefresh,
}) => {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem("admin_token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Hero Form
  const [heroForm, setHeroForm] = useState({
    eyebrow: data.hero?.eyebrow || "OMNINTELL TECHNOLOGIES · OMNINTELL LABS",
    titleLine1: data.hero?.titleLine1 || "HEY",
    titleLine2: data.hero?.titleLine2 || "I'M OMKARESHWAR",
    subtitle: data.hero?.subtitle || "CEO & FOUNDER — OMNINTELL TECHNOLOGIES · CEO & FOUNDER — OMNINTELL LABS",
    description: data.hero?.description || "Building intelligent technology for the real world.",
    statusText: data.hero?.statusText || "10th Grade Innovator · MPS Khamariya · Systems Architect",
    ctaText: data.hero?.ctaText || "Explore My Work",
    ctaLink: data.hero?.ctaLink || "#projects",
  });

  // About Form
  const [aboutForm, setAboutForm] = useState({
    heading: data.about?.heading || "About me",
    shortBio: data.about?.shortBio || data.userBio || "",
    longBio: data.about?.longBio || data.userBio || "",
    institutionText: data.about?.institutionText || "Mothers Pride School (MPS) Khamariya (Educational Institution Context), Chhattisgarh, India",
    ctaText: data.about?.ctaText || "Contact Founder",
  });

  // SEO Form
  const [seoForm, setSeoForm] = useState({
    seoTitle: data.seo?.seoTitle || "Omkareshwar Sinha — CEO & Founder | Omnintell Technologies & Omnintell Labs",
    metaDescription: data.seo?.metaDescription || "Official portfolio of Omkareshwar Sinha, CEO & Founder of Omnintell Technologies and Omnintell Labs. 10th Grade Innovator from MPS Khamariya, Chhattisgarh, India.",
    canonicalUrl: data.seo?.canonicalUrl || "https://omnintell.tech/",
    socialPreviewTitle: data.seo?.socialPreviewTitle || "Omkareshwar Sinha — CEO & Founder | Omnintell Technologies & Omnintell Labs",
    socialPreviewDescription: data.seo?.socialPreviewDescription || "Building intelligent technology for the real world. Omnintell Technologies & Omnintell Labs — AI, Cybersecurity, Software & 3D Systems.",
    ogImage: data.seo?.ogImage || "/assets/omnintell_globe_hero.jpg",
    twitterImage: data.seo?.twitterImage || "/assets/omnintell_globe_hero.jpg",
    robots: data.seo?.robots || "index, follow, max-image-preview:large",
    siteKeywords: data.seo?.siteKeywords || "Omkareshwar Sinha, Om Sinha, Omnintell, Omnintell Technologies, Omnintell Labs, Omnintell Studio, Jarvis AI, Om AI, Aegisv18 Elite, MPS Khamariya",
  });

  // Global Site Settings
  const [globalForm, setGlobalForm] = useState({
    siteName: data.siteSettings?.siteName || "Omnintell Technologies",
    siteTitle: data.siteSettings?.siteTitle || "Omkareshwar Sinha — CEO & Founder | Omnintell Technologies & Omnintell Labs",
    footerText: data.siteSettings?.footerText || "OMNINTELL TECHNOLOGIES · OMNINTELL LABS",
    location: data.location || "Chhattisgarh, India",
    institutionLocation: data.institutionLocation || "Khamariya, Chhattisgarh, India",
  });

  // Theme & Appearance Studio
  const { customization, updateCustomization } = useTheme();
  const [themeForm, setThemeForm] = useState<ThemeCustomization>(() => customization);

  useEffect(() => {
    if (customization) {
      setThemeForm(customization);
    }
  }, [customization]);

  const saveThemeSettings = async (targetTheme?: ThemeCustomization) => {
    const toSave = targetTheme || themeForm;
    try {
      await apiRequest("save_theme", {
        themeConfig: JSON.stringify(toSave),
      });
      updateCustomization(toSave);
      showNotification("Color theme and appearance saved successfully!");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const handlePresetSelect = (presetKey: string) => {
    const preset = THEME_PRESETS[presetKey];
    if (preset) {
      setThemeForm(preset);
      updateCustomization(preset);
      showNotification(`Loaded ${presetKey} palette`);
    }
  };

  const handleColorUpdate = (key: keyof ThemeCustomization, value: any) => {
    const updated = { ...themeForm, [key]: value };
    setThemeForm(updated);
    updateCustomization(updated);
  };

  // Service form
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceIcon, setServiceIcon] = useState("Cpu");
  const [serviceLink, setServiceLink] = useState("#projects");
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  // Skill form
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Intelligence");
  const [newSkillDesc, setNewSkillDesc] = useState("");
  const [newSkillTechs, setNewSkillTechs] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  // Cert form
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertDate, setNewCertDate] = useState("");
  const [newCertCredentialId, setNewCertCredentialId] = useState("");
  const [newCertCredentialUrl, setNewCertCredentialUrl] = useState("");
  const [newCertDesc, setNewCertDesc] = useState("");
  const [newCertFiles, setNewCertFiles] = useState<File[]>([]);
  const [editingCertId, setEditingCertId] = useState<number | null>(null);

  // Project form
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("AI Systems & Intelligence");
  const [newProjShortDesc, setNewProjShortDesc] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [newProjSourceUrl, setNewProjSourceUrl] = useState("");
  const [newProjTechs, setNewProjTechs] = useState("");
  const [newProjFiles, setNewProjFiles] = useState<File[]>([]);
  const [newProjFile, setNewProjFile] = useState<File | null>(null);
  const [editingProjId, setEditingProjId] = useState<number | null>(null);

  // Security password
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [securityLogs, setSecurityLogs] = useState<FailedLoginsRecord>({});

  useEffect(() => {
    setHeroForm({
      eyebrow: data.hero?.eyebrow || "OMNINTELL TECHNOLOGIES · OMNINTELL LABS",
      titleLine1: data.hero?.titleLine1 || "HEY",
      titleLine2: data.hero?.titleLine2 || "I'M OMKARESHWAR",
      subtitle: data.hero?.subtitle || "CEO & FOUNDER — OMNINTELL TECHNOLOGIES · CEO & FOUNDER — OMNINTELL LABS",
      description: data.hero?.description || "Building intelligent technology for the real world.",
      statusText: data.hero?.statusText || "10th Grade Innovator · MPS Khamariya · Systems Architect",
      ctaText: data.hero?.ctaText || "Explore My Work",
      ctaLink: data.hero?.ctaLink || "#projects",
    });

    setAboutForm({
      heading: data.about?.heading || "About me",
      shortBio: data.about?.shortBio || data.userBio || "",
      longBio: data.about?.longBio || data.userBio || "",
      institutionText: data.about?.institutionText || "Mothers Pride School (MPS) Khamariya (Educational Institution Context), Chhattisgarh, India",
      ctaText: data.about?.ctaText || "Contact Founder",
    });

    setGlobalForm({
      siteName: data.siteSettings?.siteName || "Omnintell Technologies",
      siteTitle: data.siteSettings?.siteTitle || "Omkareshwar Sinha — CEO & Founder | Omnintell Technologies & Omnintell Labs",
      footerText: data.siteSettings?.footerText || "OMNINTELL TECHNOLOGIES · OMNINTELL LABS",
      location: data.location || "Chhattisgarh, India",
      institutionLocation: data.institutionLocation || "Khamariya, Chhattisgarh, India",
    });
  }, [data]);

  useEffect(() => {
    if (token && isOpen) {
      checkAuth(token);
    }
  }, [token, isOpen]);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(""), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const checkAuth = async (testToken: string) => {
    try {
      const res = await fetch(`/api/portfolio?action=check_auth&token=${encodeURIComponent(testToken)}`);
      const result = await res.json();
      if (result.auth) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setToken("");
        sessionStorage.removeItem("admin_token");
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("action", "login");
      fd.append("password", loginPassword);

      const res = await fetch("/api/portfolio", {
        method: "POST",
        body: fd,
      });

      let result: any = {};
      try {
        result = await res.json();
      } catch {
        result = { error: `Authentication failed (status ${res.status})` };
      }

      if (res.ok && result.success) {
        setToken(result.token);
        sessionStorage.setItem("admin_token", result.token);
        setIsAuthenticated(true);
        setLoginPassword("");
        showNotification("Master session authenticated");
      } else {
        showNotification(result.error || "Authentication failed. Default password is 'omkareshwar'", true);
      }
    } catch (err: any) {
      showNotification(err.message || "Network error", true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const fd = new FormData();
      fd.append("action", "logout");
      fd.append("token", token);
      await fetch("/api/portfolio", { method: "POST", body: fd });
    } catch {}
    setToken("");
    sessionStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    showNotification("Logged out");
  };

  const apiRequest = async (
    action: string,
    fields: Record<string, any> = {},
    files: Record<string, File | File[] | null | undefined> = {}
  ) => {
    const fd = new FormData();
    fd.append("action", action);
    fd.append("token", token);
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    Object.entries(files).forEach(([k, fileOrFiles]) => {
      if (!fileOrFiles) return;
      if (Array.isArray(fileOrFiles)) {
        fileOrFiles.forEach((f) => {
          if (f) {
            fd.append(k, f);
            fd.append(`${k}[]`, f);
          }
        });
      } else {
        fd.append(k, fileOrFiles);
      }
    });

    const res = await fetch("/api/portfolio", { method: "POST", body: fd });
    let result: any = {};
    try {
      result = await res.json();
    } catch {
      result = { error: `Server response error (status ${res.status})` };
    }

    if (!res.ok || result.error) {
      if (res.status === 401) {
        setIsAuthenticated(false);
        setToken("");
        sessionStorage.removeItem("admin_token");
      }
      throw new Error(result.error || "Operation failed");
    }
    return result;
  };

  const saveHero = async () => {
    try {
      await apiRequest("save_hero", heroForm);
      showNotification("Hero environment updated");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveAbout = async () => {
    try {
      await apiRequest("save_about", aboutForm);
      showNotification("About section updated");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveSeo = async () => {
    try {
      await apiRequest("save_seo", seoForm);
      showNotification("SEO & metadata settings updated");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveGlobal = async () => {
    try {
      await apiRequest("save_global", globalForm);
      showNotification("Global site settings updated");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveService = async () => {
    if (!serviceTitle.trim()) return showNotification("Service title is required", true);
    try {
      const services = data.services || [];
      let updated: Service[];
      if (editingServiceId !== null) {
        updated = services.map((s) =>
          s.id === editingServiceId
            ? { ...s, title: serviceTitle, description: serviceDesc, icon: serviceIcon, link: serviceLink }
            : s
        );
      } else {
        updated = [
          ...services,
          {
            id: Date.now(),
            title: serviceTitle,
            description: serviceDesc,
            icon: serviceIcon,
            link: serviceLink,
          },
        ];
      }
      await apiRequest("save_services", { services: JSON.stringify(updated) });
      setServiceTitle("");
      setServiceDesc("");
      setEditingServiceId(null);
      showNotification("Services updated");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this capability/service?")) return;
    try {
      await apiRequest("delete_service", { id });
      showNotification("Service deleted");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveSkill = async () => {
    if (!newSkillName.trim()) return showNotification("Skill name is required", true);
    try {
      const techArray = newSkillTechs.split(",").map((t) => t.trim()).filter(Boolean);
      if (editingSkillId !== null) {
        await apiRequest("edit_skill", {
          id: editingSkillId,
          name: newSkillName,
          category: newSkillCategory,
          description: newSkillDesc,
          technologies: JSON.stringify(techArray),
        });
      } else {
        await apiRequest("add_skill", {
          name: newSkillName,
          category: newSkillCategory,
          description: newSkillDesc,
          technologies: JSON.stringify(techArray),
        });
      }
      setNewSkillName("");
      setNewSkillDesc("");
      setNewSkillTechs("");
      setEditingSkillId(null);
      showNotification("Skill saved");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await apiRequest("delete_skill", { id });
      showNotification("Skill deleted");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveProject = async () => {
    if (!newProjTitle.trim()) return showNotification("Project title is required", true);
    try {
      const techArray = newProjTechs.split(",").map((t) => t.trim()).filter(Boolean);
      const fields: Record<string, any> = {
        title: newProjTitle,
        category: newProjCategory,
        shortDescription: newProjShortDesc,
        description: newProjDesc,
        url: newProjUrl,
        sourceUrl: newProjSourceUrl,
        tags: newProjTechs,
        technologies: JSON.stringify(techArray),
      };
      if (editingProjId !== null) {
        fields.id = editingProjId;
        await apiRequest("edit_project", fields, { image: newProjFiles, file: newProjFile });
      } else {
        await apiRequest("add_project", fields, { image: newProjFiles, file: newProjFile });
      }
      setNewProjTitle("");
      setNewProjShortDesc("");
      setNewProjDesc("");
      setNewProjUrl("");
      setNewProjSourceUrl("");
      setNewProjTechs("");
      setNewProjFiles([]);
      setNewProjFile(null);
      setEditingProjId(null);
      showNotification("Project saved");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await apiRequest("delete_project", { id });
      showNotification("Project deleted");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const saveCertificate = async () => {
    if (!newCertTitle.trim()) return showNotification("Certificate title is required", true);
    try {
      const fields: Record<string, any> = {
        title: newCertTitle,
        issuer: newCertIssuer,
        date: newCertDate,
        credentialId: newCertCredentialId,
        credentialUrl: newCertCredentialUrl,
        description: newCertDesc,
      };
      if (editingCertId !== null) {
        fields.id = editingCertId;
        await apiRequest("edit_certificate", fields, { image: newCertFiles });
      } else {
        await apiRequest("add_certificate", fields, { image: newCertFiles });
      }
      setNewCertTitle("");
      setNewCertIssuer("");
      setNewCertDate("");
      setNewCertCredentialId("");
      setNewCertCredentialUrl("");
      setNewCertDesc("");
      setNewCertFiles([]);
      setEditingCertId(null);
      showNotification("Certificate saved");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const deleteCertificate = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await apiRequest("delete_certificate", { id });
      showNotification("Certificate deleted");
      onDataRefresh();
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const changePassword = async () => {
    if (newPwd !== confirmPwd) return showNotification("Passwords do not match", true);
    if (newPwd.length < 6) return showNotification("Password must be at least 6 characters", true);
    try {
      await apiRequest("change_password", { current: curPwd, new: newPwd });
      setCurPwd("");
      setNewPwd("");
      setConfirmPwd("");
      showNotification("Master password updated successfully");
    } catch (e: any) {
      showNotification(e.message, true);
    }
  };

  const loadSecurityLogs = async () => {
    try {
      const res = await apiRequest("get_failed_logs");
      setSecurityLogs(res || {});
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-[#0A0E17] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-[#E6EDF3] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <h3 className="font-mono font-bold text-sm sm:text-base tracking-wider uppercase text-white">
              Omnintell Master Control Deck
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="px-6 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="px-6 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Unauthenticated View */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00f0ff] mb-6 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold uppercase tracking-tight text-white mb-2">
              Authentication Required
            </h4>
            <p className="text-xs text-slate-400 font-mono mb-6 leading-relaxed">
              Enter master credentials to access system management, content editor, and administrative operations.
            </p>
            <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Master Password (default: omkareshwar)"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-sm focus:outline-none focus:border-[#00f0ff] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                {loading ? "Verifying..." : "Authenticate Session"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-white/10 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 bg-black/20">
              <button
                type="button"
                onClick={() => setActiveTab("dashboard")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "dashboard" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("theme")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "theme" ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-[#00f0ff] font-bold border border-cyan-400/40 shadow-sm" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Theme Studio</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("hero")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "hero" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Hero</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("about")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "about" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <User className="w-4 h-4" />
                <span>About</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("services")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "services" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Services</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "skills" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>Skills</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("projects")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "projects" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Projects</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("certs")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "certs" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Certs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "seo" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Search className="w-4 h-4" />
                <span>SEO</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === "security" ? "bg-[#00f0ff]/15 text-[#00f0ff] font-bold border border-[#00f0ff]/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Security</span>
              </button>

              <div className="mt-auto pt-4 border-t border-white/10 hidden md:flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 font-mono text-[0.68rem] uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>End Session</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[75vh]">
              {/* THEME & APPEARANCE STUDIO TAB */}
              {activeTab === "theme" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <h4 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-cyan-400" />
                        <span>Theme &amp; Appearance Studio</span>
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Customize site colors, Google Flow gradients, dark mode aesthetics, and real-time shader dynamics.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => saveThemeSettings()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-95 active:scale-95 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer self-start sm:self-auto"
                    >
                      Save &amp; Deploy Theme
                    </button>
                  </div>

                  {/* 1. Curated Theme Presets */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                      Curated Color Schemes (1-Click Presets)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(THEME_PRESETS).map(([key, preset]) => {
                        const isSelected = themeForm.preset === key || (
                          themeForm.primaryColor?.toLowerCase() === preset.primaryColor?.toLowerCase() &&
                          themeForm.secondaryColor?.toLowerCase() === preset.secondaryColor?.toLowerCase()
                        );
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handlePresetSelect(key)}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                              isSelected
                                ? "bg-white/10 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                                : "bg-black/40 border-white/10 hover:border-white/25 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase text-white tracking-wide">
                                {key.replace("-", " ")}
                              </span>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[0.6rem] font-bold">
                                  <Check className="w-2.5 h-2.5" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: preset.primaryColor }}
                                title="Primary Color"
                              />
                              <span
                                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: preset.secondaryColor }}
                                title="Secondary Color"
                              />
                              <span
                                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                                style={{ backgroundColor: preset.bgDark }}
                                title="Background Color"
                              />
                              <div
                                className="flex-1 h-3 rounded-full ml-1"
                                style={{
                                  background: `linear-gradient(90deg, ${preset.primaryColor}, ${preset.secondaryColor})`,
                                }}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Custom Hex Color Pickers */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                      Fine-Tuned Custom Color Science
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Primary Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block">
                          Primary Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeForm.primaryColor || "#00F0FF"}
                            onChange={(e) => handleColorUpdate("primaryColor", e.target.value)}
                            className="w-10 h-10 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeForm.primaryColor || "#00F0FF"}
                            onChange={(e) => handleColorUpdate("primaryColor", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Secondary Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block">
                          Secondary Accent / Aurora
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeForm.secondaryColor || "#8B5CF6"}
                            onChange={(e) => handleColorUpdate("secondaryColor", e.target.value)}
                            className="w-10 h-10 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeForm.secondaryColor || "#8B5CF6"}
                            onChange={(e) => handleColorUpdate("secondaryColor", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Glow Color */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block">
                          Ambient Glow / Highlights
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeForm.accentGlow || "#38BDF8"}
                            onChange={(e) => handleColorUpdate("accentGlow", e.target.value)}
                            className="w-10 h-10 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeForm.accentGlow || "#38BDF8"}
                            onChange={(e) => handleColorUpdate("accentGlow", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      {/* Background Tone */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300 block">
                          Deep Void Dark Background
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={themeForm.bgDark || "#050811"}
                            onChange={(e) => handleColorUpdate("bgDark", e.target.value)}
                            className="w-10 h-10 rounded-xl border border-white/20 cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={themeForm.bgDark || "#050811"}
                            onChange={(e) => handleColorUpdate("bgDark", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">
                          Glow Intensity
                        </label>
                        <select
                          value={themeForm.glowIntensity || "vibrant"}
                          onChange={(e) => handleColorUpdate("glowIntensity", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="subtle">Subtle</option>
                          <option value="vibrant">Vibrant (Recommended)</option>
                          <option value="intense">Intense High-Voltage</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">
                          Flow Animation Speed
                        </label>
                        <select
                          value={themeForm.flowSpeed || "normal"}
                          onChange={(e) => handleColorUpdate("flowSpeed", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                        >
                          <option value="slow">Slow &amp; Relaxed</option>
                          <option value="normal">Normal (Smooth)</option>
                          <option value="fast">Fast High-Dynamic</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-4 sm:pt-6">
                        <label className="inline-flex items-center gap-2 text-xs font-mono text-white cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={themeForm.enableFlowShaders !== false}
                            onChange={(e) => handleColorUpdate("enableFlowShaders", e.target.checked)}
                            className="w-4 h-4 rounded text-cyan-500 focus:ring-0 bg-black/50 border-white/20"
                          />
                          <span>Enable Google Flow Fluid Shader</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 3. Live Preview Card */}
                  <div className="p-6 rounded-3xl border border-white/15 relative overflow-hidden"
                    style={{
                      backgroundColor: themeForm.bgDark || "#050811",
                      boxShadow: `0 10px 40px -10px ${themeForm.primaryColor || "#00f0ff"}30`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        Live Theme Render Preview
                      </span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[0.65rem] font-mono uppercase font-bold"
                        style={{
                          backgroundColor: `${themeForm.primaryColor || "#00f0ff"}20`,
                          color: themeForm.primaryColor || "#00f0ff",
                          border: `1px solid ${themeForm.primaryColor || "#00f0ff"}50`,
                        }}
                      >
                        Active: {themeForm.preset || "Custom"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                      <div>
                        <h5
                          className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text"
                          style={{
                            backgroundImage: `linear-gradient(135deg, #FFFFFF 20%, ${themeForm.primaryColor || "#00f0ff"} 80%, ${themeForm.secondaryColor || "#8b5cf6"} 100%)`,
                          }}
                        >
                          OMNINTELL TECHNOLOGIES
                        </h5>
                        <p className="text-xs font-mono text-slate-300 mt-1">
                          Building intelligent technology for the real world.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="px-5 py-2.5 rounded-full text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg transition-transform active:scale-95"
                          style={{
                            background: `linear-gradient(135deg, ${themeForm.primaryColor || "#00f0ff"}, ${themeForm.secondaryColor || "#8b5cf6"})`,
                            boxShadow: `0 0 20px ${themeForm.primaryColor || "#00f0ff"}50`,
                          }}
                        >
                          Sample Action &rarr;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[0.65rem] font-mono text-slate-400 uppercase">Projects</span>
                      <h4 className="text-2xl font-black text-white mt-1">{data.projects?.length || 0}</h4>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[0.65rem] font-mono text-slate-400 uppercase">Certificates</span>
                      <h4 className="text-2xl font-black text-white mt-1">{data.certificates?.length || 0}</h4>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[0.65rem] font-mono text-slate-400 uppercase">Skills</span>
                      <h4 className="text-2xl font-black text-white mt-1">{data.skills?.length || 0}</h4>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <span className="text-[0.65rem] font-mono text-slate-400 uppercase">Services</span>
                      <h4 className="text-2xl font-black text-white mt-1">{data.services?.length || 4}</h4>
                    </div>
                  </div>

                  {/* Quick Settings Form */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">Global Identity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={globalForm.siteName}
                          onChange={(e) => setGlobalForm({ ...globalForm, siteName: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Location Context</label>
                        <input
                          type="text"
                          value={globalForm.location}
                          onChange={(e) => setGlobalForm({ ...globalForm, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={saveGlobal}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      Save Global Settings
                    </button>
                  </div>
                </div>
              )}

              {/* HERO TAB */}
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Hero Section Content</h4>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Eyebrow Brand Header</label>
                    <input
                      type="text"
                      value={heroForm.eyebrow}
                      onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Title Line 1</label>
                      <input
                        type="text"
                        value={heroForm.titleLine1}
                        onChange={(e) => setHeroForm({ ...heroForm, titleLine1: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Title Line 2</label>
                      <input
                        type="text"
                        value={heroForm.titleLine2}
                        onChange={(e) => setHeroForm({ ...heroForm, titleLine2: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Subtitle / Positions</label>
                    <input
                      type="text"
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Hero Description</label>
                    <textarea
                      rows={2}
                      value={heroForm.description}
                      onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={saveHero}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Save Hero Content
                  </button>
                </div>
              )}

              {/* ABOUT TAB */}
              {activeTab === "about" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">About Section &amp; Heritage</h4>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={aboutForm.heading}
                      onChange={(e) => setAboutForm({ ...aboutForm, heading: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Educational Institution Location Context</label>
                    <input
                      type="text"
                      value={aboutForm.institutionText}
                      onChange={(e) => setAboutForm({ ...aboutForm, institutionText: e.target.value })}
                      placeholder="Mothers Pride School (MPS) Khamariya (Educational Institution Context), Chhattisgarh, India"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Founder Biography &amp; Vision</label>
                    <textarea
                      rows={4}
                      value={aboutForm.longBio}
                      onChange={(e) => setAboutForm({ ...aboutForm, longBio: e.target.value, shortBio: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={saveAbout}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Save About Content
                  </button>
                </div>
              )}

              {/* SERVICES TAB */}
              {activeTab === "services" && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Capabilities &amp; Services</h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase font-bold">
                      {editingServiceId !== null ? "Edit Capability" : "Add New Capability"}
                    </span>
                    <input
                      type="text"
                      placeholder="Title (e.g. AI Systems & Autonomous Agents)"
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                    <textarea
                      rows={2}
                      placeholder="Description of technical architecture and capabilities"
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                    <button
                      type="button"
                      onClick={saveService}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {editingServiceId !== null ? "Update Service" : "Add Service"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(data.services || []).map((s) => (
                      <div key={s.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                        <div>
                          <h5 className="font-bold text-white text-xs uppercase">{s.title}</h5>
                          <p className="text-[0.68rem] text-slate-400 font-mono line-clamp-1">{s.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServiceId(s.id);
                              setServiceTitle(s.title);
                              setServiceDesc(s.description);
                            }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-cyan-400 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteService(s.id)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKILLS TAB */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Skills &amp; Technology Matrix</h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase font-bold">
                      {editingSkillId !== null ? "Edit Skill" : "Add New Skill / Technology"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Skill Name (e.g. AI Systems Architecture)"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      >
                        <option value="Intelligence">Intelligence</option>
                        <option value="Security">Security</option>
                        <option value="3D & Motion">3D &amp; Motion</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Creative">Creative</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Technologies (comma separated: PyTorch, LangChain, Python)"
                      value={newSkillTechs}
                      onChange={(e) => setNewSkillTechs(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                    <textarea
                      rows={2}
                      placeholder="Technical capability description"
                      value={newSkillDesc}
                      onChange={(e) => setNewSkillDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                    <button
                      type="button"
                      onClick={saveSkill}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {editingSkillId !== null ? "Update Skill" : "Add Skill"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {data.skills.map((sk) => (
                      <div key={sk.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[0.62rem] font-mono text-[#00f0ff] uppercase">{sk.category}</span>
                          <h5 className="font-bold text-white text-xs uppercase">{sk.name}</h5>
                          {sk.description && <p className="text-[0.68rem] text-slate-400 font-mono line-clamp-1">{sk.description}</p>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkillId(sk.id);
                              setNewSkillName(sk.name);
                              setNewSkillCategory(sk.category || "Intelligence");
                              setNewSkillDesc(sk.description || "");
                              setNewSkillTechs(sk.technologies ? sk.technologies.join(", ") : "");
                            }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-cyan-400 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSkill(sk.id)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Project Case Studies</h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase font-bold">
                      {editingProjId !== null ? "Edit Project" : "Add New Project"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Category (e.g. AI Systems & Intelligence)"
                        value={newProjCategory}
                        onChange={(e) => setNewProjCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Live Demo URL (https://...)"
                        value={newProjUrl}
                        onChange={(e) => setNewProjUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Source Code URL (https://github.com/...)"
                        value={newProjSourceUrl}
                        onChange={(e) => setNewProjSourceUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Short description"
                      value={newProjShortDesc}
                      onChange={(e) => setNewProjShortDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                    <textarea
                      rows={3}
                      placeholder="Full architecture description"
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                    <div>
                      <label className="block text-[0.68rem] font-mono text-slate-400 mb-1">
                        Upload Project Images (Multi-Image Supported)
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setNewProjFiles(Array.from(e.target.files || []))}
                        className="w-full p-2 rounded-lg bg-black/50 border border-white/15 text-xs text-slate-300 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={saveProject}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {editingProjId !== null ? "Update Project" : "Add Project"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.projects.map((p) => (
                      <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {p.image && (
                            <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover border border-white/15" />
                          )}
                          <div>
                            <span className="text-[0.62rem] font-mono text-[#00f0ff] uppercase">{p.category}</span>
                            <h5 className="font-bold text-white text-sm uppercase">{p.title}</h5>
                            <p className="text-[0.68rem] text-slate-400 font-mono line-clamp-1">{p.shortDescription || p.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProjId(p.id);
                              setNewProjTitle(p.title);
                              setNewProjCategory(p.category || "");
                              setNewProjShortDesc(p.shortDescription || "");
                              setNewProjDesc(p.description || "");
                              setNewProjUrl(p.url || "");
                              setNewProjSourceUrl(p.sourceUrl || "");
                            }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-cyan-400 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProject(p.id)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CERTS TAB */}
              {activeTab === "certs" && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Certificates &amp; Credentials</h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase font-bold">
                      {editingCertId !== null ? "Edit Certificate" : "Add New Certificate"}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Certificate Title"
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Year / Date (e.g. 2024)"
                        value={newCertDate}
                        onChange={(e) => setNewCertDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Credential Verification URL"
                        value={newCertCredentialUrl}
                        onChange={(e) => setNewCertCredentialUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewCertFiles(Array.from(e.target.files || []))}
                      className="w-full p-2 rounded-lg bg-black/50 border border-white/15 text-xs text-slate-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={saveCertificate}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      {editingCertId !== null ? "Update Certificate" : "Add Certificate"}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.certificates.map((c) => (
                      <div key={c.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                        <div>
                          <h5 className="font-bold text-white text-sm uppercase">{c.title}</h5>
                          <span className="text-[0.68rem] text-slate-400 font-mono">{c.issuer} · {c.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCertId(c.id);
                              setNewCertTitle(c.title);
                              setNewCertIssuer(c.issuer);
                              setNewCertDate(c.date || "");
                              setNewCertCredentialUrl(c.credentialUrl || "");
                            }}
                            className="p-1.5 rounded-md hover:bg-white/10 text-cyan-400 cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCertificate(c.id)}
                            className="p-1.5 rounded-md hover:bg-white/10 text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO TAB */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">Search Engine Optimization (SEO)</h4>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">SEO Page Title</label>
                    <input
                      type="text"
                      value={seoForm.seoTitle}
                      onChange={(e) => setSeoForm({ ...seoForm, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Meta Description</label>
                    <textarea
                      rows={3}
                      value={seoForm.metaDescription}
                      onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Canonical URL</label>
                      <input
                        type="text"
                        value={seoForm.canonicalUrl}
                        onChange={(e) => setSeoForm({ ...seoForm, canonicalUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Robots Directives</label>
                      <input
                        type="text"
                        value={seoForm.robots}
                        onChange={(e) => setSeoForm({ ...seoForm, robots: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Site Keywords</label>
                    <textarea
                      rows={2}
                      value={seoForm.siteKeywords}
                      onChange={(e) => setSeoForm({ ...seoForm, siteKeywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono resize-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={saveSeo}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] via-[#6366f1] to-[#a855f7] text-white font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Save SEO Configuration
                  </button>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">System Security &amp; Credentials</h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-mono text-[#00f0ff] uppercase font-bold">Update Master Password</span>
                    <input
                      type="password"
                      placeholder="Current Password"
                      value={curPwd}
                      onChange={(e) => setCurPwd(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="New Password (min 6 characters)"
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={changePassword}
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
