import type { CommerceData, Coupon, Product } from "../types";
export function validateProduct(product: Product, data: CommerceData): string {
  if (!product.name.trim() || !product.sku.trim() || !product.description.trim())
    return "Name, SKU and description are required.";
  if (
    data.products.some(
      (p) => p.id !== product.id && p.sku.toLowerCase() === product.sku.toLowerCase(),
    )
  )
    return "SKU must be unique.";
  if (!data.categories.some((c) => c.id === product.categoryId)) return "Select a valid category.";
  if (
    ![product.price, product.compareAt, product.stock, product.reorderLevel].every(
      (n) => Number.isFinite(n) && n >= 0,
    ) ||
    product.price === 0
  )
    return "Enter a positive price and non-negative inventory values.";
  if (!Number.isInteger(product.stock) || !Number.isInteger(product.reorderLevel))
    return "Inventory quantities must be whole numbers.";
  if (product.compareAt && product.compareAt < product.price)
    return "Compare-at price must be at least the selling price.";
  if (!product.images.length) return "Select at least one product photo.";
  return "";
}
export function validateCoupon(coupon: Coupon, data: CommerceData): string {
  if (!/^[A-Z0-9_-]{3,24}$/.test(coupon.code))
    return "Use 3–24 letters, numbers, underscores or hyphens for the code.";
  if (data.coupons.some((c) => c.id !== coupon.id && c.code === coupon.code))
    return "Coupon code already exists.";
  if (
    !Number.isFinite(coupon.value) ||
    coupon.value <= 0 ||
    (coupon.kind === "Percentage" && coupon.value > 100)
  )
    return "Enter a positive discount; percentage discounts cannot exceed 100%.";
  if (
    !Number.isFinite(coupon.minSpend) ||
    coupon.minSpend < 0 ||
    !Number.isInteger(coupon.maxUses) ||
    coupon.maxUses < Math.max(coupon.uses, 1)
  )
    return "Enter a valid minimum spend and usage limit (at least current usage).";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(coupon.expires)) return "Select an expiration date.";
  return "";
}
