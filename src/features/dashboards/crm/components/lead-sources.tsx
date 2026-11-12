"use client";
import { useState } from "react";
import Link from "next/link";
import { Waypoints } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Lead } from "@/features/crm/types";

export function LeadSources({ leads }: { leads: Lead[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sources = [...new Set(leads.map((lead) => lead.source))]
    .map((name) => {
      const group = leads.filter((lead) => lead.source === name);
      return {
        name,
        count: group.length,
        qualified: group.filter(
          (lead) => lead.status === "Qualified" || lead.status === "Converted",
        ).length,
        score: Math.round(group.reduce((sum, lead) => sum + lead.score, 0) / group.length),
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const active = sources.find((source) => source.name === selected);
  return (
    <Card
      className="crm-lead-sources"
      title={
        <>
          <Waypoints size={14} /> LEAD SOURCES
        </>
      }
      action={
        <Link href="/crm/leads" className="crm-text-link">
          Lead workspace
        </Link>
      }
    >
      <div className="crm-source-summary">
        <strong>{leads.length}</strong>
        <span>leads from {sources.length} sources</span>
      </div>
      <div className="crm-source-list">
        {sources.length ? (
          sources.map((source, i) => (
            <button
              key={source.name}
              aria-pressed={selected === source.name}
              onClick={() => setSelected(selected === source.name ? null : source.name)}
            >
              <span>
                <i className={`crm-source-dot-${i % 4}`} />
                <b>{source.name}</b>
                <small>{source.count} leads</small>
              </span>
              <span className="crm-source-track">
                <i
                  className={`crm-source-dot-${i % 4}`}
                  style={{ width: `${leads.length ? (source.count / leads.length) * 100 : 0}%` }}
                />
              </span>
              <strong>{Math.round((source.count / leads.length) * 100)}%</strong>
            </button>
          ))
        ) : (
          <EmptyState>No leads in the selected date range.</EmptyState>
        )}
      </div>
      <p className="crm-source-detail" role="status">
        {active
          ? `${active.qualified} of ${active.count} qualified or converted / Average score ${active.score}/100`
          : "Select a source to view qualification and average lead score."}
      </p>
      <p className="crm-footnote">
        Lead creation dates follow the dashboard date range. All pipelines are included because
        leads have no pipeline assignment.
      </p>
    </Card>
  );
}
