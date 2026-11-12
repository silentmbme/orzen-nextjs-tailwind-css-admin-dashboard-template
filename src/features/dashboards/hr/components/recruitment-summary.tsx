"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  ChevronRight,
  UsersRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { CandidateDetails } from "@/features/hr/components/candidate-details";
import { age, candidateStages, today, type HrData } from "@/features/hr/types";

const stageColors = ["bg-accent", "bg-trend-up", "bg-trend-down", "bg-success", "bg-muted"];

export function RecruitmentSummary({
  data,
  department,
  days,
}: {
  data: HrData;
  department: string;
  days: number;
}) {
  const [stage, setStage] = useState<string | null>(null),
    [selected, setSelected] = useState("");
  const jobs = data.jobs.filter((j) => department === "all" || j.departmentId === department);
  const candidates = data.candidates.filter(
    (c) => jobs.some((j) => j.id === c.jobId) && age(c.applied) >= 0 && age(c.applied) < days,
  );
  const openJobs = jobs.filter((j) => j.status === "Open");
  const vacancies = openJobs.reduce(
    (sum, job) =>
      sum +
      Math.max(
        0,
        job.openings -
          data.candidates.filter((c) => c.jobId === job.id && c.stage === "Hired").length,
      ),
    0,
  );
  const interviews = data.interviews
    .filter(
      (i) =>
        i.status === "Scheduled" &&
        i.date >= today &&
        candidates.some((c) => c.id === i.candidateId),
    )
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const stages = candidateStages.map((name) => ({
    name,
    count: candidates.filter((c) => c.stage === name).length,
  }));
  const visible = candidates.filter((c) => c.stage === stage);

  return (
    <Card
      title={<HrTitle icon={BriefcaseBusiness}>Recruitment intelligence</HrTitle>}
      action={
        <Link
          href="/apps/hr/recruitment"
          className="inline-flex items-center gap-1 text-tiny text-accent"
        >
          Hiring workspace
          <ArrowUpRight size={12} />
        </Link>
      }
    >
      <div className="mt-3 grid grid-cols-[1.15fr_1fr_1fr] divide-x divide-border rounded-control border border-border bg-surface-alt py-3">
        <div className="min-w-0 px-3">
          <p className="flex items-center gap-1 text-tiny text-muted">
            <UsersRound size={12} />
            Applicants
          </p>
          <p className="mt-1 text-kpi font-semibold leading-tight">{candidates.length}</p>
          <p className="mt-1 text-[10px] text-muted">Last {days} days</p>
        </div>
        <div className="min-w-0 px-3">
          <p className="text-tiny text-muted">Open seats</p>
          <p className="mt-1 text-kpi font-semibold leading-tight">{vacancies}</p>
          <p className="mt-1 text-[10px] text-muted">Across {openJobs.length} positions</p>
        </div>
        <div className="min-w-0 px-3">
          <p className="text-tiny text-muted">Offer stage</p>
          <p className="mt-1 text-kpi font-semibold leading-tight text-accent">{stages[3].count}</p>
          <p className="mt-1 text-[10px] text-muted">In selected cohort</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-label font-medium">Candidate pipeline</p>
        <span className="text-[10px] text-muted">Select a stage to inspect</span>
      </div>
      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
        {stages.map((item, index) => (
          <span
            key={item.name}
            className={stageColors[index]}
            style={{ width: `${candidates.length ? (item.count / candidates.length) * 100 : 0}%` }}
          />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1">
        {stages.map((item) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Inspect ${item.name} candidates (${item.count})`}
            aria-pressed={stage === item.name}
            onClick={() => setStage(stage === item.name ? null : item.name)}
            className={`min-w-0 rounded-control border px-1 py-2 text-left transition-colors hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-accent ${stage === item.name ? "border-accent bg-accent/5" : "border-transparent"}`}
          >
            <span className="block text-[10px] text-muted">{item.name}</span>
            <strong className="mt-1 block text-lg font-semibold">{item.count}</strong>
            <span className="text-[10px] text-muted">
              {candidates.length ? Math.round((item.count / candidates.length) * 100) : 0}%
            </span>
          </button>
        ))}
      </div>

      {stage && (
        <div className="mt-2 rounded-control border border-border bg-surface-alt p-2">
          <div className="mb-2 flex justify-between text-tiny">
            <span className="font-medium">{stage} candidates</span>
            <button type="button" className="text-accent" onClick={() => setStage(null)}>
              Close
            </button>
          </div>
          {visible.slice(0, 3).map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => setSelected(candidate.id)}
              className="flex w-full items-center gap-2 rounded-control p-1.5 text-left hover:bg-surface focus-visible:outline-2 focus-visible:outline-accent"
            >
              <UserAvatar name={candidate.name} size={24} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-label font-medium">{candidate.name}</span>
                <span className="block truncate text-[10px] text-muted">
                  {jobs.find((j) => j.id === candidate.jobId)?.title}
                </span>
              </span>
              <ChevronRight size={12} className="text-muted" />
            </button>
          ))}
          {!visible.length && (
            <p className="py-2 text-tiny text-muted">
              No candidates at this stage in the selected period.
            </p>
          )}
          {visible.length > 3 && (
            <Link href="/apps/hr/recruitment" className="mt-2 block text-tiny text-accent">
              View all {visible.length} in recruitment →
            </Link>
          )}
        </div>
      )}

      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-label font-medium">
            <CalendarClock size={13} className="text-muted" />
            Upcoming interviews
          </p>
          <span className="rounded-control bg-surface-alt px-1.5 py-0.5 text-[10px] text-muted">
            {interviews.length} scheduled
          </span>
        </div>
        <div className="mt-2 divide-y divide-border">
          {interviews.slice(0, 2).map((interview) => {
            const candidate = candidates.find((c) => c.id === interview.candidateId)!;
            return (
              <div key={interview.id} className="flex items-center gap-2 py-2">
                <div className="w-9 shrink-0 rounded-control border border-border bg-surface-alt py-1 text-center">
                  <span className="block text-[9px] uppercase text-muted">
                    {new Date(`${interview.date}T12:00:00Z`).toLocaleDateString("en-US", {
                      month: "short",
                      timeZone: "UTC",
                    })}
                  </span>
                  <span className="block text-label font-semibold">{interview.date.slice(8)}</span>
                </div>
                <UserAvatar name={candidate.name} size={28} />
                <div className="min-w-0 flex-1">
                  <button
                    className="block max-w-full truncate text-left text-label font-medium hover:text-accent"
                    onClick={() => setSelected(candidate.id)}
                  >
                    {candidate.name}
                  </button>
                  <p className="truncate text-[10px] text-muted">
                    {jobs.find((j) => j.id === candidate.jobId)?.title}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-label font-medium">{interview.time}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`View interview for ${candidate.name}`}
                    onClick={() => setSelected(candidate.id)}
                  >
                    Details
                    <ChevronRight size={11} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {!interviews.length && (
          <p className="mt-2 text-tiny text-muted">
            No scheduled interviews in this candidate cohort.
          </p>
        )}
      </div>
      {selected && (
        <CandidateDetails key={selected} id={selected} onClose={() => setSelected("")} />
      )}
    </Card>
  );
}
