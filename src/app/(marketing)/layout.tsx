import type { ReactNode } from "react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import "@/components/marketing/marketing.css";
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-root">
      <a href="#marketing-main" className="marketing-skip">
        Skip to content
      </a>
      <MarketingHeader />
      <main id="marketing-main">{children}</main>
      <MarketingFooter />
    </div>
  );
}
