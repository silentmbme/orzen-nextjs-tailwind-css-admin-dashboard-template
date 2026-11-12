"use client";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { currency, shortDate, stages, type Opportunity, type Stage } from "../types";

export function OpportunityCard({
  deal,
  company,
  focused,
  onEdit,
  onMove,
}: {
  deal: Opportunity;
  company: string;
  focused?: boolean;
  onEdit: () => void;
  onMove: (stage: Stage) => void;
}) {
  return (
    <Card
      id={deal.id}
      className={`crm-opportunity ${focused ? "crm-opportunity-focused" : ""}`}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", deal.id);
        event.dataTransfer.effectAllowed = "move";
      }}
    >
      <div className="crm-opportunity-top">
        <Badge
          tone={
            deal.health === "At risk" ? "danger" : deal.health === "Healthy" ? "success" : "neutral"
          }
        >
          {deal.health}
        </Badge>
        <GripVertical size={13} aria-label="Drag to another stage" />
      </div>
      <button className="crm-record-name" onClick={onEdit}>
        {deal.name}
      </button>
      <span className="crm-subline">{company}</span>
      <strong>{currency(deal.value)}</strong>
      <div className="crm-opportunity-meta">
        <span>{deal.probability}% probability</span>
        <span>Close {shortDate(deal.closeDate)}</span>
      </div>
      <div className="crm-opportunity-owner">
        <Image
          src={`/images/sales-team/${deal.owner.toLowerCase().replaceAll(" ", "-")}.webp`}
          alt=""
          width={22}
          height={22}
        />
        <span>{deal.owner}</span>
      </div>
      <Select
        aria-label={`Stage for ${deal.name}`}
        value={deal.stage}
        onChange={(event) => onMove(event.target.value as Stage)}
      >
        {stages.map((stage) => (
          <option key={stage}>{stage}</option>
        ))}
      </Select>
    </Card>
  );
}
