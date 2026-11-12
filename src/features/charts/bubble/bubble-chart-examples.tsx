"use client";

import {
  CartesianGrid,
  Cell,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { enterpriseData, growthData, marketData, riskData, timelineData } from "./data";

const purple = "#8b5cf6";
const blue = "#3b82f6";
const coral = "#f9736b";
const pink = "#ec4899";

function Axes({ grid = true }: { grid?: boolean }) {
  return (
    <>
      {grid && <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />}
      <XAxis
        type="number"
        dataKey="x"
        domain={[0, 100]}
        tick={{ fill: "var(--muted)", fontSize: 8 }}
        tickLine={false}
        axisLine={{ stroke: "var(--border)" }}
      />
      <YAxis
        type="number"
        dataKey="y"
        domain={[0, 100]}
        width={28}
        tick={{ fill: "var(--muted)", fontSize: 8 }}
        tickLine={false}
        axisLine={false}
      />
    </>
  );
}

function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[238px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 14, right: 16, bottom: 4, left: -8 }}>{children}</ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

const tooltip = (
  <Tooltip
    cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
    content={<ChartTooltip />}
  />
);

export function BubbleChartExamples() {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <ChartContainer
        title="Market opportunity"
        description="Bubble area represents addressable value across six regions."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[80, 640]} name="Market size" />
          <Scatter name="Regions" data={marketData}>
            {marketData.map((item) => (
              <Cell key={item.name} fill={item.fill} fillOpacity={0.78} />
            ))}
          </Scatter>
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Segment comparison"
        description="Two bubble groups contrast enterprise and growth accounts."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 520]} name="Pipeline" />
          <Scatter name="Enterprise" data={enterpriseData} fill={purple} fillOpacity={0.72} />
          <Scatter name="Growth" data={growthData} fill={coral} fillOpacity={0.72} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Quadrant bubbles"
        description="Priority zones separate strategic accounts by fit and value."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 560]} />
          <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={purple} fillOpacity={0.06} />
          <ReferenceLine x={50} stroke="var(--muted)" strokeDasharray="4 4" />
          <ReferenceLine y={50} stroke="var(--muted)" strokeDasharray="4 4" />
          <Scatter name="Accounts" data={enterpriseData} fill={purple} fillOpacity={0.72} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Labeled bubbles"
        description="Direct labels keep regional identities visible without a legend."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 520]} />
          <Scatter
            name="Regions"
            data={marketData}
            fill={blue}
            fillOpacity={0.68}
            label={{ dataKey: "name", position: "top", fill: "var(--muted)", fontSize: 8 }}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Hollow bubbles"
        description="Outlined circles reduce visual weight in dense comparisons."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 560]} />
          <Scatter
            name="Accounts"
            data={enterpriseData}
            fill="var(--surface)"
            stroke={blue}
            strokeWidth={2}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Growth trajectory"
        description="Connected bubbles show volume increasing through six periods."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 540]} />
          <Scatter
            name="Monthly growth"
            data={timelineData}
            fill={pink}
            fillOpacity={0.74}
            line={{ stroke: pink, strokeWidth: 1.5, strokeDasharray: "4 4" }}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Risk impact matrix"
        description="Bubble size communicates exposure while color isolates critical risks."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[80, 600]} name="Exposure" />
          <ReferenceLine y={65} stroke={coral} strokeDasharray="5 4" />
          <Scatter name="Risks" data={riskData}>
            {riskData.map((item) => (
              <Cell key={item.name} fill={item.critical ? coral : blue} fillOpacity={0.76} />
            ))}
          </Scatter>
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Compact bubbles"
        description="A constrained size range suits dashboards with many observations."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[35, 180]} />
          <Scatter name="Markets" data={marketData} fill={purple} fillOpacity={0.75} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="High-contrast scale"
        description="A broad size range emphasizes the largest commercial opportunities."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[35, 900]} />
          <Scatter name="Markets" data={marketData}>
            {marketData.map((item) => (
              <Cell key={item.name} fill={item.fill} fillOpacity={0.7} />
            ))}
          </Scatter>
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="No-grid bubbles"
        description="A minimal canvas keeps attention on relative position and scale."
      >
        <Canvas>
          <Axes grid={false} />
          <ZAxis type="number" dataKey="z" range={[70, 560]} />
          <Scatter name="Pipeline" data={growthData} fill={coral} fillOpacity={0.72} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Soft opacity"
        description="Layered translucency supports overlapping market observations."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[90, 620]} />
          <Scatter
            name="Enterprise"
            data={enterpriseData}
            fill={purple}
            fillOpacity={0.34}
            stroke={purple}
          />
          <Scatter name="Growth" data={growthData} fill={blue} fillOpacity={0.28} stroke={blue} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Monochrome bubbles"
        description="One theme accent uses opacity to maintain a restrained visual system."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[70, 620]} />
          <Scatter name="Markets" data={marketData}>
            {marketData.map((item, index) => (
              <Cell key={item.name} fill="var(--accent)" fillOpacity={1 - index * 0.1} />
            ))}
          </Scatter>
          {tooltip}
        </Canvas>
      </ChartContainer>
    </div>
  );
}
