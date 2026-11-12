import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeftRight,
  Boxes,
  Calculator,
  ChartColumn,
  ChartNoAxesCombined,
  ContactRound,
  CreditCard,
  Images,
  Layers3,
  ListChecks,
  ListTodo,
  MessageSquare,
  Package,
  PackageCheck,
  PackageOpen,
  PackageSearch,
  ReceiptText,
  RotateCcw,
  Shapes,
  ShoppingBag,
  ShoppingBasket,
  Star,
  TicketPercent,
  Trophy,
  Truck,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { Product } from "../types";
const cardIcons = {
  "Catalog categories": Shapes,
  "Discount codes": TicketPercent,
  "Customer directory": ContactRound,
  "Stock management": Boxes,
  "Inventory movement ledger": ArrowLeftRight,
  "Ordered items": Package,
  "Shipping timeline": Truck,
  "Update fulfilment": PackageCheck,
  Customer: UserRound,
  "Payment summary": CreditCard,
  "Order register": ReceiptText,
  "Product gallery": Images,
  "Catalog readiness": ListChecks,
  "Orders containing this product": ShoppingBag,
  "Customer feedback": MessageSquare,
  "Inventory movement": ArrowLeftRight,
  "Product details": PackageOpen,
  "Product information": Package,
  "Product performance": ChartNoAxesCombined,
  "Product catalog": ShoppingBag,
  "Refund tracking": RotateCcw,
  "Rating distribution": Star,
  "Basket intelligence": ShoppingBasket,
  "Category composition": Layers3,
  "Customer intelligence": UsersRound,
  "Replenishment watch": PackageSearch,
  "Fulfilment control": Truck,
  "Order value distribution": ChartColumn,
  "Revenue reconciliation": Calculator,
  "Revenue performance": ChartNoAxesCombined,
  "Best-selling products": Trophy,
  "Recent orders": ReceiptText,
  "Returns & refunds": RotateCcw,
  "Operations action center": ListTodo,
} as const;
export function CommerceCardTitle({ label }: { label: keyof typeof cardIcons }) {
  const Icon = cardIcons[label];
  return (
    <span aria-label={label} className="inline-flex min-w-0 items-center gap-1.5">
      <Icon size={14} aria-hidden="true" className="shrink-0" />
      <span>{label}</span>
    </span>
  );
}
export function ProductThumb({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <Image
      src={product.images[0] || "/images/ecommerce/headphones.webp"}
      alt={product.name}
      width={large ? 640 : 48}
      height={large ? 640 : 48}
      unoptimized={product.images[0]?.startsWith("data:")}
      className={
        large
          ? "aspect-square w-full rounded-card object-cover"
          : "h-10 w-10 shrink-0 rounded-control object-cover"
      }
    />
  );
}
export function ProductIdentity({ product }: { product: Product }) {
  return (
    <Link href={`/apps/ecommerce/products/${product.id}`} className="flex items-center gap-2">
      <ProductThumb product={product} />
      <span className="min-w-0">
        <span className="block font-medium">{product.name}</span>
        <span className="block text-tiny text-muted">{product.sku}</span>
      </span>
    </Link>
  );
}
export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      tone={
        ["Delivered", "Paid", "Published", "Completed", "Active"].includes(status)
          ? "success"
          : ["Returned", "Cancelled", "Rejected", "Expired", "Hidden"].includes(status)
            ? "danger"
            : "neutral"
      }
    >
      {status}
    </Badge>
  );
}
export function InventoryIndicator({ product }: { product: Product }) {
  return (
    <Badge tone={product.stock <= product.reorderLevel ? "danger" : "success"}>
      {product.stock} units ·{" "}
      {product.stock === 0
        ? "Out of stock"
        : product.stock <= product.reorderLevel
          ? "Low stock"
          : "In stock"}
    </Badge>
  );
}
