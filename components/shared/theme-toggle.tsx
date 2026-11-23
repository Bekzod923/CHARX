"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/hooks/use-theme";
import { useTranslation } from "@/lib/hooks/use-translation";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { dict } = useTranslation();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={dict.theme.toggle}>
      {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </Button>
  );
}
