"use client";
import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarFlyout, type SidebarFlyoutState } from "./sidebar-flyout";
import { useLayoutPreferences } from "./layout-preferences";
import { navigation, sidebarSections } from "@/config/navigation";

function subscribeDesktop(callback: () => void) {
  const media = window.matchMedia("(min-width: 851px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function desktopSnapshot() {
  return window.matchMedia("(min-width: 851px)").matches;
}

export function SidebarNavigation({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const { prefs } = useLayoutPreferences();
  const desktop = useSyncExternalStore(subscribeDesktop, desktopSnapshot, () => false);
  const compact = desktop && prefs.size === "compact";
  const [flyout, setFlyout] = useState<SidebarFlyoutState | null>(null);
  const closeFlyout = useCallback(() => setFlyout(null), []);
  const [expanded, setExpanded] = useState<{ path: string; groups: Record<string, boolean> }>({
    path: pathname,
    groups: {},
  });
  return (
    <>
      <nav aria-label="Main navigation" className="sidebar-tree">
        {sidebarSections.map((section) => (
          <section key={section.label} aria-label={section.label} className="sidebar-category">
            <h2 className="nav-section sidebar-category-label">{section.label}</h2>
            {section.groups
              .map((name) => navigation.find((group) => group.section === name))
              .filter((group) => group !== undefined)
              .map((group) => {
                const index = group.section.toLowerCase().replace(/\s+/g, "-");
                if (group.section === "DASHBOARDS")
                  return (
                    <div key={group.section}>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const selected =
                          pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            onClick={onNavigate}
                            aria-current={selected ? "page" : undefined}
                            className={`nav-link sidebar-child-link ${selected ? "active" : ""}`}
                          >
                            <Icon size={17} aria-hidden="true" className="shrink-0" />
                            <span className="nav-label min-w-0 truncate">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                const active = group.items.some(
                  (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
                );
                const open =
                  expanded.path === pathname ? (expanded.groups[group.section] ?? active) : active;
                const GroupIcon = group.items[0].icon;
                const label = group.section
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())
                  .replace(/Crm/g, "CRM")
                  .replace(/Saas/g, "SaaS")
                  .replace(/Hr /g, "HR ")
                  .replace(/Ai /g, "AI ")
                  .replace(/Ui /g, "UI ")
                  .replace(/Ecommerce/g, "eCommerce");
                return (
                  <div className="sidebar-tree-group" key={group.section}>
                    <button
                      type="button"
                      title={label}
                      aria-expanded={
                        compact
                          ? flyout?.group.section === group.section && flyout.path === pathname
                          : open
                      }
                      aria-controls={compact ? `sidebar-flyout-${index}` : `sidebar-group-${index}`}
                      onClick={(event) => {
                        if (compact && window.matchMedia("(min-width: 851px)").matches) {
                          const trigger = event.currentTarget;
                          const rail = trigger.closest("aside")!.getBoundingClientRect();
                          const rect = trigger.getBoundingClientRect();
                          const width = 260;
                          const rtl = document.documentElement.dir === "rtl";
                          setFlyout((previous) =>
                            previous?.group.section === group.section && previous.path === pathname
                              ? null
                              : {
                                  group,
                                  label,
                                  path: pathname,
                                  trigger,
                                  top: Math.max(
                                    72,
                                    Math.min(
                                      rect.top,
                                      window.innerHeight -
                                        Math.min(group.items.length * 38 + 52, 420) -
                                        16,
                                    ),
                                  ),
                                  left: rtl
                                    ? Math.max(8, rail.left - width)
                                    : Math.min(rail.right, window.innerWidth - width - 8),
                                },
                          );
                          return;
                        }
                        setExpanded((previous) => ({
                          path: pathname,
                          groups: {
                            ...(previous.path === pathname ? previous.groups : {}),
                            [group.section]: !open,
                          },
                        }));
                      }}
                      className={`nav-link sidebar-group-toggle ${active ? "sidebar-group-current" : ""}`}
                    >
                      <GroupIcon size={17} aria-hidden="true" className="shrink-0" />
                      <span className="nav-label min-w-0 flex-1 truncate text-start">{label}</span>
                      <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`sidebar-group-chevron shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id={`sidebar-group-${index}`}
                      hidden={!open}
                      className="sidebar-tree-children"
                    >
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const selected =
                          pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return item.ready ? (
                          <Link
                            title={item.label}
                            onClick={onNavigate}
                            key={item.href}
                            href={item.href}
                            aria-current={selected ? "page" : undefined}
                            className={`nav-link sidebar-child-link ${selected ? "active" : ""}`}
                          >
                            <Icon size={15} aria-hidden="true" className="shrink-0" />
                            <span className="nav-label min-w-0 truncate">{item.label}</span>
                          </Link>
                        ) : (
                          <span
                            key={item.href}
                            className="nav-link nav-disabled sidebar-child-link"
                            title="Planned for a later phase"
                          >
                            <Icon size={15} aria-hidden="true" className="shrink-0" />
                            <span className="nav-label min-w-0 truncate">{item.label}</span>
                            <span className="soon">Soon</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </section>
        ))}
      </nav>
      {flyout && flyout.path === pathname && compact && (
        <SidebarFlyout state={flyout} onClose={closeFlyout} onNavigate={onNavigate} />
      )}
    </>
  );
}
