"use client";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageContainer } from "@/components/layout/page-container";
import { useLayoutPreferences } from "./layout-preferences";
const mobileQuery = "(max-width: 850px)";
function subscribeViewport(listener: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerMobileSnapshot = () => false;
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { prefs, update } = useLayoutPreferences();
  const isMobile = useSyncExternalStore(
    subscribeViewport,
    getMobileSnapshot,
    getServerMobileSnapshot,
  );
  const [openPath, setOpenPath] = useState<string | null>(null);
  const drawerMode = isMobile || prefs.size === "offcanvas";
  const mobileOpen = drawerMode && openPath === pathname;
  const setMobileOpen = (open: boolean) => setOpenPath(open ? pathname : null);
  const navigationOpen = drawerMode ? mobileOpen : prefs.size !== "compact";
  const toggleMenu = () => {
    if (drawerMode) setMobileOpen(!mobileOpen);
    else update({ size: prefs.size === "compact" ? "default" : "compact" });
  };
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPath(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);
  return (
    <div className="workspace">
      <div className="app-frame">
        <Sidebar open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
        {mobileOpen && (
          <button
            className="mobile-backdrop"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <div className="main-column">
          <Header
            navigationOpen={navigationOpen}
            menuLabel={
              drawerMode
                ? undefined
                : prefs.size === "compact"
                  ? "Switch to default sidebar"
                  : "Switch to compact sidebar"
            }
            onToggleMenu={toggleMenu}
          />
          <PageContainer>{children}</PageContainer>
          <Footer />
        </div>
      </div>
    </div>
  );
}
