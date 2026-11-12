"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { HrField } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { saveEmployee } from "../demo-service";
import { today, type Employee } from "../types";
export function EmployeeForm({ employee, onClose }: { employee?: Employee; onClose: () => void }) {
  const { data } = useHr(),
    [draft, setDraft] = useState<Employee>(
      employee || {
        id: "",
        name: "",
        email: "",
        phone: "",
        departmentId: data.departments[0]?.id || "",
        designation: "",
        managerId: "",
        joined: today,
        departed: "",
        birthday: "1995-01-01",
        type: "Full-time",
        status: "Onboarding",
        salary: 4500,
        location: "",
      },
    ),
    [error, setError] = useState("");
  const set = <K extends keyof Employee>(key: K, value: Employee[K]) =>
    setDraft((old) => ({ ...old, [key]: value }));
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = saveEmployee(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {(
          [
            { key: "name", label: "Full name *", type: "text" },
            { key: "email", label: "Email *", type: "email" },
            { key: "designation", label: "Designation *", type: "text" },
            { key: "location", label: "Location *", type: "text" },
            { key: "phone", label: "Phone", type: "tel" },
          ] as const
        ).map((field) => (
          <HrField key={field.key} label={field.label}>
            <Input
              required={field.key !== "phone"}
              type={field.type}
              maxLength={100}
              value={draft[field.key]}
              onChange={(e) => set(field.key, e.target.value)}
            />
          </HrField>
        ))}
        <HrField label="Department *">
          <Select
            aria-label="Employee department"
            value={draft.departmentId}
            onChange={(e) => set("departmentId", e.target.value)}
          >
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </HrField>
        <HrField label="Manager">
          <Select
            aria-label="Employee manager"
            value={draft.managerId}
            onChange={(e) => set("managerId", e.target.value)}
          >
            <option value="">No assigned manager</option>
            {data.employees
              .filter((e) => e.id !== draft.id)
              .map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
          </Select>
        </HrField>
        <HrField label="Employment type">
          <Select
            aria-label="Employment type"
            value={draft.type}
            onChange={(e) => set("type", e.target.value as Employee["type"])}
          >
            {["Full-time", "Part-time", "Contract"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </HrField>
        <HrField label="Employment status">
          <Select
            aria-label="Employment status"
            value={draft.status}
            onChange={(e) => set("status", e.target.value as Employee["status"])}
          >
            {["Active", "Onboarding", "Inactive"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </HrField>
        <HrField label="Joining date *">
          <Input
            required
            type="date"
            max={today}
            value={draft.joined}
            onChange={(e) => set("joined", e.target.value)}
          />
        </HrField>
        <HrField label="Birthday *">
          <Input
            required
            type="date"
            max={draft.joined}
            value={draft.birthday}
            onChange={(e) => set("birthday", e.target.value)}
          />
        </HrField>
        <HrField label="Demo monthly base salary ($) *">
          <Input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={draft.salary}
            onChange={(e) => set("salary", Number(e.target.value))}
          />
        </HrField>
        {draft.status === "Inactive" && (
          <HrField label="Departure date *">
            <Input
              required
              type="date"
              min={draft.joined}
              max={today}
              value={draft.departed}
              onChange={(e) => set("departed", e.target.value)}
            />
          </HrField>
        )}
      </div>
      <p className="text-tiny text-muted">
        Fictional HR record only. Salary changes do not rewrite existing payroll snapshots.
      </p>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo employee</Button>
      </div>
    </form>
  );
}
