"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Clock3,
  FileArchive,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { EditProfileDialog } from "./edit-profile-dialog";
import { ProfileActivity } from "./profile-activity";
import { initialProfile, ProfileHeader, type ProfileData } from "./profile-header";

const projects = [
  {
    name: "Mobile experience launch",
    description: "Responsive onboarding and daily operations for distributed teams.",
    status: "On track",
    progress: 76,
    due: "Dec 18",
    bar: "bg-violet-500",
    team: ["Alex Morgan", "Sofia Garcia", "Daniel Kim"],
  },
  {
    name: "Design system 2.0",
    description: "Accessible patterns, governance, and shared design tokens.",
    status: "In review",
    progress: 88,
    due: "Nov 28",
    bar: "bg-blue-500",
    team: ["Alex Morgan", "Priya Shah"],
  },
  {
    name: "Customer insights",
    description: "Research synthesis for priority customer workflows.",
    status: "Planning",
    progress: 34,
    due: "Jan 12",
    bar: "bg-rose-500",
    team: ["Priya Shah", "Sofia Garcia"],
  },
];

const team = [
  { name: "Sofia Garcia", role: "Operations Lead", online: true },
  { name: "Priya Shah", role: "Growth Manager", online: true },
  { name: "Daniel Kim", role: "Engineering Lead", online: false },
  { name: "Maya Thompson", role: "Research Director", online: true },
];

const files = [
  {
    name: "Mobile research summary",
    size: "4.8 MB",
    date: "Nov 7",
    type: "PDF",
    icon: FileText,
    color: "bg-rose-500/10 text-rose-500",
  },
  {
    name: "Design system audit",
    size: "18.2 MB",
    date: "Nov 5",
    type: "ZIP",
    icon: FileArchive,
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    name: "Workshop notes",
    size: "1.6 MB",
    date: "Nov 2",
    type: "PDF",
    icon: FileText,
    color: "bg-blue-500/10 text-blue-500",
  },
];

const contactItems: Array<{
  icon: LucideIcon;
  label: string;
  key: keyof ProfileData;
  color: string;
}> = [
  { icon: Mail, label: "Email address", key: "email", color: "bg-violet-500/10 text-violet-500" },
  { icon: Phone, label: "Phone", key: "phone", color: "bg-blue-500/10 text-blue-500" },
  { icon: MapPin, label: "Location", key: "location", color: "bg-rose-500/10 text-rose-500" },
  { icon: Globe2, label: "Website", key: "website", color: "bg-cyan-500/10 text-cyan-500" },
];

export function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [editing, setEditing] = useState(false);

  return (
    <div className="grid min-w-0 gap-widget">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <PageHeader title="User Profile" />
          <p className="mt-1 text-[11px] text-muted">
            Manage professional information and workspace activity.
          </p>
        </div>
      </div>

      <ProfileHeader profile={profile} onEdit={() => setEditing(true)} />

      <div className="grid min-w-0 items-start gap-widget xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-widget">
          <Card title="Profile overview" icon={UserRound}>
            <p className="max-w-3xl text-[12px] leading-5 text-muted">{profile.bio}</p>
            <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
              {contactItems.map(({ icon: Icon, label, key, color }) => (
                <div key={label} className="flex min-w-0 items-center gap-2.5 py-1">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-md ${color}`}>
                    <Icon size={13} />
                  </span>
                  <span className="min-w-0">
                    <small className="block text-[9px] uppercase tracking-[.04em] text-muted">
                      {label}
                    </small>
                    <b className="mt-0.5 block truncate text-[11px] font-medium">{profile[key]}</b>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Professional information" icon={BriefcaseBusiness}>
            <div className="grid md:grid-cols-2">
              <section className="pb-4 md:border-r md:border-border md:pb-0 md:pr-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-md bg-violet-500/10 text-violet-500">
                    <UserRound size={13} />
                  </span>
                  <div>
                    <b className="block text-[11px]">Personal details</b>
                    <span className="text-[9px] text-muted">Identity and contact</span>
                  </div>
                </div>
                <Details
                  rows={[
                    ["Full name", profile.name],
                    ["Email", profile.email],
                    ["Phone", profile.phone],
                    ["Location", profile.location],
                  ]}
                />
              </section>
              <section className="border-t border-border pt-4 md:border-t-0 md:pl-5 md:pt-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-md bg-blue-500/10 text-blue-500">
                    <BriefcaseBusiness size={13} />
                  </span>
                  <div>
                    <b className="block text-[11px]">Employment details</b>
                    <span className="text-[9px] text-muted">Role and organization</span>
                  </div>
                </div>
                <Details
                  rows={[
                    ["Job title", profile.title],
                    ["Department", profile.department],
                    ["Experience", profile.experience],
                    ["Manager", profile.manager],
                  ]}
                />
              </section>
            </div>
          </Card>

          <Card
            title="Projects & contributions"
            icon={BriefcaseBusiness}
            action={<Badge>{projects.length} active</Badge>}
          >
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <article key={project.name} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <i className={`size-2 rounded-full ${project.bar}`} />
                        <h3 className="text-[12px] font-semibold">{project.name}</h3>
                      </div>
                      <p className="mt-1 pl-4 text-[10px] text-muted">{project.description}</p>
                    </div>
                    <Badge tone={project.status === "On track" ? "success" : "neutral"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="mt-3 grid items-center gap-3 pl-4 sm:grid-cols-[minmax(160px,1fr)_auto_auto]">
                    <div>
                      <div className="mb-1 flex justify-between text-[9px]">
                        <span className="text-muted">Progress</span>
                        <b>{project.progress}%</b>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface-alt">
                        <div
                          className={`h-full rounded-full ${project.bar}`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {project.team.map((name) => (
                        <UserAvatar
                          key={name}
                          name={name}
                          size={26}
                          className="border-2 border-surface"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[9px] text-muted">
                      <Clock3 size={10} />
                      Due {project.due}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </Card>

          <Card
            title="Team & connections"
            icon={UsersRound}
            action={<Badge>{team.length} people</Badge>}
          >
            <div className="grid gap-x-5 sm:grid-cols-2">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center gap-3 border-b border-border py-3"
                >
                  <span className="relative">
                    <UserAvatar name={member.name} size={36} />
                    <i
                      className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface ${member.online ? "bg-emerald-500" : "bg-muted"}`}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-[11px]">{member.name}</b>
                    <span className="text-[9px] text-muted">{member.role}</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="grid gap-widget">
          <Card title="Account overview" icon={ShieldCheck}>
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <div className="grid size-[76px] shrink-0 place-items-center rounded-full bg-[conic-gradient(var(--color-accent)_0_86%,var(--color-border)_86%)]">
                <span className="grid size-[60px] place-items-center rounded-full bg-surface text-center">
                  <span>
                    <b className="block text-[17px]">86%</b>
                    <small className="text-[8px] text-muted">COMPLETE</small>
                  </span>
                </span>
              </div>
              <div className="min-w-0">
                <b className="text-[12px]">Profile strength</b>
                <p className="mt-1 text-[10px] leading-4 text-muted">
                  Add one portfolio link to complete your professional profile.
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 text-[10px]">
              {[
                ["Account", "Active"],
                ["Workspace role", "Administrator"],
                ["Member since", "Aug 2023"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <span className="text-muted">{label}</span>
                  <b className="font-medium">{value}</b>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={() => setEditing(true)}>
              Complete profile
            </Button>
          </Card>

          <ProfileActivity />

          <Card title="Skills & expertise">
            <div className="grid gap-4">
              {[
                {
                  group: "Product design",
                  skills: ["Interaction", "Prototyping", "Systems"],
                  level: 92,
                  color: "bg-violet-500",
                },
                {
                  group: "Research",
                  skills: ["Interviews", "Journeys", "Testing"],
                  level: 78,
                  color: "bg-blue-500",
                },
                {
                  group: "Collaboration",
                  skills: ["Facilitation", "Mentoring", "Strategy"],
                  level: 86,
                  color: "bg-rose-500",
                },
              ].map((item) => (
                <div key={item.group}>
                  <div className="flex justify-between text-[10px]">
                    <b>{item.group}</b>
                    <span className="text-muted">{item.level}%</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-alt">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent files">
            <div className="divide-y divide-border">
              {files.map(({ name, size, date, type, icon: Icon, color }) => (
                <div key={name} className="flex items-center gap-2.5 py-3 first:pt-0 last:pb-0">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-md ${color}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-[10px]">{name}</b>
                    <span className="text-[9px] text-muted">
                      {size} · {date}
                    </span>
                  </div>
                  <Badge>{type}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      {editing && (
        <EditProfileDialog
          open
          profile={profile}
          onClose={() => setEditing(false)}
          onSave={(value) => {
            setProfile(value);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function Details({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl className="grid gap-2.5">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 border-b border-border pb-2 text-[10px] last:border-0 last:pb-0"
        >
          <dt className="text-muted">{label}</dt>
          <dd className="truncate font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
