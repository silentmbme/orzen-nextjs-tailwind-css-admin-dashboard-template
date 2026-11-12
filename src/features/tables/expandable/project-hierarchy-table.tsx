"use client";
import { useMemo, useState } from "react";
import { ChevronRight, FolderKanban, ListTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Level = "project" | "phase" | "task" | "subtask";
type Node = {
  id: string;
  parent: string | null;
  level: Level;
  name: string;
  note: string;
  owners: string[];
  priority: "High" | "Medium" | "Low";
  deadline: string;
  progress: number;
  status: "On track" | "At risk" | "Complete" | "Planned";
};
const nodes: Node[] = [
  {
    id: "nova",
    parent: null,
    level: "project",
    name: "Orzen mobile launch",
    note: "Q4 customer experience program",
    owners: ["Sofia Garcia", "Daniel Kim", "Alex Morgan"],
    priority: "High",
    deadline: "Dec 18",
    progress: 68,
    status: "On track",
  },
  {
    id: "discovery",
    parent: "nova",
    level: "phase",
    name: "Discovery & UX",
    note: "Research and interaction design",
    owners: ["Alex Morgan", "Priya Shah"],
    priority: "High",
    deadline: "Nov 18",
    progress: 92,
    status: "On track",
  },
  {
    id: "research",
    parent: "discovery",
    level: "task",
    name: "Customer research",
    note: "Validate top user journeys",
    owners: ["Priya Shah"],
    priority: "Medium",
    deadline: "Nov 12",
    progress: 100,
    status: "Complete",
  },
  {
    id: "interviews",
    parent: "research",
    level: "subtask",
    name: "Stakeholder interviews",
    note: "12 sessions summarized",
    owners: ["Priya Shah"],
    priority: "Low",
    deadline: "Nov 08",
    progress: 100,
    status: "Complete",
  },
  {
    id: "prototype",
    parent: "discovery",
    level: "task",
    name: "Interactive prototype",
    note: "High-fidelity onboarding flow",
    owners: ["Alex Morgan"],
    priority: "High",
    deadline: "Nov 18",
    progress: 76,
    status: "At risk",
  },
  {
    id: "build",
    parent: "nova",
    level: "phase",
    name: "Application build",
    note: "Native clients and platform APIs",
    owners: ["Daniel Kim", "Sofia Garcia"],
    priority: "High",
    deadline: "Dec 08",
    progress: 54,
    status: "On track",
  },
  {
    id: "auth",
    parent: "build",
    level: "task",
    name: "Identity & access",
    note: "SSO, sessions, and recovery",
    owners: ["Daniel Kim"],
    priority: "High",
    deadline: "Nov 24",
    progress: 82,
    status: "On track",
  },
  {
    id: "session",
    parent: "auth",
    level: "subtask",
    name: "Session resilience",
    note: "Offline token refresh",
    owners: ["Daniel Kim"],
    priority: "Medium",
    deadline: "Nov 20",
    progress: 64,
    status: "At risk",
  },
  {
    id: "analytics",
    parent: "build",
    level: "task",
    name: "Product analytics",
    note: "Privacy-safe event pipeline",
    owners: ["Sofia Garcia"],
    priority: "Medium",
    deadline: "Dec 02",
    progress: 40,
    status: "Planned",
  },
  {
    id: "launch",
    parent: "nova",
    level: "phase",
    name: "Release operations",
    note: "Store review and rollout",
    owners: ["Sofia Garcia"],
    priority: "Medium",
    deadline: "Dec 18",
    progress: 18,
    status: "Planned",
  },
];
const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-2.5 text-[11px]";
export function ProjectHierarchyTable() {
  const [open, setOpen] = useState(
    () => new Set(["nova", "discovery", "research", "build", "auth"]),
  );
  const visible = useMemo(
    () =>
      nodes.filter((node) => {
        let current = node;
        while (current.parent) {
          if (!open.has(current.parent)) return false;
          current = nodes.find((item) => item.id === current.parent)!;
        }
        return true;
      }),
    [open],
  );
  const toggle = (id: string) =>
    setOpen((value) => {
      const next = new Set(value);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <Card
      title="Hierarchical project table"
      icon={ListTree}
      action={<Badge>4 nesting levels</Badge>}
    >
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <caption className="sr-only">
            Expandable project, phase, task, and subtask hierarchy
          </caption>
          <thead>
            <tr>
              {["Project / Task", "Owner", "Priority", "Deadline", "Progress", "Status"].map(
                (x) => (
                  <th key={x} scope="col" className={th}>
                    {x}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((node) => (
              <TreeRow
                key={node.id}
                node={node}
                expanded={open.has(node.id)}
                hasChildren={nodes.some((item) => item.parent === node.id)}
                toggle={() => toggle(node.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
function TreeRow({
  node,
  expanded,
  hasChildren,
  toggle,
}: {
  node: Node;
  expanded: boolean;
  hasChildren: boolean;
  toggle: () => void;
}) {
  const depth = { project: 0, phase: 1, task: 2, subtask: 3 }[node.level],
    parent = node.level === "project";
  return (
    <tr
      className={`border-t border-border ${parent ? "bg-surface-alt font-medium" : node.level === "phase" ? "bg-accent/[.025]" : "hover:bg-surface-alt/60"}`}
    >
      <td className={td}>
        <div
          className="relative flex min-h-8 items-center"
          style={{ paddingLeft: `${depth * 24}px` }}
        >
          {depth > 0 &&
            Array.from({ length: depth }, (_, index) => (
              <i
                key={index}
                className="absolute bottom-[-11px] top-[-11px] w-px bg-border"
                style={{ left: `${index * 24 + 10}px` }}
              />
            ))}
          {depth > 0 && (
            <i className="absolute h-px w-3 bg-border" style={{ left: `${depth * 24 - 14}px` }} />
          )}
          {hasChildren ? (
            <Button
              size="icon"
              variant="ghost"
              className="relative z-10 mr-1 size-6! min-h-6!"
              aria-label={`${expanded ? "Collapse" : "Expand"} ${node.name}`}
              aria-expanded={expanded}
              onClick={toggle}
            >
              <ChevronRight
                size={13}
                className={`transition-transform ${expanded ? "rotate-90" : ""}`}
              />
            </Button>
          ) : (
            <span className="relative z-10 mr-1 block size-6" />
          )}
          <span
            className={`mr-2 grid size-6 shrink-0 place-items-center rounded-md ${parent ? "bg-accent text-white" : node.level === "phase" ? "bg-accent/10 text-accent" : "bg-surface-alt text-muted"}`}
          >
            <FolderKanban size={12} />
          </span>
          <span className="min-w-0">
            <b className={`block truncate ${parent ? "text-[12px]" : "text-[11px]"}`}>
              {node.name}
            </b>
            <small className="block truncate text-[9px] font-normal text-muted">{node.note}</small>
          </span>
        </div>
      </td>
      <td className={td}>
        <div className="flex -space-x-1.5">
          {node.owners.map((name) => (
            <UserAvatar key={name} name={name} size={24} className="border-2 border-surface" />
          ))}
        </div>
      </td>
      <td className={td}>
        <Badge
          className={
            node.priority === "High"
              ? "border-danger/20 bg-danger/10 text-danger"
              : node.priority === "Medium"
                ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : ""
          }
        >
          {node.priority}
        </Badge>
      </td>
      <td className={`${td} whitespace-nowrap text-muted`}>{node.deadline}</td>
      <td className={td}>
        <div className="flex min-w-28 items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-alt">
            <div
              className={`h-full rounded-full ${node.status === "At risk" ? "bg-amber-500" : "bg-accent"}`}
              style={{ width: `${node.progress}%` }}
            />
          </div>
          <span className="w-7 text-right text-[9px] text-muted">{node.progress}%</span>
        </div>
      </td>
      <td className={td}>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <i
            className={`size-2 rounded-full ${node.status === "Complete" ? "bg-success" : node.status === "At risk" ? "bg-amber-500" : node.status === "Planned" ? "bg-muted" : "bg-blue-500"}`}
          />
          {node.status}
        </span>
      </td>
    </tr>
  );
}
