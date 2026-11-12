"use client";
import { useState } from "react";
import { Columns3, List, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable, type DataColumn } from "@/components/ui/data-table";
import { CrmWorkspace } from "./crm-workspace";
import { RecordEditor } from "./record-editor";
import { OpportunityCard } from "./opportunity-card";
import { useCrm } from "../hooks/use-crm";
import { crmService } from "../demo-service";
import { currency, owners, pipelines, stages, type Opportunity, type Stage } from "../types";

export function PipelineBoard({ focusId }: { focusId?: string }) {
  const { data } = useCrm();
  const [query, setQuery] = useState("");
  const [pipeline, setPipeline] = useState("All pipelines");
  const [owner, setOwner] = useState("All owners");
  const [stageFilter, setStageFilter] = useState("All stages");
  const [sort, setSort] = useState("value");
  const [view, setView] = useState("board");
  const [editor, setEditor] = useState<Opportunity | "new" | null>(null);
  const [over, setOver] = useState<Stage | null>(null);
  const [message, setMessage] = useState("");
  const companyName = (id: string) =>
    data.companies.find((company) => company.id === id)?.name || "Unknown company";
  const deals = data.opportunities
    .filter(
      (deal) =>
        (pipeline === "All pipelines" || deal.pipeline === pipeline) &&
        (owner === "All owners" || deal.owner === owner) &&
        (stageFilter === "All stages" || deal.stage === stageFilter) &&
        `${deal.name} ${companyName(deal.companyId)}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "value" ? b.value - a.value : a.closeDate.localeCompare(b.closeDate),
    );
  const move = (deal: Opportunity, stage: Stage) => {
    crmService.moveDeal(deal.id, stage);
    setMessage(`${deal.name} moved to ${stage}. Saved in this browser.`);
  };
  const focused = data.opportunities.find((deal) => deal.id === focusId);
  const columns: DataColumn<Opportunity>[] = [
    {
      key: "name",
      label: "Opportunity",
      value: (deal) => deal.name,
      render: (deal) => (
        <button className="crm-record-name" onClick={() => setEditor(deal)}>
          {deal.name}
        </button>
      ),
    },
    {
      key: "company",
      label: "Company",
      value: (deal) => companyName(deal.companyId),
    },
    {
      key: "value",
      label: "Value",
      value: (deal) => deal.value,
      render: (deal) => currency(deal.value),
    },
    {
      key: "stage",
      label: "Stage",
      value: (deal) => deal.stage,
      render: (deal) => <Badge>{deal.stage}</Badge>,
    },
    {
      key: "health",
      label: "Health",
      value: (deal) => deal.health,
      render: (deal) => (
        <Badge tone={deal.health === "At risk" ? "danger" : "neutral"}>{deal.health}</Badge>
      ),
    },
    { key: "owner", label: "Owner", value: (deal) => deal.owner },
    { key: "closeDate", label: "Close date", value: (deal) => deal.closeDate },
  ];
  return (
    <CrmWorkspace>
      <div className="crm-page-heading">
        <div>
          <h2>Deal pipeline</h2>
          <p>
            Drag cards between stages or use each card&apos;s stage selector. All changes are local.
          </p>
        </div>
        <Button variant="dark" onClick={() => setEditor("new")}>
          <Plus size={13} />
          Add opportunity
        </Button>
      </div>
      <div className="crm-filter-bar">
        <Input
          aria-label="Search opportunities"
          value={query}
          placeholder="Search opportunity or company..."
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          aria-label="Deal pipeline"
          value={pipeline}
          onChange={(event) => setPipeline(event.target.value)}
        >
          <option>All pipelines</option>
          {pipelines.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
        <Select
          aria-label="Deal owner"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
        >
          <option>All owners</option>
          {owners.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
        <Select
          aria-label="Deal stage"
          value={stageFilter}
          onChange={(event) => setStageFilter(event.target.value)}
        >
          <option>All stages</option>
          {stages.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </Select>
        <Select
          aria-label="Deal sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="value">Highest value first</option>
          <option value="close">Closing soonest</option>
        </Select>
        <Button aria-pressed={view === "board"} onClick={() => setView("board")}>
          <Columns3 size={13} />
          Board
        </Button>
        <Button aria-pressed={view === "list"} onClick={() => setView("list")}>
          <List size={13} />
          List
        </Button>
      </div>
      <div className="crm-board-summary">
        <span>{deals.length} opportunities</span>
        <b>{currency(deals.reduce((sum, deal) => sum + deal.value, 0))} total value</b>
        {focused && (
          <Button size="sm" onClick={() => setEditor(focused)}>
            Open linked deal: {focused.name}
          </Button>
        )}
      </div>
      {message && (
        <p className="crm-save-message" role="status">
          {message}
        </p>
      )}
      {view === "list" ? (
        <Card title="OPPORTUNITY REGISTER">
          <DataTable
            rows={deals}
            columns={columns}
            rowKey={(deal) => deal.id}
            label="Opportunities"
            pageSize={6}
          />
        </Card>
      ) : (
        <div className="crm-board-scroll" tabIndex={0} aria-label="Sales pipeline board">
          <div className="crm-board">
            {stages
              .filter((stage) => stageFilter === "All stages" || stageFilter === stage)
              .map((stage, i) => {
                const group = deals.filter((deal) => deal.stage === stage);
                return (
                  <section
                    key={stage}
                    className={`crm-board-column ${over === stage ? "crm-drop-target" : ""}`}
                    aria-label={`${stage} stage`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                      setOver(stage);
                    }}
                    onDragLeave={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node)) setOver(null);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      setOver(null);
                      const deal = data.opportunities.find(
                        (item) => item.id === event.dataTransfer.getData("text/plain"),
                      );
                      if (deal) move(deal, stage);
                    }}
                  >
                    <div className="crm-board-column-heading">
                      <span>
                        <i className={`crm-board-dot crm-stage-dot-${i}`} />
                        {stage}
                        <Badge>{group.length}</Badge>
                      </span>
                      <b>{currency(group.reduce((sum, deal) => sum + deal.value, 0))}</b>
                    </div>
                    <div className="crm-board-cards">
                      {group.map((deal) => (
                        <OpportunityCard
                          key={deal.id}
                          deal={deal}
                          company={companyName(deal.companyId)}
                          focused={deal.id === focusId}
                          onEdit={() => setEditor(deal)}
                          onMove={(stage) => move(deal, stage)}
                        />
                      ))}
                      {!group.length && (
                        <EmptyState>No matching deals. Drop a card here.</EmptyState>
                      )}
                    </div>
                  </section>
                );
              })}
          </div>
        </div>
      )}
      {editor && (
        <RecordEditor
          key={editor === "new" ? "new" : editor.id}
          entity="opportunity"
          record={editor === "new" ? undefined : editor}
          open
          onClose={() => setEditor(null)}
        />
      )}
    </CrmWorkspace>
  );
}
