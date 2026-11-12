"use client";
import { useState } from "react";
import { Check, ChartNoAxesCombined, Download, Layers3, Plus, Search, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SaasWorkspace } from "./saas-workspace";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { PlanForm } from "./plan-form";
import { PricingPlanCard } from "./pricing-plan-card";
import { useSaas } from "../hooks/use-saas";
import { currentMrr, mrrAt } from "../selectors";
import { exportCsv } from "../demo-service";
import { money, today } from "../types";
export function PricingPlans() {
  const { data, update } = useSaas();
  const [yearly, setYearly] = useState(false),
    [editor, setEditor] = useState<string | null>(null),
    [deleting, setDeleting] = useState(""),
    [error, setError] = useState("");
  const [query, setQuery] = useState(""),
    [availability, setAvailability] = useState("all"),
    [sort, setSort] = useState("price"),
    [differences, setDifferences] = useState(false),
    [subscribers, setSubscribers] = useState("");
  const plan = data.plans.find((p) => p.id === deleting),
    referenced =
      data.subscriptions.some((s) => s.planId === deleting) ||
      data.movements.some((m) => m.planId === deleting);
  const mrr = (id: string) =>
    data.subscriptions
      .filter((s) => s.planId === id && s.status === "Active")
      .reduce((sum, s) => sum + mrrAt(data, s.id, today), 0);
  const totalMrr = currentMrr(data),
    leading = [...data.plans].sort((a, b) => mrr(b.id) - mrr(a.id))[0];
  const visible = data.plans
    .filter(
      (p) =>
        `${p.name} ${p.description} ${p.features.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (availability === "all" || p.active === (availability === "active")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "mrr"
          ? mrr(b.id) - mrr(a.id)
          : yearly
            ? a.yearly - b.yearly
            : a.monthly - b.monthly,
    );
  const features = [...new Set(visible.flatMap((p) => p.features))];
  const limitRows = [
    { name: "Team seats", key: "seats" as const },
    { name: "API requests / month", key: "api" as const },
    { name: "Storage (GB)", key: "storage" as const },
  ].filter((row) => !differences || new Set(visible.map((p) => p[row.key])).size > 1);
  const featureRows = features.filter(
    (feature) =>
      !differences ||
      (visible.some((p) => p.features.includes(feature)) &&
        !visible.every((p) => p.features.includes(feature))),
  );
  const selectedPlan = data.plans.find((p) => p.id === subscribers);
  function remove() {
    const error = update((state) => {
      if (
        state.subscriptions.some((s) => s.planId === deleting) ||
        state.movements.some((m) => m.planId === deleting)
      )
        throw new Error("Referenced plans cannot be deleted; deactivate the plan instead.");
      state.plans = state.plans.filter((p) => p.id !== deleting);
    });
    if (error) setError(error);
    else setDeleting("");
  }
  function exportComparison() {
    const rows: Record<string, string | number>[] = [
      ...limitRows.map((row) =>
        Object.fromEntries([["Capability", row.name], ...visible.map((p) => [p.name, p[row.key]])]),
      ),
      ...featureRows.map((feature) =>
        Object.fromEntries([
          ["Capability", feature],
          ...visible.map((p) => [
            p.name,
            p.features.includes(feature) ? "Included" : "Not included",
          ]),
        ]),
      ),
    ];
    exportCsv(`plan-comparison-${yearly ? "yearly" : "monthly"}`, rows);
  }
  return (
    <SaasWorkspace
      title="Pricing plans"
      description="Manage your offering, compare capabilities and understand recurring contribution."
      actions={
        <>
          <div className="flex gap-1" aria-label="Pricing display cycle">
            <Button
              variant={!yearly ? "secondary" : "outline"}
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
            >
              Monthly pricing
            </Button>
            <Button
              variant={yearly ? "secondary" : "outline"}
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
            >
              Yearly pricing
            </Button>
          </div>
          <Button onClick={() => setEditor("new")}>
            <Plus size={13} />
            Create plan
          </Button>
        </>
      }
    >
      <Card
        title={<SaasTitle icon={ChartNoAxesCombined}>Offering overview</SaasTitle>}
        action={
          <span className="text-tiny text-muted">Current portfolio · monthly normalized</span>
        }
      >
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-tiny text-muted">Available plans</p>
            <p className="mt-1 text-kpi font-semibold">
              {data.plans.filter((p) => p.active).length}
              <span className="ml-2 text-label font-normal text-muted">
                of {data.plans.length} total
              </span>
            </p>
          </div>
          <div>
            <p className="text-tiny text-muted">Active subscriptions</p>
            <p className="mt-1 text-kpi font-semibold">
              {data.subscriptions.filter((s) => s.status === "Active").length}
            </p>
          </div>
          <div>
            <p className="text-tiny text-muted">Recurring portfolio revenue</p>
            <p className="mt-1 text-kpi font-semibold">{money(totalMrr)}</p>
          </div>
        </div>
        <p className="mt-3 border-t border-border pt-2 text-tiny text-muted">
          Display-cycle changes affect quoted pricing only. Existing agreement amounts and
          historical invoices stay unchanged.
        </p>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute top-2 left-2.5 text-muted" />
            <Input
              aria-label="Search pricing plans"
              placeholder="Search plans or features…"
              className="pl-8!"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select
            aria-label="Plan availability filter"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            <option value="all">All plan states</option>
            <option value="active">Active plans</option>
            <option value="inactive">Inactive plans</option>
          </Select>
          <Select
            aria-label="Sort pricing plans"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="price">Price · low to high</option>
            <option value="mrr">MRR · high to low</option>
            <option value="name">Name · A–Z</option>
          </Select>
          {(query || availability !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setQuery("");
                setAvailability("all");
              }}
            >
              <X size={12} />
              Clear
            </Button>
          )}
        </div>
        <span className="text-tiny text-muted">
          {visible.length} plans shown · {yearly ? "Annual commitment" : "Monthly commitment"}
        </span>
      </div>
      <div className="grid items-stretch gap-widget md:grid-cols-2 xl:grid-cols-3">
        {visible.map((p) => (
          <PricingPlanCard
            key={p.id}
            plan={p}
            yearly={yearly}
            subscribers={
              data.subscriptions.filter((s) => s.planId === p.id && s.status === "Active").length
            }
            mrr={mrr(p.id)}
            totalMrr={totalMrr}
            leading={leading?.id === p.id && mrr(p.id) > 0}
            onEdit={() => setEditor(p.id)}
            onDelete={() => {
              setDeleting(p.id);
              setError("");
            }}
            onSubscribers={() => setSubscribers(p.id)}
          />
        ))}
      </div>
      {!visible.length && (
        <Card>
          <EmptyState>
            No pricing plans match these filters. Clear the search or create a plan.
          </EmptyState>
        </Card>
      )}
      <Card
        title={<SaasTitle icon={Layers3}>Feature comparison</SaasTitle>}
        action={
          <div className="flex flex-wrap gap-1">
            <Button
              variant={differences ? "secondary" : "ghost"}
              size="sm"
              aria-pressed={differences}
              onClick={() => setDifferences(!differences)}
            >
              Differences only
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!visible.length || (!limitRows.length && !featureRows.length)}
              onClick={exportComparison}
            >
              <Download size={12} />
              Export comparison
            </Button>
          </div>
        }
      >
        <p className="mt-2 text-tiny text-muted">
          Compare the currently visible plans. Limits and capabilities are current configuration;
          subscription prices may be grandfathered.
        </p>
        {visible.length && (limitRows.length || featureRows.length) ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left text-label">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-border bg-surface py-3 pr-3 font-medium">
                    Capability
                  </th>
                  {visible.map((p) => (
                    <th key={p.id} className="min-w-32 border-b border-border px-3 py-3">
                      <span className="block font-medium">{p.name}</span>
                      <span className="mt-1 block text-tiny font-normal text-muted">
                        {money(yearly ? p.yearly : p.monthly)} / {yearly ? "year" : "month"}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {limitRows.map((row) => (
                  <tr key={row.key}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-border bg-surface py-3 pr-3 font-normal text-muted"
                    >
                      {row.name}
                    </th>
                    {visible.map((p) => (
                      <td key={p.id} className="border-b border-border px-3 font-medium">
                        {p[row.key].toLocaleString("en-US")}
                      </td>
                    ))}
                  </tr>
                ))}
                {featureRows.map((feature) => (
                  <tr key={feature}>
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-b border-border bg-surface py-3 pr-3 font-normal text-muted"
                    >
                      {feature}
                    </th>
                    {visible.map((p) => (
                      <td key={p.id} className="border-b border-border px-3">
                        {p.features.includes(feature) ? (
                          <span className="inline-flex items-center gap-1.5 text-success">
                            <Check size={12} />
                            <span className="text-tiny">Included</span>
                          </span>
                        ) : (
                          <span className="text-tiny text-muted">Not included</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState>
            {visible.length
              ? "No differences across the visible plans. Switch off Differences only to see all capabilities."
              : "Choose plans to compare by clearing the catalog filters."}
          </EmptyState>
        )}
      </Card>
      <Dialog
        open={editor !== null}
        title={editor === "new" ? "Create plan" : "Edit plan"}
        onClose={() => setEditor(null)}
      >
        {editor !== null && (
          <PlanForm
            key={editor}
            plan={data.plans.find((p) => p.id === editor)}
            onClose={() => setEditor(null)}
          />
        )}
      </Dialog>
      <Dialog open={!!plan} title="Delete pricing plan" onClose={() => setDeleting("")}>
        {plan && (
          <div className="space-y-3">
            <p className="text-label">
              Delete <strong>{plan.name}</strong> from this browser’s demo?
            </p>
            <p className="text-label text-muted">
              {referenced
                ? "This plan is referenced by subscriptions or historical MRR events. Deactivate it to preserve history."
                : "This removes an unreferenced plan. This action cannot be undone."}
            </p>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleting("")}>
                Keep plan
              </Button>
              <Button variant="destructive" disabled={referenced} onClick={remove}>
                Confirm delete
              </Button>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        open={!!selectedPlan}
        title={selectedPlan ? `${selectedPlan.name} subscribers` : "Plan subscribers"}
        onClose={() => setSubscribers("")}
      >
        {selectedPlan && (
          <>
            <p className="mb-3 text-tiny text-muted">
              All subscription states · current plan assignment · existing agreement prices
            </p>
            <div className="[&_table]:min-w-[540px]">
              <DataTable
                label="Plan subscribers"
                rows={data.subscriptions.filter((s) => s.planId === selectedPlan.id)}
                rowKey={(s) => s.id}
                columns={[
                  {
                    key: "customer",
                    label: "Customer",
                    value: (s) =>
                      data.customers.find((c) => c.id === s.customerId)?.company || "Unknown",
                    render: (s) => {
                      const c = data.customers.find((c) => c.id === s.customerId);
                      return (
                        <div className="flex items-center gap-2">
                          <UserAvatar name={c?.name} size={28} />
                          <span>{c?.company}</span>
                        </div>
                      );
                    },
                  },
                  { key: "id", label: "Subscription", value: (s) => s.id },
                  {
                    key: "status",
                    label: "Status",
                    value: (s) => s.status,
                    render: (s) => <StatusBadge status={s.status} />,
                  },
                  {
                    key: "price",
                    label: "Agreement",
                    value: (s) => s.amount,
                    render: (s) => `${money(s.amount)} / ${s.cycle.toLowerCase()}`,
                  },
                ]}
              />
            </div>
          </>
        )}
      </Dialog>
    </SaasWorkspace>
  );
}
