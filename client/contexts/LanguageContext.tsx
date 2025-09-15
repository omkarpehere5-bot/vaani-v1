import React, { createContext, useContext, useMemo, useState } from "react";

type Lang = "en" | "hi" | "mr" | "es";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    connected: "Connected",
    offline: "Offline",
    settings: "Settings",
    calendar: "Calendar",
    language: "Language",
    save: "Save",
  },
  hi: {
    connected: "कनेक्टेड",
    offline: "ऑफ़लाइन",
    settings: "सेटिंग्स",
    calendar: "कैलेंडर",
    language: "भाषा",
    save: "सहेजें",
  },
  mr: {
    connected: "कनेक्टेड",
    offline: "ऑफ़लाइन",
    settings: "सेटिंग्ज",
    calendar: "कॅलेंडर",
    language: "भाषा",
    save: "जतन करा",
  },
  es: {
    connected: "Conectado",
    offline: "Sin conexión",
    settings: "Configuración",
    calendar: "Calendario",
    language: "Idioma",
    save: "Guardar",
  },
};

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem("vaani.ui.lang");
      return (s as Lang) || "en";
    } catch {
      return "en";
    }
  });

  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("vaani.ui.lang", l);
    } catch {}
    setLangState(l);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
