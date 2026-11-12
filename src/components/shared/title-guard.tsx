"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { SITE_TITLE } from "@/config/seo";

/** Keeps the fixed template title stable while App Router swaps route metadata. */
export function TitleGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const applyTitle = () => {
      if (document.title !== SITE_TITLE) document.title = SITE_TITLE;
    };

    applyTitle();
    const observer = new MutationObserver(applyTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
