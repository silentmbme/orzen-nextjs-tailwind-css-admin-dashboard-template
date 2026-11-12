import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { currency, isOpenDeal, stages, type Opportunity } from "@/features/crm/types";

export function PipelineOverview({ deals }: { deals: Opportunity[] }) {
  const open = deals.filter(isOpenDeal);
  const total = open.reduce((sum, deal) => sum + deal.value, 0);
  const weighted = open.reduce((sum, deal) => sum + (deal.value * deal.probability) / 100, 0);
  return (
    <Card
      title={
        <>
          <GitBranch size={14} /> OPPORTUNITY WORKSPACE
        </>
      }
      action={
        <Link className="crm-text-link" href="/crm/deals">
          Open pipeline <ArrowRight size={12} />
        </Link>
      }
    >
      <div className="crm-pipeline-intro">
        <div>
          <strong>{currency(total)}</strong>
          <span>open pipeline value</span>
        </div>
        <p>
          <b>{open.length}</b> active opportunities <span>/</span> <b>{currency(weighted)}</b>{" "}
          probability-weighted forecast
        </p>
        <Badge tone={open.some((deal) => deal.health === "At risk") ? "danger" : "success"}>
          {open.filter((deal) => deal.health === "At risk").length} need attention
        </Badge>
      </div>
      <div className="crm-pipeline-flow">
        {stages
          .filter((stage) => stage !== "Lost")
          .map((stage, i) => {
            const current = deals.filter((deal) => deal.stage === stage);
            const reached = deals.filter(
              (deal) => deal.stage !== "Lost" && stages.indexOf(deal.stage) >= i,
            ).length;
            const previous = i
              ? deals.filter((deal) => deal.stage !== "Lost" && stages.indexOf(deal.stage) >= i - 1)
                  .length
              : 0;
            return (
              <div key={stage} className={`crm-pipeline-stage crm-stage-${i}`}>
                <span className="crm-stage-index">0{i + 1}</span>
                <h3>
                  {stage}
                  <span>{current.length}</span>
                </h3>
                <strong>{currency(current.reduce((sum, deal) => sum + deal.value, 0))}</strong>
                <small>
                  {i
                    ? `${previous ? Math.round((reached / previous) * 100) : 0}% progressed from prior stage`
                    : `${reached} deals entered this funnel`}
                </small>
                <div className="crm-stage-health">
                  {current.length
                    ? `${current.filter((deal) => deal.health === "Healthy").length} healthy / ${current.length} deals`
                    : "No opportunities yet"}
                </div>
              </div>
            );
          })}
      </div>
      <p className="crm-footnote">
        Stage progression is inferred from the current deal snapshot; it is not a historical cohort
        report. Lost deals: {deals.filter((deal) => deal.stage === "Lost").length}.
      </p>
    </Card>
  );
}
