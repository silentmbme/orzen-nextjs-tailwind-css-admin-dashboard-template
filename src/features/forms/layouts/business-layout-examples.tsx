"use client";

import {
  Building2,
  Check,
  CreditCard,
  FormInput,
  ImagePlus,
  Package,
  Settings2,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";

const label = "grid gap-1.5 text-[9px] font-medium";
const textarea = "ui-input min-h-24 w-full resize-y py-2.5";
function Title({ number, title, note }: { number: string; title: string; note: string }) {
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

export function BusinessLayoutExamples() {
  return (
    <div className="grid gap-3">
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[.75fr_1.25fr]">
          <aside className="-m-[var(--card-padding,0px)] border-b border-border bg-surface-alt p-5 lg:border-b-0 lg:border-r">
            <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
              <Building2 size={16} />
            </span>
            <Title
              number="09"
              title="Split-screen company form"
              note="Context and requirements remain visible beside the working form."
            />
            <p className="text-[9px] leading-5 text-muted">
              Create a verified company profile for invoices, team access, and compliance workflows.
            </p>
            <ul className="mt-4 grid gap-2 text-[8px]">
              {["Legal company details", "Verified business address", "Primary administrator"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="grid size-4 place-items-center rounded-full bg-success/10 text-success">
                      <Check size={9} />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
          </aside>
          <div className="p-1 lg:pl-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Legal name
                <Input placeholder="Northstar Labs Inc." />
              </label>
              <label className={label}>
                Registration number
                <Input placeholder="REG-204849" />
              </label>
              <label className={label}>
                Country
                <Select>
                  <option>United States</option>
                  <option>India</option>
                </Select>
              </label>
              <label className={label}>
                Industry
                <Select>
                  <option>Software</option>
                  <option>Financial services</option>
                </Select>
              </label>
              <label className={`${label} sm:col-span-2`}>
                Business address
                <Input placeholder="120 Market Street, San Francisco" />
              </label>
              <label className={label}>
                Administrator email
                <Input type="email" placeholder="admin@company.com" />
              </label>
              <label className={label}>
                Phone
                <Input type="tel" placeholder="+1 555 014 228" />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost">Save draft</Button>
              <Button>Continue verification</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <Title
            number="10"
            title="Profile settings"
            note="Identity, contact information, and biography in one balanced layout."
          />
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="shrink-0 text-center">
              <UserAvatar name="Sofia Garcia" size={72} />
              <Button size="sm" variant="outline" className="mt-2">
                Change photo
              </Button>
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <label className={label}>
                First name
                <Input defaultValue="Sofia" />
              </label>
              <label className={label}>
                Last name
                <Input defaultValue="Garcia" />
              </label>
              <label className={label}>
                Email
                <Input type="email" defaultValue="sofia@orzen.dev" />
              </label>
              <label className={label}>
                Role
                <Select>
                  <option>Product designer</option>
                  <option>Manager</option>
                </Select>
              </label>
              <label className={`${label} sm:col-span-2`}>
                Biography
                <textarea
                  className={textarea}
                  defaultValue="Designing calm, useful experiences for growing teams."
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Update profile</Button>
          </div>
        </Card>

        <Card>
          <Title
            number="11"
            title="Billing details"
            note="Payment and invoice information with a compact card preview."
          />
          <div className="mb-4 rounded-xl bg-foreground p-4 text-surface">
            <div className="flex justify-between">
              <CreditCard size={18} />
              <span className="text-[8px] opacity-70">BUSINESS</span>
            </div>
            <p className="mt-6 font-mono text-[12px] tracking-[.2em]">•••• •••• •••• 4281</p>
            <div className="mt-3 flex justify-between text-[8px]">
              <span>SOFIA GARCIA</span>
              <span>09/29</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`${label} sm:col-span-2`}>
              Cardholder name
              <Input defaultValue="Sofia Garcia" />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Card number
              <Input inputMode="numeric" placeholder="1234 5678 9012 3456" />
            </label>
            <label className={label}>
              Expiry
              <Input placeholder="MM / YY" />
            </label>
            <label className={label}>
              CVC
              <Input inputMode="numeric" placeholder="123" />
            </label>
          </div>
          <Button className="mt-4 w-full">Update payment method</Button>
        </Card>
      </div>

      <Card>
        <Title
          number="12"
          title="Product creation"
          note="Media, catalog details, pricing, and inventory arranged by task."
        />
        <div className="grid gap-5 xl:grid-cols-[240px_1fr]">
          <label className="grid min-h-56 cursor-pointer place-items-center rounded-xl border border-dashed border-border bg-surface-alt p-5 text-center hover:border-accent">
            <span>
              <ImagePlus size={24} className="mx-auto text-accent" />
              <b className="mt-3 block text-[9px]">Upload product media</b>
              <small className="mt-1 block text-[8px] text-muted">PNG or JPG up to 8 MB</small>
            </span>
            <input type="file" accept="image/*" className="sr-only" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className={`${label} sm:col-span-2 xl:col-span-3`}>
              Product name
              <Input placeholder="Wireless studio headphones" />
            </label>
            <label className={`${label} sm:col-span-2 xl:col-span-3`}>
              Description
              <textarea
                className={textarea}
                placeholder="Describe the product and its key benefits..."
              />
            </label>
            <label className={label}>
              Category
              <Select>
                <option>Electronics</option>
                <option>Accessories</option>
              </Select>
            </label>
            <label className={label}>
              SKU
              <Input placeholder="HD-2048" />
            </label>
            <label className={label}>
              Status
              <Select>
                <option>Draft</option>
                <option>Published</option>
              </Select>
            </label>
            <label className={label}>
              Price
              <Input type="number" placeholder="129.00" />
            </label>
            <label className={label}>
              Compare price
              <Input type="number" placeholder="159.00" />
            </label>
            <label className={label}>
              Inventory
              <Input type="number" placeholder="240" />
            </label>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline">Save draft</Button>
          <Button>
            <Package size={12} />
            Publish product
          </Button>
        </div>
      </Card>

      <Card>
        <Title
          number="13"
          title="Settings sidebar form"
          note="Local navigation keeps a long settings surface organized."
        />
        <div className="grid overflow-hidden rounded-xl border border-border lg:grid-cols-[190px_1fr]">
          <nav className="border-b border-border bg-surface-alt p-2 lg:border-b-0 lg:border-r">
            {[
              [UserRound, "General"],
              [ShieldCheck, "Security"],
              [Settings2, "Preferences"],
            ].map(([Icon, text], index) => {
              const I = Icon as typeof UserRound;
              return (
                <button
                  key={String(text)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[9px] ${index === 0 ? "bg-surface font-semibold text-accent" : "text-muted hover:bg-surface"}`}
                >
                  <I size={13} />
                  {String(text)}
                </button>
              );
            })}
          </nav>
          <div className="p-4">
            <div className="mb-4">
              <b className="text-[10px]">Workspace preferences</b>
              <p className="text-[8px] text-muted">Manage regional and communication defaults.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Workspace name
                <Input defaultValue="Orzen Studio" />
              </label>
              <label className={label}>
                Default language
                <Select>
                  <option>English</option>
                  <option>German</option>
                </Select>
              </label>
              <label className={label}>
                Timezone
                <Select>
                  <option>Asia / Kolkata</option>
                  <option>America / New York</option>
                </Select>
              </label>
              <label className={label}>
                Date format
                <Select>
                  <option>DD / MM / YYYY</option>
                  <option>MM / DD / YYYY</option>
                </Select>
              </label>
              <label className="flex items-start gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-0.5 accent-[var(--color-accent)]"
                />
                <span>
                  <b className="block text-[9px]">Weekly workspace digest</b>
                  <small className="text-[8px] text-muted">
                    A summary is delivered every Monday.
                  </small>
                </span>
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <Button>Save preferences</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <Title
            number="14"
            title="Modal form composition"
            note="A constrained dialog preview with clear header and footer actions."
          />
          <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            <div className="flex items-start justify-between border-b border-border p-4">
              <div>
                <b className="text-[11px]">Invite team member</b>
                <p className="mt-0.5 text-[8px] text-muted">
                  Send a local demonstration invitation.
                </p>
              </div>
              <button aria-label="Close preview" className="text-muted">
                <X size={14} />
              </button>
            </div>
            <div className="grid gap-4 p-4">
              <label className={label}>
                Email address
                <Input type="email" placeholder="name@company.com" />
              </label>
              <label className={label}>
                Access level
                <Select>
                  <option>Editor</option>
                  <option>Viewer</option>
                  <option>Administrator</option>
                </Select>
              </label>
              <label className={label}>
                Personal note
                <textarea className={textarea} placeholder="Add an optional welcome message..." />
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-border bg-surface-alt p-3">
              <Button variant="ghost">Cancel</Button>
              <Button>Send invitation</Button>
            </div>
          </div>
        </Card>

        <Card>
          <Title
            number="15"
            title="Multi-section account form"
            note="Section dividers create hierarchy without additional nested cards."
          />
          <div className="grid gap-5">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-accent/10 text-accent">
                  <UserRound size={13} />
                </span>
                <div>
                  <b className="block text-[9px]">Personal information</b>
                  <small className="text-[8px] text-muted">Your public account identity.</small>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={label}>
                  Full name
                  <Input defaultValue="Daniel Kim" />
                </label>
                <label className={label}>
                  Email
                  <Input type="email" defaultValue="daniel@orzen.dev" />
                </label>
              </div>
            </section>
            <section className="border-t border-border pt-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                  <ShieldCheck size={13} />
                </span>
                <div>
                  <b className="block text-[9px]">Security</b>
                  <small className="text-[8px] text-muted">Update account protection.</small>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={label}>
                  New password
                  <Input type="password" />
                </label>
                <label className={label}>
                  Confirm password
                  <Input type="password" />
                </label>
              </div>
            </section>
            <section className="border-t border-border pt-5">
              <label className="flex items-center justify-between gap-3">
                <span>
                  <b className="block text-[9px]">Two-factor authentication</b>
                  <small className="text-[8px] text-muted">
                    Require a verification code when signing in.
                  </small>
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 accent-[var(--color-accent)]"
                />
              </label>
            </section>
            <div className="flex justify-end">
              <Button>Save account</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Title
          number="16"
          title="Card-grouped organization form"
          note="Independent business domains are grouped while sharing one final action row."
        />
        <div className="grid gap-3 lg:grid-cols-3">
          <section className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={14} className="text-accent" />
              <b className="text-[9px]">Organization</b>
            </div>
            <div className="grid gap-3">
              <label className={label}>
                Business name
                <Input placeholder="Acme Studio" />
              </label>
              <label className={label}>
                Organization type
                <Select>
                  <option>Private company</option>
                  <option>Nonprofit</option>
                </Select>
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={14} className="text-blue-500" />
              <b className="text-[9px]">Tax and billing</b>
            </div>
            <div className="grid gap-3">
              <label className={label}>
                Tax ID
                <Input placeholder="TAX-2048" />
              </label>
              <label className={label}>
                Billing cycle
                <Select>
                  <option>Monthly</option>
                  <option>Annual</option>
                </Select>
              </label>
            </div>
          </section>
          <section className="rounded-xl border border-border p-4">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-success" />
              <b className="text-[9px]">Governance</b>
            </div>
            <div className="grid gap-3">
              <label className={label}>
                Data region
                <Select>
                  <option>United States</option>
                  <option>European Union</option>
                </Select>
              </label>
              <label className="flex gap-2 text-[8px]">
                <input type="checkbox" defaultChecked className="accent-[var(--color-accent)]" />
                Enforce workspace SSO
              </label>
            </div>
          </section>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-[8px] text-muted">
            Changes are shown as a local design preview.
          </span>
          <div className="flex gap-2">
            <Button variant="outline">Discard</Button>
            <Button>Save organization</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
