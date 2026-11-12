import { demoDate, orderTotals, round, type CommerceData, type Order, type Product } from "./types";

const products: Product[] = [
  {
    id: "pr-1",
    name: "Studio wireless headphones",
    sku: "NV-AUD-001",
    categoryId: "cat-1",
    storeId: "main",
    price: 129,
    compareAt: 159,
    stock: 48,
    reorderLevel: 10,
    status: "Active",
    description:
      "Comfortable wireless over-ear headphones with a balanced sound profile and all-day cushioning. Fictional demo product.",
    images: ["/images/ecommerce/headphones.webp"],
    created: "2026-09-01",
  },
  {
    id: "pr-2",
    name: "Pocket portable speaker",
    sku: "NV-AUD-002",
    categoryId: "cat-1",
    storeId: "main",
    price: 79,
    compareAt: 99,
    stock: 6,
    reorderLevel: 10,
    status: "Active",
    description: "A compact woven-fabric speaker for everyday listening. Fictional demo product.",
    images: ["/images/ecommerce/speaker.webp"],
    created: "2026-09-01",
  },
  {
    id: "pr-3",
    name: "Pulse smart watch",
    sku: "NV-WEA-001",
    categoryId: "cat-2",
    storeId: "main",
    price: 149,
    compareAt: 179,
    stock: 18,
    reorderLevel: 8,
    status: "Active",
    description:
      "A streamlined smartwatch with a graphite case and a comfortable silicone strap. Fictional demo product.",
    images: ["/images/ecommerce/watch.webp"],
    created: "2026-09-04",
  },
  {
    id: "pr-4",
    name: "Arc wireless controller",
    sku: "NV-GAM-001",
    categoryId: "cat-3",
    storeId: "main",
    price: 69,
    compareAt: 89,
    stock: 0,
    reorderLevel: 6,
    status: "Active",
    description:
      "An ergonomic wireless controller with responsive inputs and a two-tone finish. Fictional demo product.",
    images: ["/images/ecommerce/controller.webp"],
    created: "2026-09-08",
  },
  {
    id: "pr-5",
    name: "Studio headphones Pro",
    sku: "NV-AUD-003",
    categoryId: "cat-1",
    storeId: "outlet",
    price: 189,
    compareAt: 219,
    stock: 9,
    reorderLevel: 10,
    status: "Active",
    description: "The extended-listening edition of the Studio headphones. Fictional demo variant.",
    images: ["/images/ecommerce/headphones.webp"],
    created: "2026-09-12",
  },
  {
    id: "pr-6",
    name: "Pocket speaker Mini",
    sku: "NV-AUD-004",
    categoryId: "cat-1",
    storeId: "outlet",
    price: 49,
    compareAt: 59,
    stock: 32,
    reorderLevel: 10,
    status: "Active",
    description: "The small-space edition of the Pocket speaker. Fictional demo variant.",
    images: ["/images/ecommerce/speaker.webp"],
    created: "2026-09-15",
  },
  {
    id: "pr-7",
    name: "Pulse watch Sport",
    sku: "NV-WEA-002",
    categoryId: "cat-2",
    storeId: "outlet",
    price: 119,
    compareAt: 149,
    stock: 4,
    reorderLevel: 8,
    status: "Active",
    description:
      "A lightweight edition of the Pulse watch for daily movement. Fictional demo variant.",
    images: ["/images/ecommerce/watch.webp"],
    created: "2026-09-18",
  },
  {
    id: "pr-8",
    name: "Arc controller Studio",
    sku: "NV-GAM-002",
    categoryId: "cat-3",
    storeId: "outlet",
    price: 89,
    compareAt: 99,
    stock: 21,
    reorderLevel: 6,
    status: "Draft",
    description:
      "A studio edition of the Arc controller, currently a draft listing. Fictional demo variant.",
    images: ["/images/ecommerce/controller.webp"],
    created: "2026-09-20",
  },
];
const customers = [
  "Olivia Martin",
  "Jackson Lee",
  "Sophia Brown",
  "Noah Williams",
  "Emma Davis",
  "Liam Wilson",
  "Ava Taylor",
  "Lucas Clark",
].map((name, i) => ({
  id: `cu-${i + 1}`,
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  region: ["North America", "Europe", "Asia Pacific"][i % 3],
  address: `${100 + i} Example Avenue, Demo City`,
  joined: `2026-0${7 + (i % 3)}-0${i + 1}`,
}));
const statusCycle: Order["status"][] = [
  "Delivered",
  "In transit",
  "Ready to ship",
  "Processing",
  "Pending",
  "Delivered",
  "Returned",
  "Delivered",
  "Cancelled",
  "Delivered",
];
const orders: Order[] = Array.from({ length: 30 }, (_, i) => {
  const storeId = i % 3 === 0 ? ("outlet" as const) : ("main" as const);
  const pool = products.filter((product) => product.storeId === storeId);
  const selected = [
    pool[(i + 1) % pool.length],
    ...(i % 4 === 0 ? [pool[(i + 2) % pool.length]] : []),
  ];
  const items = selected.map((product, j) => ({
    productId: product.id,
    name: product.name,
    unitPrice: product.price,
    quantity: j === 0 && i % 5 === 0 ? 2 : 1,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const created = new Date(Date.parse(demoDate) - (1 + i * 3) * 86400000)
    .toISOString()
    .slice(0, 10);
  const status = statusCycle[i % statusCycle.length];
  const sequence: Order["status"][] = [
    "Pending",
    "Processing",
    "Ready to ship",
    "In transit",
    "Delivered",
  ];
  const timeline = sequence
    .slice(0, status === "Returned" ? 5 : status === "Cancelled" ? 1 : sequence.indexOf(status) + 1)
    .map((value) => ({ status: value, date: created }));
  if (status === "Returned" || status === "Cancelled") timeline.push({ status, date: created });
  return {
    id: `EC-${1100 + i}`,
    customerId: customers[i % customers.length].id,
    storeId,
    created,
    status,
    payment:
      status === "Returned"
        ? "Refunded"
        : status === "Pending" || status === "Cancelled"
          ? "Pending"
          : "Paid",
    items,
    shipping: 5,
    tax: round(subtotal * 0.08),
    discount: i % 5 === 0 ? 10 : 0,
    address: customers[i % customers.length].address,
    tracking: ["In transit", "Delivered", "Returned"].includes(status) ? `DEMO-${1100 + i}` : "",
    timeline,
  };
});

export const seed: CommerceData = {
  products,
  customers,
  orders,
  categories: [
    {
      id: "cat-1",
      name: "Audio",
      description: "Headphones and portable speakers",
    },
    {
      id: "cat-2",
      name: "Wearables",
      description: "Everyday smart accessories",
    },
    { id: "cat-3", name: "Gaming", description: "Controllers and gaming gear" },
    {
      id: "cat-4",
      name: "Accessories",
      description: "Room for the next collection",
    },
  ],
  movements: products.map((product) => ({
    id: `mv-${product.id}`,
    productId: product.id,
    before: 0,
    change: product.stock,
    after: product.stock,
    reason: "Opening demo stock",
    date: product.created,
  })),
  coupons: [
    {
      id: "cp-1",
      code: "WELCOME10",
      kind: "Percentage",
      value: 10,
      minSpend: 30,
      maxUses: 500,
      uses: 143,
      expires: "2026-12-31",
      status: "Active",
    },
    {
      id: "cp-2",
      code: "SHIP5",
      kind: "Fixed",
      value: 5,
      minSpend: 25,
      maxUses: 100,
      uses: 54,
      expires: "2026-11-30",
      status: "Active",
    },
    {
      id: "cp-3",
      code: "VIP20",
      kind: "Percentage",
      value: 20,
      minSpend: 100,
      maxUses: 100,
      uses: 21,
      expires: "2026-10-20",
      status: "Active",
    },
    {
      id: "cp-4",
      code: "OUTLET15",
      kind: "Fixed",
      value: 15,
      minSpend: 60,
      maxUses: 50,
      uses: 50,
      expires: "2026-11-15",
      status: "Paused",
    },
  ],
  reviews: customers.map((customer, i) => ({
    id: `rv-${i + 1}`,
    customerId: customer.id,
    productId: products[i].id,
    rating: [5, 4, 3, 5, 2, 4, 5, 1][i],
    comment: [
      "Comfortable for long listening sessions.",
      "Good build quality and straightforward setup.",
      "Useful features; the strap could be softer.",
      "Responsive controls and a comfortable grip.",
      "Packaging arrived damaged; support was helpful.",
      "Compact enough for my desk.",
      "A useful everyday companion.",
      "Connection was unreliable on my demo device.",
    ][i],
    created: `2026-10-${20 + i}`,
    status: i < 2 ? "Pending" : i < 6 ? "Published" : "Hidden",
  })),
  refunds: [
    ...orders
      .filter((order) => order.payment === "Refunded")
      .map((order, i) => ({
        id: `rf-done-${i}`,
        orderId: order.id,
        amount: orderTotals(order).total,
        reason: "Returned item (demo)",
        status: "Completed" as const,
        created: order.created,
      })),
    {
      id: "rf-1",
      orderId: orders[0].id,
      amount: 25,
      reason: "Damaged packaging - partial refund requested",
      status: "Requested",
      created: "2026-10-31",
    },
    {
      id: "rf-2",
      orderId: orders[5].id,
      amount: 60,
      reason: "Customer reported a product fault",
      status: "Requested",
      created: "2026-10-30",
    },
    {
      id: "rf-3",
      orderId: orders[4].id,
      amount: 125,
      reason: "Wrong item delivered - full refund requested",
      status: "Requested",
      created: "2026-10-29",
    },
    {
      id: "rf-4",
      orderId: orders[3].id,
      amount: 459,
      reason: "Missing accessories in delivered package",
      status: "Requested",
      created: "2026-10-28",
    },
  ],
};
