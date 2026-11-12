"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  CheckCircle2,
  FileCheck2,
  ListOrdered,
  Settings2,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const accountSteps = ["Account", "Profile", "Preferences", "Complete"];
function Title({ number, title, note }: { number: string; title: string; note: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
        <ListOrdered size={12} />
      </span>
      <div>
        <span className="text-[7px] font-medium text-muted">PATTERN {number}</span>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.04em]">{title}</h3>
        <p className="mt-0.5 text-[8px] text-muted">{note}</p>
      </div>
    </div>
  );
}
function Actions({
  step,
  count,
  setStep,
}: {
  step: number;
  count: number;
  setStep: (value: number) => void;
}) {
  return (
    <div className="mt-4 flex justify-between border-t border-border pt-3">
      <Button size="sm" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
        Back
      </Button>
      <Button size="sm" onClick={() => setStep(step === count - 1 ? 0 : step + 1)}>
        {step === count - 1 ? "Restart demo" : "Next step"}
      </Button>
    </div>
  );
}

export function WizardVariations() {
  const [horizontal, setHorizontal] = useState(1),
    [vertical, setVertical] = useState(1),
    [iconStep, setIconStep] = useState(1),
    [progress, setProgress] = useState(1),
    [pill, setPill] = useState(1),
    [visual, setVisual] = useState(1);
  return (
    <div className="grid gap-3">
      <Card>
        <Title
          number="01"
          title="Numbered horizontal wizard"
          note="Completed, active, and upcoming states share a connected progress line."
        />
        <div className="flex">
          {accountSteps.map((item, index) => (
            <button
              type="button"
              key={item}
              onClick={() => setHorizontal(index)}
              aria-current={horizontal === index ? "step" : undefined}
              className="relative flex flex-1 flex-col items-center"
            >
              <span
                className={`relative z-10 grid size-7 place-items-center rounded-full border text-[8px] ${index < horizontal ? "border-accent bg-accent text-white" : index === horizontal ? "border-accent bg-surface text-accent" : "border-border bg-surface text-muted"}`}
              >
                {index < horizontal ? <Check size={10} /> : index + 1}
              </span>
              {index < accountSteps.length - 1 && (
                <i
                  className={`absolute left-1/2 top-3.5 h-px w-full ${index < horizontal ? "bg-accent" : "bg-border"}`}
                />
              )}
              <span className="mt-2 text-[8px] font-medium">{item}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[9px]">
            Display name
            <Input placeholder="Sofia Garcia" />
          </label>
          <label className="grid gap-1.5 text-[9px]">
            Account role
            <Select>
              <option>Administrator</option>
              <option>Editor</option>
            </Select>
          </label>
        </div>
        <Actions step={horizontal} count={4} setStep={setHorizontal} />
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <Title
            number="02"
            title="Vertical connected stepper"
            note="Persistent step navigation sits beside current content."
          />
          <div className="grid gap-4 sm:grid-cols-[145px_1fr]">
            <nav>
              {["Personal information", "Employment", "Documents", "Review"].map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setVertical(index)}
                  aria-current={vertical === index ? "step" : undefined}
                  className="relative flex w-full items-start gap-2 pb-5 text-left"
                >
                  <span
                    className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border text-[7px] ${index < vertical ? "border-success bg-success text-white" : index === vertical ? "border-accent bg-accent text-white" : "border-border bg-surface"}`}
                  >
                    {index < vertical ? <Check size={9} /> : index + 1}
                  </span>
                  {index < 3 && (
                    <i className="absolute left-3 top-6 h-[calc(100%-24px)] w-px bg-border" />
                  )}
                  <span className="pt-1 text-[8px]">{item}</span>
                </button>
              ))}
            </nav>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <Badge>Step {vertical + 1}</Badge>
              <b className="mt-3 block text-[10px]">
                {
                  ["Personal details", "Employment profile", "Document checklist", "Final review"][
                    vertical
                  ]
                }
              </b>
              <p className="mt-1 text-[8px] leading-4 text-muted">
                This local preview updates as you select each connected step.
              </p>
              <Input className="mt-3 bg-surface!" placeholder="Current step field" />
              <Actions step={vertical} count={4} setStep={setVertical} />
            </div>
          </div>
        </Card>

        <Card>
          <Title
            number="03"
            title="Icon-based wizard"
            note="Lucide icons make each workflow stage immediately recognizable."
          />
          <div className="grid grid-cols-4 gap-2">
            {[
              [UserRound, "User"],
              [Building2, "Company"],
              [Settings2, "Settings"],
              [CheckCircle2, "Done"],
            ].map(([Icon, text], index) => {
              const I = Icon as typeof UserRound;
              return (
                <button
                  type="button"
                  key={String(text)}
                  onClick={() => setIconStep(index)}
                  aria-current={iconStep === index ? "step" : undefined}
                  className={`grid place-items-center rounded-lg border p-3 text-[7px] ${iconStep === index ? "border-accent bg-accent/5 text-accent" : index < iconStep ? "border-success/30 text-success" : "border-border text-muted"}`}
                >
                  <I size={15} />
                  <span className="mt-1.5">{String(text)}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-surface-alt p-3">
            <b className="text-[9px]">
              {
                [
                  "Create user identity",
                  "Add company details",
                  "Choose preferences",
                  "Review summary",
                ][iconStep]
              }
            </b>
            <p className="mt-1 text-[8px] text-muted">Step {iconStep + 1} of 4</p>
          </div>
          <Actions step={iconStep} count={4} setStep={setIconStep} />
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <Title
            number="04"
            title="Progress bar wizard"
            note="Percentage and step count update from local state."
          />
          <div className="flex justify-between text-[8px]">
            <span>Step {progress + 1} of 4</span>
            <b>{Math.round(((progress + 1) / 4) * 100)}%</b>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress + 1}
            aria-valuemin={1}
            aria-valuemax={4}
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-alt"
          >
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${((progress + 1) / 4) * 100}%` }}
            />
          </div>
          <div className="mt-4 rounded-lg border border-border p-3">
            <b className="text-[9px]">{accountSteps[progress]}</b>
            <p className="mt-1 text-[8px] text-muted">Complete the fields for this stage.</p>
          </div>
          <Actions step={progress} count={4} setStep={setProgress} />
        </Card>

        <Card>
          <Title
            number="05"
            title="Pill stepper"
            note="Segmented navigation provides a compact tab-like treatment."
          />
          <div className="flex overflow-x-auto rounded-lg bg-surface-alt p-1">
            {["Details", "Members", "Rules"].map((item, index) => (
              <button
                type="button"
                key={item}
                onClick={() => setPill(index)}
                aria-current={pill === index ? "step" : undefined}
                className={`min-w-20 flex-1 rounded-md px-3 py-2 text-[8px] ${pill === index ? "bg-accent text-white" : index < pill ? "text-success" : "text-muted"}`}
              >
                {index < pill ? "✓ " : ""}
                {item}
              </button>
            ))}
          </div>
          <Input className="mt-4" placeholder={`${["Workspace", "Member", "Rule"][pill]} name`} />
          <Actions step={pill} count={3} setStep={setPill} />
        </Card>

        <Card>
          <Title
            number="06"
            title="Arrow stepper"
            note="Chevron segments communicate forward movement without images."
          />
          <div className="flex overflow-x-auto">
            {["Draft", "Configure", "Verify", "Launch"].map((item, index) => (
              <button
                type="button"
                key={item}
                onClick={() => setVisual(index)}
                className={`min-w-20 flex-1 px-3 py-2 text-[7px] [clip-path:polygon(0_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,0_100%,8px_50%)] first:[clip-path:polygon(0_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,0_100%)] ${visual === index ? "bg-accent text-white" : index < visual ? "bg-success/15 text-success" : "bg-surface-alt text-muted"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="mt-4 text-[8px] text-muted">
            Current segment:{" "}
            <b className="text-foreground">{["Draft", "Configure", "Verify", "Launch"][visual]}</b>
          </p>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <Title
            number="07"
            title="Minimal underline wizard"
            note="Text labels and a fine underline create a lightweight pattern."
          />
          <div className="flex border-b border-border">
            {["Basics", "Content", "Visibility", "Review"].map((item, index) => (
              <button
                type="button"
                key={item}
                onClick={() => setVisual(index)}
                className={`relative flex-1 px-2 py-2 text-[8px] ${visual === index ? "font-semibold text-accent after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-accent" : index < visual ? "text-success" : "text-muted"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="py-4">
            <Input placeholder="Lightweight step content" />
          </div>
        </Card>

        <Card>
          <Title
            number="08"
            title="Card-based wizard"
            note="Large selectable cards explain each workspace setup stage."
          />
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              [UserRound, "Team details", "Name and roles"],
              [Settings2, "Project settings", "Defaults and access"],
              [FileCheck2, "Invite members", "Add collaborators"],
            ].map(([Icon, title, note], index) => {
              const I = Icon as typeof UserRound;
              return (
                <button
                  type="button"
                  key={String(title)}
                  onClick={() => setVisual(index)}
                  className={`rounded-xl border p-3 text-left ${visual === index ? "border-accent bg-accent/5" : "border-border"}`}
                >
                  <I size={15} className="text-accent" />
                  <b className="mt-3 block text-[9px]">{String(title)}</b>
                  <small className="text-[7px] text-muted">{String(note)}</small>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <Title
            number="09"
            title="Timeline wizard"
            note="Milestones read naturally as a connected operational history."
          />
          <div className="grid gap-0">
            {["Started", "Details completed", "Verification", "Finished"].map((item, index) => (
              <div key={item} className="relative flex gap-3 pb-5 last:pb-0">
                <span
                  className={`relative z-10 grid size-6 place-items-center rounded-full border ${index < 2 ? "border-success bg-success text-white" : index === 2 ? "border-accent bg-accent text-white" : "border-border bg-surface"}`}
                >
                  {index < 2 ? <Check size={9} /> : index + 1}
                </span>
                {index < 3 && (
                  <i className="absolute left-3 top-6 h-[calc(100%-24px)] w-px bg-border" />
                )}
                <div>
                  <b className="text-[8px]">{item}</b>
                  <p className="text-[7px] text-muted">
                    {index < 2
                      ? "Completed locally"
                      : index === 2
                        ? "Current milestone"
                        : "Not started"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <Title
            number="10"
            title="Compact dot wizard"
            note="A minimal indicator suited to modals and onboarding panels."
          />
          <div className="flex items-center justify-center gap-2 py-5">
            {[0, 1, 2, 3, 4].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => setVisual(item)}
                aria-label={`Step ${item + 1}`}
                className={`rounded-full transition-all ${visual === item ? "h-2.5 w-7 bg-accent" : item < visual ? "size-2.5 bg-success" : "size-2.5 bg-border"}`}
              />
            ))}
          </div>
          <p className="text-center text-[8px] text-muted">Step {visual + 1} of 5</p>
        </Card>
      </div>
    </div>
  );
}
