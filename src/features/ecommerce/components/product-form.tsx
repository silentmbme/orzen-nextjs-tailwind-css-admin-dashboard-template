"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useCommerce } from "../hooks/use-commerce";
import { validateProduct } from "../schemas/validation";
import { demoDate, productPhotos, stores, type Product } from "../types";
export function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product?: Product;
  onSave: (id: string) => void;
  onCancel: () => void;
}) {
  const { data, update } = useCommerce();
  const [draft, setDraft] = useState<Product>(() =>
    product
      ? { ...product }
      : {
          id: "",
          name: "",
          sku: "",
          categoryId: data.categories[0]?.id || "",
          storeId: "main",
          price: 0,
          compareAt: 0,
          stock: 0,
          reorderLevel: 10,
          status: "Draft",
          description: "",
          images: [productPhotos[0].src],
          created: demoDate,
        },
  );
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const field = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((old) => ({ ...old, [key]: value }));
  function submit(event: FormEvent) {
    event.preventDefault();
    const message = validateProduct(draft, data);
    if (message) {
      setError(message);
      return;
    }
    const saved = {
      ...draft,
      name: draft.name.trim(),
      sku: draft.sku.trim(),
      id: draft.id || crypto.randomUUID(),
    };
    update((state) => {
      const index = state.products.findIndex((p) => p.id === saved.id);
      if (index >= 0) state.products[index] = { ...saved, stock: state.products[index].stock };
      else {
        state.products.unshift(saved);
        state.movements.unshift({
          id: crypto.randomUUID(),
          productId: saved.id,
          before: 0,
          change: saved.stock,
          after: saved.stock,
          reason: "Initial inventory",
          date: demoDate,
        });
      }
    });
    onSave(saved.id);
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-label">
          Product name *
          <Input
            required
            value={draft.name}
            onChange={(e) => field("name", e.target.value)}
            maxLength={100}
          />
        </label>
        <label className="space-y-1 text-label">
          SKU *
          <Input
            required
            value={draft.sku}
            onChange={(e) => field("sku", e.target.value)}
            maxLength={40}
          />
        </label>
        <label className="space-y-1 text-label">
          Category *
          <Select
            aria-label="Category"
            value={draft.categoryId}
            onChange={(e) => field("categoryId", e.target.value)}
          >
            {data.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-1 text-label">
          Store
          <Select
            aria-label="Store"
            value={draft.storeId}
            onChange={(e) => field("storeId", e.target.value as Product["storeId"])}
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </label>
        {(["price", "compareAt", "stock", "reorderLevel"] as const).map((key) => (
          <label key={key} className="space-y-1 text-label">
            {
              {
                price: "Price ($) *",
                compareAt: "Compare-at price ($)",
                stock: product ? "Stock (adjust in Inventory)" : "Opening stock",
                reorderLevel: "Reorder level",
              }[key]
            }
            <Input
              type="number"
              min={key === "price" ? 0.01 : 0}
              step={key === "price" || key === "compareAt" ? "0.01" : "1"}
              required
              readOnly={key === "stock" && !!product}
              value={draft[key]}
              onChange={(e) => field(key, Number(e.target.value))}
            />
          </label>
        ))}
        <label className="space-y-1 text-label">
          Listing status
          <Select
            aria-label="Listing status"
            value={draft.status}
            onChange={(e) => field("status", e.target.value as Product["status"])}
          >
            {["Draft", "Active", "Archived"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </label>
      </div>
      <label className="block space-y-1 text-label">
        Description *
        <textarea
          required
          value={draft.description}
          onChange={(e) => field("description", e.target.value)}
          maxLength={1500}
          className="min-h-20 w-full rounded-control border border-border bg-surface p-2 outline-accent"
        />
      </label>
      <fieldset>
        <legend className="mb-2 text-label">Catalog photos (select up to four)</legend>
        <div className="flex flex-wrap gap-2">
          {productPhotos.map((photo) => (
            <Button
              key={photo.name}
              type="button"
              variant={draft.images.includes(photo.src) ? "primary" : "outline"}
              aria-pressed={draft.images.includes(photo.src)}
              onClick={() =>
                field(
                  "images",
                  draft.images.includes(photo.src)
                    ? draft.images.filter((src) => src !== photo.src)
                    : [...draft.images, photo.src].slice(0, 4),
                )
              }
            >
              {photo.name}
            </Button>
          ))}
        </div>
        <label className="mt-3 block space-y-1 text-label">
          Or upload photos · PNG/JPEG/WebP · up to 4 × 400 KB
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            multiple
            onChange={async (event) => {
              const files = Array.from(event.target.files || []);
              if (
                files.length > 4 ||
                files.some(
                  (file) =>
                    file.size > 400 * 1024 ||
                    !["image/png", "image/jpeg", "image/webp"].includes(file.type),
                )
              ) {
                setError("Select up to four PNG, JPEG or WebP images under 400 KB each.");
                return;
              }
              setUploading(true);
              try {
                const images = await Promise.all(
                  files.map(
                    (file) =>
                      new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(String(reader.result));
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      }),
                  ),
                );
                if (images.length) field("images", images);
                setError("");
              } catch {
                setError("Photos could not be read. Please try again.");
              } finally {
                setUploading(false);
              }
            }}
          />
        </label>
        <p className="mt-1 text-tiny text-muted">
          {draft.images.length} photo(s) selected. Uploaded images are stored locally.
        </p>
      </fieldset>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={uploading}>
          Save demo product
        </Button>
      </div>
    </form>
  );
}
