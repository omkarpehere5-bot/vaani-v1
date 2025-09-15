import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CalendarDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label={t("calendar")}>
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("calendar")}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Calendar />
        </div>
      </DialogContent>
    </Dialog>
  );
}
