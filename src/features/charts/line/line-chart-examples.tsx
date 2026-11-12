"use client";
import type { ReactNode } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { techniqueData } from "./data";
const axis = { fill: "var(--muted)", fontSize: 8 };
const gapData: Array<(typeof techniqueData)[number] & { gapped?: number | null }> =
  techniqueData.map((item, index) => ({
    ...item,
    gapped: index === 3 || index === 4 ? null : item.actual,
  }));
type DotProps = { cx?: number; cy?: number; stroke?: string };
function SquareDot({ cx = 0, cy = 0, stroke = "#3b82f6" }: DotProps) {
  return (
    <rect
      x={cx - 3.5}
      y={cy - 3.5}
      width={7}
      height={7}
      rx={1}
      fill="var(--surface)"
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}
function DiamondDot({ cx = 0, cy = 0, stroke = "#f9736b" }: DotProps) {
  return (
    <path
      d={`M${cx} ${cy - 4}L${cx + 4} ${cy}L${cx} ${cy + 4}L${cx - 4} ${cy}Z`}
      fill="var(--surface)"
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}
function TriangleDot({ cx = 0, cy = 0, stroke = "#ec4899" }: DotProps) {
  return (
    <path
      d={`M${cx} ${cy - 4.5}L${cx + 4.5} ${cy + 3.5}L${cx - 4.5} ${cy + 3.5}Z`}
      fill="var(--surface)"
      stroke={stroke}
      strokeWidth={1.5}
    />
  );
}
function Chart({
  children,
  data = techniqueData,
  vertical = false,
}: {
  children: ReactNode;
  data?: typeof gapData;
  vertical?: boolean;
}) {
  return (
    <div className="h-[190px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          layout={vertical ? "vertical" : "horizontal"}
          margin={{ left: vertical ? 4 : -28, right: 10, top: 10, bottom: 0 }}
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
              <YAxis tick={axis} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip content={<ChartTooltip />} />
          {children}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
const common = { strokeWidth: 2.4, isAnimationActive: false as const };
export function LineChartExamples() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <ChartContainer title="Smooth line" description="Monotone curve with round data points.">
          <Chart>
            <Line
              {...common}
              type="monotone"
              dataKey="actual"
              name="Smooth"
              stroke="var(--accent)"
              dot={{ r: 3, fill: "var(--surface)", strokeWidth: 2 }}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Straight line"
          description="Linear segments with square data markers."
        >
          <Chart>
            <Line
              {...common}
              type="linear"
              dataKey="actual"
              name="Straight"
              stroke="#3b82f6"
              dot={<SquareDot />}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Natural curve"
          description="Natural cubic interpolation creates a flowing shape."
        >
          <Chart>
            <Line
              {...common}
              type="natural"
              dataKey="actual"
              name="Natural"
              stroke="#318765"
              dot={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Basis curve"
          description="Basis interpolation produces a soft rounded silhouette."
        >
          <Chart>
            <Line
              {...common}
              type="basis"
              dataKey="actual"
              name="Basis"
              stroke="#ec4899"
              dot={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Bump line"
          description="Bump interpolation emphasizes ranking transitions."
        >
          <Chart>
            <Line
              {...common}
              type="bumpX"
              dataKey="actual"
              name="Bump"
              stroke="#f9736b"
              dot={<DiamondDot />}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Step before"
          description="Value changes occur before each category boundary."
        >
          <Chart>
            <Line
              {...common}
              type="stepBefore"
              dataKey="actual"
              name="Step before"
              stroke="var(--accent)"
              dot={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Step middle"
          description="Transitions happen at the midpoint between categories."
        >
          <Chart>
            <Line
              {...common}
              type="step"
              dataKey="actual"
              name="Step middle"
              stroke="#3b82f6"
              dot={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Step after"
          description="Value changes occur after each category boundary."
        >
          <Chart>
            <Line
              {...common}
              type="stepAfter"
              dataKey="actual"
              name="Step after"
              stroke="#318765"
              dot={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Dashed comparison"
          description="Solid circles and dashed diamonds distinguish series."
        >
          <Chart>
            <Line
              {...common}
              type="monotone"
              dataKey="actual"
              name="Current"
              stroke="var(--accent)"
              dot={{ r: 2.5 }}
            />
            <Line
              type="linear"
              dataKey="compare"
              name="Previous"
              stroke="#f9736b"
              strokeWidth={1.8}
              strokeDasharray="7 5"
              dot={<DiamondDot />}
              isAnimationActive={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Mixed marker shapes"
          description="Circle, square, and triangle points identify three series."
        >
          <Chart>
            <Line
              type="linear"
              dataKey="actual"
              name="Circle"
              stroke="var(--accent)"
              strokeWidth={1.5}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="compare"
              name="Square"
              stroke="#3b82f6"
              strokeWidth={1.5}
              dot={<SquareDot />}
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="target"
              name="Triangle"
              stroke="#ec4899"
              strokeWidth={1.5}
              dot={<TriangleDot />}
              isAnimationActive={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Line with data gaps"
          description="Null values deliberately break the line into sections."
        >
          <Chart data={gapData}>
            <Line
              {...common}
              type="monotone"
              dataKey="gapped"
              name="Disconnected"
              stroke="#f9736b"
              dot={{ r: 3 }}
              connectNulls={false}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Connected missing data"
          description="The same null values are bridged using connectNulls."
        >
          <Chart data={gapData}>
            <Line
              {...common}
              type="monotone"
              dataKey="gapped"
              name="Connected"
              stroke="var(--accent)"
              dot={{ r: 3 }}
              connectNulls
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Vertical line chart"
          description="Categories run vertically for a different reading direction."
        >
          <Chart vertical>
            <Line
              {...common}
              type="monotone"
              dataKey="actual"
              name="Vertical"
              stroke="#3b82f6"
              dot={<SquareDot />}
            />
          </Chart>
        </ChartContainer>
        <ChartContainer
          title="Threshold line"
          description="A reference rule highlights values above the limit."
        >
          <Chart>
            <ReferenceLine
              y={60}
              stroke="#e77f76"
              strokeDasharray="4 4"
              label={{ value: "Limit", fill: "var(--muted)", fontSize: 8 }}
            />
            <Line
              {...common}
              type="natural"
              dataKey="actual"
              name="Utilization"
              stroke="#e77f76"
              dot={{ r: 3, fill: "var(--surface)" }}
            />
          </Chart>
        </ChartContainer>
      </div>
    </div>
  );
}
