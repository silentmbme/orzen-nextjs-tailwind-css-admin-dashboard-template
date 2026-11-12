"use client";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { areaData, gapAreaData, percentageData, rangeData } from "./data";
const axis = { fill: "var(--muted)", fontSize: 8 };
type ChartData = Array<Record<string, unknown>>;
function Plot({
  children,
  data = areaData,
  vertical = false,
  yDomain,
}: {
  children: ReactNode;
  data?: ChartData;
  vertical?: boolean;
  yDomain?: [number, number];
}) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          layout={vertical ? "vertical" : "horizontal"}
          margin={{ left: vertical ? 5 : -28, right: 10, top: 10, bottom: 0 }}
        >
          <CartesianGrid
            vertical={vertical}
            horizontal={!vertical}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
          {vertical ? (
            <>
              <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                tick={axis}
                axisLine={false}
                tickLine={false}
                width={28}
              />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
              <YAxis domain={yDomain} tick={axis} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip content={<ChartTooltip />} />
          {children}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
const common = { strokeWidth: 2, isAnimationActive: false as const };
export function AreaChartExamples() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <ChartContainer
          title="Smooth area"
          description="Monotone curve with a translucent brand fill."
        >
          <Plot>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Revenue"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.18}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Straight area"
          description="Linear edges preserve sharp point-to-point changes."
        >
          <Plot>
            <Area
              {...common}
              type="linear"
              dataKey="primary"
              name="Traffic"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.16}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Natural area"
          description="Natural interpolation creates an organic silhouette."
        >
          <Plot>
            <Area
              {...common}
              type="natural"
              dataKey="primary"
              name="Growth"
              stroke="#318765"
              fill="#318765"
              fillOpacity={0.17}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Basis area"
          description="Basis interpolation produces a deeply rounded shape."
        >
          <Plot>
            <Area
              {...common}
              type="basis"
              dataKey="primary"
              name="Engagement"
              stroke="#ec4899"
              fill="#ec4899"
              fillOpacity={0.16}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Step area"
          description="Step-after geometry suits inventory and state totals."
        >
          <Plot>
            <Area
              {...common}
              type="stepAfter"
              dataKey="primary"
              name="Inventory"
              stroke="#f9736b"
              fill="#f9736b"
              fillOpacity={0.18}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Gradient area"
          description="A vertical gradient fades cleanly into the surface."
        >
          <Plot>
            <defs>
              <linearGradient id="area-purple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity={0.38} />
                <stop offset="1" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Revenue"
              stroke="var(--accent)"
              fill="url(#area-purple)"
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Multi-area comparison"
          description="Two overlapping translucent areas retain their outlines."
        >
          <Plot>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Current"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.12}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="secondary"
              name="Previous"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Stacked area"
          description="Series stack vertically to show cumulative volume."
        >
          <Plot>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Organic"
              stackId="total"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.75}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="secondary"
              name="Paid"
              stackId="total"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.65}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="tertiary"
              name="Referral"
              stackId="total"
              stroke="#f9736b"
              fill="#f9736b"
              fillOpacity={0.6}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="100% stacked area"
          description="Normalized series show proportional contribution over time."
        >
          <Plot data={percentageData} yDomain={[0, 100]}>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Organic %"
              stackId="percent"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.78}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="secondary"
              name="Paid %"
              stackId="percent"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.68}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="tertiary"
              name="Referral %"
              stackId="percent"
              stroke="#f9736b"
              fill="#f9736b"
              fillOpacity={0.62}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Range area band"
          description="A two-value range renders lower and upper bounds."
        >
          <Plot data={rangeData}>
            <Area
              {...common}
              type="monotone"
              dataKey="range"
              name="Confidence range"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.16}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Positive and negative area"
          description="Values diverge around a visible zero reference line."
        >
          <Plot yDomain={[-25, 100]}>
            <ReferenceLine y={0} stroke="var(--muted)" />
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Positive"
              stroke="#318765"
              fill="#318765"
              fillOpacity={0.14}
            />
            <Area
              {...common}
              type="monotone"
              dataKey="negative"
              name="Negative"
              stroke="#e77f76"
              fill="#e77f76"
              fillOpacity={0.18}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Area with data gap"
          description="Null values deliberately interrupt both stroke and fill."
        >
          <Plot data={gapAreaData}>
            <Area
              {...common}
              type="monotone"
              dataKey="gap"
              name="Disconnected"
              stroke="#f9736b"
              fill="#f9736b"
              fillOpacity={0.15}
              connectNulls={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Connected missing area"
          description="The same missing values are bridged with connectNulls."
        >
          <Plot data={gapAreaData}>
            <Area
              {...common}
              type="monotone"
              dataKey="gap"
              name="Connected"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.16}
              connectNulls
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Vertical area"
          description="Categories run vertically for a distinct reading direction."
        >
          <Plot vertical>
            <Area
              {...common}
              type="monotone"
              dataKey="primary"
              name="Vertical volume"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.18}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Threshold area"
          description="A reference line marks where the filled series crosses its limit."
        >
          <Plot>
            <ReferenceLine
              y={60}
              stroke="#e77f76"
              strokeDasharray="4 4"
              label={{ value: "Limit", fill: "var(--muted)", fontSize: 8 }}
            />
            <Area
              {...common}
              type="natural"
              dataKey="primary"
              name="Utilization"
              stroke="#e77f76"
              fill="#e77f76"
              fillOpacity={0.13}
            />
          </Plot>
        </ChartContainer>
      </div>
    </div>
  );
}
