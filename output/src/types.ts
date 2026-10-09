export interface ThemeCustomization {
  preset?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentGlow?: string;
  bgDark?: string;
  bgLight?: string;
  cardBg?: string;
  glowIntensity?: "subtle" | "vibrant" | "intense";
  flowSpeed?: "slow" | "normal" | "fast";
  enableFlowShaders?: boolean;
}

export interface SiteSettings {
  siteName?: string;
  siteTitle?: string;
  siteDescription?: string;
  footerText?: string;
  logoText?: string;
  branding?: string;
  themeConfig?: ThemeCustomization;
}

export interface HeroData {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  description?: string;
  labels?: string[];
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  statusText?: string;
}

export interface AboutData {
  sectionTitle?: string;
  heading?: string;
  shortBio?: string;
  longBio?: string;
  institutionText?: string;
  capabilities?: string[];
  highlights?: string[];
  ctaText?: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

export interface Skill {
  id: number;
  name: string;
  level?: number;
  category?: string;
  description?: string;
  technologies?: string[];
  icon?: string;
  link?: string;
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  date?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  featured?: boolean;
  displayOrder?: number;
}

export interface Project {
  id: number;
  title: string;
  category?: string;
  shortDescription?: string;
  description: string;
  url?: string;
  sourceUrl?: string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  file?: string;
  fileUrl?: string;
  tags?: string[];
  technologies?: string[];
  status?: string;
  featured?: boolean;
  year?: string;
  displayOrder?: number;
}

export interface ContactLink {
  id: number;
  platform: "linkedin" | "instagram" | "github" | "facebook" | "reddit" | "twitter" | "email" | "phone" | "website" | "other" | string;
  label: string;
  url: string;
  isPrimary?: boolean;
}

export interface SeoData {
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  socialPreviewTitle?: string;
  socialPreviewDescription?: string;
  ogImage?: string;
  twitterImage?: string;
  robots?: string;
  siteKeywords?: string;
  schemaDescription?: string;
}

export interface PortfolioData {
  userName: string;
  userTagline: string;
  userBio: string;
  location?: string;
  institutionLocation?: string;
  school?: string;
  companies?: string[];
  siteSettings?: SiteSettings;
  themeConfig?: ThemeCustomization;
  hero?: HeroData;
  about?: AboutData;
  services?: Service[];
  skills: Skill[];
  certificates: Certificate[];
  projects: Project[];
  contacts?: ContactLink[];
  seo?: SeoData;
}

export interface FailedLoginsRecord {
  [ip: string]: {
    count: number;
    first_attempt: number;
    last_attempt: number;
    blocked_until: number;
  };
}
