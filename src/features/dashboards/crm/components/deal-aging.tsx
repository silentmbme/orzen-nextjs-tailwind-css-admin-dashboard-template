import { Clock3 } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ageDays, currency, isOpenDeal, type Opportunity } from "@/features/crm/types";

export function DealAging({ deals }: { deals: Opportunity[] }) {
  const open = deals.filter(isOpenDeal);
  const bands = [
    { label: "0–14 days", min: 0, max: 14 },
    { label: "15–30 days", min: 15, max: 30 },
    { label: "31–60 days", min: 31, max: 60 },
    { label: "61+ days", min: 61, max: Infinity },
  ];
  return (
    <ChartCard
      title={
        <>
          <Clock3 size={14} /> DEAL AGING
        </>
      }
      action={<span className="crm-muted">Open deals only</span>}
    >
      <div className="crm-aging-summary">
        <strong>
          {open.length
            ? Math.round(open.reduce((sum, deal) => sum + ageDays(deal.created), 0) / open.length)
            : 0}
          <small>days</small>
        </strong>
        <span>average time in pipeline</span>
      </div>
      <div className="crm-aging-bands">
        {bands.map((band, i) => {
          const group = open.filter(
            (deal) => ageDays(deal.created) >= band.min && ageDays(deal.created) <= band.max,
          );
          return (
            <div key={band.label}>
              <div>
                <span>{band.label}</span>
                <b>{group.length} deals</b>
              </div>
              <div className="crm-aging-track">
                <i
                  className={`crm-band-${i}`}
                  style={{ width: `${open.length ? (group.length / open.length) * 100 : 0}%` }}
                />
              </div>
              <small>{currency(group.reduce((sum, deal) => sum + deal.value, 0))}</small>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
