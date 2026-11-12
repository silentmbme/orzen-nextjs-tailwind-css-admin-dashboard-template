"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  CreditCard,
  ImagePlus,
  ListOrdered,
  Package,
  RotateCcw,
  ShoppingCart,
  Truck,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const label = "grid gap-1.5 text-[9px] font-medium";
function Title({ number, title, note }: { number: string; title: string; note: string }) {
  return (
    <div className="mb-4 flex items-start gap-2.5">
      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent/10 text-accent">
        <ListOrdered size={12} />
      </span>
      <div>
        <span className="text-[7px] font-medium text-muted">WORKFLOW {number}</span>
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.04em]">{title}</h3>
        <p className="mt-0.5 text-[8px] text-muted">{note}</p>
      </div>
    </div>
  );
}
function Footer({
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
        {step === count - 1 ? "Restart demo" : "Continue"}
      </Button>
    </div>
  );
}

export function WizardBusinessExamples() {
  const [checkout, setCheckout] = useState(1),
    [registration, setRegistration] = useState(0),
    [onboarding, setOnboarding] = useState(1),
    [product, setProduct] = useState(0),
    [split, setSplit] = useState(1),
    [complete, setComplete] = useState(false);
  return (
    <div className="grid gap-3">
      <Card>
        <Title
          number="11"
          title="Checkout wizard"
          note="A wide checkout workflow with a fictional order summary and no payment processing."
        />
        <div className="mb-5 grid grid-cols-4 gap-1">
          {[
            [ShoppingCart, "Cart"],
            [Truck, "Shipping"],
            [CreditCard, "Payment"],
            [CheckCircle2, "Review"],
          ].map(([Icon, text], index) => {
            const I = Icon as typeof ShoppingCart;
            return (
              <button
                type="button"
                key={String(text)}
                onClick={() => setCheckout(index)}
                className={`flex items-center justify-center gap-1.5 border-b-2 px-2 py-2 text-[8px] ${checkout === index ? "border-accent text-accent" : index < checkout ? "border-success text-success" : "border-border text-muted"}`}
              >
                <I size={12} />
                <span className="hidden sm:inline">{String(text)}</span>
              </button>
            );
          })}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`${label} sm:col-span-2`}>
              Shipping address
              <Input placeholder="120 Market Street" />
            </label>
            <label className={label}>
              City
              <Input placeholder="San Francisco" />
            </label>
            <label className={label}>
              Postal code
              <Input placeholder="94105" />
            </label>
            <label className={label}>
              Delivery option
              <Select>
                <option>Standard · Free</option>
                <option>Express · $12</option>
              </Select>
            </label>
            <label className={label}>
              Contact phone
              <Input type="tel" placeholder="+1 555 014 228" />
            </label>
            <p className="text-[8px] text-muted sm:col-span-2">
              Demo checkout only. Do not enter real payment information.
            </p>
          </div>
          <aside className="rounded-xl border border-border bg-surface-alt p-4">
            <b className="text-[9px]">Order summary</b>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
                <Package size={16} />
              </span>
              <div className="flex-1">
                <b className="block text-[8px]">Studio headphones</b>
                <small className="text-[7px] text-muted">Qty 1</small>
              </div>
              <span className="text-[9px]">$129</span>
            </div>
            <div className="mt-4 grid gap-2 border-t border-border pt-3 text-[8px]">
              <span className="flex justify-between">
                Shipping <b>Free</b>
              </span>
              <span className="flex justify-between text-[10px]">
                Total <b>$129</b>
              </span>
            </div>
          </aside>
        </div>
        <Footer step={checkout} count={4} setStep={setCheckout} />
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <Title
            number="12"
            title="Registration wizard"
            note="Account, profile, preferences, and confirmation for a demo registration flow."
          />
          <div className="flex gap-1">
            {["Account", "Profile", "Preferences", "Confirm"].map((item, index) => (
              <button
                type="button"
                key={item}
                onClick={() => setRegistration(index)}
                className={`h-1.5 flex-1 rounded-full ${index <= registration ? "bg-accent" : "bg-surface-alt"}`}
                aria-label={item}
                aria-current={registration === index ? "step" : undefined}
              />
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className={label}>
              Work email
              <Input type="email" placeholder="name@company.com" />
            </label>
            <label className={label}>
              Password
              <Input type="password" />
            </label>
            <label className={`${label} sm:col-span-2`}>
              Account type
              <Select>
                <option>Team workspace</option>
                <option>Personal workspace</option>
              </Select>
            </label>
          </div>
          <p className="mt-3 text-[8px] text-muted">Demo UI only; no account will be created.</p>
          <Footer step={registration} count={4} setStep={setRegistration} />
        </Card>

        <Card className="overflow-hidden">
          <div className="grid sm:grid-cols-[.75fr_1.25fr]">
            <aside className="rounded-xl bg-accent p-4 text-white">
              <span className="text-[8px] opacity-80">ONBOARDING</span>
              <h3 className="mt-3 text-[14px] font-semibold">Welcome to your new workspace.</h3>
              <p className="mt-2 text-[8px] leading-4 opacity-80">
                A guided setup helps tailor the dashboard to your team.
              </p>
              <div className="mt-6 grid place-items-center">
                <div className="relative grid size-24 place-items-center rounded-full border border-white/25">
                  <div className="grid size-16 place-items-center rounded-full bg-white/10">
                    <UserRound size={24} />
                  </div>
                  <span className="absolute -right-1 top-3 grid size-6 place-items-center rounded-full bg-white text-[8px] text-accent">
                    {onboarding + 1}
                  </span>
                </div>
              </div>
            </aside>
            <div className="p-4">
              <Title
                number="13"
                title="Split onboarding wizard"
                note={`Step ${onboarding + 1} of 4`}
              />
              <div
                role="progressbar"
                aria-valuenow={onboarding + 1}
                aria-valuemin={1}
                aria-valuemax={4}
                className="h-1.5 rounded-full bg-surface-alt"
              >
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(onboarding + 1) * 25}%` }}
                />
              </div>
              <label className={`${label} mt-4`}>
                Primary goal
                <Select>
                  <option>Grow revenue</option>
                  <option>Improve operations</option>
                  <option>Launch products</option>
                </Select>
              </label>
              <label className={`${label} mt-3`}>
                Team size
                <Select>
                  <option>11–50 people</option>
                  <option>51–200 people</option>
                </Select>
              </label>
              <Footer step={onboarding} count={4} setStep={setOnboarding} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Title
          number="14"
          title="Product creation wizard"
          note="An editor-style workflow covering details, media, pricing, and review."
        />
        <div className="grid gap-4 lg:grid-cols-[190px_1fr]">
          <nav className="grid gap-1">
            {[
              [Package, "Product details"],
              [ImagePlus, "Media"],
              [CreditCard, "Pricing"],
              [CheckCircle2, "Review"],
            ].map(([Icon, text], index) => {
              const I = Icon as typeof Package;
              return (
                <button
                  type="button"
                  key={String(text)}
                  onClick={() => setProduct(index)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[8px] ${product === index ? "bg-accent/10 font-semibold text-accent" : index < product ? "text-success" : "text-muted hover:bg-surface-alt"}`}
                >
                  <span
                    className={`grid size-6 place-items-center rounded-md ${product === index ? "bg-accent text-white" : "bg-surface-alt"}`}
                  >
                    {index < product ? <Check size={10} /> : <I size={11} />}
                  </span>
                  {String(text)}
                </button>
              );
            })}
          </nav>
          <div className="rounded-xl border border-border p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${label} sm:col-span-2`}>
                Product name
                <Input placeholder="Wireless studio headphones" />
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
                Price
                <Input type="number" placeholder="129.00" />
              </label>
              <label className={label}>
                Inventory
                <Input type="number" placeholder="240" />
              </label>
            </div>
            <Footer step={product} count={4} setStep={setProduct} />
          </div>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
        <Card>
          <Title
            number="15"
            title="Split-screen process wizard"
            note="A descriptive step rail provides context beside the selected form."
          />
          <div className="grid overflow-hidden rounded-xl border border-border sm:grid-cols-[190px_1fr]">
            <aside className="bg-surface-alt p-3">
              {["Organization", "Access rules", "Notifications", "Review"].map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setSplit(index)}
                  className={`mb-1 w-full rounded-lg p-2.5 text-left ${split === index ? "bg-surface shadow-sm" : ""}`}
                >
                  <span className="flex items-center gap-2 text-[8px] font-medium">
                    <i
                      className={`size-2 rounded-full ${index < split ? "bg-success" : index === split ? "bg-accent" : "bg-border"}`}
                    />
                    {item}
                  </span>
                  <small className="ml-4 mt-1 block text-[7px] text-muted">
                    {index < split ? "Completed" : index === split ? "In progress" : "Upcoming"}
                  </small>
                </button>
              ))}
            </aside>
            <div className="p-4">
              <Badge>Step {split + 1}</Badge>
              <h3 className="mt-3 text-[11px] font-semibold">
                {
                  [
                    "Organization details",
                    "Configure access rules",
                    "Notification defaults",
                    "Review settings",
                  ][split]
                }
              </h3>
              <p className="mt-1 text-[8px] text-muted">
                Complete the current local preview before moving forward.
              </p>
              <Input className="mt-4" placeholder="Current step value" />
              <Footer step={split} count={4} setStep={setSplit} />
            </div>
          </div>
        </Card>

        <Card>
          <Title
            number="16"
            title="Review and completion"
            note="Summary, edit actions, completion feedback, and restart behavior."
          />
          {complete ? (
            <div className="grid place-items-center rounded-xl border border-success/30 bg-success/5 px-4 py-8 text-center">
              <span className="grid size-11 place-items-center rounded-full bg-success text-white">
                <CheckCircle2 size={21} />
              </span>
              <b className="mt-3 text-[11px]">Demo workflow complete</b>
              <p className="mt-1 max-w-xs text-[8px] leading-4 text-muted">
                No account, order, or payment was created. This is a local completion state.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() => setComplete(false)}
              >
                <RotateCcw size={11} />
                Restart demonstration
              </Button>
            </div>
          ) : (
            <div className="grid gap-2">
              <div className="rounded-lg border border-border p-3">
                <div className="flex justify-between">
                  <b className="text-[8px]">Workspace</b>
                  <button className="text-[7px] text-accent">Edit</button>
                </div>
                <p className="mt-1 text-[8px] text-muted">Northstar Studio · Growth plan</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex justify-between">
                  <b className="text-[8px]">Owner</b>
                  <button className="text-[7px] text-accent">Edit</button>
                </div>
                <p className="mt-1 text-[8px] text-muted">Sofia Garcia · Administrator</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="flex justify-between">
                  <b className="text-[8px]">Preferences</b>
                  <button className="text-[7px] text-accent">Edit</button>
                </div>
                <p className="mt-1 text-[8px] text-muted">Weekly digest · English</p>
              </div>
              <Button className="mt-2" onClick={() => setComplete(true)}>
                Complete local demo
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
