"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Check, Globe2, Search } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
const countries = [
  { code: "us", name: "United States", region: "North America" },
  { code: "gb", name: "United Kingdom", region: "Europe" },
  { code: "in", name: "India", region: "Asia" },
  { code: "de", name: "Germany", region: "Europe" },
  { code: "fr", name: "France", region: "Europe" },
  { code: "jp", name: "Japan", region: "Asia" },
  { code: "au", name: "Australia", region: "Oceania" },
  { code: "ca", name: "Canada", region: "North America" },
];
const storageKey = "orzen-country";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(storageKey, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(storageKey, listener);
  };
}
function snapshot() {
  try {
    return localStorage.getItem(storageKey) ?? "us";
  } catch {
    return "us";
  }
}
export function CountryDropdown() {
  const code = useSyncExternalStore(subscribe, snapshot, () => "us");
  const [fallbackCode, setFallbackCode] = useState<string | null>(null);
  const selected =
    countries.find((country) => country.code === (fallbackCode ?? code)) ?? countries[0];
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const filtered = countries.filter((country) =>
    `${country.name} ${country.code} ${country.region}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget))
          setOpen(false);
      }}
    >
      <IconButton
        ref={trigger}
        aria-label={`Country: ${selected.name}`}
        title={`Country: ${selected.name}`}
        aria-expanded={open}
        aria-controls="header-country"
        onClick={() => {
          setOpen((value) => !value);
          setSearch("");
        }}
      >
        <Image
          src={`/images/flags/${selected.code}.png`}
          alt=""
          width={20}
          height={18}
          className="h-[18px] w-5 rounded-[2px] object-cover"
        />
      </IconButton>
      {open && (
        <section
          id="header-country"
          aria-label="Country selector"
          className="absolute right-0 top-full z-50 mt-2 w-[290px] max-w-[calc(100vw-18px)] overflow-hidden rounded-[10px] border border-border bg-surface text-foreground shadow-sm max-[560px]:fixed max-[560px]:right-[9px] max-[560px]:top-[55px]"
        >
          <div className="border-b border-border p-3">
            <h2 className="mb-3 flex items-center gap-2 text-[12px] font-semibold">
              <Globe2 size={14} className="text-muted" />
              Select country
            </h2>
            <div className="relative">
              <Search
                size={13}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <Input
                aria-label="Search countries"
                placeholder="Search countries..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-8!"
              />
            </div>
          </div>
          <div
            className="max-h-[min(360px,55dvh)] overflow-y-auto overscroll-contain p-1.5"
            role="group"
            aria-label="Countries"
          >
            {filtered.map((country) => (
              <button
                type="button"
                key={country.code}
                aria-pressed={selected.code === country.code}
                onClick={() => {
                  try {
                    localStorage.setItem(storageKey, country.code);
                    setFallbackCode(null);
                    window.dispatchEvent(new Event(storageKey));
                  } catch {
                    setFallbackCode(country.code);
                  }
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-start focus-visible:outline-2 focus-visible:outline-accent ${selected.code === country.code ? "bg-accent/5" : "hover:bg-surface-alt"}`}
              >
                <span className="grid h-7 w-9 shrink-0 place-items-center rounded border border-border bg-surface-alt">
                  <Image
                    src={`/images/flags/${country.code}.png`}
                    alt=""
                    width={24}
                    height={16}
                    className="h-4 w-6 rounded-[1px] object-cover"
                  />
                </span>
                <span className="flex-1">
                  <span className="block text-[12px] font-medium">{country.name}</span>
                  <span className="mt-0.5 block text-[10px] text-muted">{country.region}</span>
                </span>
                {selected.code === country.code && <Check size={14} className="text-accent" />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-[12px] text-muted">No countries found.</p>
            )}
          </div>
          <p className="border-t border-border bg-surface-alt px-3 py-2.5 text-[10px] text-muted">
            Country preference only; demo data is unchanged.
          </p>
        </section>
      )}
    </div>
  );
}
