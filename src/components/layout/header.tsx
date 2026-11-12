"use client";
import { useState } from "react";
import { Search, Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { IconButton } from "@/components/ui/icon-button";
import { navigation } from "@/config/navigation";
import { HeaderTools } from "./header-tools";
import { CountryDropdown } from "./country-dropdown";

export type HeaderProps = { navigationOpen: boolean; onToggleMenu: () => void; menuLabel?: string };
export function Header({ navigationOpen, onToggleMenu, menuLabel }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const matches = navigation
    .flatMap((group) => group.items)
    .filter(
      (item) =>
        item.ready &&
        search.trim() &&
        item.label.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .filter((item, index, items) => items.findIndex((other) => other.href === item.href) === index);
  return (
    <header className="topbar">
      <div className="header-title">
        <IconButton
          variant="ghost"
          className="menu-toggle"
          aria-controls="admin-sidebar"
          aria-expanded={navigationOpen}
          aria-label={menuLabel ?? (navigationOpen ? "Close navigation" : "Open navigation")}
          onClick={onToggleMenu}
        >
          <Menu size={17} />
        </IconButton>
        <div className="header-search-wrap">
          <label className="search-field">
            <Search size={15} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search available pages"
              placeholder="Search pages..."
            />
          </label>
          {search.trim() && (
            <div className="header-search-results" role="status">
              {matches.length ? (
                matches.map((item) => (
                  <Link href={item.href} key={item.href} onClick={() => setSearch("")}>
                    {item.label}
                  </Link>
                ))
              ) : (
                <span>No matching pages</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="header-actions">
        <CountryDropdown />
        <IconButton
          aria-label="Toggle light and dark theme"
          title="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="theme-icon-light" size={16} />
          <Moon className="theme-icon-dark" size={16} />
        </IconButton>
        <HeaderTools />
      </div>
    </header>
  );
}
