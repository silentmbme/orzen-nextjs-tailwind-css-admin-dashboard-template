"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { HrTitle } from "@/features/hr/components/hr-ui";
import { LeaveDecisionDialog, LeaveRequestCard } from "@/features/hr/components/leave-request-card";
import { age, type HrData } from "@/features/hr/types";
export function LeaveApprovals({
  data,
  department,
  days,
}: {
  data: HrData;
  department: string;
  days: number;
}) {
  const [decision, setDecision] = useState<{
    id: string;
    status: "Approved" | "Rejected";
  } | null>(null);
  const pending = data.leaves.filter(
    (l) =>
      l.status === "Pending" &&
      age(l.created) < days &&
      (department === "all" ||
        data.employees.find((e) => e.id === l.employeeId)?.departmentId === department),
  );
  return (
    <Card
      className="h-full"
      title={<HrTitle icon={CalendarClock}>Leave approval queue</HrTitle>}
      action={
        <Link href="/apps/hr/leave" className="text-tiny text-accent">
          All requests →
        </Link>
      }
    >
      <div className="mt-3 space-y-2">
        {pending.slice(0, 3).map((request) => (
          <LeaveRequestCard
            key={request.id}
            request={request}
            onDecide={(id, status) => setDecision({ id, status })}
          />
        ))}
        {!pending.length && <EmptyState>No pending requests in this reporting window.</EmptyState>}
      </div>
      {decision && (
        <LeaveDecisionDialog
          key={`${decision.id}-${decision.status}`}
          {...decision}
          onClose={() => setDecision(null)}
        />
      )}
    </Card>
  );
}
