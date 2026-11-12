import { orderStatuses, type CommerceData } from "../types";
type Row = Record<string, unknown>;
const text = (v: unknown): v is string => typeof v === "string";
const positive = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;
const whole = (v: unknown) => positive(v) && Number.isInteger(v);
const date = (v: unknown) =>
  text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v));
const fields = (r: Row, keys: string[]) => keys.every((key) => text(r[key]));
const oneOf = (value: unknown, options: readonly string[]) =>
  text(value) && options.includes(value);
const array = (value: unknown, validate: (row: Row) => boolean): boolean =>
  Array.isArray(value) && value.every((row) => !!row && typeof row === "object" && validate(row));
export function validCommerceData(value: unknown): value is CommerceData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const checks: Record<keyof CommerceData, (row: Row) => boolean> = {
    categories: (r) => fields(r, ["id", "name", "description"]),
    products: (r) =>
      fields(r, ["id", "name", "sku", "categoryId", "description"]) &&
      oneOf(r.storeId, ["main", "outlet"]) &&
      oneOf(r.status, ["Active", "Draft", "Archived"]) &&
      [r.price, r.compareAt].every(positive) &&
      [r.stock, r.reorderLevel].every(whole) &&
      date(r.created) &&
      Array.isArray(r.images) &&
      r.images.length > 0 &&
      r.images.length <= 4 &&
      r.images.every(
        (src) =>
          text(src) &&
          (/^\/images\/ecommerce\/[a-z]+\.webp$/.test(src) ||
            /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src)),
      ),
    customers: (r) => fields(r, ["id", "name", "email", "region", "address"]) && date(r.joined),
    orders: (r) =>
      fields(r, ["id", "customerId", "address", "tracking"]) &&
      oneOf(r.storeId, ["main", "outlet"]) &&
      date(r.created) &&
      oneOf(r.status, orderStatuses) &&
      oneOf(r.payment, ["Paid", "Pending", "Refunded"]) &&
      [r.shipping, r.tax, r.discount].every(positive) &&
      array(
        r.items,
        (i) =>
          fields(i, ["productId", "name"]) &&
          positive(i.unitPrice) &&
          whole(i.quantity) &&
          Number(i.quantity) > 0,
      ) &&
      array(r.timeline, (t) => oneOf(t.status, orderStatuses) && date(t.date)),
    movements: (r) =>
      fields(r, ["id", "productId", "reason"]) &&
      date(r.date) &&
      [r.before, r.after].every(whole) &&
      typeof r.change === "number" &&
      Number.isInteger(r.change) &&
      Number(r.before) + r.change === r.after,
    coupons: (r) =>
      fields(r, ["id", "code"]) &&
      oneOf(r.kind, ["Percentage", "Fixed"]) &&
      positive(r.value) &&
      positive(r.minSpend) &&
      [r.maxUses, r.uses].every(whole) &&
      date(r.expires) &&
      oneOf(r.status, ["Active", "Paused"]),
    reviews: (r) =>
      fields(r, ["id", "productId", "customerId", "comment"]) &&
      date(r.created) &&
      whole(r.rating) &&
      Number(r.rating) >= 1 &&
      Number(r.rating) <= 5 &&
      oneOf(r.status, ["Pending", "Published", "Hidden"]),
    refunds: (r) =>
      fields(r, ["id", "orderId", "reason"]) &&
      date(r.created) &&
      positive(r.amount) &&
      oneOf(r.status, ["Requested", "Approved", "Rejected", "Completed"]),
  };
  if (
    !Object.entries(checks).every(
      ([key, check]) =>
        array(data[key], check) &&
        new Set((data[key] as Row[]).map((r) => r.id)).size === (data[key] as Row[]).length,
    )
  )
    return false;
  const typed = value as CommerceData;
  return (
    typed.products.every((p) => typed.categories.some((c) => c.id === p.categoryId)) &&
    typed.orders.every(
      (o) =>
        typed.customers.some((c) => c.id === o.customerId) &&
        o.items.every((i) => typed.products.some((p) => p.id === i.productId)),
    ) &&
    typed.movements.every((m) => typed.products.some((p) => p.id === m.productId)) &&
    typed.reviews.every(
      (r) =>
        typed.products.some((p) => p.id === r.productId) &&
        typed.customers.some((c) => c.id === r.customerId),
    ) &&
    typed.refunds.every((r) => typed.orders.some((o) => o.id === r.orderId))
  );
}
