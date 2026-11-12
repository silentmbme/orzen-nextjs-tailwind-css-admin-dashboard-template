import { Filter } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { stages, type Opportunity } from "@/features/crm/types";

export function ConversionFunnel({ deals }: { deals: Opportunity[] }) {
  const rows = [
    "All opportunities",
    "Qualified or beyond",
    "Proposal or beyond",
    "Negotiation or beyond",
    "Won",
  ].map((label, i) => ({
    label,
    value:
      i === 0
        ? deals.length
        : deals.filter((deal) => deal.stage !== "Lost" && stages.indexOf(deal.stage) >= i).length,
  }));
  return (
    <ChartCard
      title={
        <>
          <Filter size={14} /> CONVERSION PATH
        </>
      }
      action={<span className="crm-muted">Current deal snapshot</span>}
    >
      <div className="crm-funnel">
        {rows.map((row, i) => (
          <div key={row.label}>
            <span>{row.label}</span>
            <div className="crm-funnel-lane">
              <div
                style={{
                  width: `${Math.max(8, deals.length ? (row.value / deals.length) * 100 : 0)}%`,
                  opacity: 1 - i * 0.12,
                }}
              >
                <b>{row.value}</b>
              </div>
            </div>
            <small>{deals.length ? Math.round((row.value / deals.length) * 100) : 0}%</small>
          </div>
        ))}
      </div>
      <p className="crm-footnote">
        From first conversation to signed agreement. Filter the command center to explore each
        pipeline.
      </p>
    </ChartCard>
  );
}
