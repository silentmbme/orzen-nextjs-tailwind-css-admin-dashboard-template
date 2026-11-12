"use client";
import { useState } from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { EmptyState } from "@/components/ui/empty-state";
import { currency, isOpenDeal, type Opportunity } from "@/features/crm/types";

export function DealRiskMatrix({ deals }: { deals: Opportunity[] }) {
  const [selection, setSelection] = useState<number | null>(null);
  const open = deals.filter(isOpenDeal);
  const bucket = (deal: Opportunity) =>
    (deal.value >= 75000 ? 0 : deal.value >= 30000 ? 1 : 2) * 3 +
    (deal.health === "Healthy" ? 0 : deal.health === "Watch" ? 1 : 2);
  const selected = open.filter((deal) => bucket(deal) === selection);
  return (
    <ChartCard
      title={
        <>
          <ShieldAlert size={14} /> DEAL RISK MATRIX
        </>
      }
      action={<span className="crm-muted">Select a cell</span>}
    >
      <div className="crm-risk-matrix">
        <span />
        {["Healthy", "Watch", "At risk"].map((label) => (
          <small key={label}>{label}</small>
        ))}
        {["$75k+", "$30–75k", "Under $30k"].map((label, row) => (
          <div className="crm-risk-row" key={label}>
            <small>{label}</small>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              const count = open.filter((deal) => bucket(deal) === index).length;
              return (
                <button
                  key={col}
                  className={`crm-risk-cell crm-risk-${col}`}
                  aria-pressed={selection === index}
                  aria-label={`${label}, ${["Healthy", "Watch", "At risk"][col]}: ${count} opportunities`}
                  onClick={() => setSelection(selection === index ? null : index)}
                >
                  <b>{count}</b>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {selection === null ? (
        <p className="crm-footnote">
          Value against deal health. Prioritize high-value opportunities in the rightmost column.
        </p>
      ) : (
        <div className="crm-risk-results">
          {selected.length ? (
            selected.map((deal) => (
              <Link key={deal.id} href={`/crm/deals?deal=${deal.id}`}>
                {deal.name}
                <b>{currency(deal.value)}</b>
              </Link>
            ))
          ) : (
            <EmptyState>No deals in this segment.</EmptyState>
          )}
        </div>
      )}
    </ChartCard>
  );
}
