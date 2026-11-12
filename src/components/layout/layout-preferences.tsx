"use client";
import { useEffect, useSyncExternalStore } from "react";
import { themePresets } from "@/config/theme-presets";
export const defaults = {
  color: "default",
  direction: "ltr",
  sidebar: "light",
  header: "light",
  size: "default",
  width: "fluid",
};
export type Preferences = typeof defaults;
const key = "orzen-layout";
const choices: Record<keyof Preferences, string[]> = {
  color: ["default", ...themePresets.map((preset) => preset.id)],
  direction: ["ltr", "rtl"],
  sidebar: ["light", "dark", "gray"],
  header: ["light", "dark", "gray"],
  size: ["default", "compact", "hover", "offcanvas"],
  width: ["fluid", "boxed"],
};
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(key, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(key, callback);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}
export function useLayoutPreferences() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "");
  const prefs = { ...defaults };
  try {
    const saved = JSON.parse(raw);
    for (const field of Object.keys(defaults) as (keyof Preferences)[])
      if (choices[field].includes(saved[field])) prefs[field] = saved[field];
  } catch {}
  function update(next: Partial<Preferences>) {
    try {
      localStorage.setItem(key, JSON.stringify({ ...prefs, ...next }));
    } catch {}
    window.dispatchEvent(new Event(key));
  }
  return { prefs, update };
}
export function LayoutPreferences() {
  const { prefs } = useLayoutPreferences();
  useEffect(() => {
    const root = document.documentElement;
    root.dir = prefs.direction;
    root.dataset.sidebarColor = prefs.sidebar;
    root.dataset.headerColor = prefs.header;
    root.dataset.sidebarSize = prefs.size;
    root.dataset.layoutWidth = prefs.width;
    root.dataset.themeColor = prefs.color;
    const preset = themePresets.find((item) => item.id === prefs.color) ?? themePresets[9];
    for (const mode of ["light", "dark"] as const) {
      for (const [token, value] of Object.entries(preset[mode]))
        root.style.setProperty(`--preset-${mode}-${token}`, value);
    }
    root.style.setProperty("--radius-card", `${preset.radius}px`);
    root.style.setProperty("--radius-control", `${preset.control}px`);
    preset.chart.forEach((color, index) => root.style.setProperty(`--chart-${index + 2}`, color));
  }, [prefs.color, prefs.direction, prefs.sidebar, prefs.header, prefs.size, prefs.width]);
  return null;
}
