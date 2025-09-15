import React from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t("language")}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("hi")}>हिंदी</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("mr")}>मराठी</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("es")}>Español</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
