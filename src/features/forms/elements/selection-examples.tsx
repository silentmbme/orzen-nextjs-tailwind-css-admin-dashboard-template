"use client";

import { useState } from "react";
import { Bell, Check, Cloud, Code2, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const controlLabel = "flex cursor-pointer items-start gap-2.5 text-[9px]";

function Switch({
  checked,
  onChange,
  label,
  description,
  size = "md",
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}) {
  const sizes = {
    sm: "h-4 w-7 after:size-3 after:translate-x-0.5 data-[checked=true]:after:translate-x-3",
    md: "h-5 w-9 after:size-4 after:translate-x-0.5 data-[checked=true]:after:translate-x-4",
    lg: "h-6 w-11 after:size-5 after:translate-x-0.5 data-[checked=true]:after:translate-x-5",
  };
  return (
    <label
      className={`flex items-start justify-between gap-3 ${disabled ? "opacity-45" : "cursor-pointer"}`}
    >
      <span>
        <b className="block text-[9px]">{label}</b>
        {description && <small className="mt-0.5 block text-[8px] text-muted">{description}</small>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-checked={checked}
        onClick={onChange}
        className={`relative shrink-0 rounded-full bg-surface-alt transition after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:rounded-full after:bg-white after:shadow-sm after:transition data-[checked=true]:bg-accent ${sizes[size]}`}
      />
    </label>
  );
}

export function SelectionExamples() {
  const [checks, setChecks] = useState(["Analytics", "Reports"]);
  const [plan, setPlan] = useState("Growth");
  const [toggles, setToggles] = useState({
    email: true,
    push: false,
    security: true,
    digest: false,
  });
  const flip = (key: keyof typeof toggles) =>
    setToggles((value) => ({ ...value, [key]: !value[key] }));
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Select controls" action={<Badge>9 patterns</Badge>}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-[9px]">
              Native select
              <Select defaultValue="design">
                <option value="design">Design team</option>
                <option value="engineering">Engineering</option>
                <option value="product">Product</option>
              </Select>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Grouped select
              <Select>
                <optgroup label="Americas">
                  <option>United States</option>
                  <option>Canada</option>
                </optgroup>
                <optgroup label="Europe">
                  <option>United Kingdom</option>
                  <option>Germany</option>
                </optgroup>
              </Select>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Searchable combobox
              <Input list="workspace-options" placeholder="Search workspace..." />
              <datalist id="workspace-options">
                <option value="Orzen Studio" />
                <option value="Orzen Labs" />
                <option value="Northstar Team" />
              </datalist>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Select with icon
              <div className="relative">
                <Cloud size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Select className="pl-8!" defaultValue="production">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </Select>
              </div>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Owner with avatar
              <div className="relative">
                <UserRound
                  size={12}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <Select className="pl-8!">
                  <option>Alex Morgan</option>
                  <option>Sofia Garcia</option>
                  <option>Daniel Kim</option>
                </Select>
              </div>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Error state
              <Select aria-invalid="true" className="border-danger!" defaultValue="">
                <option value="" disabled>
                  Select a region
                </option>
                <option>North America</option>
              </Select>
              <span className="text-[8px] text-danger">A region is required.</span>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Disabled select
              <Select disabled>
                <option>Unavailable</option>
              </Select>
            </label>
            <label className="grid gap-1.5 text-[9px]">
              Multi-select
              <select multiple defaultValue={["sales", "crm"]} className="ui-select min-h-20 py-1">
                <option value="sales">Sales</option>
                <option value="crm">CRM</option>
                <option value="commerce">Commerce</option>
                <option value="ai">AI</option>
              </select>
            </label>
          </div>
        </Card>

        <Card title="Checkbox patterns" action={<Badge>{checks.length} selected</Badge>}>
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {["Analytics", "Reports", "Automation"].map((item) => (
                <label key={item} className={controlLabel}>
                  <input
                    type="checkbox"
                    checked={checks.includes(item)}
                    onChange={() =>
                      setChecks((value) =>
                        value.includes(item)
                          ? value.filter((entry) => entry !== item)
                          : [...value, item],
                      )
                    }
                    className="mt-0.5 size-4 accent-[var(--color-accent)]"
                  />
                  <span>
                    <b className="block">{item}</b>
                    <small className="text-[8px] text-muted">Enable workspace access</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer gap-3 rounded-lg border border-accent bg-accent/5 p-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <span>
                  <b className="block text-[9px]">Priority support</b>
                  <small className="text-[8px] text-muted">
                    Faster responses from specialists.
                  </small>
                </span>
              </label>
              <label className="flex cursor-pointer gap-3 rounded-lg border border-border p-3">
                <input type="checkbox" className="mt-0.5 accent-[var(--color-accent)]" />
                <span>
                  <b className="block text-[9px]">Weekly review</b>
                  <small className="text-[8px] text-muted">Receive a Monday summary.</small>
                </span>
              </label>
            </div>
            <div className="flex flex-wrap gap-5 border-t border-border pt-3">
              <label className={controlLabel}>
                <input type="checkbox" />
                Unchecked
              </label>
              <label className={controlLabel}>
                <input type="checkbox" defaultChecked />
                Checked
              </label>
              <label className={`${controlLabel} opacity-45`}>
                <input type="checkbox" disabled />
                Disabled
              </label>
              <label className={controlLabel}>
                <input
                  ref={(node) => {
                    if (node) node.indeterminate = true;
                  }}
                  type="checkbox"
                />
                Indeterminate
              </label>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.1fr_.9fr]">
        <Card title="Radio selections" action={<Badge>{plan}</Badge>}>
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-5">
              {["Monthly", "Quarterly", "Annually"].map((item) => (
                <label key={item} className={controlLabel}>
                  <input
                    type="radio"
                    name="billing"
                    defaultChecked={item === "Monthly"}
                    className="accent-[var(--color-accent)]"
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {[
                ["Starter", "For small teams", "$19"],
                ["Growth", "For scaling teams", "$49"],
                ["Enterprise", "Advanced controls", "Custom"],
              ].map(([name, note, price]) => (
                <label
                  key={name}
                  className={`cursor-pointer rounded-lg border p-3 transition ${plan === name ? "border-accent bg-accent/5" : "border-border hover:bg-surface-alt"}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={name}
                    checked={plan === name}
                    onChange={() => setPlan(name)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between">
                    <span>
                      <b className="block text-[10px]">{name}</b>
                      <small className="text-[8px] text-muted">{note}</small>
                    </span>
                    {plan === name && (
                      <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
                        <Check size={10} />
                      </span>
                    )}
                  </span>
                  <strong className="mt-3 block text-[13px]">{price}</strong>
                </label>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                [Code2, "Developer"],
                [ShieldCheck, "Security"],
                [Smartphone, "Mobile"],
              ].map(([Icon, name]) => {
                const I = Icon as typeof Code2;
                return (
                  <label
                    key={String(name)}
                    className="cursor-pointer rounded-lg border border-border p-3 text-center hover:border-accent"
                  >
                    <input type="radio" name="role" className="sr-only" />
                    <I size={16} className="mx-auto text-accent" />
                    <b className="mt-2 block text-[9px]">{String(name)}</b>
                  </label>
                );
              })}
            </div>
          </div>
        </Card>

        <Card title="Switches and settings">
          <div className="grid gap-4">
            <Switch
              checked={toggles.email}
              onChange={() => flip("email")}
              label="Email notifications"
              description="Receive activity and account updates."
            />
            <Switch
              checked={toggles.push}
              onChange={() => flip("push")}
              label="Push notifications"
              description="Show alerts on registered devices."
              size="sm"
            />
            <Switch
              checked={toggles.security}
              onChange={() => flip("security")}
              label="Security alerts"
              description="Important authentication changes."
              size="lg"
            />
            <Switch
              checked={false}
              onChange={() => undefined}
              label="Disabled setting"
              description="Managed by an administrator."
              disabled
            />
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <div className="mb-3 flex items-center gap-2">
                <Bell size={13} className="text-accent" />
                <b className="text-[9px]">Channel settings</b>
              </div>
              <div className="grid gap-3">
                <Switch
                  checked={toggles.digest}
                  onChange={() => flip("digest")}
                  label="Weekly digest"
                />
                <Switch
                  checked={toggles.email}
                  onChange={() => flip("email")}
                  label="Product announcements"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
