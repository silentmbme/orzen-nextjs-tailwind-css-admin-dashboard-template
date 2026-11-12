"use client";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { barData, percentBarData, rangeBarData, waterfallData } from "./data";
const axis = { fill: "var(--muted)", fontSize: 8 };
function Plot({
  children,
  data = barData,
  horizontal = false,
  domain,
}: {
  children: ReactNode;
  data?: object[];
  horizontal?: boolean;
  domain?: [number, number];
}) {
  return (
    <div className="h-[210px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ left: horizontal ? 8 : -28, right: 10, top: 10, bottom: 0 }}
        >
          <CartesianGrid
            vertical={horizontal}
            horizontal={!horizontal}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
          {horizontal ? (
            <>
              <XAxis type="number" domain={domain} tick={axis} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                tick={axis}
                axisLine={false}
                tickLine={false}
                width={30}
              />
            </>
          ) : (
            <>
              <XAxis dataKey="label" tick={axis} axisLine={false} tickLine={false} />
              <YAxis domain={domain} tick={axis} axisLine={false} tickLine={false} />
            </>
          )}
          <Tooltip content={<ChartTooltip />} />
          {children}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
export function BarChartExamples() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <ChartContainer
          title="Basic columns"
          description="Classic vertical bars with compact category spacing."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Revenue"
              fill="var(--accent)"
              maxBarSize={28}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Rounded columns"
          description="Rounded top corners create a softer column shape."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Orders"
              fill="#3b82f6"
              radius={[7, 7, 0, 0]}
              maxBarSize={30}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Horizontal bars"
          description="Category labels run vertically for easy comparison."
        >
          <Plot horizontal>
            <Bar
              dataKey="primary"
              name="Performance"
              fill="#318765"
              radius={[0, 6, 6, 0]}
              maxBarSize={18}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Grouped bars"
          description="Three side-by-side series compare each category."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Organic"
              fill="var(--accent)"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              isAnimationActive={false}
            />
            <Bar
              dataKey="secondary"
              name="Paid"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              isAnimationActive={false}
            />
            <Bar
              dataKey="tertiary"
              name="Referral"
              fill="#f9736b"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Stacked bars"
          description="Series combine vertically into cumulative totals."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Product"
              stackId="total"
              fill="var(--accent)"
              maxBarSize={30}
              isAnimationActive={false}
            />
            <Bar
              dataKey="secondary"
              name="Service"
              stackId="total"
              fill="#3b82f6"
              maxBarSize={30}
              isAnimationActive={false}
            />
            <Bar
              dataKey="tertiary"
              name="Other"
              stackId="total"
              fill="#f9736b"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="100% stacked bars"
          description="Normalized stacks show proportional contribution."
        >
          <Plot data={percentBarData} domain={[0, 100]}>
            <Bar
              dataKey="primary"
              name="Organic %"
              stackId="percent"
              fill="var(--accent)"
              maxBarSize={30}
              isAnimationActive={false}
            />
            <Bar
              dataKey="secondary"
              name="Paid %"
              stackId="percent"
              fill="#3b82f6"
              maxBarSize={30}
              isAnimationActive={false}
            />
            <Bar
              dataKey="tertiary"
              name="Referral %"
              stackId="percent"
              fill="#f9736b"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Positive and negative"
          description="Bars extend above and below a visible zero baseline."
        >
          <Plot domain={[-30, 90]}>
            <ReferenceLine y={0} stroke="var(--muted)" />
            <Bar
              dataKey="primary"
              name="Gain"
              fill="#318765"
              maxBarSize={20}
              isAnimationActive={false}
            />
            <Bar
              dataKey="negative"
              name="Loss"
              fill="#e77f76"
              maxBarSize={20}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Diverging horizontal bars"
          description="Positive and negative results diverge from the center."
        >
          <Plot horizontal domain={[-30, 90]}>
            <ReferenceLine x={0} stroke="var(--muted)" />
            <Bar
              dataKey="primary"
              name="Positive"
              fill="var(--accent)"
              maxBarSize={12}
              isAnimationActive={false}
            />
            <Bar
              dataKey="negative"
              name="Negative"
              fill="#f9736b"
              maxBarSize={12}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Range bars"
          description="Floating bars display a low-to-high interval."
        >
          <Plot data={rangeBarData}>
            <Bar
              dataKey="range"
              name="Operating range"
              fill="#3b82f6"
              radius={[5, 5, 5, 5]}
              maxBarSize={22}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Waterfall bars"
          description="Invisible bases position incremental gains and losses."
        >
          <Plot data={waterfallData}>
            <Bar dataKey="base" stackId="waterfall" fill="transparent" isAnimationActive={false} />
            <Bar
              dataKey="value"
              stackId="waterfall"
              name="Movement"
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
              isAnimationActive={false}
            >
              {waterfallData.map((item, index) => (
                <Cell
                  key={index}
                  fill={
                    item.kind === "up"
                      ? "#318765"
                      : item.kind === "down"
                        ? "#f9736b"
                        : "var(--accent)"
                  }
                />
              ))}
            </Bar>
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Target reference bars"
          description="A target rule makes above-target columns obvious."
        >
          <Plot>
            <ReferenceLine
              y={55}
              stroke="#e77f76"
              strokeDasharray="4 4"
              label={{ value: "Target 55", fill: "var(--muted)", fontSize: 8 }}
            />
            <Bar
              dataKey="primary"
              name="Actual"
              fill="var(--accent)"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Narrow dense bars"
          description="Slim columns support dense operational datasets."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Requests"
              fill="#ec4899"
              barSize={8}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Wide capsule bars"
          description="Wide rounded columns create a strong compact silhouette."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Score"
              fill="var(--accent)"
              barSize={38}
              radius={[18, 18, 18, 18]}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Bars with track background"
          description="A muted full-height track provides capacity context."
        >
          <Plot>
            <Bar
              dataKey="primary"
              name="Capacity"
              fill="#3b82f6"
              radius={[5, 5, 0, 0]}
              background={{ fill: "var(--surface-alt)", radius: 5 }}
              maxBarSize={25}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
        <ChartContainer
          title="Gradient columns"
          description="Vertical color fade adds depth without changing geometry."
        >
          <Plot>
            <defs>
              <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="var(--accent)" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity={0.45} />
              </linearGradient>
            </defs>
            <Bar
              dataKey="primary"
              name="Gradient"
              fill="url(#bar-gradient)"
              radius={[5, 5, 0, 0]}
              maxBarSize={27}
              isAnimationActive={false}
            />
          </Plot>
        </ChartContainer>
      </div>
    </div>
  );
}
