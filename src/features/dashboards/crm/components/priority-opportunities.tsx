"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Focus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  currency,
  isOpenDeal,
  shortDate,
  type Company,
  type Opportunity,
} from "@/features/crm/types";

export function PriorityOpportunities({
  deals,
  companies,
}: {
  deals: Opportunity[];
  companies: Company[];
}) {
  const [sort, setSort] = useState("value");
  const ranked = deals
    .filter(isOpenDeal)
    .sort((a, b) => (sort === "value" ? b.value - a.value : a.closeDate.localeCompare(b.closeDate)))
    .slice(0, 4);
  return (
    <Card
      className="crm-priority-opportunities"
      title={
        <>
          <Focus size={14} /> PRIORITY OPPORTUNITIES
        </>
      }
      action={
        <Select
          aria-label="Opportunity priority"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="value">Highest value</option>
          <option value="close">Closing soonest</option>
        </Select>
      }
    >
      <div className="crm-priority-list">
        {ranked.length ? (
          ranked.map((deal, i) => (
            <Link key={deal.id} href={`/crm/deals?deal=${deal.id}`}>
              <span className="crm-priority-rank">0{i + 1}</span>
              <span>
                <b>{deal.name}</b>
                <small>
                  {companies.find((company) => company.id === deal.companyId)?.name} / {deal.owner}
                </small>
                <span className="crm-priority-detail">
                  <Badge tone={deal.health === "At risk" ? "danger" : "neutral"}>
                    {deal.health}
                  </Badge>
                  <small>Close {shortDate(deal.closeDate)}</small>
                </span>
              </span>
              <strong>
                {currency(deal.value)}
                <ArrowUpRight size={12} />
              </strong>
            </Link>
          ))
        ) : (
          <EmptyState>No open opportunities in this selection.</EmptyState>
        )}
      </div>
      <p className="crm-footnote">
        Your next four opportunities to review, ranked by value or expected close date.
      </p>
    </Card>
  );
}
