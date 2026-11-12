"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { ProductCard } from "./product-card";
import { ProductForm } from "./product-form";
import { CommerceWorkspace } from "./commerce-workspace";
import {
  CommerceCardTitle,
  ProductIdentity,
  InventoryIndicator,
  OrderStatusBadge,
} from "./commerce-ui";
import { useCommerce } from "../hooks/use-commerce";
import { money } from "../types";
export function ProductsTable() {
  const { data } = useCommerce();
  const [category, setCategory] = useState("all"),
    [stock, setStock] = useState("all"),
    [status, setStatus] = useState("all"),
    [grid, setGrid] = useState(false),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("name"),
    [page, setPage] = useState(0);
  const [editing, setEditing] = useState("");
  const editingProduct = data.products.find((product) => product.id === editing);
  const products = data.products.filter(
    (p) =>
      (category === "all" || p.categoryId === category) &&
      (stock === "all" ||
        (stock === "low" ? p.stock <= p.reorderLevel : p.stock > p.reorderLevel)) &&
      (status === "all" || p.status === status),
  );
  const filtered = products
    .filter((p) => `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sort === "price" ? a.price - b.price : a.name.localeCompare(b.name)));
  const current = Math.min(page, Math.max(0, Math.ceil(filtered.length / 6) - 1));
  return (
    <CommerceWorkspace
      title="Products"
      description="Manage your demo catalog, pricing and listing status."
      actions={
        <Link className="ui-button ui-button--dark" href="/apps/ecommerce/products/new">
          Add product
        </Link>
      }
    >
      <Card
        title={<CommerceCardTitle label="Product catalog" />}
        action={
          <div className="flex gap-1">
            <Button
              variant={!grid ? "primary" : "outline"}
              aria-pressed={!grid}
              onClick={() => setGrid(false)}
            >
              Table
            </Button>
            <Button
              variant={grid ? "primary" : "outline"}
              aria-pressed={grid}
              onClick={() => setGrid(true)}
            >
              Grid
            </Button>
          </div>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Select
            aria-label="Category filter"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All categories</option>
            {data.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Stock filter"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All stock levels</option>
            <option value="low">Low / out of stock</option>
            <option value="healthy">Healthy stock</option>
          </Select>
          <Select
            aria-label="Listing filter"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="all">All listings</option>
            {["Active", "Draft", "Archived"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        {grid ? (
          <>
            <div className="mb-3 flex flex-wrap gap-2">
              <Input
                aria-label="Search product grid"
                placeholder="Search name or SKU…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
              />
              <Select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name">Name A–Z</option>
                <option value="price">Price low to high</option>
              </Select>
            </div>
            <div className="grid gap-widget sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(current * 6, current * 6 + 6).map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  category={
                    data.categories.find((category) => category.id === p.categoryId)?.name ||
                    "Uncategorized"
                  }
                  onEdit={() => setEditing(p.id)}
                />
              ))}
            </div>
            {!filtered.length && <EmptyState>No matching products.</EmptyState>}
            <div className="mt-3 flex items-center justify-end gap-2 text-label">
              <span>
                {filtered.length} products · Page {current + 1}
              </span>
              <Button disabled={current === 0} onClick={() => setPage(current - 1)}>
                Previous
              </Button>
              <Button
                disabled={(current + 1) * 6 >= filtered.length}
                onClick={() => setPage(current + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="[&_table]:min-w-[720px]">
            <DataTable
              label="Products"
              rows={products}
              rowKey={(p) => p.id}
              pageSize={6}
              columns={[
                {
                  key: "name",
                  label: "Product",
                  value: (p) => `${p.name} ${p.sku}`,
                  render: (p) => <ProductIdentity product={p} />,
                },
                {
                  key: "category",
                  label: "Category",
                  value: (p) =>
                    data.categories.find((c) => c.id === p.categoryId)?.name || "Uncategorized",
                },
                {
                  key: "price",
                  label: "Price",
                  value: (p) => p.price,
                  render: (p) => money(p.price),
                },
                {
                  key: "stock",
                  label: "Inventory",
                  value: (p) => p.stock,
                  render: (p) => <InventoryIndicator product={p} />,
                },
                {
                  key: "status",
                  label: "Listing",
                  value: (p) => p.status,
                  render: (p) => <OrderStatusBadge status={p.status} />,
                },
              ]}
            />
          </div>
        )}
      </Card>
      <Dialog open={!!editingProduct} title="Edit demo product" onClose={() => setEditing("")}>
        {editingProduct && (
          <ProductForm
            key={editingProduct.id}
            product={editingProduct}
            onSave={() => setEditing("")}
            onCancel={() => setEditing("")}
          />
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
