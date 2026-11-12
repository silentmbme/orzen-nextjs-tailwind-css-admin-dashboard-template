"use client";
import { useState } from "react";
import { UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SaasWorkspace } from "./saas-workspace";
import { SaasTitle, StatusBadge } from "./saas-ui";
import { CustomerDetails } from "./customer-details";
import { useSaas } from "../hooks/use-saas";
import { customerHealth, lifetimeValue } from "../selectors";
import { latestDate, money } from "../types";
export function CustomerDirectory() {
  const { data } = useSaas(),
    [query, setQuery] = useState(""),
    [health, setHealth] = useState("all"),
    [plan, setPlan] = useState("all"),
    [selected, setSelected] = useState(""),
    [page, setPage] = useState(0),
    [modal, setModal] = useState(false);
  const customers = data.customers.filter(
    (c) =>
      `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(query.trim().toLowerCase()) &&
      (health === "all" || customerHealth(data, c.id) === health) &&
      (plan === "all" ||
        data.subscriptions.some((s) => s.customerId === c.id && s.planId === plan)),
  );
  const currentPage = Math.min(page, Math.max(0, Math.ceil(customers.length / 5) - 1)),
    active = customers.find((c) => c.id === selected) || customers[0];
  return (
    <SaasWorkspace
      title="SaaS customers"
      description="Account relationships, engagement signals and recurring history."
      actions={
        active && (
          <Button variant="outline" onClick={() => setModal(true)}>
            Open customer profile
          </Button>
        )
      }
    >
      <div className="grid items-start gap-widget xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card
          title={<SaasTitle icon={UsersRound}>Account directory</SaasTitle>}
          action={<span className="text-tiny text-muted">{customers.length} accounts</span>}
        >
          <div className="mt-3 space-y-2">
            <Input
              className="w-full"
              aria-label="Search SaaS customers"
              placeholder="Search customer, company or email…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Select
                aria-label="Customer health filter"
                value={health}
                onChange={(e) => {
                  setHealth(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">All health states</option>
                {["Healthy", "Watch", "At risk"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
              <Select
                aria-label="Customer plan filter"
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setPage(0);
                }}
              >
                <option value="all">All plans</option>
                {data.plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {customers.slice(currentPage * 5, currentPage * 5 + 5).map((customer) => {
              const subs = data.subscriptions.filter((s) => s.customerId === customer.id);
              return (
                <button
                  key={customer.id}
                  aria-pressed={active?.id === customer.id}
                  onClick={() => setSelected(customer.id)}
                  className={`block w-full rounded-control border p-3 text-left transition-colors ${active?.id === customer.id ? "border-accent bg-accent/5" : "border-border bg-surface hover:border-accent/40"}`}
                >
                  <div className="flex items-center gap-2">
                    <UserAvatar name={customer.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-body font-medium">{customer.company}</p>
                      <p className="mt-1 text-label text-muted">{customer.name}</p>
                    </div>
                    <StatusBadge status={customerHealth(data, customer.id)} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-tiny">
                    <span className="text-muted">
                      {subs
                        .map(
                          (s) => `${data.plans.find((p) => p.id === s.planId)?.name} · ${s.status}`,
                        )
                        .join(" / ") || "No subscriptions"}
                    </span>
                    <span className="text-right font-medium">
                      {money(lifetimeValue(data, customer.id))} LTV
                    </span>
                    <span className="text-muted">
                      Last active{" "}
                      {latestDate(
                        data.usage.filter((u) => u.customerId === customer.id && u.activeUsers > 0),
                      ) || "Never"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          {!customers.length && <EmptyState>No customers match these filters.</EmptyState>}
          <TablePagination
            label="SaaS customers"
            count={customers.length}
            currentPage={currentPage}
            pageCount={Math.max(1, Math.ceil(customers.length / 5))}
            pageSize={5}
            onPageChange={setPage}
          />
        </Card>
        {active ? (
          <CustomerDetails key={active.id} id={active.id} />
        ) : (
          <Card>
            <EmptyState>Choose an account to see its details.</EmptyState>
          </Card>
        )}
      </div>
      <Dialog
        open={modal && !!active}
        title="SaaS customer profile"
        onClose={() => setModal(false)}
      >
        {modal && active && <CustomerDetails key={active.id} id={active.id} />}
      </Dialog>
    </SaasWorkspace>
  );
}
