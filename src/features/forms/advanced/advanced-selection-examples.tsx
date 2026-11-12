"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Folder,
  LayoutGrid,
  Search,
  Server,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/ui/user-avatar";

type Option = { label: string; group: string; icon?: typeof Box };
const options: Option[] = [
  { label: "Analytics dashboard", group: "Workspace", icon: LayoutGrid },
  { label: "Customer portal", group: "Workspace", icon: UserRound },
  { label: "API gateway", group: "Developer", icon: Server },
  { label: "Security center", group: "Developer", icon: ShieldCheck },
  { label: "Component library", group: "Design", icon: Box },
];

function Combobox({
  label,
  disabled = false,
  forceEmpty = false,
}: {
  label: string;
  disabled?: boolean;
  forceEmpty?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(forceEmpty ? "No matching workspace" : ""),
    [selected, setSelected] = useState("");
  const filtered = useMemo(
    () => options.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const listId = `combobox-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <span className="mb-1.5 block text-[9px] font-medium">{label}</span>
      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((value) => !value)}
          className="ui-input flex w-full items-center justify-between text-left disabled:opacity-45"
        >
          <span className={selected ? "" : "text-muted"}>{selected || "Select an option"}</span>
          <ChevronDown size={12} />
        </button>
        {open && (
          <div className="absolute z-30 mt-1 w-full min-w-60 rounded-lg border border-border bg-surface p-1.5 shadow-lg">
            <div className="relative mb-1.5">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search options..."
                className="h-8! pl-7! text-[8px]!"
              />
            </div>
            <div id={listId} role="listbox" className="max-h-44 overflow-y-auto">
              {filtered.map((item, index) => {
                const Icon = item.icon ?? Box;
                const previous = filtered[index - 1];
                return (
                  <div key={item.label}>
                    {(!previous || previous.group !== item.group) && (
                      <p className="px-2 py-1 text-[7px] font-medium uppercase tracking-wider text-muted">
                        {item.group}
                      </p>
                    )}
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected === item.label}
                      onClick={() => {
                        setSelected(item.label);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[8px] hover:bg-surface-alt"
                    >
                      <span className="grid size-6 place-items-center rounded-md bg-accent/10 text-accent">
                        <Icon size={11} />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {selected === item.label && <Check size={11} className="text-accent" />}
                    </button>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="grid place-items-center px-3 py-7 text-center">
                  <Search size={16} className="text-muted" />
                  <b className="mt-2 text-[8px]">No results found</b>
                  <span className="mt-1 text-[7px] text-muted">Try a different search phrase.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdvancedSelectionExamples() {
  const [selected, setSelected] = useState(["Analytics", "Automation"]),
    [tags, setTags] = useState(["React", "TypeScript", "Design"]),
    [tagInput, setTagInput] = useState(""),
    [segment, setSegment] = useState("Board"),
    [plan, setPlan] = useState("Growth"),
    [shipping, setShipping] = useState("Express");
  const [available, setAvailable] = useState(["CRM", "Billing", "Reports", "Inventory"]),
    [assigned, setAssigned] = useState(["Dashboard", "Customers"]);
  const toggleSelected = (item: string) =>
    setSelected((value) =>
      value.includes(item) ? value.filter((entry) => entry !== item) : [...value, item],
    );
  return (
    <div className="grid gap-3">
      <Card title="Searchable select controls" action={<Badge>6 patterns</Badge>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Combobox label="Basic searchable combobox" />
          <Combobox label="Grouped icon dropdown" />
          <div>
            <span className="mb-1.5 block text-[9px] font-medium">Avatar user select</span>
            <button type="button" className="ui-input flex w-full items-center gap-2 text-left">
              <UserAvatar name="Sofia Garcia" size={22} />
              <span className="flex-1">Sofia Garcia</span>
              <ChevronDown size={12} />
            </button>
          </div>
          <Combobox label="Disabled searchable select" disabled />
          <Combobox label="Empty result state" forceEmpty />
          <div>
            <span className="mb-1.5 block text-[9px] font-medium">Compact icon select</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                [Code2, "Code"],
                [LayoutGrid, "Board"],
                [Server, "API"],
              ].map(([Icon, text]) => {
                const I = Icon as typeof Code2;
                return (
                  <button
                    type="button"
                    key={String(text)}
                    className="grid place-items-center rounded-lg border border-border p-2 text-[7px] hover:border-accent"
                  >
                    <I size={13} className="mb-1 text-accent" />
                    {String(text)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Multi-select variations" action={<Badge>{selected.length} selected</Badge>}>
          <div className="grid gap-4">
            <div>
              <span className="mb-1.5 block text-[9px] font-medium">Multi-select with tags</span>
              <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border p-1.5">
                {selected.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 text-[8px] text-accent"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => toggleSelected(item)}
                      aria-label={`Remove ${item}`}
                    >
                      <X size={9} />
                    </button>
                  </span>
                ))}
                <button type="button" className="px-2 text-[8px] text-muted">
                  + Add
                </button>
              </div>
            </div>
            <div>
              <span className="mb-2 block text-[9px] font-medium">Checkbox multi-select</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {["Analytics", "Automation", "Customer portal", "API access"].map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-[8px] hover:bg-surface-alt"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(item)}
                      onChange={() => toggleSelected(item)}
                      className="accent-[var(--color-accent)]"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-[9px] font-medium">Avatar multi-select</span>
              <div className="flex items-center gap-2 rounded-lg border border-border p-2">
                {["Sofia Garcia", "Daniel Kim", "Alex Morgan"].map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 rounded-full bg-surface-alt py-1 pl-1 pr-2 text-[7px]"
                  >
                    <UserAvatar name={name} size={20} />
                    {name.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Tag input patterns">
          <div className="grid gap-4">
            <div>
              <span className="mb-1.5 block text-[9px] font-medium">Standard removable tags</span>
              <div className="flex min-h-10 flex-wrap gap-1.5 rounded-lg border border-border p-1.5">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-[8px] ${index % 3 === 0 ? "rounded-md bg-accent/10 text-accent" : index % 3 === 1 ? "rounded-full bg-blue-500/10 text-blue-500" : "rounded-md bg-rose-500/10 text-rose-500"}`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags((value) => value.filter((entry) => entry !== tag))}
                    >
                      <X size={9} />
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && tagInput.trim() && tags.length < 6) {
                      event.preventDefault();
                      setTags((value) => [...value, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                  placeholder={tags.length >= 6 ? "Maximum reached" : "Add tag..."}
                  disabled={tags.length >= 6}
                  className="min-w-24 flex-1 bg-transparent px-1 text-[8px] outline-none"
                />
              </div>
              <p className="mt-1 text-right text-[7px] text-muted">{tags.length}/6 tags</p>
            </div>
            <div>
              <span className="mb-2 block text-[9px] font-medium">Suggestions</span>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "Accessibility", "Research", "Marketing"]
                  .filter((item) => !tags.includes(item))
                  .map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => tags.length < 6 && setTags((value) => [...value, item])}
                      className="rounded-full border border-border px-2.5 py-1 text-[7px] hover:border-accent hover:text-accent"
                    >
                      + {item}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Rich selection controls">
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <div>
            <span className="mb-2 block text-[9px] font-medium">
              Segmented text and icon controls
            </span>
            <div className="inline-flex rounded-lg border border-border bg-surface-alt p-1">
              {["List", "Board", "Timeline"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSegment(item)}
                  className={`rounded-md px-3 py-1.5 text-[8px] ${segment === item ? "bg-surface shadow-sm" : "text-muted"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-[9px] font-medium">Toggle card selection</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                [Server, "Cloud"],
                [ShieldCheck, "Private"],
              ].map(([Icon, text], index) => {
                const I = Icon as typeof Server;
                return (
                  <button
                    type="button"
                    key={String(text)}
                    className={`rounded-lg border p-3 text-left ${index === 0 ? "border-accent bg-accent/5" : "border-border"}`}
                  >
                    <I size={14} className="text-accent" />
                    <b className="mt-2 block text-[8px]">{String(text)}</b>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-[9px] font-medium">Subscription options</span>
            <div className="grid gap-2">
              {["Starter", "Growth", "Scale"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setPlan(item)}
                  className={`flex items-center justify-between rounded-lg border p-2.5 text-[8px] ${plan === item ? "border-accent bg-accent/5" : "border-border"}`}
                >
                  <span>{item}</span>
                  <b>{item === "Starter" ? "$19" : item === "Growth" ? "$49" : "$99"}</b>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-[9px] font-medium">Shipping option cards</span>
            {["Standard", "Express"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setShipping(item)}
                className={`mb-2 flex w-full items-center gap-3 rounded-lg border p-3 text-left ${shipping === item ? "border-accent" : "border-border"}`}
              >
                <Truck size={14} className="text-accent" />
                <span className="flex-1">
                  <b className="block text-[8px]">{item}</b>
                  <small className="text-[7px] text-muted">
                    {item === "Express" ? "1–2 business days" : "4–6 business days"}
                  </small>
                </span>
                {shipping === item && <Check size={11} className="text-accent" />}
              </button>
            ))}
          </div>
          <div className="xl:col-span-2">
            <span className="mb-2 block text-[9px] font-medium">Transfer list</span>
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
              <div className="rounded-lg border border-border p-2">
                <b className="mb-2 block text-[7px] text-muted">AVAILABLE</b>
                {available.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setAvailable((value) => value.filter((entry) => entry !== item));
                      setAssigned((value) => [...value, item]);
                    }}
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 text-[8px] hover:bg-surface-alt"
                  >
                    {item}
                    <ChevronRight size={10} />
                  </button>
                ))}
              </div>
              <div className="grid place-items-center text-muted">⇄</div>
              <div className="rounded-lg border border-border p-2">
                <b className="mb-2 block text-[7px] text-muted">ASSIGNED</b>
                {assigned.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => {
                      setAssigned((value) => value.filter((entry) => entry !== item));
                      setAvailable((value) => [...value, item]);
                    }}
                    className="flex w-full items-center justify-between rounded px-2 py-1.5 text-[8px] hover:bg-surface-alt"
                  >
                    {item}
                    <X size={9} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className="mb-2 block text-[9px] font-medium">Hierarchical tree select</span>
            <div className="rounded-lg border border-border p-2 text-[8px]">
              <label className="flex items-center gap-2 py-1">
                <ChevronDown size={10} />
                <Folder size={11} className="text-accent" />
                <input type="checkbox" className="accent-[var(--color-accent)]" />
                Workspace
              </label>
              <div className="ml-5 border-l border-border pl-3">
                <label className="flex items-center gap-2 py-1">
                  <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
                  Dashboards
                </label>
                <label className="flex items-center gap-2 py-1">
                  <input type="checkbox" className="accent-[var(--color-accent)]" />
                  Applications
                </label>
                <label className="flex items-center gap-2 py-1">
                  <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
                  Reports
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
