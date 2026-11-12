"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { HrField } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { addCandidate, saveJob } from "../demo-service";
import { today, type Candidate, type Job } from "../types";
export function PositionForm({ job, onClose }: { job?: Job; onClose: () => void }) {
  const { data } = useHr(),
    [draft, setDraft] = useState<Job>(
      job || {
        id: "",
        title: "",
        departmentId: data.departments[0]?.id || "",
        openings: 1,
        status: "Open",
        description: "",
        created: today,
      },
    ),
    [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = saveJob(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <HrField label="Position title *">
        <Input
          required
          maxLength={100}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </HrField>
      <div className="grid gap-3 sm:grid-cols-2">
        <HrField label="Position department">
          <Select
            aria-label="Position department"
            value={draft.departmentId}
            onChange={(e) => setDraft({ ...draft, departmentId: e.target.value })}
          >
            {data.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </HrField>
        <HrField label="Openings *">
          <Input
            required
            type="number"
            min={1}
            step={1}
            value={draft.openings}
            onChange={(e) => setDraft({ ...draft, openings: Number(e.target.value) })}
          />
        </HrField>
        <HrField label="Position status">
          <Select
            aria-label="Position status"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as Job["status"] })}
          >
            {["Open", "On hold", "Closed"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </HrField>
      </div>
      <HrField label="Position description *">
        <textarea
          required
          maxLength={1000}
          className="min-h-20 rounded-control border border-border bg-surface p-2 outline-accent"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </HrField>
      <p className="text-tiny text-muted">
        Filled positions cannot be reopened without increasing openings. No listing is published
        externally.
      </p>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo position</Button>
      </div>
    </form>
  );
}
export function CandidateForm({ jobId, onClose }: { jobId: string; onClose: () => void }) {
  const { data } = useHr(),
    [draft, setDraft] = useState<Candidate>({
      id: "",
      name: "",
      email: "",
      jobId,
      stage: "Applied",
      applied: today,
      source: "Careers page",
      notes: "",
    }),
    [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = addCandidate(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <HrField label="Candidate name *">
        <Input
          required
          maxLength={100}
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </HrField>
      <HrField label="Candidate email *">
        <Input
          required
          type="email"
          maxLength={100}
          value={draft.email}
          onChange={(e) => setDraft({ ...draft, email: e.target.value })}
        />
      </HrField>
      <HrField label="Open position">
        <Select
          aria-label="Candidate position"
          value={draft.jobId}
          onChange={(e) => setDraft({ ...draft, jobId: e.target.value })}
        >
          {data.jobs
            .filter((j) => j.status === "Open")
            .map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
        </Select>
      </HrField>
      <HrField label="Candidate source">
        <Select
          aria-label="Candidate source"
          value={draft.source}
          onChange={(e) => setDraft({ ...draft, source: e.target.value })}
        >
          {["Careers page", "Referral", "Job board"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </HrField>
      <HrField label="Candidate notes">
        <Input
          maxLength={300}
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
        />
      </HrField>
      {error && (
        <p role="alert" className="text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add demo candidate</Button>
      </div>
    </form>
  );
}
