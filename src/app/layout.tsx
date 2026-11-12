import type { Metadata } from "next";
import { siteMetadata } from "@/config/seo";
import { TitleGuard } from "@/components/shared/title-guard";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
import "@/styles/tailwind/components.css";
import "@/styles/base.css";
import "@/styles/tailwind/layout.css";
import "@/styles/tailwind/presets.css";
export const metadata: Metadata = siteMetadata;
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TitleGuard />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
