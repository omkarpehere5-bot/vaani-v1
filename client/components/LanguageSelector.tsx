import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();

  const applyLang = (l: 'en' | 'hi' | 'mr' | 'es') => {
    setLang(l);
    try {
      const map: Record<string, string> = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', es: 'es-ES' };
      const full = map[l] || 'en-US';
      localStorage.setItem('vaani.settings.lang', full);
      localStorage.setItem('vaani.ui.lang', l);
      window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.settings.lang', newValue: full }));
      window.dispatchEvent(new StorageEvent('storage', { key: 'vaani.ui.lang', newValue: l }));
    } catch {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t("language")}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => applyLang('en')} className={lang === 'en' ? 'font-semibold bg-secondary/10' : ''}>
          English
          {lang === 'en' && <span aria-hidden className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyLang('hi')} className={lang === 'hi' ? 'font-semibold bg-secondary/10' : ''}>
          हिंदी
          {lang === 'hi' && <span aria-hidden className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyLang('mr')} className={lang === 'mr' ? 'font-semibold bg-secondary/10' : ''}>
          मराठी
          {lang === 'mr' && <span aria-hidden className="ml-2">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyLang('es')}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
