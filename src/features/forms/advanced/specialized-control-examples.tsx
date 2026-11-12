"use client";

import { useState } from "react";
import { CalendarDays, Heart, Smile, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const label = "grid gap-1.5 text-[9px] font-medium";
const colors = [
  "#8b5cf6",
  "#3b82f6",
  "#06b6d4",
  "#318765",
  "#f59e0b",
  "#f9736b",
  "#ec4899",
  "#e85d68",
  "#111827",
  "#94a3b8",
];

export function SpecializedControlExamples() {
  const [rangeStart, setRangeStart] = useState(24),
    [rangeEnd, setRangeEnd] = useState(78),
    [step, setStep] = useState(40),
    [volume, setVolume] = useState(66),
    [rating, setRating] = useState(4),
    [heartRating, setHeartRating] = useState(3),
    [emoji, setEmoji] = useState(3),
    [numeric, setNumeric] = useState(7),
    [color, setColor] = useState("#8b5cf6"),
    [preset, setPreset] = useState("This month");
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Date and time controls" action={<Badge>{preset}</Badge>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-[9px] font-medium">Date range picker</span>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input aria-label="Start date" type="date" defaultValue="2026-11-09" />
                <span className="text-[8px] text-muted">to</span>
                <Input aria-label="End date" type="date" defaultValue="2026-11-18" />
              </div>
            </div>
            <label className={label}>
              Month picker
              <Input type="month" defaultValue="2026-11" />
            </label>
            <label className={label}>
              Year picker
              <Select defaultValue="2026">
                {[2024, 2025, 2026, 2027, 2028].map((year) => (
                  <option key={year}>{year}</option>
                ))}
              </Select>
            </label>
            <label className={label}>
              Date and time
              <Input type="datetime-local" defaultValue="2026-11-09T14:30" />
            </label>
            <div>
              <span className="mb-1.5 block text-[9px] font-medium">Time range</span>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input type="time" defaultValue="09:00" aria-label="Start time" />
                <span className="text-[8px] text-muted">–</span>
                <Input type="time" defaultValue="17:30" aria-label="End time" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className="mb-2 block text-[9px] font-medium">Date presets</span>
              <div className="flex flex-wrap gap-2">
                {["Today", "Last 7 days", "This month", "This quarter"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setPreset(item)}
                    className={`rounded-lg border px-3 py-1.5 text-[8px] ${preset === item ? "border-accent bg-accent/5 text-accent" : "border-border"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-border bg-surface-alt p-3">
              <CalendarDays size={14} className="text-accent" />
              <span className="flex-1 text-[8px]">Selected window: November 9–18, 2026</span>
              <Button size="sm" variant="outline">
                Clear
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Advanced sliders">
          <div className="grid gap-5">
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Standard slider</span>
                <b>{volume}</b>
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
                <span>Double-thumb range</span>
                <b>
                  ${rangeStart * 10} – ${rangeEnd * 10}
                </b>
              </div>
              <div className="grid gap-1">
                <input
                  aria-label="Minimum price"
                  type="range"
                  min="0"
                  max="100"
                  value={rangeStart}
                  onChange={(event) =>
                    setRangeStart(Math.min(Number(event.target.value), rangeEnd - 1))
                  }
                  className="w-full accent-[var(--color-accent)]"
                />
                <input
                  aria-label="Maximum price"
                  type="range"
                  min="0"
                  max="100"
                  value={rangeEnd}
                  onChange={(event) =>
                    setRangeEnd(Math.max(Number(event.target.value), rangeStart + 1))
                  }
                  className="w-full accent-[var(--color-accent)]"
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Stepped slider</span>
                <b>{step}%</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={step}
                onChange={(event) => setStep(Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="mt-1 flex justify-between text-[7px] text-muted">
                {[0, 20, 40, 60, 80, 100].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-4">
              <div className="grid h-24 place-items-center">
                <input
                  aria-label="Vertical volume"
                  type="range"
                  defaultValue="58"
                  className="w-20 -rotate-90 accent-[var(--color-accent)]"
                />
              </div>
              <div className="rounded-lg border border-border bg-surface-alt p-3">
                <b className="text-[9px]">Value label</b>
                <div className="mt-3 flex items-center gap-3">
                  <input
                    type="range"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="flex-1 accent-[var(--color-accent)]"
                  />
                  <span className="grid min-w-10 place-items-center rounded-md bg-accent px-2 py-1 text-[8px] text-white">
                    {volume}%
                  </span>
                </div>
              </div>
            </div>
            <div className="opacity-45">
              <span className="text-[9px]">Disabled slider</span>
              <input type="range" disabled defaultValue="35" className="mt-2 w-full" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <Card title="Rating controls">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-[9px] font-medium">Star rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    type="button"
                    key={item}
                    aria-label={`${item} stars`}
                    onClick={() => setRating(item)}
                    className={item <= rating ? "text-amber-500" : "text-border"}
                  >
                    <Star size={18} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-[9px] font-medium">Read-only half rating</span>
              <div className="flex gap-1 text-amber-500" aria-label="4.5 out of 5">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <StarHalf size={18} fill="currentColor" />
              </div>
            </div>
            <div>
              <span className="mb-2 block text-[9px] font-medium">Heart rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setHeartRating(item)}
                    aria-label={`${item} hearts`}
                    className={item <= heartRating ? "text-rose-500" : "text-border"}
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-[9px] font-medium">Emoji rating</span>
              <div className="flex gap-2">
                {["😞", "😐", "🙂", "😊", "🤩"].map((item, index) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setEmoji(index + 1)}
                    aria-label={`Mood ${index + 1}`}
                    className={`grid size-8 place-items-center rounded-full text-[15px] ${emoji === index + 1 ? "bg-accent/10 ring-1 ring-accent" : "bg-surface-alt"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <span className="mb-2 block text-[9px] font-medium">Numeric rating</span>
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setNumeric(item)}
                    className={`grid size-7 place-items-center rounded-md border text-[8px] ${numeric === item ? "border-accent bg-accent text-white" : "border-border"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Color pickers"
          action={
            <span
              className="size-5 rounded-full border border-border"
              style={{ background: color }}
            />
          }
        >
          <div className="grid gap-4">
            <div>
              <span className="mb-2 block text-[9px] font-medium">Color swatches</span>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setColor(item)}
                    aria-label={`Select ${item}`}
                    className={`aspect-square rounded-lg border-2 ${color === item ? "border-foreground" : "border-transparent"}`}
                    style={{ background: item }}
                  />
                ))}
              </div>
            </div>
            <label className={label}>
              HEX color
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="h-10! w-12! p-1!"
                />
                <Input
                  value={color.toUpperCase()}
                  onChange={(event) =>
                    /^#[0-9A-Fa-f]{0,6}$/.test(event.target.value) && setColor(event.target.value)
                  }
                  className="font-mono"
                />
              </div>
            </label>
            <div
              className="rounded-xl border border-border p-4"
              style={{ background: `color-mix(in srgb, ${color} 12%, var(--surface))` }}
            >
              <span className="block text-[8px] text-muted">Selected preview</span>
              <b className="mt-1 block text-[11px]" style={{ color }}>
                Advanced interface accent
              </b>
            </div>
            <div>
              <span className="mb-2 block text-[8px] text-muted">Recent colors</span>
              <div className="flex gap-2">
                {colors.slice(0, 5).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setColor(item)}
                    className="size-6 rounded-full border border-border"
                    style={{ background: item }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="OTP and masked inputs" action={<Badge>Local examples</Badge>}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <span className="mb-2 block text-[9px] font-medium">Four-digit OTP</span>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((item) => (
                <Input
                  key={item}
                  aria-label={`OTP digit ${item}`}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-11! px-0! text-center! text-[13px]!"
                />
              ))}
            </div>
            <p className="mt-2 text-[7px] text-muted">Demonstration only; no code is sent.</p>
          </div>
          <div>
            <span className="mb-2 block text-[9px] font-medium">Six-digit OTP</span>
            <div className="grid grid-cols-6 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Input
                  key={item}
                  aria-label={`Six digit OTP ${item}`}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-10! px-0! text-center!"
                />
              ))}
            </div>
          </div>
          <label className={label}>
            Masked PIN
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              defaultValue="4821"
              className="tracking-[.5em]"
            />
          </label>
          <label className={label}>
            Phone mask
            <div className="flex">
              <span className="grid place-items-center rounded-l-lg border border-r-0 border-border bg-surface-alt px-3 text-[8px]">
                +1
              </span>
              <Input type="tel" placeholder="(555) 000-0000" className="rounded-l-none!" />
            </div>
          </label>
          <label className={label}>
            Currency
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-muted">
                $
              </span>
              <Input type="number" defaultValue="2480" className="pl-7! pr-12!" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-muted">
                USD
              </span>
            </div>
          </label>
          <label className={label}>
            Percentage
            <div className="relative">
              <Input type="number" min="0" max="100" defaultValue="68" className="pr-8!" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted">
                %
              </span>
            </div>
          </label>
          <label className={label}>
            Postal code
            <Input inputMode="numeric" placeholder="94105" maxLength={10} />
          </label>
          <div className="rounded-lg border border-border bg-surface-alt p-3">
            <div className="flex items-center gap-2">
              <Smile size={14} className="text-accent" />
              <b className="text-[9px]">Input guidance</b>
            </div>
            <p className="mt-2 text-[8px] leading-4 text-muted">
              Masks provide visual formatting only and do not verify real phone numbers, postal
              codes, or payments.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
