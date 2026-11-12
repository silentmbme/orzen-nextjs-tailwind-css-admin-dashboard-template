"use client";
import { useState } from "react";
import { ArrowRight, Check, GitBranch, RotateCcw, CircleDot, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
const stages = ["New lead", "Qualified", "Proposal", "Won"];
const initialDeals = [
  {
    id: 1,
    name: "Northline expansion",
    company: "Northline",
    value: 12400,
    owner: "Alex Morgan",
    stage: 0,
    next: "Confirm the team's requirements",
  },
  {
    id: 2,
    name: "Olive team workspace",
    company: "Olive Works",
    value: 8600,
    owner: "Priya Shah",
    stage: 0,
    next: "Schedule a discovery conversation",
  },
  {
    id: 3,
    name: "Forma annual plan",
    company: "Forma Studio",
    value: 18200,
    owner: "Sofia Garcia",
    stage: 1,
    next: "Review the proposed rollout",
  },
  {
    id: 4,
    name: "Cloudwell rollout",
    company: "Cloudwell",
    value: 24000,
    owner: "Daniel Kim",
    stage: 2,
    next: "Follow up on the proposal",
  },
  {
    id: 5,
    name: "Cedar onboarding",
    company: "Cedar Lab",
    value: 9600,
    owner: "Alex Morgan",
    stage: 3,
    next: "Prepare the customer handover",
  },
];
export function PipelinePreview() {
  const [deals, setDeals] = useState(initialDeals);
  const [selected, setSelected] = useState<number | null>(null);
  const deal = deals.find((row) => row.id === selected);
  const [notice, setNotice] = useState("");
  const totalValue = deals.reduce((sum, row) => sum + row.value, 0);
  const wonValue = deals.filter((row) => row.stage === 3).reduce((sum, row) => sum + row.value, 0);
  const money = (value: number) => "$" + value.toLocaleString("en-US");
  return (
    <div className="marketing-preview crm-pipeline-preview">
      <div className="crm-board-toolbar">
        <div className="crm-board-brand">
          <span>
            <GitBranch size={19} />
          </span>
          <div>
            <h3>A conversation at every stage.</h3>
            <p>
              Your relationship workspace <span> / </span> Sales pipeline
            </p>
          </div>
        </div>
        <div className="crm-board-toolbar-actions">
          <span className="crm-board-demo">
            <i />
            Interactive preview
          </span>
          <Button
            size="sm"
            onClick={() => {
              setDeals(initialDeals);
              setNotice("Demo pipeline reset.");
            }}
          >
            <RotateCcw size={12} />
            Reset
          </Button>
        </div>
      </div>
      <div className="crm-board-overview">
        <div>
          <small>Pipeline value</small>
          <strong>{money(totalValue)}</strong>
          <span>Across {deals.length} opportunities</span>
        </div>
        <div>
          <small>Open opportunities</small>
          <strong>
            {deals
              .filter((row) => row.stage < 3)
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <span>Moving toward the next milestone</span>
        </div>
        <div>
          <small>Revenue won</small>
          <strong>{money(wonValue)}</strong>
          <span>Ready for a thoughtful handover</span>
        </div>
        <div className="crm-board-team">
          <div>
            {["Alex Morgan", "Sofia Garcia", "Daniel Kim"].map((name) => (
              <UserAvatar key={name} name={name} size={29} />
            ))}
          </div>
          <small>One team. A shared next step.</small>
        </div>
      </div>
      <div className="crm-board-scroll">
        <div className="crm-board-columns">
          {stages.map((stage, index) => {
            const rows = deals.filter((row) => row.stage === index);
            return (
              <div key={stage} className={"crm-board-column crm-stage-" + index}>
                <div className="crm-stage-header">
                  <span className="crm-stage-dot" />
                  <h4>{stage}</h4>
                  <span className="crm-stage-count">{rows.length}</span>
                </div>
                <div className="crm-stage-total">
                  {money(rows.reduce((sum, row) => sum + row.value, 0))}
                  <span>stage value</span>
                </div>
                <div className="crm-stage-deals">
                  {rows.map((row) => (
                    <button
                      type="button"
                      key={row.id}
                      onClick={() => setSelected(row.id)}
                      className="crm-deal-card"
                    >
                      <span className="crm-deal-company">
                        <CircleDot size={11} />
                        {row.company}
                        <ArrowUpRight size={13} />
                      </span>
                      <span className="crm-deal-name">{row.name}</span>
                      <strong>{money(row.value)}</strong>
                      <span className="crm-deal-next">
                        <span>Next step</span>
                        {row.next}
                      </span>
                      <span className="crm-deal-owner">
                        <UserAvatar name={row.owner} size={24} />
                        <span>{row.owner}</span>
                        <ArrowRight size={13} />
                      </span>
                    </button>
                  ))}
                  {rows.length === 0 && (
                    <div className="crm-stage-empty">
                      <CircleDot size={20} />
                      <p>Room for the next opportunity.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="crm-board-footer">
        <span role="status">
          <CircleDot size={12} />
          {notice || "Select any deal to explore its next step."}
        </span>
        <span>
          {deals.filter((row) => row.stage === 3).length} of {deals.length} opportunities won
        </span>
      </div>
      <Dialog open={Boolean(deal)} title="Deal preview" onClose={() => setSelected(null)}>
        {deal && (
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <UserAvatar name={deal.owner} size={36} />
              <div>
                <h3 className="text-[16px] font-medium">{deal.name}</h3>
                <p className="text-[11px] text-muted">
                  {deal.company} · {deal.owner}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface-alt p-4">
              <div>
                <p className="text-[10px] text-muted">Opportunity value</p>
                <p className="mt-1 text-[20px] font-semibold">
                  ${deal.value.toLocaleString("en-US")}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted">Current stage</p>
                <p className="mt-2 text-[13px]">{stages[deal.stage]}</p>
              </div>
            </div>
            <p className="text-[12px]">
              <span className="text-muted">Next step:</span> {deal.next}
            </p>
            {deal.stage < 3 ? (
              <Button
                variant="primary"
                onClick={() => {
                  setDeals((current) =>
                    current.map((row) =>
                      row.id === deal.id ? { ...row, stage: row.stage + 1 } : row,
                    ),
                  );
                  setNotice(`${deal.name} moved to ${stages[deal.stage + 1]}. Demo data only.`);
                }}
              >
                Move to {stages[deal.stage + 1]}
                <ArrowRight size={13} />
              </Button>
            ) : (
              <p className="flex items-center gap-2 text-[12px] text-accent">
                <Check size={14} />
                Won · ready for a customer handover
              </p>
            )}
            <p className="text-[10px] text-muted">
              Local simulation. No customer record is changed.
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
