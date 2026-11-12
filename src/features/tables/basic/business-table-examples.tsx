"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

const th = "px-3 py-2.5 text-left text-[11px] font-medium text-muted",
  td = "px-3 py-3 text-[12px]";
const users = [
  {
    name: "Sofia Garcia",
    email: "sofia@orzen.dev",
    department: "Operations",
    role: "Lead",
    status: "Active",
  },
  {
    name: "Alex Morgan",
    email: "alex@orzen.dev",
    department: "Design",
    role: "Designer",
    status: "Active",
  },
  {
    name: "Priya Shah",
    email: "priya@orzen.dev",
    department: "Growth",
    role: "Manager",
    status: "Away",
  },
  {
    name: "Daniel Kim",
    email: "daniel@orzen.dev",
    department: "Engineering",
    role: "Lead",
    status: "Active",
  },
];
const orders = [
  ["#ORD-8421", "Sofia Garcia", "Completed", "$248.00"],
  ["#ORD-8420", "Alex Morgan", "Pending", "$129.00"],
  ["#ORD-8419", "Priya Shah", "Processing", "$484.50"],
  ["#ORD-8418", "Daniel Kim", "Cancelled", "$92.00"],
];
const products = [
  {
    name: "Studio Headphones",
    sku: "AUD-2048",
    image: "headphones",
    category: "Audio",
    stock: 84,
    price: "$129.00",
    status: "Active",
  },
  {
    name: "Orbit Smartwatch",
    sku: "WAT-4092",
    image: "watch",
    category: "Wearables",
    stock: 26,
    price: "$249.00",
    status: "Active",
  },
  {
    name: "Orzen Speaker",
    sku: "SPK-1104",
    image: "speaker",
    category: "Audio",
    stock: 0,
    price: "$89.00",
    status: "Out of stock",
  },
  {
    name: "Arc Controller",
    sku: "GAM-7721",
    image: "controller",
    category: "Gaming",
    stock: 42,
    price: "$74.00",
    status: "Active",
  },
];
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="min-w-[620px]">{children}</div>
    </div>
  );
}
function Status({ value }: { value: string }) {
  const tone =
    value === "Completed" || value === "Active"
      ? "success"
      : value === "Cancelled" || value === "Out of stock"
        ? "danger"
        : "neutral";
  return <Badge tone={tone}>{value}</Badge>;
}
export function BusinessTableExamples() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid min-w-0 gap-3">
      <Card title="Avatar directory" action={<Badge>4 members</Badge>}>
        <Wrap>
          <table className="w-full">
            <caption className="sr-only">User directory with avatars</caption>
            <thead>
              <tr>
                {["User", "Department", "Role", "Status"].map((x) => (
                  <th key={x} scope="col" className={th}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-t border-border">
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <UserAvatar name={user.name} size={34} />
                      <span>
                        <b className="block font-medium">{user.name}</b>
                        <small className="text-[10px] text-muted">{user.email}</small>
                      </span>
                    </span>
                  </td>
                  <td className={td}>{user.department}</td>
                  <td className={td}>{user.role}</td>
                  <td className={td}>
                    <Status value={user.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Wrap>
      </Card>
      <div className="grid min-w-0 gap-3 xl:grid-cols-2">
        <Card title="Order status">
          <Wrap>
            <table className="w-full">
              <caption className="sr-only">Order status records</caption>
              <thead>
                <tr>
                  {["Order", "Customer", "Status", "Total"].map((x) => (
                    <th key={x} scope="col" className={th}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(([id, customer, status, total]) => (
                  <tr key={id} className="border-t border-border">
                    <td className={`${td} font-medium`}>{id}</td>
                    <td className={td}>{customer}</td>
                    <td className={td}>
                      <Status value={status} />
                    </td>
                    <td className={`${td} text-right font-medium`}>{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Wrap>
        </Card>
        <Card title="Nested cell content">
          <Wrap>
            <table className="w-full">
              <caption className="sr-only">Records with layered cell content</caption>
              <thead>
                <tr>
                  {["Workspace", "Owner", "Plan", "Health"].map((x) => (
                    <th key={x} scope="col" className={th}>
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.email} className="border-t border-border">
                    <td className={td}>
                      <b className="block">
                        {["Northstar Studio", "Atlas Finance", "Orbit Labs", "Formo Health"][index]}
                      </b>
                      <small className="text-[10px] text-muted">Updated {index + 1}h ago</small>
                    </td>
                    <td className={td}>
                      <span className="flex items-center gap-2">
                        <UserAvatar name={user.name} size={24} />
                        {user.name}
                      </span>
                    </td>
                    <td className={td}>
                      <b className="block">{index % 2 ? "Growth" : "Scale"}</b>
                      <small className="text-[10px] text-muted">Annual billing</small>
                    </td>
                    <td className={td}>
                      <span className="flex items-center gap-2">
                        <i
                          className={`size-2 rounded-full ${index === 2 ? "bg-amber-500" : "bg-success"}`}
                        />
                        {index === 2 ? "Review" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Wrap>
        </Card>
      </div>
      <Card title="Product inventory">
        <Wrap>
          <table className="w-full">
            <caption className="sr-only">eCommerce product inventory</caption>
            <thead>
              <tr>
                {["Product", "Category", "Stock", "Price", "Status"].map((x) => (
                  <th key={x} scope="col" className={th}>
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.sku} className="border-t border-border">
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center overflow-hidden rounded-lg border border-border bg-surface-alt">
                        <Image
                          src={`/images/ecommerce/${product.image}.webp`}
                          alt=""
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span>
                        <b className="block">{product.name}</b>
                        <small className="text-[10px] text-muted">SKU {product.sku}</small>
                      </span>
                    </span>
                  </td>
                  <td className={td}>{product.category}</td>
                  <td className={td}>{product.stock}</td>
                  <td className={`${td} font-medium`}>{product.price}</td>
                  <td className={td}>
                    <Status value={product.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Wrap>
      </Card>
      <div className="grid min-w-0 gap-3 xl:grid-cols-[1.15fr_.85fr]">
        <Card title="Financial transactions" action={<Badge>USD</Badge>}>
          <Wrap>
            <table className="w-full">
              <caption className="sr-only">Financial transactions and total</caption>
              <thead>
                <tr>
                  {["Transaction", "Date", "Account", "Amount"].map((x) => (
                    <th
                      key={x}
                      scope="col"
                      className={`${th} ${x === "Amount" ? "text-right" : ""}`}
                    >
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Subscription payment", "Nov 09, 2026", "Revenue", "+$4,820.00"],
                  ["Cloud infrastructure", "Nov 08, 2026", "Operations", "−$1,248.50"],
                  ["Partner commission", "Nov 07, 2026", "Revenue", "+$892.00"],
                  ["Software licenses", "Nov 06, 2026", "Operations", "−$428.00"],
                ].map(([label, date, account, amount]) => (
                  <tr key={label} className="border-t border-border">
                    <td className={td}>
                      <b>{label}</b>
                      <small className="block text-[10px] text-muted">Settled</small>
                    </td>
                    <td className={`${td} text-muted`}>{date}</td>
                    <td className={td}>{account}</td>
                    <td
                      className={`${td} text-right font-semibold ${amount.startsWith("+") ? "text-success" : "text-danger"}`}
                    >
                      {amount}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-border bg-surface-alt">
                <tr>
                  <td colSpan={3} className={`${td} font-semibold`}>
                    Net movement
                  </td>
                  <td className={`${td} text-right font-semibold text-success`}>+$4,035.50</td>
                </tr>
              </tfoot>
            </table>
          </Wrap>
        </Card>
        <Card title="Action menu" action={<Badge>Design preview</Badge>}>
          <table className="w-full">
            <caption className="sr-only">User records with action menus</caption>
            <thead>
              <tr>
                <th scope="col" className={th}>
                  Member
                </th>
                <th scope="col" className={`${th} text-right`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="border-t border-border">
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <UserAvatar name={user.name} size={32} />
                      <span className="min-w-0">
                        <b className="block truncate text-[12px]">{user.name}</b>
                        <small className="text-[10px] text-muted">{user.role}</small>
                      </span>
                    </span>
                  </td>
                  <td className={`${td} relative text-right`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Actions for ${user.name}`}
                      aria-expanded={open === user.email}
                      onClick={() => setOpen(open === user.email ? null : user.email)}
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                    {open === user.email && (
                      <div className="absolute right-3 top-11 z-20 w-36 rounded-lg border border-border bg-surface p-1 text-left shadow-lg">
                        <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] hover:bg-surface-alt">
                          <Eye size={12} />
                          View details
                        </button>
                        <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] hover:bg-surface-alt">
                          <Pencil size={12} />
                          Edit preview
                        </button>
                        <button className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[11px] text-danger hover:bg-danger/5">
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-3 flex w-full items-center justify-center gap-1 border-t border-border pt-3 text-[11px] text-muted">
            View all records
            <ChevronDown size={12} />
          </button>
        </Card>
      </div>
    </div>
  );
}
