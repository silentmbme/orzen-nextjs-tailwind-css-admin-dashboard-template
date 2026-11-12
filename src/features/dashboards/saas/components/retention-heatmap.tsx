"use client";
import { useState } from "react";
import { Grid2X2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaasTitle } from "@/features/saas/components/saas-ui";
import type { saasDashboardData } from "../data";
export function RetentionHeatmap({
  cohorts,
}: {
  cohorts: ReturnType<typeof saasDashboardData>["cohorts"];
}) {
  const [counts, setCounts] = useState(false),
    [detail, setDetail] = useState("Select a cohort cell to inspect retained customers.");
  return (
    <Card
      title={<SaasTitle icon={Grid2X2}>Paid cohort retention</SaasTitle>}
      action={
        <Button size="sm" variant="ghost" onClick={() => setCounts(!counts)}>
          {counts ? "Show percentages" : "Show counts"}
        </Button>
      }
    >
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[400px] border-separate border-spacing-1 text-center text-tiny">
          <thead>
            <tr className="text-muted">
              <th className="text-left font-normal">First paid month</th>
              <th className="font-normal">Size</th>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <th key={i} className="font-normal">
                  M{i}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((cohort) => (
              <tr key={cohort.month}>
                <th className="text-left font-medium">{cohort.month}</th>
                <td className="text-muted">{cohort.count}</td>
                {Array.from({ length: 6 }, (_, index) => {
                  const cell = cohort.values[index];
                  return (
                    <td key={index}>
                      {cell && cell.rate !== null ? (
                        <button
                          aria-label={`${cohort.month} month ${index}: ${cell.rate.toFixed(0)} percent retained`}
                          onClick={() =>
                            setDetail(
                              `${cohort.month} cohort: ${cell.retained} of ${cohort.count} paying customers retained at ${cell.month} month-end (${cell.rate!.toFixed(1)}%).`,
                            )
                          }
                          className="w-full rounded-sm border border-accent/10 py-2 font-medium focus-visible:outline-2 focus-visible:outline-accent"
                          style={{
                            background: `color-mix(in srgb, var(--accent) ${Math.max(6, cell.rate * 0.36)}%, var(--surface))`,
                          }}
                        >
                          {counts ? cell.retained : `${cell.rate.toFixed(0)}%`}
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-tiny text-muted" role="status">
        {detail}
      </p>
      <p className="mt-2 text-tiny text-muted">
        Cohorts follow the first positive MRR per customer. Retained means at least one positive-MRR
        agreement at month-end; paused/canceled accounts are excluded. Completed months only.
      </p>
    </Card>
  );
}
