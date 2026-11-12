"use client";
import { useState } from "react";
import {
  BriefcaseBusiness,
  CalendarClock,
  GripVertical,
  Plus,
  ScrollText,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrWorkspace } from "./hr-workspace";
import { HrTitle, HrStatus } from "./hr-ui";
import { PositionForm, CandidateForm } from "./recruitment-forms";
import { CandidateDetails } from "./candidate-details";
import { useHr } from "../hooks/use-hr";
import { moveCandidate } from "../demo-service";
import { candidateStages, today, type Candidate } from "../types";
export function CandidatePipeline() {
  const { data } = useHr(),
    [department, setDepartment] = useState("all"),
    [jobStatus, setJobStatus] = useState("all"),
    [jobId, setJobId] = useState("all"),
    [query, setQuery] = useState(""),
    [editor, setEditor] = useState<string | null>(null),
    [adding, setAdding] = useState(false),
    [selected, setSelected] = useState(""),
    [hiring, setHiring] = useState(""),
    [message, setMessage] = useState("");
  const jobs = data.jobs.filter(
    (j) =>
      (department === "all" || j.departmentId === department) &&
      (jobStatus === "all" || j.status === jobStatus),
  );
  const candidates = data.candidates.filter(
    (c) =>
      jobs.some((j) => j.id === c.jobId) &&
      (jobId === "all" || c.jobId === jobId) &&
      `${c.name} ${c.email} ${c.source}`.toLowerCase().includes(query.toLowerCase()),
  );
  const interviews = data.interviews
    .filter(
      (i) =>
        i.status === "Scheduled" &&
        i.date >= today &&
        candidates.some((c) => c.id === i.candidateId),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  function move(id: string, stage: Candidate["stage"]) {
    if (stage === "Hired" && data.candidates.find((c) => c.id === id)?.stage === "Offer") {
      setMessage("");
      setHiring(id);
      return;
    }
    const error = moveCandidate(id, stage);
    setMessage(error || "Candidate stage updated locally.");
  }
  return (
    <HrWorkspace
      title="Recruitment"
      description="Position capacity, applicant conversations and interview operations."
      actions={
        <>
          <Button
            variant="outline"
            disabled={!data.jobs.some((j) => j.status === "Open")}
            onClick={() => setAdding(true)}
          >
            Add candidate
          </Button>
          <Button onClick={() => setEditor("new")}>
            <Plus size={13} />
            Create position
          </Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Select
          aria-label="Recruitment department"
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setJobId("all");
          }}
        >
          <option value="all">All departments</option>
          {data.departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Recruitment job status"
          value={jobStatus}
          onChange={(e) => {
            setJobStatus(e.target.value);
            setJobId("all");
          }}
        >
          <option value="all">All position states</option>
          {["Open", "On hold", "Closed"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <Select
          aria-label="Candidate position filter"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        >
          <option value="all">All matching positions</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-widget md:grid-cols-2 xl:grid-cols-4">
        {jobs.map((job) => {
          const hired = data.candidates.filter(
            (c) => c.jobId === job.id && c.stage === "Hired",
          ).length;
          return (
            <Card
              key={job.id}
              title={<HrTitle icon={BriefcaseBusiness}>{job.title}</HrTitle>}
              action={<HrStatus status={job.status} />}
            >
              <p className="mt-2 text-tiny text-muted">
                {data.departments.find((d) => d.id === job.departmentId)?.name}
              </p>
              <div className="mt-3 flex items-end justify-between text-label">
                <strong className="font-medium">
                  {hired} / {job.openings} hired
                </strong>
                <span className="text-tiny text-muted">
                  {Math.max(0, job.openings - hired)} unfilled
                </span>
              </div>
              <div className="mt-2 h-1 rounded-full bg-surface-alt">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${(hired / job.openings) * 100}%` }}
                />
              </div>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => setEditor(job.id)}>
                Edit position
              </Button>
            </Card>
          );
        })}
        {!jobs.length && (
          <Card>
            <EmptyState>No positions match these filters.</EmptyState>
          </Card>
        )}
      </div>
      <Card
        title={<HrTitle icon={UsersRound}>Candidate pipeline</HrTitle>}
        action={<span className="text-tiny text-muted">{candidates.length} applicants</span>}
      >
        <div className="my-3 flex flex-wrap items-center justify-between gap-2">
          <Input
            aria-label="Search HR candidates"
            placeholder="Search candidate, email or source…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className="text-tiny text-muted">
            Drag one stage at a time, or use each card’s stage menu. Hiring requires confirmation.
          </span>
        </div>
        {message && (
          <p role="status" className="mb-3 text-label text-muted">
            {message}
          </p>
        )}
        <div className="overflow-x-auto">
          <div className="grid min-w-[1140px] grid-cols-5 gap-2">
            {candidateStages.map((stage) => (
              <section
                key={stage}
                data-testid={`hr-stage-${stage}`}
                aria-label={`${stage} candidates`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const id = event.dataTransfer.getData("text/plain");
                  if (id) move(id, stage);
                }}
                className="min-w-0 rounded-control border border-border bg-surface-alt p-2"
              >
                <div className="mb-3 flex justify-between gap-2 px-1 text-label">
                  <h3 className="font-medium">{stage}</h3>
                  <span className="text-muted">
                    {candidates.filter((c) => c.stage === stage).length}
                  </span>
                </div>
                <div className="min-h-40 space-y-2">
                  {candidates
                    .filter((c) => c.stage === stage)
                    .map((candidate) => {
                      const job = data.jobs.find((j) => j.id === candidate.jobId)!;
                      return (
                        <article
                          key={candidate.id}
                          data-testid={`hr-candidate-${candidate.id}`}
                          draggable={candidate.stage !== "Hired" && job.status === "Open"}
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/plain", candidate.id);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                          className="rounded-control border border-border bg-surface p-2.5"
                        >
                          <div className="flex items-start gap-2">
                            <UserAvatar name={candidate.name} size={30} />
                            <button
                              className="min-w-0 flex-1 text-left text-label font-medium hover:text-accent"
                              onClick={() => setSelected(candidate.id)}
                            >
                              {candidate.name}
                            </button>
                            <GripVertical size={12} className="shrink-0 text-muted" />
                          </div>
                          <p className="mt-3 text-tiny text-muted">{job.title}</p>
                          <p className="mt-2 text-tiny">{candidate.source}</p>
                          <p className="mt-1 text-tiny text-muted">Applied {candidate.applied}</p>
                          <Select
                            aria-label={`Stage for ${candidate.name}`}
                            className="mt-3 w-full"
                            value={candidate.stage}
                            disabled={candidate.stage === "Hired" || job.status !== "Open"}
                            onChange={(e) =>
                              move(candidate.id, e.target.value as Candidate["stage"])
                            }
                          >
                            {candidateStages
                              .filter(
                                (value) =>
                                  value === candidate.stage ||
                                  (candidate.stage !== "Hired" &&
                                    Math.abs(
                                      candidateStages.indexOf(value) -
                                        candidateStages.indexOf(candidate.stage),
                                    ) === 1),
                              )
                              .map((value) => (
                                <option key={value}>{value}</option>
                              ))}
                          </Select>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-1"
                            onClick={() => setSelected(candidate.id)}
                          >
                            View candidate
                          </Button>
                        </article>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid gap-widget lg:grid-cols-2">
        <Card title={<HrTitle icon={CalendarClock}>Upcoming interviews</HrTitle>}>
          <div className="mt-3 space-y-3">
            {interviews.map((interview) => (
              <button
                key={interview.id}
                onClick={() => setSelected(interview.candidateId)}
                className="flex w-full items-center justify-between gap-3 rounded-control border border-border p-3 text-left"
              >
                <div>
                  <p className="text-label font-medium">
                    {data.candidates.find((c) => c.id === interview.candidateId)?.name}
                  </p>
                  <p className="mt-1 text-tiny text-muted">
                    With {data.employees.find((e) => e.id === interview.employeeId)?.name}
                  </p>
                </div>
                <time className="text-tiny text-accent">
                  {interview.date}
                  <span className="mt-1 block text-right">{interview.time}</span>
                </time>
              </button>
            ))}
            {!interviews.length && (
              <EmptyState>No upcoming interviews for these filters.</EmptyState>
            )}
          </div>
        </Card>
        <Card title={<HrTitle icon={ScrollText}>Hiring activity</HrTitle>}>
          <ol className="mt-3 space-y-3">
            {data.activity
              .filter((a) => a.kind === "Hiring")
              .slice(0, 6)
              .map((activity) => (
                <li key={activity.id} className="border-l border-border pl-3">
                  <p className="text-label">{activity.message}</p>
                  <time className="mt-1 block text-tiny text-muted">{activity.date}</time>
                </li>
              ))}
          </ol>
          <p className="mt-3 text-tiny text-muted">Latest hiring events across all departments.</p>
        </Card>
      </div>
      <Dialog
        open={editor !== null}
        title={editor === "new" ? "Create position" : "Edit position"}
        onClose={() => setEditor(null)}
      >
        {editor !== null && (
          <PositionForm
            key={editor}
            job={data.jobs.find((j) => j.id === editor)}
            onClose={() => setEditor(null)}
          />
        )}
      </Dialog>
      <Dialog open={adding} title="Add demo candidate" onClose={() => setAdding(false)}>
        {adding && (
          <CandidateForm
            jobId={
              data.jobs.find((j) => j.id === jobId && j.status === "Open")?.id ||
              data.jobs.find((j) => j.status === "Open")?.id ||
              ""
            }
            onClose={() => setAdding(false)}
          />
        )}
      </Dialog>
      {selected && (
        <CandidateDetails key={selected} id={selected} onClose={() => setSelected("")} />
      )}
      <Dialog open={!!hiring} title="Confirm candidate hire" onClose={() => setHiring("")}>
        <div className="space-y-3">
          <p className="text-label">
            Move {data.candidates.find((c) => c.id === hiring)?.name} to Hired?
          </p>
          <p className="text-label text-muted">
            The hiring stage is final. Filling the last opening closes the demo position. This does
            not create an employee or send an offer.
          </p>
          {message && (
            <p role="alert" className="text-label text-danger">
              {message}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setHiring("")}>
              Keep in offer
            </Button>
            <Button
              onClick={() => {
                const error = moveCandidate(hiring, "Hired");
                setMessage(
                  error || "Hire recorded locally. Create an employee separately when ready.",
                );
                if (!error) setHiring("");
              }}
            >
              Confirm hire
            </Button>
          </div>
        </div>
      </Dialog>
    </HrWorkspace>
  );
}
