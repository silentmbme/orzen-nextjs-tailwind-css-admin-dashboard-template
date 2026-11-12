"use client";
import { useState, type ReactNode } from "react";
import { Check, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  status: string;
};
const employees: Employee[] = [
  {
    id: "EMP-1042",
    name: "Sofia Garcia",
    role: "Operations lead",
    department: "Operations",
    location: "Barcelona",
    status: "Active",
  },
  {
    id: "EMP-1068",
    name: "Alex Morgan",
    role: "Product designer",
    department: "Design",
    location: "London",
    status: "Active",
  },
  {
    id: "EMP-1091",
    name: "Priya Shah",
    role: "Growth manager",
    department: "Marketing",
    location: "Mumbai",
    status: "Away",
  },
  {
    id: "EMP-1114",
    name: "Daniel Kim",
    role: "Engineering lead",
    department: "Engineering",
    location: "Seoul",
    status: "Active",
  },
];
const heads = ["Employee", "Department", "Location", "Status"],
  th = "px-3 py-2 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-2.5 text-[12px]";
function Scroll({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 overflow-x-auto ${className}`}>
      <div className="min-w-[520px]">{children}</div>
    </div>
  );
}
function Head() {
  return (
    <thead>
      <tr>
        {heads.map((x) => (
          <th key={x} scope="col" className={th}>
            {x}
          </th>
        ))}
      </tr>
    </thead>
  );
}
function Rows({ compact = false }: { compact?: boolean }) {
  return (
    <>
      {employees.map((row) => (
        <tr key={row.id} className="border-t border-border">
          <td className={`px-3 ${compact ? "py-1.5" : "py-2.5"}`}>
            <b className="block text-[12px] font-medium">{row.name}</b>
            <span className="text-[10px] text-muted">{row.id}</span>
          </td>
          <td className={td}>{row.department}</td>
          <td className={td}>{row.location}</td>
          <td className={td}>
            <Badge tone={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>
          </td>
        </tr>
      ))}
    </>
  );
}
export function TableStyleExamples() {
  const [selected, setSelected] = useState("EMP-1068"),
    activity = [
      ["Report exported", "Sofia Garcia", "2 min ago"],
      ["Role updated", "Daniel Kim", "18 min ago"],
      ["Member invited", "Priya Shah", "1 hr ago"],
      ["Invoice reviewed", "Alex Morgan", "3 hr ago"],
    ];
  return (
    <div className="grid min-w-0 gap-3">
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Basic table">
          <Scroll>
            <table className="w-full border-collapse">
              <caption className="sr-only">Standard employee records</caption>
              <Head />
              <tbody>
                <Rows />
              </tbody>
            </table>
          </Scroll>
        </Card>
        <Card title="Bordered table">
          <Scroll>
            <table className="w-full border-collapse border border-border">
              <caption className="sr-only">Department data with cell borders</caption>
              <thead>
                <tr>
                  {["Department", "Lead", "Specialty", "Office"].map((x) => (
                    <th key={x} scope="col" className={`${th} border border-border bg-surface-alt`}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((row) => (
                  <tr key={row.id}>
                    {[row.department, row.name, row.role, row.location].map((value) => (
                      <td key={value} className={`${td} border border-border`}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroll>
        </Card>
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Borderless activity">
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Recent workspace activity</caption>
              <thead>
                <tr>
                  {["Activity", "Owner", "Time"].map((x) => (
                    <th key={x} scope="col" className={th}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activity.map(([event, owner, time]) => (
                  <tr key={event}>
                    <td className={td}>
                      <b className="font-medium">{event}</b>
                      <span className="block text-[10px] text-muted">Workspace event</span>
                    </td>
                    <td className={td}>{owner}</td>
                    <td className={`${td} text-muted`}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroll>
        </Card>
        <Card title="Striped rows">
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Striped employee records</caption>
              <Head />
              <tbody>
                {employees.map((row, index) => (
                  <tr key={row.id} className={index % 2 ? "bg-surface-alt" : ""}>
                    <td className={td}>{row.name}</td>
                    <td className={td}>{row.department}</td>
                    <td className={td}>{row.location}</td>
                    <td className={td}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroll>
        </Card>
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-3">
        <Card title="Hover rows">
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Hoverable records</caption>
              <Head />
              <tbody>
                {employees.slice(0, 3).map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-border transition-colors hover:bg-surface-alt"
                  >
                    <td className={td}>{row.name}</td>
                    <td className={td}>{row.department}</td>
                    <td className={td}>{row.location}</td>
                    <td className={td}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroll>
        </Card>
        <Card title="Compact density">
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Compact employee records</caption>
              <Head />
              <tbody>
                <Rows compact />
              </tbody>
            </table>
          </Scroll>
        </Card>
        <Card title="Comfortable rows">
          <table className="w-full">
            <caption className="sr-only">Comfortable employee records</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>
                  Employee
                </th>
                <th scope="col" className={th}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 3).map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-2 py-4">
                    <span className="flex items-center gap-3">
                      <UserAvatar name={row.name} size={36} />
                      <span className="min-w-0">
                        <b className="block truncate text-[12px]">{row.name}</b>
                        <small className="text-[10px] text-muted">{row.role}</small>
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-4 text-right">
                    <Badge tone="success">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Rounded container">
          <div className="overflow-hidden rounded-lg border border-border">
            <Scroll>
              <table className="w-full">
                <caption className="sr-only">Rounded employee table</caption>
                <thead className="bg-surface-alt">
                  <tr>
                    {["ID", "Name", "Team", "Office"].map((x) => (
                      <th key={x} scope="col" className={`${th} py-2.5`}>
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className={td}>{row.id}</td>
                      <td className={td}>{row.name}</td>
                      <td className={td}>{row.department}</td>
                      <td className={td}>{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroll>
          </div>
        </Card>
        <Card title="Contrasting header">
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Contrasting header table</caption>
              <thead className="bg-foreground text-surface">
                <tr>
                  {heads.map((x) => (
                    <th
                      key={x}
                      scope="col"
                      className="px-3 py-2.5 text-left text-[11px] font-medium"
                    >
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Rows />
              </tbody>
            </table>
          </Scroll>
        </Card>
      </div>
      <Card title="Selectable highlighted row" action={<Badge>{selected} selected</Badge>}>
        <Scroll>
          <table className="w-full">
            <caption className="sr-only">Selectable employee records</caption>
            <Head />
            <tbody>
              {employees.map((row) => {
                const active = selected === row.id;
                return (
                  <tr
                    key={row.id}
                    aria-selected={active}
                    tabIndex={0}
                    onClick={() => setSelected(row.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(row.id);
                      }
                    }}
                    className={`cursor-pointer border-t border-border focus-visible:outline-2 focus-visible:outline-accent ${active ? "bg-accent/5 shadow-[inset_3px_0_var(--color-accent)]" : "hover:bg-surface-alt"}`}
                  >
                    <td className={td}>
                      <span className="flex items-center gap-2">
                        {active && <Check size={12} className="text-accent" />}
                        <b>{row.name}</b>
                      </span>
                    </td>
                    <td className={td}>{row.department}</td>
                    <td className={td}>{row.location}</td>
                    <td className={td}>
                      <Badge>{row.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Scroll>
      </Card>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Responsive overflow" action={<Badge>Scroll on mobile</Badge>}>
          <Scroll>
            <table className="w-full">
              <caption className="sr-only">Responsive wide table</caption>
              <thead>
                <tr>
                  {["Employee ID", "Employee", "Role", "Department", "Location", "Status"].map(
                    (x) => (
                      <th key={x} scope="col" className={`${th} whitespace-nowrap`}>
                        {x}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map((row) => (
                  <tr key={row.id} className="border-t border-border">
                    <td className={`${td} whitespace-nowrap`}>{row.id}</td>
                    <td className={`${td} whitespace-nowrap`}>{row.name}</td>
                    <td className={`${td} whitespace-nowrap`}>{row.role}</td>
                    <td className={td}>{row.department}</td>
                    <td className={td}>{row.location}</td>
                    <td className={td}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroll>
        </Card>
        <Card title="Sticky header">
          <div className="max-h-60 overflow-auto rounded-lg border border-border">
            <table className="w-full min-w-[520px]">
              <caption className="sr-only">Records with sticky header</caption>
              <thead className="sticky top-0 z-10 bg-surface-alt">
                <tr>
                  {["Record", "Owner", "Category", "Updated"].map((x) => (
                    <th key={x} scope="col" className={`${th} py-2.5`}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 10 }, (_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className={td}>REC-{2040 + i}</td>
                    <td className={td}>{employees[i % 4].name}</td>
                    <td className={td}>{employees[i % 4].department}</td>
                    <td className={`${td} text-muted`}>{i + 2} min ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Empty state">
          <table className="w-full">
            <caption className="sr-only">Empty archived records</caption>
            <thead>
              <tr>
                {["Record", "Owner", "Status"].map((x) => (
                  <th key={x} scope="col" className={th}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="border-t border-border py-10 text-center">
                  <Inbox size={22} className="mx-auto text-muted" />
                  <b className="mt-2 block text-[12px]">No archived records</b>
                  <span className="mt-1 block text-[11px] text-muted">
                    Archived items will appear here.
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
        <Card title="Loading skeleton">
          <table className="w-full">
            <caption className="sr-only">Loading table preview</caption>
            <thead>
              <tr>
                {["Item", "Owner", "Status", "Updated"].map((x) => (
                  <th key={x} scope="col" className={th}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }, (_, row) => (
                <tr key={row} className="border-t border-border">
                  {[42, 28, 20, 24].map((width, index) => (
                    <td key={index} className={td}>
                      <span
                        className="block h-2.5 animate-pulse rounded bg-surface-alt"
                        style={{ width: `${width + row * 3}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
