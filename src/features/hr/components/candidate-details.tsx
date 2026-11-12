"use client";
import { useState, type FormEvent } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrField, HrStatus } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { scheduleInterview } from "../demo-service";
import { addDays, today } from "../types";
export function CandidateDetails({ id, onClose }: { id: string; onClose: () => void }) {
  const { data } = useHr(),
    candidate = data.candidates.find((c) => c.id === id),
    [scheduling, setScheduling] = useState(false),
    [date, setDate] = useState(addDays(today, 2)),
    [time, setTime] = useState("11:00"),
    [interviewer, setInterviewer] = useState(
      data.employees.find((e) => e.status === "Active")?.id || "",
    ),
    [note, setNote] = useState(""),
    [message, setMessage] = useState("");
  const job = data.jobs.find((j) => j.id === candidate?.jobId),
    interviews = data.interviews.filter((i) => i.candidateId === id);
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = scheduleInterview({
      id: "",
      candidateId: id,
      employeeId: interviewer,
      date,
      time,
      note,
      status: "Scheduled",
    });
    if (error) setMessage(error);
    else {
      setMessage("Demo interview scheduled. No invitation was sent.");
      setScheduling(false);
    }
  }
  return (
    <Dialog open title="Candidate details" onClose={onClose}>
      {candidate && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={candidate.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{candidate.name}</p>
              <p className="break-all text-label text-muted">{candidate.email}</p>
            </div>
            <HrStatus status={candidate.stage} />
          </div>
          <div className="rounded-control border border-border bg-surface-alt p-3">
            <p className="text-label font-medium">{job?.title}</p>
            <p className="mt-1 text-tiny text-muted">
              Applied {candidate.applied} · {candidate.source}
            </p>
            <p className="mt-3 text-label text-muted">
              {candidate.notes || "No candidate notes recorded."}
            </p>
          </div>
          <div>
            <p className="text-label font-medium">Interview history</p>
            {interviews.map((i) => (
              <div
                key={i.id}
                className="mt-2 flex justify-between gap-2 rounded-control border border-border p-2 text-label"
              >
                <div>
                  {i.date} · {i.time}
                  <p className="mt-1 text-tiny text-muted">
                    {data.employees.find((e) => e.id === i.employeeId)?.name} · {i.note}
                  </p>
                </div>
                <HrStatus status={i.status} />
              </div>
            ))}
            {!interviews.length && (
              <p className="mt-2 text-tiny text-muted">No interviews scheduled.</p>
            )}
          </div>
          {["Screening", "Interview"].includes(candidate.stage) &&
            job?.status === "Open" &&
            !scheduling && (
              <Button
                onClick={() => {
                  setScheduling(true);
                  setMessage("");
                }}
              >
                Schedule demo interview
              </Button>
            )}
          {candidate.stage === "Hired" && (
            <p className="text-tiny text-muted">
              Hired stage recorded. Create the employee profile separately in Employees; onboarding
              is not automatic.
            </p>
          )}
          {scheduling && (
            <form onSubmit={submit} className="space-y-3 border-t border-border pt-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <HrField label="Interview date *">
                  <Input
                    required
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </HrField>
                <HrField label="Interview time *">
                  <Input
                    required
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </HrField>
              </div>
              <HrField label="Interviewer">
                <Select
                  aria-label="Interview employee"
                  value={interviewer}
                  onChange={(e) => setInterviewer(e.target.value)}
                >
                  {data.employees
                    .filter((e) => e.status !== "Inactive")
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                </Select>
              </HrField>
              <HrField label="Interview note">
                <Input maxLength={200} value={note} onChange={(e) => setNote(e.target.value)} />
              </HrField>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setScheduling(false)}>
                  Cancel scheduling
                </Button>
                <Button type="submit">Save demo interview</Button>
              </div>
            </form>
          )}
          {message && (
            <p role="status" className="text-label text-muted">
              {message}
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
