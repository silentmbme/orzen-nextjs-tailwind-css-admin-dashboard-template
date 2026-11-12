"use client";
import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  location: string;
  status: "Available" | "In a meeting" | "On leave";
  email: string;
  phone: string;
  joined: string;
  manager: string;
  projects: string[];
  skills: string[];
};
const employees: Employee[] = [
  {
    id: "EMP-1042",
    name: "Sofia Garcia",
    title: "Operations Lead",
    department: "Customer Operations",
    location: "Barcelona, Spain",
    status: "Available",
    email: "sofia.garcia@orzen.dev",
    phone: "+34 612 480 214",
    joined: "March 14, 2022",
    manager: "Maya Thompson",
    projects: ["Customer 360", "Renewal intelligence"],
    skills: ["Operations", "Service design", "Analytics", "Leadership"],
  },
  {
    id: "EMP-1068",
    name: "Alex Morgan",
    title: "Senior Product Designer",
    department: "Product Design",
    location: "London, UK",
    status: "In a meeting",
    email: "alex.morgan@orzen.dev",
    phone: "+44 7700 900 842",
    joined: "August 02, 2023",
    manager: "Noah Williams",
    projects: ["Mobile launch", "Design system"],
    skills: ["Product design", "Prototyping", "Research", "Accessibility"],
  },
  {
    id: "EMP-1091",
    name: "Priya Shah",
    title: "Growth Manager",
    department: "Growth & Lifecycle",
    location: "Mumbai, India",
    status: "Available",
    email: "priya.shah@orzen.dev",
    phone: "+91 98204 28410",
    joined: "January 19, 2024",
    manager: "Olivia Chen",
    projects: ["Lifecycle automation", "Expansion signals"],
    skills: ["Growth strategy", "CRM", "Experimentation", "SQL"],
  },
];
const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-3 text-[12px]";
export function EmployeeExpansionTable() {
  const [open, setOpen] = useState<string | null>(employees[0].id);
  return (
    <Card
      title="Employee profile expansion"
      icon={UserRoundCheck}
      action={<Badge>People directory</Badge>}
    >
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <caption className="sr-only">Expandable employee directory</caption>
          <thead>
            <tr>
              {["Employee", "Designation", "Department", "Location", "Status", ""].map(
                (label, index) => (
                  <th key={`${label}-${index}`} scope="col" className={th}>
                    {label}
                    <span className="sr-only">{index === 5 ? "Expand profile" : ""}</span>
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const expanded = open === employee.id,
                panel = `profile-${employee.id}`;
              return (
                <ProfileRows
                  key={employee.id}
                  employee={employee}
                  expanded={expanded}
                  panel={panel}
                  toggle={() => setOpen(expanded ? null : employee.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function ProfileRows({
  employee,
  expanded,
  panel,
  toggle,
}: {
  employee: Employee;
  expanded: boolean;
  panel: string;
  toggle: () => void;
}) {
  return (
    <>
      <tr className={`border-t border-border ${expanded ? "bg-accent/5" : "hover:bg-surface-alt"}`}>
        <td className={td}>
          <span className="flex items-center gap-3">
            <span className="relative">
              <UserAvatar name={employee.name} size={34} />
              <i
                className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-surface ${employee.status === "Available" ? "bg-success" : employee.status === "On leave" ? "bg-muted" : "bg-amber-500"}`}
              />
            </span>
            <span>
              <b className="block font-medium">{employee.name}</b>
              <small className="text-[10px] text-muted">{employee.id}</small>
            </span>
          </span>
        </td>
        <td className={td}>{employee.title}</td>
        <td className={td}>{employee.department}</td>
        <td className={`${td} text-muted`}>{employee.location}</td>
        <td className={td}>
          <Badge tone={employee.status === "Available" ? "success" : "neutral"}>
            {employee.status}
          </Badge>
        </td>
        <td className={`${td} text-right`}>
          <Button
            size="icon"
            variant="ghost"
            aria-label={`${expanded ? "Collapse" : "Expand"} profile for ${employee.name}`}
            aria-expanded={expanded}
            aria-controls={panel}
            onClick={toggle}
          >
            <ChevronDown
              size={14}
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </Button>
        </td>
      </tr>
      {expanded && (
        <tr id={panel}>
          <td colSpan={6} className="border-t border-border bg-accent/[.035] p-0">
            <div className="grid gap-5 p-5 md:grid-cols-[280px_1fr]">
              <section className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start gap-4">
                  <UserAvatar
                    name={employee.name}
                    size={72}
                    className="ring-2 ring-accent/20 ring-offset-2 ring-offset-surface"
                  />
                  <div className="min-w-0">
                    <Badge tone={employee.status === "Available" ? "success" : "neutral"}>
                      {employee.status}
                    </Badge>
                    <h3 className="mt-2 truncate text-[15px] font-semibold">{employee.name}</h3>
                    <p className="text-[11px] text-muted">{employee.title}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 border-t border-border pt-4 text-[11px]">
                  <Contact icon={Mail}>{employee.email}</Contact>
                  <Contact icon={Phone}>{employee.phone}</Contact>
                  <Contact icon={MapPin}>{employee.location}</Contact>
                </div>
              </section>
              <section className="grid content-start gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Meta icon={BriefcaseBusiness} label="Department" value={employee.department} />
                  <Meta icon={CalendarDays} label="Joining date" value={employee.joined} />
                  <Meta icon={UserRoundCheck} label="Reporting manager" value={employee.manager} />
                  <Meta icon={Clock3} label="Availability" value={employee.status} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <b className="text-[11px]">Current projects</b>
                    <div className="mt-2 grid gap-2">
                      {employee.projects.map((project, index) => (
                        <div
                          key={project}
                          className="flex items-center justify-between text-[10px]"
                        >
                          <span>{project}</span>
                          <Badge>{index === 0 ? "Primary" : "Supporting"}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-3">
                    <b className="text-[11px]">Skills</b>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {employee.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-border bg-surface-alt px-2 py-1 text-[10px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
function Contact({ icon: Icon, children }: { icon: typeof Mail; children: React.ReactNode }) {
  return (
    <span className="flex min-w-0 items-center gap-2 text-muted">
      <Icon size={12} className="shrink-0 text-accent" />
      <span className="truncate">{children}</span>
    </span>
  );
}
function Meta({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <span className="flex items-center gap-2 text-[10px] text-muted">
        <Icon size={12} className="text-accent" />
        {label}
      </span>
      <b className="mt-1.5 block text-[11px]">{value}</b>
    </div>
  );
}
