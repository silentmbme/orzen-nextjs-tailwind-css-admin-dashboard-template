"use client";
import { useState } from "react";
import { ListFilter, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SaasWorkspace } from "./saas-workspace";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { SubscriptionForm } from "./subscription-form";
import { SubscriptionDetailsDrawer } from "./subscription-details-drawer";
import { useSaas } from "../hooks/use-saas";
import { age, money, statuses } from "../types";
export function SubscriptionsTable() {
  const { data } = useSaas(),
    [status, setStatus] = useState("all"),
    [plan, setPlan] = useState("all"),
    [period, setPeriod] = useState("all"),
    [creating, setCreating] = useState(false),
    [selected, setSelected] = useState("");
  const rows = data.subscriptions.filter(
    (s) =>
      (status === "all" || s.status === status) &&
      (plan === "all" || s.planId === plan) &&
      (period === "all" || (age(s.created) >= 0 && age(s.created) < Number(period))),
  );
  return (
    <SaasWorkspace
      title="Subscriptions"
      description="Manage recurring agreements and demo lifecycle changes."
      actions={
        <Button onClick={() => setCreating(true)}>
          <Plus size={13} />
          Create subscription
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {["all", ...statuses].map((value) => (
          <Button
            key={value}
            variant={status === value ? "secondary" : "outline"}
            aria-pressed={status === value}
            onClick={() => setStatus(value)}
          >
            {value === "all" ? "All subscriptions" : value}
            <span className="text-tiny text-muted">
              {data.subscriptions.filter((s) => value === "all" || s.status === value).length}
            </span>
          </Button>
        ))}
      </div>
      <Card
        title={<SaasTitle icon={ListFilter}>Subscription register</SaasTitle>}
        action={<span className="text-tiny text-muted">{rows.length} matching records</span>}
      >
        <div className="my-3 flex flex-wrap gap-2">
          <Select
            aria-label="Subscription status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select
            aria-label="Subscription plan filter"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="all">All plans</option>
            {data.plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Subscription date filter"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="all">All creation dates</option>
            {[30, 90, 180].map((n) => (
              <option key={n} value={n}>
                Created in last {n} days
              </option>
            ))}
          </Select>
          <Button
            variant="ghost"
            onClick={() => {
              setStatus("all");
              setPlan("all");
              setPeriod("all");
            }}
          >
            Reset filters
          </Button>
        </div>
        <div className="[&_table]:min-w-[850px]">
          <DataTable
            label="Subscriptions"
            rows={rows}
            rowKey={(s) => s.id}
            pageSize={6}
            columns={[
              {
                key: "id",
                label: "Subscription",
                value: (s) => s.id,
                render: (s) => (
                  <button className="font-medium text-accent" onClick={() => setSelected(s.id)}>
                    {s.id}
                  </button>
                ),
              },
              {
                key: "customer",
                label: "Customer",
                value: (s) => {
                  const c = data.customers.find((c) => c.id === s.customerId);
                  return `${c?.name} ${c?.company} ${c?.email}`;
                },
                render: (s) => {
                  const c = data.customers.find((c) => c.id === s.customerId)!;
                  return (
                    <div className="flex items-center gap-2">
                      <UserAvatar name={c.name} size={28} />
                      <div>
                        <p className="font-medium">{c.company}</p>
                        <p className="text-tiny text-muted">{c.name}</p>
                      </div>
                    </div>
                  );
                },
              },
              {
                key: "plan",
                label: "Plan",
                value: (s) => data.plans.find((p) => p.id === s.planId)?.name || "Unknown",
              },
              {
                key: "status",
                label: "Status",
                value: (s) => s.status,
                render: (s) => <StatusBadge status={s.status} />,
              },
              { key: "renewal", label: "Renewal", value: (s) => s.renewal },
              {
                key: "amount",
                label: "Amount",
                value: (s) => s.amount,
                render: (s) => (
                  <span>
                    {money(s.amount)}
                    <span className="ml-1 text-tiny text-muted">/{s.cycle.toLowerCase()}</span>
                  </span>
                ),
              },
              {
                key: "manage",
                label: "Manage",
                value: (s) => s.id,
                render: (s) => (
                  <Button variant="outline" onClick={() => setSelected(s.id)}>
                    View details
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Dialog open={creating} title="Create demo subscription" onClose={() => setCreating(false)}>
        {creating && <SubscriptionForm onClose={() => setCreating(false)} />}
      </Dialog>
      {selected && (
        <SubscriptionDetailsDrawer key={selected} id={selected} onClose={() => setSelected("")} />
      )}
    </SaasWorkspace>
  );
}
