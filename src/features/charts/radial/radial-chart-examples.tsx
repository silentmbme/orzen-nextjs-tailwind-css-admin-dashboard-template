"use client";

import {
  Cell,
  Legend,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { channelData, comparisonData, radialData } from "./data";

const purple = "#8b5cf6";
const blue = "#3b82f6";
const coral = "#f9736b";
const pink = "#ec4899";

function Center({ value, label, y = 116 }: { value: string; label: string; y?: number }) {
  return (
    <>
      <text
        x="50%"
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize="18"
        fontWeight="600"
      >
        {value}
      </text>
      <text
        x="50%"
        y={y + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--muted)"
        fontSize="8"
      >
        {label}
      </text>
    </>
  );
}

function Chart({
  children,
  data = radialData,
  startAngle = 90,
  endAngle = -270,
}: {
  children: React.ReactNode;
  data?: Record<string, string | number>[];
  startAngle?: number;
  endAngle?: number;
}) {
  return (
    <div className="h-[238px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          cx="50%"
          cy="50%"
          innerRadius="24%"
          outerRadius="84%"
          startAngle={startAngle}
          endAngle={endAngle}
        >
          {children}
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltip = <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />;

export function RadialChartExamples() {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <ChartContainer
        title="Basic radial bars"
        description="Concentric bars compare completion across four customer plans."
      >
        <Chart>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--surface-alt)" }} cornerRadius={7}>
            {radialData.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </RadialBar>
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Progress ring"
        description="A single radial band presents one clear completion value."
      >
        <Chart data={[{ name: "Progress", value: 78 }]}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            fill={purple}
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={12}
          />
          <Center value="78%" label="COMPLETE" />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Semi-circle gauge"
        description="A half-ring creates a compact operational health gauge."
      >
        <Chart data={[{ name: "Health", value: 84 }]} startAngle={180} endAngle={0}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            fill={blue}
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={10}
          />
          <text
            x="50%"
            y="66%"
            textAnchor="middle"
            fill="var(--foreground)"
            fontSize="20"
            fontWeight="600"
          >
            84
          </text>
          <text x="50%" y="74%" textAnchor="middle" fill="var(--muted)" fontSize="8">
            HEALTH SCORE
          </text>
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Three-quarter gauge"
        description="A 270-degree arc leaves room for an anchored summary."
      >
        <Chart data={[{ name: "SLA", value: 92 }]} startAngle={225} endAngle={-45}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            fill={coral}
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={12}
          />
          <Center value="92%" label="SLA MET" />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Channel ranking"
        description="Five concentric bars rank acquisition channel contribution."
      >
        <Chart data={channelData}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--surface-alt)" }} cornerRadius={6}>
            {channelData.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </RadialBar>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: 9 }}
          />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Rounded tracks"
        description="Wide rounded tracks create a softer product analytics treatment."
      >
        <Chart>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={20}
            barSize={14}
          >
            {radialData.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </RadialBar>
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Goal comparison"
        description="Actual and target rings make the remaining goal gap visible."
      >
        <Chart data={comparisonData}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            name="Actual"
            dataKey="actual"
            fill={purple}
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={8}
          />
          <RadialBar
            name="Target"
            dataKey="target"
            fill={blue}
            fillOpacity={0.48}
            cornerRadius={8}
          />
          <Center value="76%" label="91% TARGET" />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Stacked composition"
        description="Angular segments show completed and remaining work in one band."
      >
        <Chart data={comparisonData}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            name="Actual"
            dataKey="actual"
            stackId="total"
            fill={purple}
            cornerRadius={8}
          />
          <RadialBar
            name="Remaining"
            dataKey="remaining"
            stackId="total"
            fill="var(--surface-alt)"
            cornerRadius={8}
          />
          <Center value="76%" label="DELIVERED" />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Rotated radial"
        description="A shifted origin gives the same data a distinct directional shape."
      >
        <Chart startAngle={135} endAngle={-225}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--surface-alt)" }} cornerRadius={6}>
            {radialData.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </RadialBar>
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Compact KPI ring"
        description="A narrow band keeps the focus on the central KPI value."
      >
        <Chart data={[{ name: "Conversion", value: 64 }]}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            fill={pink}
            background={{ fill: "var(--surface-alt)" }}
            cornerRadius={10}
            barSize={10}
          />
          <Center value="64%" label="CONVERSION" />
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="No-track radial"
        description="Removing background tracks produces a lighter comparison silhouette."
      >
        <Chart>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={5}>
            {radialData.map((item) => (
              <Cell key={item.name} fill={item.fill} fillOpacity={0.82} />
            ))}
          </RadialBar>
          {tooltip}
        </Chart>
      </ChartContainer>

      <ChartContainer
        title="Monochrome radial"
        description="Opacity creates hierarchy while keeping one project accent color."
      >
        <Chart>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" background={{ fill: "var(--surface-alt)" }} cornerRadius={7}>
            {radialData.map((item, index) => (
              <Cell key={item.name} fill="var(--accent)" fillOpacity={1 - index * 0.2} />
            ))}
          </RadialBar>
          {tooltip}
        </Chart>
      </ChartContainer>
    </div>
  );
}
