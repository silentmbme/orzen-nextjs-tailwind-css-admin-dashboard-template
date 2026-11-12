"use client";
import { useState, type FormEvent } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
import { HrField, HrStatus } from "./hr-ui";
import { useHr } from "../hooks/use-hr";
import { decideLeave } from "../demo-service";
import { workdays, type Leave } from "../types";
export function LeaveRequestCard({
  request,
  onDecide,
}: {
  request: Leave;
  onDecide: (id: string, status: "Approved" | "Rejected") => void;
}) {
  const { data } = useHr(),
    employee = data.employees.find((e) => e.id === request.employeeId)!;
  return (
    <article className="rounded-control border border-border p-3">
      <div className="flex items-center gap-2">
        <UserAvatar name={employee.name} size={30} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-label font-medium">{employee.name}</p>
          <p className="text-tiny text-muted">
            {data.departments.find((d) => d.id === employee.departmentId)?.name}
          </p>
        </div>
        <HrStatus status={request.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-label">
        <span>{request.type} leave</span>
        <span className="text-tiny text-muted">
          {workdays(request.start, request.end)} weekdays
        </span>
      </div>
      <p className="mt-1 flex items-center gap-1 text-tiny text-muted">
        <CalendarDays size={11} />
        {request.start} → {request.end}
      </p>
      <p className="mt-2 text-label text-muted">{request.reason}</p>
      {request.status === "Pending" ? (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-danger! border-danger!"
            onClick={() => onDecide(request.id, "Rejected")}
          >
            Reject
          </Button>
          <Button
            className="text-success! border-success!"
            size="sm"
            onClick={() => onDecide(request.id, "Approved")}
          >
            Approve
          </Button>
        </div>
      ) : (
        <p className="mt-2 border-t border-border pt-2 text-tiny text-muted">{request.decision}</p>
      )}
    </article>
  );
}
export function LeaveDecisionDialog({
  id,
  status,
  onClose,
}: {
  id: string;
  status: "Approved" | "Rejected";
  onClose: () => void;
}) {
  const { data } = useHr(),
    request = data.leaves.find((l) => l.id === id),
    [note, setNote] = useState(
      status === "Approved" ? "Approved in local demo after coverage review." : "",
    ),
    [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const error = decideLeave(id, status, note);
    if (error) setError(error);
    else onClose();
  }
  return (
    <Dialog
      open
      title={status === "Approved" ? "Approve leave request" : "Reject leave request"}
      onClose={onClose}
    >
      {request && (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-label text-muted">
            {request.start} to {request.end} · {workdays(request.start, request.end)} weekdays ·{" "}
            {request.type}
          </p>
          <p className="text-label">
            {status === "Approved"
              ? "Approval books the demo balance and marks overlapping workdays as leave across the attendance views."
              : "Rejection leaves attendance and balances unchanged."}
          </p>
          <HrField label="Decision note *">
            <Input
              required
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </HrField>
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Keep pending
            </Button>
            <Button type="submit" variant={status === "Approved" ? "primary" : "destructive"}>
              Confirm {status === "Approved" ? "approval" : "rejection"}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
