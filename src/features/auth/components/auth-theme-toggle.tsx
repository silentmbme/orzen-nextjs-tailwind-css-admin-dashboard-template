"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { IconButton } from "@/components/ui/icon-button";

export function AuthThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <IconButton
      aria-label="Toggle light and dark theme"
      title="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="theme-icon-light" size={16} />
      <Moon className="theme-icon-dark" size={16} />
    </IconButton>
  );
}
