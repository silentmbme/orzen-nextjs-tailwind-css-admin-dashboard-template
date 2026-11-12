"use client";
import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  location: string;
  type: "Full time" | "Contract" | "Part time";
  status: "Active" | "Away" | "On leave";
};
const initial: Employee[] = [
  {
    id: "e1",
    name: "Sofia Garcia",
    email: "sofia@orzen.dev",
    department: "Operations",
    designation: "Operations Lead",
    location: "Barcelona",
    type: "Full time",
    status: "Active",
  },
  {
    id: "e2",
    name: "Alex Morgan",
    email: "alex@orzen.dev",
    department: "Design",
    designation: "Product Designer",
    location: "London",
    type: "Full time",
    status: "Away",
  },
  {
    id: "e3",
    name: "Priya Shah",
    email: "priya@orzen.dev",
    department: "Growth",
    designation: "Growth Manager",
    location: "Mumbai",
    type: "Contract",
    status: "Active",
  },
  {
    id: "e4",
    name: "Daniel Kim",
    email: "daniel@orzen.dev",
    department: "Engineering",
    designation: "Engineering Lead",
    location: "Seoul",
    type: "Full time",
    status: "On leave",
  },
];
const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-3 text-[12px]";
export function RowEditableTable() {
  const [rows, setRows] = useState(initial),
    [editing, setEditing] = useState<string | null>(null),
    [draft, setDraft] = useState<Employee | null>(null),
    [saved, setSaved] = useState("");
  const begin = (row: Employee) => {
    setEditing(row.id);
    setDraft({ ...row });
    setSaved("");
  };
  const invalid =
    !draft || !draft.name.trim() || !draft.designation.trim() || !draft.location.trim();
  const save = () => {
    if (!draft || invalid) return;
    setRows((items) => items.map((item) => (item.id === draft.id ? draft : item)));
    setEditing(null);
    setDraft(null);
    setSaved("Employee record updated in local demo state.");
  };
  const cancel = () => {
    setEditing(null);
    setDraft(null);
  };
  const update = <K extends keyof Employee>(key: K, value: Employee[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  return (
    <Card
      title="Full-row employee editing"
      action={
        <span aria-live="polite" className="text-[10px] text-success">
          {saved}
        </span>
      }
    >
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[1040px]">
          <caption className="sr-only">Employee directory with full-row editing</caption>
          <thead>
            <tr>
              {[
                "Employee",
                "Department",
                "Designation",
                "Location",
                "Employment type",
                "Status",
                "Actions",
              ].map((label) => (
                <th key={label} scope="col" className={th}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const active = editing === row.id && draft;
              return (
                <tr
                  key={row.id}
                  className={`border-t border-border align-top ${active ? "bg-accent/5 shadow-[inset_3px_0_var(--color-accent)]" : "hover:bg-surface-alt/50"}`}
                >
                  <td className={td}>
                    {active ? (
                      <div className="grid grid-cols-[32px_1fr] gap-2">
                        <UserAvatar name={row.name} size={32} />
                        <span>
                          <Input
                            aria-label="Employee name"
                            aria-invalid={!draft.name.trim()}
                            value={draft.name}
                            onChange={(event) => update("name", event.target.value)}
                            className="h-7! min-h-7! w-36 px-2! text-[11px]!"
                          />
                          {!draft.name.trim() && (
                            <small role="alert" className="block text-[9px] text-danger">
                              Name is required.
                            </small>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-2.5">
                        <UserAvatar name={row.name} size={32} />
                        <span>
                          <b className="block">{row.name}</b>
                          <small className="text-[10px] text-muted">{row.email}</small>
                        </span>
                      </span>
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <Select
                        aria-label="Department"
                        value={draft.department}
                        onChange={(event) => update("department", event.target.value)}
                        className="h-7! min-h-7! w-32 px-2! text-[11px]!"
                      >
                        <option>Operations</option>
                        <option>Design</option>
                        <option>Growth</option>
                        <option>Engineering</option>
                      </Select>
                    ) : (
                      <Badge>{row.department}</Badge>
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <span>
                        <Input
                          aria-label="Designation"
                          aria-invalid={!draft.designation.trim()}
                          value={draft.designation}
                          onChange={(event) => update("designation", event.target.value)}
                          className="h-7! min-h-7! w-40 px-2! text-[11px]!"
                        />
                        {!draft.designation.trim() && (
                          <small role="alert" className="block text-[9px] text-danger">
                            Required.
                          </small>
                        )}
                      </span>
                    ) : (
                      row.designation
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <span>
                        <Input
                          aria-label="Location"
                          aria-invalid={!draft.location.trim()}
                          value={draft.location}
                          onChange={(event) => update("location", event.target.value)}
                          className="h-7! min-h-7! w-28 px-2! text-[11px]!"
                        />
                        {!draft.location.trim() && (
                          <small role="alert" className="block text-[9px] text-danger">
                            Required.
                          </small>
                        )}
                      </span>
                    ) : (
                      row.location
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <Select
                        aria-label="Employment type"
                        value={draft.type}
                        onChange={(event) => update("type", event.target.value as Employee["type"])}
                        className="h-7! min-h-7! w-28 px-2! text-[11px]!"
                      >
                        <option>Full time</option>
                        <option>Contract</option>
                        <option>Part time</option>
                      </Select>
                    ) : (
                      row.type
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <Select
                        aria-label="Employment status"
                        value={draft.status}
                        onChange={(event) =>
                          update("status", event.target.value as Employee["status"])
                        }
                        className="h-7! min-h-7! w-24 px-2! text-[11px]!"
                      >
                        <option>Active</option>
                        <option>Away</option>
                        <option>On leave</option>
                      </Select>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <i
                          className={`size-2 rounded-full ${row.status === "Active" ? "bg-success" : row.status === "Away" ? "bg-amber-500" : "bg-muted"}`}
                        />
                        {row.status}
                      </span>
                    )}
                  </td>
                  <td className={td}>
                    {active ? (
                      <span className="flex gap-1">
                        <Button size="sm" variant="primary" disabled={invalid} onClick={save}>
                          <Check size={11} />
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancel}>
                          <X size={11} />
                          Cancel
                        </Button>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={Boolean(editing)}
                        onClick={() => begin(row)}
                      >
                        <Pencil size={11} />
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[10px] text-muted">
        Only one employee can be edited at a time. Save updates local state; Cancel restores the
        original row.
      </p>
    </Card>
  );
}
