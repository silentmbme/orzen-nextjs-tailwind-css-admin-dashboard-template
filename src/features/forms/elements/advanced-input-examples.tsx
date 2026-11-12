"use client";

import { useState } from "react";
import {
  CalendarDays,
  Command,
  Link2,
  Minus,
  Plus,
  Search,
  Star,
  UploadCloud,
  Volume2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";

const labelClass = "mb-1.5 block text-[9px] font-medium";

export function AdvancedInputExamples() {
  const [volume, setVolume] = useState(64);
  const [budget, setBudget] = useState(4200);
  const [rating, setRating] = useState(4);
  const [segment, setSegment] = useState("Monthly");
  const [fileName, setFileName] = useState("No file selected");
  const [tags, setTags] = useState(["Design", "Product", "Research"]);
  const [tagInput, setTagInput] = useState("");
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Range and sliders" action={<Badge>Native controls</Badge>}>
          <div className="grid gap-5">
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Basic slider</span>
                <b>{volume}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Step slider</span>
                <b>{budget.toLocaleString()} credits</b>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="100"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="mt-1 flex justify-between text-[7px] text-muted">
                <span>1,000</span>
                <span>5,500</span>
                <span>10,000</span>
              </div>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <Volume2 size={14} className="text-muted" />
              <input
                aria-label="Volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <span className="w-8 text-right text-[8px] text-muted">{volume}</span>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px]">Price range</span>
                <b className="text-[9px]">$200 – $8,000</b>
              </div>
              <div className="mt-3 grid gap-2">
                <input
                  aria-label="Minimum price"
                  type="range"
                  min="0"
                  max="10000"
                  defaultValue="200"
                  className="w-full accent-[var(--color-accent)]"
                />
                <input
                  aria-label="Maximum price"
                  type="range"
                  min="0"
                  max="10000"
                  defaultValue="8000"
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
            </div>
            <div className="opacity-45">
              <span className={labelClass}>Disabled slider</span>
              <input
                aria-label="Disabled slider"
                disabled
                type="range"
                defaultValue="35"
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <Card title="Date and time controls">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-[9px]">
              Date input
              <Input type="date" defaultValue="2026-11-09" className="mt-1.5" />
            </label>
            <label className="text-[9px]">
              Time input
              <Input type="time" defaultValue="14:30" className="mt-1.5" />
            </label>
            <label className="text-[9px]">
              Date and time
              <Input type="datetime-local" defaultValue="2026-11-09T14:30" className="mt-1.5" />
            </label>
            <label className="text-[9px]">
              Month picker
              <Input type="month" defaultValue="2026-11" className="mt-1.5" />
            </label>
            <div className="sm:col-span-2">
              <span className={labelClass}>Date range</span>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input aria-label="Range start" type="date" defaultValue="2026-11-09" />
                <span className="text-[8px] text-muted">to</span>
                <Input aria-label="Range end" type="date" defaultValue="2026-11-16" />
              </div>
            </div>
            <label className="text-[9px]">
              Week picker
              <Input type="week" defaultValue="2026-W46" className="mt-1.5" />
            </label>
            <label className="text-[9px] opacity-45">
              Disabled date
              <Input type="date" disabled defaultValue="2026-12-01" className="mt-1.5" />
            </label>
            <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-border bg-accent/5 p-3">
              <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                <CalendarDays size={14} />
              </span>
              <div>
                <b className="block text-[9px]">Next review</b>
                <span className="text-[8px] text-muted">Monday, November 16 at 2:30 PM</span>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                Change
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Input groups">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <span className={labelClass}>Search with shortcut</span>
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input placeholder="Search workspace" className="pl-8! pr-14!" />
              <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-border px-1.5 py-1 text-[7px] text-muted">
                <Command size={8} />K
              </span>
            </div>
          </div>
          <div>
            <span className={labelClass}>Input with button</span>
            <div className="flex">
              <Input placeholder="Invite by email" className="rounded-r-none!" />
              <Button className="rounded-l-none!">Invite</Button>
            </div>
          </div>
          <div>
            <span className={labelClass}>Currency group</span>
            <div className="flex">
              <span className="grid place-items-center rounded-l-lg border border-r-0 border-border bg-surface-alt px-3 text-[9px]">
                $
              </span>
              <Input type="number" defaultValue="2450" className="rounded-none!" />
              <span className="grid place-items-center rounded-r-lg border border-l-0 border-border bg-surface-alt px-3 text-[8px] text-muted">
                USD
              </span>
            </div>
          </div>
          <div>
            <span className={labelClass}>Domain group</span>
            <div className="relative">
              <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input defaultValue="workspace" className="pl-8! pr-16!" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-muted">
                .orzen.io
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[.9fr_1.1fr]">
        <Card title="File and color controls">
          <div className="grid gap-4">
            <label className="group grid cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-surface-alt px-4 py-7 text-center transition hover:border-accent hover:bg-accent/5">
              <UploadCloud size={22} className="text-accent" />
              <b className="mt-2 text-[9px]">Drop files here or browse</b>
              <span className="mt-1 text-[8px] text-muted">PNG, JPG or PDF up to 10 MB</span>
              <input
                type="file"
                className="sr-only"
                onChange={(event) =>
                  setFileName(event.target.files?.[0]?.name ?? "No file selected")
                }
              />
            </label>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="min-w-0 truncate text-[8px] text-muted">{fileName}</span>
              {fileName !== "No file selected" && (
                <button
                  type="button"
                  onClick={() => setFileName("No file selected")}
                  className="text-muted hover:text-danger"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-[9px]">
                Brand color
                <Input type="color" defaultValue="#8b5cf6" className="mt-1.5 h-10! p-1!" />
              </label>
              <label className="text-[9px]">
                Accent hex
                <Input defaultValue="#8B5CF6" className="mt-1.5 font-mono" />
              </label>
            </div>
          </div>
        </Card>

        <Card title="Specialized controls">
          <div className="grid gap-5">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-[9px] font-medium">Rating input</span>
                <span className="text-[8px] text-muted">{rating} of 5</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-label={`Rate ${item} stars`}
                    onClick={() => setRating(item)}
                    className={item <= rating ? "text-amber-500" : "text-border"}
                  >
                    <Star size={19} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Segmented control</span>
              <div className="inline-flex rounded-lg border border-border bg-surface-alt p-1">
                {["Monthly", "Quarterly", "Yearly"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setSegment(item)}
                    className={`rounded-md px-3 py-1.5 text-[8px] font-medium transition ${segment === item ? "bg-surface text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className={labelClass}>Toggle button group</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">
                  <Plus size={11} />
                  Add
                </Button>
                <Button size="sm" variant="outline">
                  <Minus size={11} />
                  Remove
                </Button>
                <Button size="sm" variant="ghost">
                  Reset
                </Button>
              </div>
            </div>
            <div>
              <span className={labelClass}>Tag input</span>
              <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 focus-within:border-accent">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-accent/10 px-2 py-1 text-[8px] text-accent"
                  >
                    {tag}
                    <button
                      type="button"
                      aria-label={`Remove ${tag}`}
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
                    if (event.key === "Enter" && tagInput.trim()) {
                      event.preventDefault();
                      setTags((value) => [...value, tagInput.trim()]);
                      setTagInput("");
                    }
                  }}
                  placeholder="Type and press Enter"
                  className="min-w-32 flex-1 bg-transparent px-1 py-1 text-[8px] outline-none placeholder:text-muted"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
