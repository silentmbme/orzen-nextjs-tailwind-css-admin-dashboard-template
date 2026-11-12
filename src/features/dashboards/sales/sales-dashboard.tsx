"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownToLine,
  ArrowUpRight,
  ChartNoAxesCombined,
  Check,
  CirclePercent,
  CreditCard,
  Download,
  Ellipsis,
  Gamepad2,
  Gauge,
  Globe2,
  ReceiptText,
  Headphones,
  Package,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Speaker,
  Trophy,
  Users,
  Watch,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { DataTable, type DataColumn } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  invoices,
  type Invoice,
  channels,
  getRevenue,
  money,
  orders,
  palette,
  productSales,
  regions,
  team,
  topProducts,
  type DateRange,
  type Order,
  type Period,
} from "./data";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "./sales.css";

const tick = { fontSize: 10, fill: "var(--muted)" };
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = ["09-11", "11-13", "13-15", "15-17"];
const productIcons = {
  headphones: Headphones,
  speaker: Speaker,
  gamepad: Gamepad2,
  watch: Watch,
};

export function SalesDashboard() {
  const [range, setRange] = useState<DateRange>("current");
  const [period, setPeriod] = useState<Period>("monthly");
  const [productPeriod, setProductPeriod] = useState<"week" | "lastWeek">("week");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [selectedHeat, setSelectedHeat] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notice, setNotice] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const factor = range === "previous" ? 0.89 : 1;
  const revenue = getRevenue(period, range);
  const revenueTotal = revenue.reduce((sum, point) => sum + point.revenue, 0);
  const targetTotal = revenue.reduce((sum, point) => sum + point.target, 0);
  const distribution = channels.map((channel) => ({
    ...channel,
    value: Math.round(channel.value * factor),
  }));
  const channelTotal = distribution.reduce((sum, channel) => sum + channel.value, 0);
  const bars = productSales.map((day) => ({
    ...day,
    units: Math.round(day.units * factor * (productPeriod === "lastWeek" ? 0.83 : 1)),
  }));
  const heat = Array.from({ length: 28 }, (_, i) =>
    Math.round((22 + ((i * 31 + Math.floor(i / 7) * 17) % 96)) * factor),
  );
  const visitorTotal = heat.reduce((sum, count) => sum + count, 0);
  const metrics = [
    {
      label: "TOTAL SALES",
      value: money(1312400 * factor),
      change: "+4.5%",
      up: true,
      icon: ShoppingBag,
    },
    {
      label: "TOTAL ORDERS",
      value: Math.round(1600 * factor).toLocaleString("en-US"),
      change: "-1.1%",
      up: false,
      icon: ShoppingCart,
    },
    {
      label: "TOTAL CUSTOMERS",
      value: Math.round(35270 * factor).toLocaleString("en-US"),
      change: "+3.2%",
      up: true,
      icon: Users,
    },
    {
      label: "CONVERSION RATE",
      value: range === "current" ? "4.53%" : "4.28%",
      change: "+0.25 pp",
      up: true,
      icon: CirclePercent,
    },
  ];
  const shownOrders = orders.map((order) => ({
    ...order,
    amount: Math.round(order.amount * factor),
  }));
  const columns: DataColumn<Order>[] = [
    {
      key: "customer",
      label: "Customer",
      value: (row) => row.customer,
      render: (row) => (
        <button
          className="sales-order-link"
          onClick={() => {
            setSelectedOrder(row);
            dialog.current?.showModal();
          }}
        >
          <b>{row.customer}</b>
          <small>#{row.id}</small>
        </button>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      value: (row) => row.amount,
      render: (row) => money(row.amount),
    },
    {
      key: "status",
      label: "Status",
      value: (row) => row.status,
      render: (row) => (
        <Badge
          tone={
            row.status === "Paid" ? "success" : row.status === "Refunded" ? "danger" : "neutral"
          }
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  const invoiceDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  const invoiceColumns: DataColumn<Invoice>[] = [
    {
      key: "id",
      label: "Invoice",
      value: (row) => row.id,
      render: (row) => <span className="sales-invoice-id">#{row.id}</span>,
    },
    {
      key: "customer",
      label: "Customer",
      value: (row) => row.customer + " " + row.company,
      render: (row) => (
        <span className="sales-invoice-customer">
          <b>{row.customer}</b>
          <small>{row.company}</small>
        </span>
      ),
    },
    {
      key: "issued",
      label: "Issued",
      value: (row) => row.issued,
      render: (row) => <time dateTime={row.issued}>{invoiceDate(row.issued)}</time>,
    },
    {
      key: "due",
      label: "Due date",
      value: (row) => row.due,
      render: (row) => <time dateTime={row.due}>{invoiceDate(row.due)}</time>,
    },
    {
      key: "amount",
      label: "Amount",
      value: (row) => row.amount,
      render: (row) => <strong className="sales-invoice-amount">{money(row.amount)}</strong>,
    },
    {
      key: "status",
      label: "Status",
      value: (row) => row.status,
      render: (row) => (
        <Badge
          tone={row.status === "Paid" ? "success" : row.status === "Overdue" ? "danger" : "neutral"}
        >
          {row.status}
        </Badge>
      ),
    },
  ];
  function exportRevenue() {
    const csv = [
      "Period,Revenue USD,Target USD",
      ...revenue.map((point) => `${point.label},${point.revenue},${point.target}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `orzen-demo-sales-${range}-${period}.csv`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Simulated revenue exported as CSV.");
  }
  return (
    <div className="sales-dashboard">
      <div className="sales-toolbar">
        <div>
          <h2>Sales Dashboard</h2>
          <span>
            Sales overview <span aria-hidden="true">/</span> 2026 demo
          </span>
        </div>
        <div className="right-toolbar">
          <Select
            aria-label="Dashboard date range"
            value={range}
            onChange={(event) => {
              setRange(event.target.value as DateRange);
              setSelectedHeat(null);
            }}
          >
            <option value="current">Current period</option>
            <option value="previous">Previous period</option>
          </Select>
          <details
            className="sales-menu"
            onKeyDown={(event) => {
              if (event.key === "Escape") event.currentTarget.open = false;
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                event.currentTarget.open = false;
            }}
          >
            <summary aria-label="Dashboard actions">
              <Ellipsis size={16} />
            </summary>
            <div>
              <Button
                variant="ghost"
                onClick={(event) => {
                  exportRevenue();
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}
              >
                <ArrowDownToLine size={13} /> Download demo CSV
              </Button>
              <Button
                variant="ghost"
                onClick={(event) => {
                  setRange("current");
                  setPeriod("monthly");
                  setProductPeriod("week");
                  setSelectedChannel(null);
                  setSelectedHeat(null);
                  setNotice("Demo filters reset.");
                  event.currentTarget.closest("details")?.removeAttribute("open");
                }}
              >
                <RotateCcw size={13} /> Reset filters
              </Button>
            </div>
          </details>
          <Button variant="dark" onClick={() => window.print()}>
            <Download size={15} /> Export
          </Button>
        </div>
      </div>
      {notice && (
        <div className="sales-notice" role="status">
          <Check size={14} />
          {notice}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Dismiss message"
            onClick={() => setNotice("")}
          >
            <X size={13} />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 sales-metrics">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            {...metric}
            comparison={range === "current" ? "vs. previous period" : "vs. prior period"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 sales-row">
        <ChartCard
          title={
            <>
              <ChartNoAxesCombined size={14} /> SALES REVENUE
            </>
          }
          className="xl:col-span-2"
          action={
            <Select
              aria-label="Revenue period"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </Select>
          }
          summary={
            <>
              <div>
                <strong>{money(revenueTotal)}</strong>
                <small>
                  {range === "current" ? "Current" : "Previous"} {period} series total
                </small>
              </div>
              <Badge tone={revenueTotal >= targetTotal ? "success" : "neutral"}>
                {((revenueTotal / targetTotal) * 100).toFixed(1)}% of target
              </Badge>
            </>
          }
        >
          <div className="sales-legend">
            <span>
              <i style={{ background: palette.purple }} />
              Revenue
            </span>
            <span>
              <i className="sales-target-dot" />
              Target
            </span>
            <span className="sales-legend-note">USD</span>
          </div>
          <div
            className="sales-revenue-chart"
            role="img"
            aria-label={`${period} revenue ${money(revenueTotal)} compared with target ${money(targetTotal)}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenue} margin={{ top: 12, right: 8, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="sales-revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={palette.purple} stopOpacity={0.42} />
                    <stop offset="100%" stopColor={palette.purple} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
                <XAxis
                  dataKey="label"
                  tick={tick}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={15}
                />
                <YAxis
                  tick={tick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip content={<ChartTooltip currency />} />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  fill="url(#sales-revenue-fill)"
                  stroke={palette.purple}
                  strokeWidth={2}
                />
                <Line
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke={palette.coral}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <ChartCard
          title={
            <>
              <Gauge size={14} /> SALES PERFORMANCE
            </>
          }
          className="sales-performance"
          action={<span className="sales-muted">By channel</span>}
        >
          <div className="sales-donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={64}
                  outerRadius={82}
                  paddingAngle={4}
                  stroke="var(--surface)"
                  isAnimationActive={false}
                >
                  {distribution.map((channel) => (
                    <Cell
                      key={channel.name}
                      fill={channel.color}
                      opacity={!selectedChannel || selectedChannel === channel.name ? 1 : 0.2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip currency />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="sales-donut-center">
              <strong>
                {money(
                  selectedChannel
                    ? distribution.find((channel) => channel.name === selectedChannel)!.value
                    : channelTotal,
                )}
              </strong>
              <small>{selectedChannel ?? "Channel revenue"}</small>
            </div>
          </div>
          <div className="sales-channel-list">
            {distribution.map((channel) => (
              <button
                key={channel.name}
                aria-pressed={selectedChannel === channel.name}
                onClick={() =>
                  setSelectedChannel(selectedChannel === channel.name ? null : channel.name)
                }
              >
                <i style={{ background: channel.color }} />
                <span>
                  {channel.name}
                  <small>
                    {((channel.value / channelTotal) * 100).toFixed(1)}% of channel sales
                  </small>
                </span>
                <b>{money(channel.value)}</b>
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 sales-row">
        <Card
          title={
            <>
              <Users size={14} /> VISITOR ACTIVITY
            </>
          }
          action={<span className="sales-muted">Typical week</span>}
        >
          <div className="sales-widget-kpi">
            <strong>{visitorTotal.toLocaleString("en-US")}</strong>
            <Badge tone="success">+4.5%</Badge>
            <span>visits</span>
          </div>
          <div className="sales-visitor-sources">
            <span>
              Organic search <b>48%</b>
            </span>
            <span>
              Direct <b>32%</b>
            </span>
            <span>
              Referral <b>20%</b>
            </span>
          </div>
          <div className="sales-heatmap">
            <span />
            {weekdays.map((day) => (
              <small key={day}>{day}</small>
            ))}
            {timeSlots.map((slot, row) => (
              <div className="sales-heatmap-row" key={slot}>
                <small>{slot}</small>
                {weekdays.map((day, col) => {
                  const i = row * 7 + col;
                  return (
                    <button
                      key={day}
                      className={`sales-heat sales-heat-${Math.min(3, Math.floor(heat[i] / 30))}`}
                      aria-pressed={selectedHeat === i}
                      aria-label={`${day} ${slot}: ${heat[i]} demo visits`}
                      title={`${day} ${slot}: ${heat[i]} visits`}
                      onClick={() => setSelectedHeat(i)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="sales-heat-caption" role="status">
            {selectedHeat === null
              ? "Select a cell to explore visitor activity"
              : `${weekdays[selectedHeat % 7]}, ${timeSlots[Math.floor(selectedHeat / 7)]}: ${heat[selectedHeat]} simulated visits`}
          </div>
          <div className="sales-heat-key">
            <span>Less</span>
            {[0, 1, 2, 3].map((level) => (
              <i key={level} className={`sales-heat-${level}`} />
            ))}
            <span>More</span>
          </div>
        </Card>
        <ChartCard
          title={
            <>
              <Package size={14} /> PRODUCT SALES
            </>
          }
          action={
            <Select
              aria-label="Product sales period"
              value={productPeriod}
              onChange={(event) => setProductPeriod(event.target.value as "week" | "lastWeek")}
            >
              <option value="week">This week</option>
              <option value="lastWeek">Last week</option>
            </Select>
          }
        >
          <div className="sales-widget-kpi">
            <strong>{bars.reduce((sum, day) => sum + day.units, 0).toLocaleString("en-US")}</strong>
            <Badge tone="success">+8.6%</Badge>
            <span>units sold</span>
          </div>
          <div className="sales-product-chart" role="img" aria-label="Daily product units sold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 10, right: 0, left: -28, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={tick} />
                <YAxis axisLine={false} tickLine={false} tick={tick} />
                <Tooltip cursor={{ fill: "var(--surface-alt)" }} content={<ChartTooltip />} />
                <Bar
                  isAnimationActive={false}
                  dataKey="units"
                  name="Units sold"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={30}
                >
                  {bars.map((day, i) => (
                    <Cell
                      key={day.label}
                      fill={i === 5 ? palette.purple : palette.blue}
                      fillOpacity={i === 5 ? 1 : 0.42}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <Card
          title={
            <>
              <CreditCard size={14} /> RECENT ORDERS
            </>
          }
          action={<Badge>Demo</Badge>}
          className="md:col-span-2 xl:col-span-1"
        >
          <DataTable rows={shownOrders} columns={columns} rowKey={(row) => row.id} label="Orders" />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 sales-row">
        <Card
          title={
            <>
              <ShoppingBag size={14} /> TOP-SELLING PRODUCTS
            </>
          }
          action={<span className="sales-muted">By units</span>}
        >
          <div className="sales-product-list">
            {topProducts.map((product, i) => {
              const Icon = productIcons[product.icon as keyof typeof productIcons];
              return (
                <div key={product.name}>
                  <span className={`sales-product-icon sales-tone-${i}`}>
                    <Icon size={17} />
                  </span>
                  <span>
                    <b>{product.name}</b>
                    <small>
                      {Math.round(product.units * factor)} units - {product.category}
                    </small>
                  </span>
                  <strong>{money(product.revenue * factor)}</strong>
                </div>
              );
            })}
          </div>
          <p className="sales-footnote">Ranked by units sold in the selected demo period.</p>
        </Card>
        <Card
          title={
            <>
              <Globe2 size={14} /> SALES BY REGION
            </>
          }
          action={<span className="sales-muted">Global</span>}
        >
          <div className="sales-widget-kpi">
            <strong>
              {money(regions.reduce((sum, region) => sum + region.revenue * factor, 0))}
            </strong>
            <span>across 4 regions</span>
          </div>
          <div className="sales-region-list">
            {regions.map((region, i) => (
              <div key={region.name}>
                <div>
                  <span>{region.name}</span>
                  <b>{money(region.revenue * factor)}</b>
                </div>
                <div className="sales-region-track">
                  <span
                    className={`sales-tone-${i}`}
                    style={{ width: `${(region.revenue / 1312400) * 100}%` }}
                  />
                </div>
                <small>
                  {((region.revenue / 1312400) * 100).toFixed(1)}% of total{" "}
                  <span>
                    <ArrowUpRight size={11} />
                    {region.change}
                  </span>
                </small>
              </div>
            ))}
          </div>
        </Card>
        <Card
          title={
            <>
              <Trophy size={14} /> SALES TEAM PERFORMANCE
            </>
          }
          action={<Badge>4 members</Badge>}
          className="md:col-span-2 xl:col-span-1"
        >
          <div className="sales-team-list">
            {team.map((member) => {
              const achieved = ((member.revenue * factor) / member.target) * 100;
              return (
                <div key={member.name}>
                  <Image
                    className="sales-team-avatar"
                    src={member.image}
                    alt={`${member.name} portrait`}
                    width={33}
                    height={33}
                    sizes="33px"
                  />
                  <div>
                    <div>
                      <b>{member.name}</b>
                      <strong>{money(member.revenue * factor)}</strong>
                    </div>
                    <small>
                      {member.role}
                      <span>{achieved.toFixed(0)}% of target</span>
                    </small>
                    <progress
                      aria-label={`${member.name} target attainment`}
                      value={achieved}
                      max={100}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="sales-footnote">Individual demo targets - Selected period</p>
        </Card>
      </div>
      <Card
        title={
          <>
            <ReceiptText size={14} /> RECENT INVOICES
          </>
        }
        action={<Badge>Simulated invoices</Badge>}
        className="sales-invoices"
      >
        <p className="sales-invoice-caption">
          Latest billing activity - October 2026 demo snapshot. Search by invoice, customer,
          company, date or status.
        </p>
        <DataTable
          rows={invoices}
          columns={invoiceColumns}
          rowKey={(row) => row.id}
          label="Invoices"
          pageSize={5}
        />
      </Card>
      <dialog ref={dialog} className="sales-order-dialog ui-modal-centered">
        <div>
          <h2>Demo order #{selectedOrder?.id}</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close order details"
            onClick={() => dialog.current?.close()}
          >
            <X size={15} />
          </Button>
        </div>
        {selectedOrder && (
          <>
            <Badge>Simulated order</Badge>
            <dl>
              <dt>Customer</dt>
              <dd>{selectedOrder.customer}</dd>
              <dt>Amount</dt>
              <dd>{money(selectedOrder.amount)}</dd>
              <dt>Status</dt>
              <dd>{selectedOrder.status}</dd>
            </dl>
            <p>
              This sample order is for preview only. No payment or fulfillment action is performed.
            </p>
          </>
        )}
      </dialog>
    </div>
  );
}
