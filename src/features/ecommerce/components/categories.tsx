"use client";
import { CommerceCardTitle } from "@/features/ecommerce/components/commerce-ui";
import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { CommerceWorkspace } from "./commerce-workspace";
import { useCommerce } from "../hooks/use-commerce";
import type { Category } from "../types";
export function Categories() {
  const { data, update } = useCommerce();
  const [draft, setDraft] = useState<Category | null>(null),
    [error, setError] = useState("");
  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (
      !draft.name.trim() ||
      data.categories.some(
        (c) => c.id !== draft.id && c.name.toLowerCase() === draft.name.trim().toLowerCase(),
      )
    ) {
      setError("Enter a unique category name.");
      return;
    }
    update((state) => {
      const category = { ...draft, name: draft.name.trim(), id: draft.id || crypto.randomUUID() };
      const index = state.categories.findIndex((c) => c.id === category.id);
      if (index >= 0) state.categories[index] = category;
      else state.categories.push(category);
    });
    setDraft(null);
  }
  return (
    <CommerceWorkspace
      title="Categories"
      description="Organize the demo product catalog."
      actions={
        <Button
          onClick={() => {
            setError("");
            setDraft({ id: "", name: "", description: "" });
          }}
        >
          Add category
        </Button>
      }
    >
      <Card title={<CommerceCardTitle label="Catalog categories" />}>
        <DataTable
          label="Categories"
          rows={data.categories}
          rowKey={(c) => c.id}
          columns={[
            { key: "name", label: "Name", value: (c) => c.name },
            { key: "description", label: "Description", value: (c) => c.description },
            {
              key: "count",
              label: "Products",
              value: (c) => data.products.filter((p) => p.categoryId === c.id).length,
            },
            {
              key: "edit",
              label: "Manage",
              value: (c) => c.name,
              render: (c) => (
                <Button
                  variant="outline"
                  onClick={() => {
                    setError("");
                    setDraft({ ...c });
                  }}
                >
                  Edit
                </Button>
              ),
            },
          ]}
        />
      </Card>
      <Dialog
        open={!!draft}
        title={draft?.id ? "Edit category" : "Add category"}
        onClose={() => setDraft(null)}
      >
        {draft && (
          <form className="space-y-3" onSubmit={save}>
            <label className="block space-y-1 text-label">
              Name *
              <Input
                required
                maxLength={60}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="block space-y-1 text-label">
              Description
              <Input
                maxLength={200}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </label>
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDraft(null)}>
                Cancel
              </Button>
              <Button type="submit">Save category</Button>
            </div>
          </form>
        )}
      </Dialog>
    </CommerceWorkspace>
  );
}
