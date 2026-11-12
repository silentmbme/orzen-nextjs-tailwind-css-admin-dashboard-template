"use client";

import { Filter, FormInput, Mail, Search, Send, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="grid gap-1.5 text-[9px] font-medium">
      {label}
      {children}
      {hint && <span className="text-[8px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

function SectionTitle({ number, title, note }: { number: string; title: string; note: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
        <FormInput size={12} />
      </span>
      <div>
        <span className="text-[7px] font-medium text-muted">SECTION {number}</span>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.04em]">{title}</h3>
        <p className="mt-0.5 text-[8px] text-muted">{note}</p>
      </div>
    </div>
  );
}

export function BasicLayoutExamples() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle
            number="01"
            title="Vertical form"
            note="A focused single-column form with a stable action footer."
          />
          <div className="mx-auto grid max-w-md gap-4">
            <Field label="Workspace name">
              <Input placeholder="Northstar Studio" />
            </Field>
            <Field label="Workspace URL" hint="You can change this later.">
              <div className="flex">
                <span className="grid place-items-center rounded-l-lg border border-r-0 border-border bg-surface-alt px-3 text-[8px] text-muted">
                  orzen.app/
                </span>
                <Input placeholder="northstar" className="rounded-l-none!" />
              </div>
            </Field>
            <Field label="Team size">
              <Select defaultValue="11-50">
                <option>1-10</option>
                <option value="11-50">11-50</option>
                <option>51-200</option>
              </Select>
            </Field>
            <label className="flex items-start gap-2 text-[8px] text-muted">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 accent-[var(--color-accent)]"
              />
              Allow product updates and onboarding tips.
            </label>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost">Cancel</Button>
              <Button>Create workspace</Button>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle
            number="02"
            title="Horizontal form"
            note="Labels align consistently beside controls on wide screens."
          />
          <div className="grid gap-4">
            {[
              ["Display name", "Sofia Garcia"],
              ["Job title", "Product designer"],
              ["Department", "Design systems"],
            ].map(([label, value]) => (
              <label key={label} className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:items-center">
                <span className="text-[9px] font-medium">{label}</span>
                <Input defaultValue={value} />
              </label>
            ))}
            <label className="grid gap-1.5 sm:grid-cols-[120px_1fr] sm:items-center">
              <span className="text-[9px] font-medium">Timezone</span>
              <Select defaultValue="ist">
                <option value="ist">India Standard Time</option>
                <option>Pacific Time</option>
                <option>Central European Time</option>
              </Select>
            </label>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline">Reset</Button>
              <Button>Save changes</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="grid gap-6 xl:grid-cols-[1fr_auto_1fr]">
          <div>
            <SectionTitle
              number="03"
              title="Two-column form"
              note="Balanced columns for related account information."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <Input defaultValue="Alex" />
              </Field>
              <Field label="Last name">
                <Input defaultValue="Morgan" />
              </Field>
              <Field label="Work email">
                <Input type="email" defaultValue="alex@orzen.dev" />
              </Field>
              <Field label="Phone">
                <Input type="tel" placeholder="+1 555 012 400" />
              </Field>
              <Field label="Role">
                <Select>
                  <option>Administrator</option>
                  <option>Editor</option>
                </Select>
              </Field>
              <Field label="Status">
                <Select>
                  <option>Active</option>
                  <option>Invited</option>
                </Select>
              </Field>
            </div>
          </div>
          <div className="hidden w-px bg-border xl:block" />
          <div>
            <SectionTitle
              number="04"
              title="Three-column form"
              note="Dense business data arranged for efficient scanning."
            />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Company">
                <Input placeholder="Acme Inc." />
              </Field>
              <Field label="Industry">
                <Select>
                  <option>Technology</option>
                  <option>Finance</option>
                </Select>
              </Field>
              <Field label="Employees">
                <Select>
                  <option>50-100</option>
                  <option>100-500</option>
                </Select>
              </Field>
              <Field label="Country">
                <Select>
                  <option>United States</option>
                  <option>India</option>
                </Select>
              </Field>
              <Field label="Tax ID">
                <Input placeholder="US-204829" />
              </Field>
              <Field label="Currency">
                <Select>
                  <option>USD</option>
                  <option>EUR</option>
                </Select>
              </Field>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline">Save draft</Button>
          <Button>Continue</Button>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <Card>
          <SectionTitle
            number="05"
            title="Compact inline forms"
            note="Small task forms keep fields and actions aligned."
          />
          <div className="grid gap-3">
            <form className="flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
              <div className="relative min-w-52 flex-1">
                <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input type="email" placeholder="Email for newsletter" className="pl-8!" />
              </div>
              <Button type="submit">
                <Send size={12} />
                Subscribe
              </Button>
            </form>
            <form className="flex flex-wrap gap-2" onSubmit={(event) => event.preventDefault()}>
              <Input placeholder="teammate@company.com" className="min-w-52 flex-1" />
              <Select className="sm:w-36">
                <option>Editor</option>
                <option>Viewer</option>
              </Select>
              <Button type="submit" variant="outline">
                <UserPlus size={12} />
                Invite
              </Button>
            </form>
            <form
              className="flex flex-wrap gap-2 rounded-lg bg-surface-alt p-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="relative min-w-48 flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input placeholder="Search records" className="bg-surface! pl-8!" />
              </div>
              <Select className="sm:w-32">
                <option>All status</option>
                <option>Active</option>
              </Select>
              <Button type="submit">
                <Filter size={12} />
                Apply
              </Button>
            </form>
          </div>
        </Card>

        <Card>
          <SectionTitle
            number="06"
            title="Action-aligned form"
            note="Primary and secondary actions remain visually distinct."
          />
          <div className="grid gap-4">
            <Field label="Report name">
              <Input defaultValue="Quarterly revenue" />
            </Field>
            <Field label="Format">
              <div className="grid grid-cols-3 gap-2">
                {["PDF", "CSV", "XLSX"].map((item) => (
                  <label
                    key={item}
                    className="cursor-pointer rounded-lg border border-border p-2 text-center text-[8px] has-[:checked]:border-accent has-[:checked]:bg-accent/5"
                  >
                    <input
                      type="radio"
                      name="format"
                      defaultChecked={item === "PDF"}
                      className="sr-only"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">Preview</Button>
              <Button>Generate</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <SectionTitle
            number="07"
            title="Floating-label form"
            note="Labels transition safely without overlapping entered content."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["float-name", "Name", "text"],
              ["float-email", "Email", "email"],
              ["float-password", "Password", "password"],
              ["float-company", "Company", "text"],
            ].map(([id, label, type]) => (
              <div key={id} className="relative">
                <Input id={id} type={type} placeholder=" " className="peer h-12! pt-4!" />
                <label
                  htmlFor={id}
                  className="pointer-events-none absolute left-3 top-2.5 text-[7px] text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[9px] peer-focus:top-2.5 peer-focus:text-[7px] peer-focus:text-accent"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Create account</Button>
          </div>
        </Card>

        <Card>
          <SectionTitle
            number="08"
            title="Responsive filter toolbar"
            note="Controls wrap naturally without losing hierarchy on small screens."
          />
          <div className="rounded-xl border border-border bg-surface-alt p-3">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[1fr_130px_130px_auto]">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input placeholder="Search customers" className="bg-surface! pl-8!" />
              </div>
              <Select className="bg-surface!">
                <option>All segments</option>
                <option>Enterprise</option>
              </Select>
              <Select className="bg-surface!">
                <option>Last 30 days</option>
                <option>This quarter</option>
              </Select>
              <Button>
                <Filter size={12} />
                Filter
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[8px] text-muted">Active filters:</span>
              <Badge>Enterprise ×</Badge>
              <Badge>Active ×</Badge>
              <button className="text-[8px] text-accent">Clear all</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
