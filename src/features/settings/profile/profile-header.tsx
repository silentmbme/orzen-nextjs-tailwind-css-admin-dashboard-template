import Image from "next/image";
import {
  BriefcaseBusiness,
  MapPin,
  MoreHorizontal,
  Pencil,
  Share2,
  UserRoundPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ProfileData = {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  department: string;
  company: string;
  joined: string;
  experience: string;
  manager: string;
};

export const initialProfile: ProfileData = {
  name: "Alex Morgan",
  title: "Senior Product Designer",
  bio: "Product designer focused on turning complex operational workflows into clear, dependable experiences for growing teams.",
  email: "alex.morgan@orzen.dev",
  phone: "+44 7700 900 842",
  location: "London, United Kingdom",
  website: "alexmorgan.design",
  department: "Product Design",
  company: "Orzen Studio",
  joined: "August 2, 2023",
  experience: "8 years",
  manager: "Noah Williams",
};

const metrics = [
  { value: "28", label: "Projects", color: "bg-violet-500" },
  { value: "142", label: "Contributions", color: "bg-blue-500" },
  { value: "96%", label: "Delivery rate", color: "bg-emerald-500" },
  { value: "4.9", label: "Team rating", color: "bg-rose-500" },
];

export function ProfileHeader({ profile, onEdit }: { profile: ProfileData; onEdit: () => void }) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-card-border bg-surface">
      <div className="relative h-28 overflow-hidden border-b border-border bg-surface-alt sm:h-32">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute -left-16 -top-24 size-60 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-8 top-0 size-44 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute bottom-0 right-[30%] size-24 rounded-full bg-rose-500/10 blur-2xl" />
        <span className="absolute right-4 top-4 rounded-md border border-border bg-surface/80 px-2.5 py-1 text-[10px] text-muted backdrop-blur">
          Product Design · London
        </span>
      </div>

      <div className="relative px-4 pb-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative -mt-1 shrink-0 rounded-full border-[3px] border-surface bg-surface p-0.5">
            <Image
              src="/images/sales-team/alex-morgan.webp"
              alt={`${profile.name} profile portrait`}
              width={88}
              height={88}
              priority
              className="size-20 rounded-full object-cover"
            />
            <i
              className="absolute bottom-1 right-0 size-3.5 rounded-full border-[3px] border-surface bg-emerald-500"
              aria-label="Available"
            />
          </div>
          <div className="min-w-0 flex-1 pb-0.5 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[19px] font-semibold leading-tight tracking-tight">
                {profile.name}
              </h2>
              <Badge tone="success">Active</Badge>
            </div>
            <p className="mt-1 text-[12px] text-muted">{profile.title}</p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness size={11} className="text-violet-500" />
                {profile.department} · {profile.company}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={11} className="text-rose-500" />
                {profile.location}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2 pb-0.5">
            <Button variant="dark" onClick={onEdit}>
              <Pencil size={12} />
              Edit profile
            </Button>
            <details className="group relative">
              <summary
                className="ui-button ui-button--icon list-none cursor-pointer"
                aria-label="More profile actions"
              >
                <MoreHorizontal size={14} />
              </summary>
              <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-lg border border-border bg-surface p-1 shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] hover:bg-surface-alt"
                >
                  <Share2 size={12} />
                  Share profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[11px] hover:bg-surface-alt"
                >
                  <UserRoundPlus size={12} />
                  Add connection
                </button>
              </div>
            </details>
          </div>
        </div>

        <div className="mt-4 grid border-t border-border pt-3 sm:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 border-b border-border py-2 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:py-0 sm:first:pl-0 sm:last:border-r-0"
            >
              <i className={`h-7 w-1 rounded-full ${item.color}`} />
              <span>
                <strong className="block text-[16px] font-semibold leading-none">
                  {item.value}
                </strong>
                <small className="mt-1 block text-[9px] uppercase tracking-[.05em] text-muted">
                  {item.label}
                </small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
