"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Link2,
  Mail,
  Search,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/showcase-card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const labelClass = "mb-1.5 block text-[9px] font-medium";
const textareaClass = "ui-input min-h-24 w-full resize-y py-2.5";

export function InputExamples() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [bio, setBio] = useState("Building thoughtful products for modern teams.");
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-3">
      <Card title="Text input variations">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FormField label="Default input" htmlFor="default-input">
            <Input id="default-input" placeholder="Enter a value" />
          </FormField>
          <FormField label="Outlined input" htmlFor="outlined-input">
            <Input
              id="outlined-input"
              defaultValue="Outlined field"
              className="border-foreground/25!"
            />
          </FormField>
          <FormField label="Filled input" htmlFor="filled-input">
            <Input
              id="filled-input"
              defaultValue="Filled field"
              className="border-transparent! bg-surface-alt!"
            />
          </FormField>
          <FormField label="Underlined input" htmlFor="underlined-input">
            <Input
              id="underlined-input"
              placeholder="Underlined field"
              className="rounded-none! border-x-0! border-t-0! bg-transparent! px-0!"
            />
          </FormField>
          <FormField label="Small input" htmlFor="small-input">
            <Input id="small-input" placeholder="Small" className="h-8! text-[8px]!" />
          </FormField>
          <FormField label="Medium input" htmlFor="medium-input">
            <Input id="medium-input" placeholder="Medium" />
          </FormField>
          <FormField label="Large input" htmlFor="large-input">
            <Input id="large-input" placeholder="Large" className="h-12! text-[11px]!" />
          </FormField>
          <FormField label="Pill input" htmlFor="pill-input">
            <Input id="pill-input" placeholder="Rounded pill" className="rounded-full! px-4!" />
          </FormField>
          <div className="relative pt-2">
            <Input id="floating-input" placeholder=" " className="peer pt-4!" />
            <label
              htmlFor="floating-input"
              className="pointer-events-none absolute left-3 top-5 text-[9px] text-muted transition-all peer-placeholder-shown:top-[22px] peer-placeholder-shown:text-[10px] peer-focus:top-3 peer-focus:text-[7px] peer-focus:text-accent"
            >
              Floating label
            </label>
          </div>
          <FormField label="Leading icon" htmlFor="leading-input">
            <div className="relative">
              <UserRound
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <Input id="leading-input" placeholder="Account owner" className="pl-8!" />
            </div>
          </FormField>
          <FormField label="Trailing action" htmlFor="password-input">
            <div className="relative">
              <Input
                id="password-input"
                type={passwordVisible ? "text" : "password"}
                defaultValue="securepass"
                className="pr-9!"
              />
              <button
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {passwordVisible ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </FormField>
          <FormField label="Prefix and suffix" htmlFor="domain-input">
            <div className="flex">
              <span className="grid place-items-center rounded-l-lg border border-r-0 border-border bg-surface-alt px-3 text-[8px] text-muted">
                https://
              </span>
              <Input id="domain-input" defaultValue="orzen" className="rounded-none!" />
              <span className="grid place-items-center rounded-r-lg border border-l-0 border-border bg-surface-alt px-3 text-[8px] text-muted">
                .app
              </span>
            </div>
          </FormField>
          <FormField label="Disabled" htmlFor="disabled-input">
            <Input id="disabled-input" disabled value="Unavailable value" readOnly />
          </FormField>
          <FormField
            label="Read-only"
            htmlFor="readonly-input"
            hint="This value is managed by your workspace."
          >
            <Input id="readonly-input" readOnly value="ORG-2048" />
          </FormField>
          <FormField label="Success state" htmlFor="success-input">
            <div className="relative">
              <Input
                id="success-input"
                defaultValue="Available username"
                className="border-success! pr-8!"
                aria-describedby="success-note"
              />
              <CheckCircle2
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
              />
            </div>
            <span id="success-note" className="mt-1 block text-[8px] text-success">
              Username is available.
            </span>
          </FormField>
          <FormField label="Warning state" htmlFor="warning-input">
            <div className="relative">
              <Input
                id="warning-input"
                defaultValue="Storage near limit"
                className="border-amber-500! pr-8!"
              />
              <TriangleAlert
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500"
              />
            </div>
            <span className="mt-1 block text-[8px] text-amber-600">Review before continuing.</span>
          </FormField>
          <FormField label="Error state" htmlFor="error-input">
            <Input
              id="error-input"
              defaultValue="invalid@email"
              className="border-danger!"
              aria-invalid="true"
              aria-describedby="error-note"
            />
            <span id="error-note" className="mt-1 block text-[8px] text-danger">
              Enter a valid email address.
            </span>
          </FormField>
          <FormField label="Character counter" htmlFor="counter-input">
            <Input
              id="counter-input"
              maxLength={40}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Short workspace name"
            />
            <span className="mt-1 block text-right text-[8px] text-muted">{message.length}/40</span>
          </FormField>
        </div>
      </Card>

      <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
        <Card title="Special input types">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField label="Email" htmlFor="email">
              <div className="relative">
                <Mail size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input id="email" type="email" placeholder="name@company.com" className="pl-8!" />
              </div>
            </FormField>
            <FormField label="Search" htmlFor="search">
              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input id="search" type="search" placeholder="Search records" className="pl-8!" />
              </div>
            </FormField>
            <FormField label="Telephone" htmlFor="telephone">
              <Input id="telephone" type="tel" placeholder="+1 555 014 228" />
            </FormField>
            <FormField label="Number" htmlFor="number">
              <Input id="number" type="number" min="0" max="100" defaultValue="42" />
            </FormField>
            <FormField label="URL" htmlFor="url">
              <div className="relative">
                <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <Input id="url" type="url" placeholder="https://example.com" className="pl-8!" />
              </div>
            </FormField>
            <FormField label="Currency" htmlFor="currency">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] text-muted">
                  $
                </span>
                <Input id="currency" type="number" defaultValue="1280" className="pl-7!" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-muted">
                  USD
                </span>
              </div>
            </FormField>
            <FormField label="Percentage" htmlFor="percentage">
              <div className="relative">
                <Input id="percentage" type="number" defaultValue="68" className="pr-8!" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted">
                  %
                </span>
              </div>
            </FormField>
            <FormField label="Color" htmlFor="color">
              <Input id="color" type="color" defaultValue="#8b5cf6" className="h-10! p-1!" />
            </FormField>
            <FormField label="File" htmlFor="file">
              <Input
                id="file"
                type="file"
                className="py-2! text-[8px]! file:mr-2 file:rounded file:border-0 file:bg-accent/10 file:px-2 file:py-1 file:text-[8px] file:text-accent"
              />
            </FormField>
            <FormField label="Date" htmlFor="date">
              <Input id="date" type="date" defaultValue="2026-11-09" />
            </FormField>
            <FormField label="Time" htmlFor="time">
              <Input id="time" type="time" defaultValue="10:30" />
            </FormField>
            <FormField label="Month" htmlFor="month">
              <Input id="month" type="month" defaultValue="2026-11" />
            </FormField>
          </div>
        </Card>

        <Card title="OTP and PIN">
          <div className="grid gap-5">
            <div>
              <span className={labelClass}>Six-digit verification code</span>
              <div className="grid grid-cols-6 gap-2">
                {[4, 8, 2, 9, 1, 6].map((digit, index) => (
                  <Input
                    key={index}
                    aria-label={`Digit ${index + 1}`}
                    inputMode="numeric"
                    maxLength={1}
                    defaultValue={digit}
                    className="h-11! px-0! text-center! text-[13px]! font-semibold"
                  />
                ))}
              </div>
              <p className="mt-2 text-[8px] text-muted">
                A verification code was sent to your registered device.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface-alt p-3">
              <b className="text-[9px]">Secure PIN</b>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <span
                    key={item}
                    className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-[13px]"
                  >
                    •
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Textarea variations">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className={labelClass} htmlFor="textarea-default">
              Default textarea
            </label>
            <textarea
              id="textarea-default"
              className={textareaClass}
              placeholder="Write a project note..."
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="textarea-filled">
              Filled textarea
            </label>
            <textarea
              id="textarea-filled"
              className={`${textareaClass} border-transparent! bg-surface-alt!`}
              defaultValue="A filled surface distinguishes longer content."
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="textarea-count">
              Character count
            </label>
            <textarea
              id="textarea-count"
              className={textareaClass}
              maxLength={160}
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
            <span className="mt-1 block text-right text-[8px] text-muted">{bio.length}/160</span>
          </div>
          <div className="relative pt-2">
            <textarea
              id="textarea-floating"
              className={`${textareaClass} peer pt-5!`}
              placeholder=" "
            />
            <label
              htmlFor="textarea-floating"
              className="pointer-events-none absolute left-3 top-5 text-[9px] text-muted transition-all peer-placeholder-shown:top-6 peer-focus:top-3 peer-focus:text-[7px] peer-focus:text-accent"
            >
              Floating message
            </label>
          </div>
          <div>
            <label className={labelClass} htmlFor="textarea-error">
              Error textarea
            </label>
            <textarea
              id="textarea-error"
              className={`${textareaClass} border-danger!`}
              defaultValue="Too short"
              aria-invalid="true"
            />
            <span className="mt-1 text-[8px] text-danger">Provide at least 20 characters.</span>
          </div>
          <div>
            <label className={labelClass} htmlFor="textarea-disabled">
              Disabled textarea
            </label>
            <textarea
              id="textarea-disabled"
              className={textareaClass}
              disabled
              defaultValue="Editing has been disabled."
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
