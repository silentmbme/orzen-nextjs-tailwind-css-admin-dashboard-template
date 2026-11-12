"use client";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { CommerceCardTitle, ProductIdentity, InventoryIndicator } from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { demoDate, type Product } from "../types";
export function InventoryTable() {
  const { data, update } = useCommerce(),
    [filter, setFilter] = useState("all"),
    [selected, setSelected] = useState<Product | null>(null),
    [change, setChange] = useState(""),
    [reason, setReason] = useState(""),
    [error, setError] = useState("");
  function save(event: FormEvent) {
    event.preventDefault();
    const quantity = Number(change);
    const current = data.products.find((p) => p.id === selected?.id);
    if (
      !current ||
      !Number.isInteger(quantity) ||
      quantity === 0 ||
      current.stock + quantity < 0 ||
      !reason.trim()
    ) {
      setError("Enter a non-zero whole quantity and reason. Stock cannot become negative.");
      return;
    }
    update((state) => {
      const product = state.products.find((p) => p.id === current.id)!;
      const before = product.stock;
      product.stock += quantity;
      state.movements.unshift({
        id: crypto.randomUUID(),
        productId: product.id,
        before,
        change: quantity,
        after: product.stock,
        reason: reason.trim(),
        date: demoDate,
      });
    });
    setSelected(null);
  }
  return (
    <CommerceWorkspace
      title="Inventory"
      description="Adjust local stock levels and inspect the movement ledger."
    >
      <Card
        title={<CommerceCardTitle label="Stock management" />}
        action={
          <Select
            aria-label="Inventory filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All products</option>
            <option value="low">Low stock only</option>
          </Select>
        }
      >
        <div className="[&_table]:min-w-[640px]">
          <DataTable
            label="Inventory"
            rows={data.products.filter((p) => filter === "all" || p.stock <= p.reorderLevel)}
            rowKey={(p) => p.id}
            pageSize={6}
            columns={[
              {
                key: "product",
                label: "Product",
                value: (p) => `${p.name} ${p.sku}`,
                render: (p) => <ProductIdentity product={p} />,
              },
              {
                key: "stock",
                label: "Available",
                value: (p) => p.stock,
                render: (p) => <InventoryIndicator product={p} />,
              },
              { key: "reorder", label: "Reorder at", value: (p) => p.reorderLevel },
              {
                key: "adjust",
                label: "Manage",
                value: (p) => p.name,
                render: (p) => (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelected(p);
                      setChange("");
                      setReason("");
                      setError("");
                    }}
                  >
                    Adjust stock
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </Card>
      <Card title={<CommerceCardTitle label="Inventory movement ledger" />}>
        <div className="[&_table]:min-w-[650px]">
          <DataTable
            label="Inventory movements"
            rows={data.movements}
            rowKey={(m) => m.id}
            columns={[
              { key: "date", label: "Date", value: (m) => m.date },
              {
                key: "product",
                label: "Product",
                value: (m) => data.products.find((p) => p.id === m.productId)?.name || "Unknown",
              },
              { key: "before", label: "Before", value: (m) => m.before },
              { key: "change", label: "Change", value: (m) => m.change },
              { key: "after", label: "After", value: (m) => m.after },
              { key: "reason", label: "Reason", value: (m) => m.reason },
            ]}
          />
        </div>
      </Card>
      <Dialog open={!!selected} title="Adjust demo inventory" onClose={() => setSelected(null)}>
        {selected && (
          <form onSubmit={save} className="space-y-3">
            <p className="text-label text-muted">
              {selected.name} · Current stock:{" "}
              {data.products.find((p) => p.id === selected.id)?.stock}
            </p>
            <label className="block space-y-1 text-label">
              Quantity change *
              <Input
                type="number"
                step="1"
                required
                placeholder="e.g. 10 or -2"
                value={change}
                onChange={(e) => setChange(e.target.value)}
              />
            </label>
            <label className="block space-y-1 text-label">
              Reason *
              <Input
                required
                maxLength={150}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
            {error && (
              <p className="text-danger" role="alert">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button type="submit">Save adjustment</Button>
            </div>
          </form>
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
