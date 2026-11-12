export const demoDate = "2026-11-01";
export const stores = [
  { id: "main", name: "Orzen flagship" },
  { id: "outlet", name: "Orzen outlet" },
] as const;
export type StoreId = (typeof stores)[number]["id"];
export const orderStatuses = [
  "Pending",
  "Processing",
  "Ready to ship",
  "In transit",
  "Delivered",
  "Returned",
  "Cancelled",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type Category = { id: string; name: string; description: string };
export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  storeId: StoreId;
  price: number;
  compareAt: number;
  stock: number;
  reorderLevel: number;
  status: "Active" | "Draft" | "Archived";
  description: string;
  images: string[];
  created: string;
};
export type Customer = {
  id: string;
  name: string;
  email: string;
  region: string;
  address: string;
  joined: string;
};
export type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};
export type Order = {
  id: string;
  customerId: string;
  storeId: StoreId;
  created: string;
  status: OrderStatus;
  payment: "Paid" | "Pending" | "Refunded";
  items: OrderItem[];
  shipping: number;
  tax: number;
  discount: number;
  address: string;
  tracking: string;
  timeline: { status: OrderStatus; date: string }[];
};
export type InventoryMovement = {
  id: string;
  productId: string;
  before: number;
  change: number;
  after: number;
  reason: string;
  date: string;
};
export type Coupon = {
  id: string;
  code: string;
  kind: "Percentage" | "Fixed";
  value: number;
  minSpend: number;
  maxUses: number;
  uses: number;
  expires: string;
  status: "Active" | "Paused";
};
export type Review = {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  comment: string;
  created: string;
  status: "Pending" | "Published" | "Hidden";
};
export type Refund = {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "Requested" | "Approved" | "Rejected" | "Completed";
  created: string;
};
export type CommerceData = {
  categories: Category[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  movements: InventoryMovement[];
  coupons: Coupon[];
  reviews: Review[];
  refunds: Refund[];
};
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
export const shortDate = (value: string) =>
  new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
export const daysAgo = (value: string) =>
  Math.round((Date.parse(demoDate) - Date.parse(value)) / 86400000);
export const round = (value: number) => Math.round(value * 100) / 100;
export function orderTotals(order: Order) {
  const subtotal = round(
    order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  );
  return {
    subtotal,
    total: round(subtotal + order.shipping + order.tax - order.discount),
  };
}
export const couponState = (coupon: Coupon) =>
  coupon.expires < demoDate
    ? "Expired"
    : coupon.uses >= coupon.maxUses
      ? "Usage limit"
      : coupon.status;
export const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Ready to ship", "Cancelled"],
  "Ready to ship": ["In transit", "Cancelled"],
  "In transit": ["Delivered", "Returned"],
  Delivered: ["Returned"],
  Returned: [],
  Cancelled: [],
};
export const productPhotos = ["headphones", "speaker", "watch", "controller"].map((name) => ({
  name,
  src: `/images/ecommerce/${name}.webp`,
}));
