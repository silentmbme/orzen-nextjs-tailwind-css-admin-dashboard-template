"use client";

import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";

type Tone = "neutral" | "error" | "success" | "warning";
const toneClasses = {
  neutral: "",
  error: "border-danger!",
  success: "border-success!",
  warning: "border-amber-500!",
};
const textClasses = {
  neutral: "text-muted",
  error: "text-danger",
  success: "text-success",
  warning: "text-amber-600",
};

function StateField({
  id,
  label,
  value,
  note,
  tone = "neutral",
  required,
  disabled,
}: {
  id: string;
  label: string;
  value?: string;
  note: string;
  tone?: Tone;
  required?: boolean;
  disabled?: boolean;
}) {
  const Icon =
    tone === "error"
      ? AlertCircle
      : tone === "success"
        ? CheckCircle2
        : tone === "warning"
          ? TriangleAlert
          : Info;
  return (
    <label className="grid gap-1.5 text-[9px] font-medium" htmlFor={id}>
      {label}
      {required && <span className="sr-only">required</span>}
      <div className="relative">
        <Input
          id={id}
          value={value ?? ""}
          readOnly
          disabled={disabled}
          aria-invalid={tone === "error" || undefined}
          aria-describedby={`${id}-note`}
          className={`${toneClasses[tone]} pr-8!`}
        />
        <Icon
          size={12}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${textClasses[tone]}`}
        />
      </div>
      <span
        id={`${id}-note`}
        className={`flex items-center gap-1 text-[8px] font-normal ${textClasses[tone]}`}
      >
        {note}
      </span>
    </label>
  );
}

export function ValidationStates() {
  return (
    <div className="grid gap-3">
      <Card title="Required field states" action={<Badge>Comparison</Badge>}>
        <div className="grid gap-4 md:grid-cols-3">
          <StateField
            id="required-empty"
            label="Company name *"
            note="Company name is required."
            tone="error"
            required
          />
          <StateField
            id="required-corrected"
            label="Company name *"
            value="Northstar Labs"
            note="Required field is complete."
            tone="success"
            required
          />
          <StateField
            id="required-neutral"
            label="Department"
            value="Product design"
            note="Optional information."
          />
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <Card title="Email validation states">
          <div className="grid gap-4 sm:grid-cols-2">
            <StateField
              id="email-empty"
              label="Empty email"
              note="Email address is required."
              tone="error"
            />
            <StateField
              id="email-invalid"
              label="Invalid email"
              value="alex@company"
              note="Enter a complete email address."
              tone="error"
            />
            <StateField
              id="email-valid"
              label="Valid email"
              value="alex@company.com"
              note="Email format is valid."
              tone="success"
            />
            <StateField
              id="email-disabled"
              label="Disabled email"
              value="managed@company.com"
              note="Managed by your organization."
              disabled
            />
            <label className="grid gap-1.5 text-[9px] font-medium sm:col-span-2">
              Interactive focus state
              <Input type="email" placeholder="Focus to enter an email" />
              <span className="text-[8px] font-normal text-muted">
                The shared input focus ring remains visible.
              </span>
            </label>
          </div>
        </Card>
        <Card title="URL validation">
          <div className="grid gap-4">
            <StateField
              id="url-invalid"
              label="Invalid URL"
              value="company dot com"
              note="Use a complete URL such as https://company.com."
              tone="error"
            />
            <StateField
              id="url-valid"
              label="Valid HTTPS URL"
              value="https://orzen.dev"
              note="Secure URL format detected."
              tone="success"
            />
            <StateField
              id="url-optional"
              label="Optional website"
              note="Leave blank if no public website exists."
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Number and range validation">
          <div className="grid gap-4 sm:grid-cols-2">
            <StateField
              id="range-low"
              label="Team size · minimum 2"
              value="1"
              note="Value must be at least 2."
              tone="error"
            />
            <StateField
              id="range-high"
              label="Seats · maximum 500"
              value="820"
              note="Value cannot exceed 500."
              tone="error"
            />
            <StateField
              id="range-valid"
              label="Valid seat count"
              value="120"
              note="Value is within the allowed range."
              tone="success"
            />
            <StateField
              id="range-guide"
              label="Optional budget"
              value="25000"
              note="Enter a number between 1,000 and 100,000."
            />
          </div>
        </Card>
        <Card title="Success and warning feedback">
          <div className="grid gap-4">
            <div className="rounded-lg border border-success/30 bg-success/5 p-3">
              <div className="flex gap-2">
                <CheckCircle2 size={14} className="mt-0.5 text-success" />
                <div>
                  <b className="text-[9px]">Validated input group</b>
                  <p className="mt-1 text-[8px] text-muted">
                    All required business details have valid local formats.
                  </p>
                </div>
              </div>
            </div>
            <StateField
              id="warning-recommended"
              label="Recovery email"
              note="Recommended for account recovery."
              tone="warning"
            />
            <StateField
              id="warning-format"
              label="Display name"
              value="A"
              note="A longer name is easier for teammates to recognize."
              tone="warning"
            />
          </div>
        </Card>
      </div>

      <Card title="Checkbox and radio validation">
        <div className="grid gap-5 md:grid-cols-3">
          <fieldset aria-describedby="terms-error">
            <legend className="text-[9px] font-medium">Required agreement *</legend>
            <label className="mt-2 flex gap-2 text-[8px]">
              <input type="checkbox" aria-invalid="true" className="accent-[var(--color-accent)]" />
              I accept the workspace terms.
            </label>
            <p id="terms-error" className="mt-1.5 text-[8px] text-danger">
              Accept the terms to continue.
            </p>
          </fieldset>
          <fieldset>
            <legend className="text-[9px] font-medium">Valid agreement</legend>
            <label className="mt-2 flex gap-2 text-[8px]">
              <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />I
              accept the privacy policy.
            </label>
            <p className="mt-1.5 text-[8px] text-success">Agreement recorded locally.</p>
          </fieldset>
          <fieldset aria-describedby="contact-error">
            <legend className="text-[9px] font-medium">Preferred contact *</legend>
            <div className="mt-2 flex gap-4 text-[8px]">
              <label>
                <input
                  type="radio"
                  name="contact-state"
                  className="mr-1 accent-[var(--color-accent)]"
                />
                Email
              </label>
              <label>
                <input
                  type="radio"
                  name="contact-state"
                  className="mr-1 accent-[var(--color-accent)]"
                />
                Phone
              </label>
            </div>
            <p id="contact-error" className="mt-1.5 text-[8px] text-danger">
              Select one contact method.
            </p>
          </fieldset>
        </div>
      </Card>
    </div>
  );
}
