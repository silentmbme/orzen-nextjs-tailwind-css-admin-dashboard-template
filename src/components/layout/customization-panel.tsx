"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
  Check,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { defaults, useLayoutPreferences, type Preferences } from "./layout-preferences";
import { themePresets } from "@/config/theme-presets";

const appearances: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];
const subscribeHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export function CustomizationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme: savedTheme, resolvedTheme: savedResolvedTheme, setTheme } = useTheme();
  // next-themes knows local storage on the client, but the server cannot.
  // Keep hidden dialog attributes identical until React finishes hydration.
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated);
  const theme = hydrated ? savedTheme : undefined;
  const resolvedTheme = hydrated ? savedResolvedTheme : undefined;
  const { prefs, update } = useLayoutPreferences();
  const currentPreset = themePresets.find((preset) => preset.id === prefs.color) ?? themePresets[9];
  function options(label: string, field: keyof Preferences, values: [string, string][]) {
    return (
      <fieldset className="min-w-0">
        <legend className="mb-2 text-[11px] font-medium">{label}</legend>
        <div
          className={`grid gap-1 rounded-lg border border-border bg-surface-alt p-1 ${values.length === 4 ? "grid-cols-2" : values.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {values.map(([value, text]) => (
            <button
              key={value}
              type="button"
              aria-pressed={prefs[field] === value}
              onClick={() => update({ [field]: value })}
              className={`flex min-h-7 items-center justify-center gap-1.5 rounded-md border px-1.5 py-1 text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${prefs[field] === value ? "border-border bg-surface font-medium text-accent" : "border-transparent text-muted hover:bg-surface hover:text-foreground"}`}
            >
              {(field === "header" || field === "sidebar") && (
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full border border-border"
                  style={{
                    background:
                      value === "dark"
                        ? currentPreset.dark.surface
                        : value === "gray"
                          ? currentPreset[resolvedTheme === "dark" ? "dark" : "light"].border
                          : currentPreset[resolvedTheme === "dark" ? "dark" : "light"].surface,
                  }}
                />
              )}{" "}
              {text}
            </button>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <Dialog
      open={open}
      title="Customization"
      onClose={onClose}
      variant="offcanvas"
      offcanvasWidth={390}
      closeLabel="Close customization"
    >
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex items-center gap-3 border-b border-border bg-surface-alt px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface text-accent">
            <SlidersHorizontal size={17} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium">Your workspace, your style</p>
            <p className="mt-0.5 text-[10px] text-muted">
              Changes apply instantly and save automatically.
            </p>
          </div>
        </div>
        <div className="grid gap-4 p-4">
          <fieldset>
            <legend className="mb-2 text-[11px] font-medium">Appearance</legend>
            <div className="grid grid-cols-3 gap-2">
              {appearances.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={theme === value}
                  onClick={() => setTheme(value)}
                  className={`flex items-center justify-center gap-2 rounded-lg border px-2 py-2.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${theme === value ? "border-accent/50 bg-accent/5 text-accent" : "border-border text-muted hover:bg-surface-alt"}`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="border-t border-border pt-4">
            <legend className="sr-only">Theme presets</legend>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[11px] font-medium">
                <Palette size={13} className="text-muted" />
                Theme presets
              </h3>
              <span className="rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                {prefs.color === "default" ? "Default" : currentPreset.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themePresets.map((preset) => {
                const palette = preset[resolvedTheme === "dark" ? "dark" : "light"];
                const selected = prefs.color === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={`${preset.name} theme`}
                    aria-pressed={selected}
                    onClick={() => update({ color: preset.id })}
                    className={`flex items-center gap-2.5 rounded-lg border p-2 text-start transition-colors focus-visible:outline-2 focus-visible:outline-accent ${selected ? "border-accent/50 bg-accent/5" : "border-border hover:bg-surface-alt"}`}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-10 shrink-0 overflow-hidden rounded border"
                      style={{
                        background: palette.background,
                        borderColor: palette.border,
                      }}
                    >
                      <span className="w-2 shrink-0" style={{ background: palette.accent }} />
                      <span className="flex flex-1 flex-col gap-1 p-1">
                        <span className="h-1 rounded-sm" style={{ background: palette.border }} />
                        <span className="flex flex-1 gap-0.5">
                          {preset.chart.slice(0, 2).map((color) => (
                            <span
                              key={color}
                              className="flex-1 rounded-sm opacity-70"
                              style={{ background: color }}
                            />
                          ))}
                        </span>
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-medium">{preset.name}</span>
                      <span className="mt-0.5 block text-[9px] leading-3 text-muted">
                        {preset.description}
                      </span>
                    </span>
                    {selected && <Check size={12} className="shrink-0 text-accent" />}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-medium">
              <SlidersHorizontal size={13} className="text-muted" />
              Layout preferences
            </h3>
            <div className="grid gap-3.5">
              {options("Direction", "direction", [
                ["ltr", "LTR"],
                ["rtl", "RTL"],
              ])}
              {options("Sidebar color", "sidebar", [
                ["light", "Light"],
                ["dark", "Dark"],
                ["gray", "Gray"],
              ])}
              {options("Header color", "header", [
                ["light", "Light"],
                ["dark", "Dark"],
                ["gray", "Gray"],
              ])}
              {options("Sidebar size", "size", [
                ["default", "Default"],
                ["compact", "Compact"],
                ["hover", "On hover"],
                ["offcanvas", "Offcanvas"],
              ])}
              {options("Layout width", "width", [
                ["fluid", "Fluid"],
                ["boxed", "Boxed"],
              ])}
            </div>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3">
        <Button
          className="w-full bg-danger! text-white!"
          onClick={() => {
            update(defaults);
            setTheme("light");
          }}
        >
          <RotateCcw size={13} />
          Reset defaults
        </Button>
      </div>
    </Dialog>
  );
}
