"use client";
import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Cloud,
  Download,
  FileText,
  Pause,
  Play,
  RefreshCw,
  Server,
  Upload,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";

function Bar({
  value,
  color = "bg-accent",
  height = "h-2",
  label,
}: {
  value: number;
  color?: string;
  height?: string;
  label: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={`${height} overflow-hidden rounded-full bg-surface-alt`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
function Ring({
  value,
  color = "var(--color-accent)",
  size = 88,
  label,
}: {
  value: number;
  color?: string;
  size?: number;
  label: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className="relative grid place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} ${value}%, var(--color-border) 0)`,
      }}
    >
      <span
        className="grid place-items-center rounded-full bg-surface"
        style={{ width: size - 18, height: size - 18 }}
      >
        <b className="text-[12px]">{value}%</b>
      </span>
    </div>
  );
}
export function ProgressShowcase() {
  const [upload, setUpload] = useState(38),
    [running, setRunning] = useState(false),
    [step, setStep] = useState(2),
    [goal, setGoal] = useState(68);
  return (
    <div className="grid gap-3">
      <Card title="Basic progress bars" action={<Badge>Linear</Badge>}>
        <div className="grid gap-5">
          {[
            ["Project setup", 24],
            ["Design review", 58],
            ["Release readiness", 82],
            ["Deployment", 100],
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>{label}</span>
                <b>{value}%</b>
              </div>
              <Bar value={Number(value)} label={String(label)} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Color variants">
          <div className="grid gap-4">
            {[
              ["Primary", 72, "bg-accent"],
              ["Success", 88, "bg-success"],
              ["Warning", 56, "bg-amber-500"],
              ["Danger", 34, "bg-danger"],
              ["Information", 64, "bg-blue-500"],
            ].map(([label, value, color]) => (
              <div
                key={String(label)}
                className="grid grid-cols-[72px_1fr_32px] items-center gap-3"
              >
                <span className="text-[8px] text-muted">{String(label)}</span>
                <Bar value={Number(value)} color={String(color)} label={`${label} progress`} />
                <b className="text-right text-[8px]">{value}%</b>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Size variants">
          <div className="grid gap-5">
            {[
              ["Extra small", "h-1", 28],
              ["Small", "h-1.5", 46],
              ["Default", "h-2", 64],
              ["Large", "h-3", 78],
              ["Extra large", "h-4", 92],
            ].map(([label, height, value]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between text-[8px] text-muted">
                  <span>{String(label)}</span>
                  <span>{value}%</span>
                </div>
                <Bar value={Number(value)} height={String(height)} label={`${label} progress`} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Soft progress">
          <div className="rounded-xl bg-accent/8 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] text-muted">Monthly target</p>
                <b className="mt-1 block text-[17px]">$68,400</b>
              </div>
              <Badge tone="success">+12.8%</Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-accent/15">
              <div className="h-full w-[74%] rounded-full bg-accent" />
            </div>
            <p className="mt-2 text-[8px] text-muted">74% of $92,000 target</p>
          </div>
        </Card>
        <Card title="Striped progress">
          <div className="grid gap-4">
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Processing</span>
                <span>65%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-alt">
                <div className="h-full w-[65%] rounded-full bg-[repeating-linear-gradient(135deg,var(--color-accent)_0,var(--color-accent)_6px,transparent_6px,transparent_10px)] bg-accent/40" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-[9px]">
                <span>Optimizing assets</span>
                <span>42%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-surface-alt">
                <div className="h-full w-[42%] animate-pulse rounded-full bg-[repeating-linear-gradient(135deg,var(--color-success)_0,var(--color-success)_6px,transparent_6px,transparent_10px)] bg-success/40 motion-reduce:animate-none" />
              </div>
            </div>
          </div>
        </Card>
        <Card title="Progress with label">
          <div className="grid gap-4">
            <div className="relative h-6 overflow-hidden rounded-md bg-surface-alt">
              <div className="h-full w-[72%] bg-accent" />
              <span className="absolute inset-0 grid place-items-center text-[8px] font-semibold mix-blend-difference text-white">
                72% complete
              </span>
            </div>
            <div className="relative h-8 overflow-hidden rounded-lg border border-border bg-surface-alt">
              <div className="h-full w-[48%] bg-success/20" />
              <span className="absolute inset-0 flex items-center justify-between px-3 text-[8px]">
                <b>48 of 100 tasks</b>
                <span>48%</span>
              </span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Segmented progress" action={<Badge>Milestones</Badge>}>
        <div className="grid gap-5">
          <div>
            <div className="mb-2 flex justify-between text-[9px]">
              <span>Onboarding completion</span>
              <b>4 of 6</b>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 rounded-full ${index < 4 ? "bg-accent" : index === 4 ? "bg-accent/35" : "bg-surface-alt"}`}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-[9px]">
              <span>Password strength</span>
              <b className="text-success">Strong</b>
            </div>
            <div className="flex gap-1">
              {["bg-success", "bg-success", "bg-success", "bg-success", "bg-surface-alt"].map(
                (color, index) => (
                  <span key={index} className={`h-1.5 flex-1 rounded ${color}`} />
                ),
              )}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[82, 62, 100, 44, 72, 91, 55].map((value, index) => (
              <div key={index} className="grid gap-1">
                <div className="flex h-12 items-end rounded bg-surface-alt">
                  <span
                    className={`w-full rounded ${value >= 80 ? "bg-success" : value >= 60 ? "bg-accent" : "bg-amber-500"}`}
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span className="text-center text-[7px] text-muted">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Circular progress">
          <div className="flex items-center justify-around">
            <Ring value={72} label="72 percent complete" />
            <div>
              <b className="text-[11px]">Profile setup</b>
              <p className="mt-1 text-[8px] leading-4 text-muted">Complete two more fields.</p>
              <button className="mt-2 text-[8px] font-medium text-accent">Continue setup</button>
            </div>
          </div>
        </Card>
        <Card title="Ring variants">
          <div className="flex items-center justify-around">
            <Ring value={86} color="var(--color-success)" size={70} label="Success 86 percent" />
            <Ring value={62} color="#3b82f6" size={70} label="Information 62 percent" />
            <Ring value={38} color="var(--color-danger)" size={70} label="Danger 38 percent" />
          </div>
        </Card>
        <Card title="Multi-ring">
          <div className="relative mx-auto size-24">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(var(--color-accent) 78%,var(--color-border) 0)",
              }}
            />
            <div className="absolute inset-2 rounded-full bg-surface" />
            <div
              className="absolute inset-3 rounded-full"
              style={{
                background: "conic-gradient(var(--color-success) 56%,var(--color-border) 0)",
              }}
            />
            <div className="absolute inset-5 grid place-items-center rounded-full bg-surface">
              <b className="text-[10px]">78%</b>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-3 text-[7px] text-muted">
            <span>● Revenue</span>
            <span>● Orders</span>
          </div>
        </Card>
        <Card title="Gauge progress">
          <div className="relative mx-auto h-14 w-28 overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 aspect-square rounded-full"
              style={{
                background:
                  "conic-gradient(from 270deg,var(--color-accent) 0 68%,var(--color-border) 68% 100%)",
              }}
            />
            <div className="absolute left-3 right-3 top-3 aspect-square rounded-full bg-surface" />
            <b className="absolute inset-x-0 bottom-0 text-center text-[13px]">68%</b>
          </div>
          <p className="mt-3 text-center text-[8px] text-muted">Performance score</p>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Interactive upload" action={<Badge>{running ? "Uploading" : "Paused"}</Badge>}>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
              <FileText size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <b className="block truncate text-[9px]">orzen-assets.zip</b>
              <span className="text-[7px] text-muted">24.8 MB of 64.2 MB</span>
            </div>
            <b className="text-[10px]">{upload}%</b>
          </div>
          <div className="mt-4">
            <Bar value={upload} label="File upload progress" />
          </div>
          <input
            aria-label="Upload progress"
            type="range"
            min="0"
            max="100"
            value={upload}
            onChange={(event) => setUpload(Number(event.target.value))}
            className="mt-4 w-full accent-[var(--color-accent)]"
          />
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                setRunning(!running);
                if (!running) setUpload(Math.min(100, upload + 12));
              }}
            >
              {running ? (
                <>
                  <Pause size={11} />
                  Pause
                </>
              ) : (
                <>
                  <Play size={11} />
                  Resume
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setUpload(0);
                setRunning(false);
              }}
            >
              <RefreshCw size={11} />
              Reset
            </Button>
          </div>
        </Card>
        <Card title="File transfers">
          <div className="grid gap-3">
            {[
              [Upload, "dashboard-assets.zip", 82, "bg-accent"],
              [Download, "quarterly-report.pdf", 100, "bg-success"],
              [Cloud, "customer-backup.json", 46, "bg-blue-500"],
            ].map(([Icon, name, value, color]) => {
              const I = Icon as typeof Upload;
              return (
                <div key={String(name)} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <I size={13} className="text-muted" />
                    <span className="flex-1 truncate text-[9px]">{String(name)}</span>
                    {Number(value) === 100 ? (
                      <CheckCircle2 size={13} className="text-success" />
                    ) : (
                      <span className="text-[8px] text-muted">{Number(value)}%</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <Bar
                      value={Number(value)}
                      color={String(color)}
                      height="h-1"
                      label={`${name} transfer`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Step progress" action={<Badge>Step {step} of 4</Badge>}>
          <div className="flex">
            {[1, 2, 3, 4].map((number) => (
              <button
                key={number}
                onClick={() => setStep(number)}
                className="relative flex flex-1 justify-center"
              >
                <span
                  className={`relative z-10 grid size-7 place-items-center rounded-full border text-[8px] ${number < step ? "border-accent bg-accent text-white" : number === step ? "border-accent bg-surface text-accent" : "border-border bg-surface text-muted"}`}
                >
                  {number < step ? <Check size={10} /> : number}
                </span>
                {number < 4 && (
                  <i
                    className={`absolute left-1/2 top-3.5 h-px w-full ${number < step ? "bg-accent" : "bg-border"}`}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[7px] text-muted">
            <span>Details</span>
            <span>Review</span>
            <span>Payment</span>
            <span>Finish</span>
          </div>
        </Card>
        <Card title="Storage usage">
          <div className="flex items-center gap-4">
            <span className="grid size-11 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
              <Server size={19} />
            </span>
            <div className="flex-1">
              <div className="flex justify-between">
                <b className="text-[9px]">68.4 GB used</b>
                <span className="text-[8px] text-muted">100 GB</span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface-alt">
                <span className="w-[38%] bg-accent" />
                <span className="w-[19%] bg-blue-500" />
                <span className="w-[11%] bg-rose-500" />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-[7px] text-muted">
            <span>● Files</span>
            <span>● Media</span>
            <span>● Other</span>
          </div>
        </Card>
        <Card title="Live goal">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[8px] text-muted">Quarterly goal</span>
              <b className="mt-1 block text-[17px]">${goal}k</b>
            </div>
            <Badge tone={goal >= 80 ? "success" : "neutral"}>{goal}%</Badge>
          </div>
          <div className="mt-4">
            <Bar value={goal} label="Quarterly goal progress" />
          </div>
          <input
            aria-label="Goal progress"
            type="range"
            value={goal}
            onChange={(event) => setGoal(Number(event.target.value))}
            className="mt-4 w-full accent-[var(--color-accent)]"
          />
        </Card>
      </div>

      <Card title="Project completion">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex justify-between text-[9px]">
              <b>Mobile application launch</b>
              <span className="text-muted">24 of 32 tasks</span>
            </div>
            <div className="mt-3">
              <Bar value={75} height="h-2.5" label="Project completion" />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-[8px] text-muted">
              <span>
                Design <b className="text-success">100%</b>
              </span>
              <span>
                Development <b className="text-accent">78%</b>
              </span>
              <span>
                Testing <b className="text-amber-500">42%</b>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Ring value={75} size={72} label="Project 75 percent complete" />
            <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
              <Zap size={14} />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
