"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LayoutPreferences } from "@/components/layout/layout-preferences";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LayoutPreferences />
      {children}
    </NextThemesProvider>
  );
}
