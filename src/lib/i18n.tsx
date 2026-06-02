import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Lang = "en" | "ta";

const dict = {
  en: {
    org: "Kovai Nadar Sangam",
    tagline: "A community trust serving the Hindu & Christian Nadar families of Coimbatore since 1952.",
    nav: { home: "Home", matrimony: "Matrimony", members: "Members", events: "Events", scholarships: "Scholarships", about: "About", admin: "Admin" },
    cta: { register: "Register for Matrimony", member: "Become a Member", signin: "Sign In", join: "Join Free" },
    stats: { members: "Registered Members", matches: "Successful Matches", years: "Years of Service" },
    services: "What we do",
    servicesSub: "Six pillars of service to the community.",
    featured: "Featured Matrimony Profiles",
    featuredSub: "Recently verified profiles. Contact is shared only through the sangam.",
    eventsLabel: "Upcoming Events",
    contact: "Contact the Sangam",
    contactSub: "Visit our office, call us, or send an enquiry below.",
    matrimony: {
      title: "Matrimony",
      subtitle: "Verified profiles from registered families. Contact details are shared only through the sangam office.",
      filter: "Filter",
      gender: "Gender",
      religion: "Religion",
      age: "Age Range",
      rasi: "Rasi",
      search: "Search by name, education, area…",
      verified: "verified profiles · contact via sangam only",
      expressInterest: "Express Interest",
      aiMatch: "AI Compatibility",
      noProfiles: "No profiles match those filters",
    },
    admin: {
      title: "Admin Panel",
      subtitle: "Internal dashboard for office bearers.",
      dashboard: "Dashboard",
      matrimonyApprovals: "Matrimony",
      members: "Members",
      eventsTab: "Events",
      scholarships: "Scholarships",
      signIn: "Admin Sign In",
      signInSub: "Office bearers only.",
    },
    scholarships: {
      title: "Scholarships",
      subtitle: "Merit and need-based scholarships for students from Nadar families.",
      apply: "Apply Now",
      status: "Check Status",
    },
    events: {
      title: "Events",
      subtitle: "Community gatherings, meets, and programs by Kovai Nadar Sangam.",
      upcoming: "Upcoming",
      past: "Past Events",
      register: "Register",
    },
    members: {
      title: "Member Directory",
      subtitle: "Find and connect with Nadar community members in Coimbatore.",
      search: "Search members…",
    },
  },
  ta: {
    org: "கோவை நாடார் சங்கம்",
    tagline: "கோயம்புத்தூரின் இந்து மற்றும் கிறிஸ்தவ நாடார் குடும்பங்களுக்கு 1952 முதல் சேவை.",
    nav: { home: "முகப்பு", matrimony: "திருமணம்", members: "உறுப்பினர்கள்", events: "நிகழ்வுகள்", scholarships: "உதவித்தொகை", about: "எங்களைப் பற்றி", admin: "நிர்வாகம்" },
    cta: { register: "திருமண பதிவு", member: "உறுப்பினராகுங்கள்", signin: "உள்நுழைக", join: "இலவசமாக சேர" },
    stats: { members: "பதிவு செய்த உறுப்பினர்கள்", matches: "வெற்றிகரமான பொருத்தங்கள்", years: "சேவை ஆண்டுகள்" },
    services: "எங்கள் சேவைகள்",
    servicesSub: "சமூகத்திற்கான ஆறு தூண்கள்.",
    featured: "சிறப்பு திருமண சுயவிவரங்கள்",
    featuredSub: "சரிபார்க்கப்பட்ட சுயவிவரங்கள். தொடர்பு சங்கம் வழியாக மட்டுமே.",
    eventsLabel: "வரவிருக்கும் நிகழ்வுகள்",
    contact: "தொடர்பு கொள்ள",
    contactSub: "எங்கள் அலுவலகத்தை சந்திக்கவும், அழைக்கவும் அல்லது விசாரிக்கவும்.",
    matrimony: {
      title: "திருமணம்",
      subtitle: "சரிபார்க்கப்பட்ட சுயவிவரங்கள். தொடர்பு சங்கம் வழியாக மட்டுமே.",
      filter: "வடிகட்டி",
      gender: "பாலினம்",
      religion: "மதம்",
      age: "வயது வரம்பு",
      rasi: "ராசி",
      search: "பெயர், கல்வி, இடம் தேடுங்கள்…",
      verified: "சரிபார்க்கப்பட்ட சுயவிவரங்கள்",
      expressInterest: "ஆர்வம் தெரிவிக்க",
      aiMatch: "AI பொருத்தம்",
      noProfiles: "தேடலுக்கு பொருந்தும் சுயவிவரங்கள் இல்லை",
    },
    admin: {
      title: "நிர்வாக பலகை",
      subtitle: "அலுவலக நிர்வாகிகளுக்கான டாஷ்போர்டு.",
      dashboard: "டாஷ்போர்டு",
      matrimonyApprovals: "திருமணம்",
      members: "உறுப்பினர்கள்",
      eventsTab: "நிகழ்வுகள்",
      scholarships: "உதவித்தொகை",
      signIn: "நிர்வாகி உள்நுழைவு",
      signInSub: "அலுவலக நிர்வாகிகள் மட்டும்.",
    },
    scholarships: {
      title: "உதவித்தொகை",
      subtitle: "நாடார் குடும்பத்தினர் மாணவர்களுக்கான தகுதி மற்றும் தேவை அடிப்படையிலான உதவித்தொகை.",
      apply: "விண்ணப்பிக்க",
      status: "நிலையை சரிபார்க்க",
    },
    events: {
      title: "நிகழ்வுகள்",
      subtitle: "கோவை நாடார் சங்கத்தின் சமூக கூட்டங்கள் மற்றும் நிகழ்ச்சிகள்.",
      upcoming: "வரவிருக்கும்",
      past: "கடந்த நிகழ்வுகள்",
      register: "பதிவு செய்க",
    },
    members: {
      title: "உறுப்பினர் பட்டியல்",
      subtitle: "கோயம்புத்தூரில் நாடார் சமூக உறுப்பினர்களை தேடுங்கள்.",
      search: "உறுப்பினர்களை தேடுங்கள்…",
    },
  },
};

export type TranslationDict = typeof dict.en;
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: TranslationDict };
const I18nCtx = createContext<Ctx | null>(null);

const LANG_KEY = "kns_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as Lang | null;
    if (saved === "en" || saved === "ta") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  };

  return <I18nCtx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
