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
import {
  bubbleData,
  correlationData,
  inverseData,
  outlierData,
  teamAData,
  teamBData,
} from "./data";

const purple = "#8b5cf6";
const blue = "#3b82f6";
const coral = "#f9736b";
const pink = "#ec4899";

function Axes({
  grid = true,
  xLabel,
  yLabel,
}: {
  grid?: boolean;
  xLabel?: string;
  yLabel?: string;
}) {
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
        name={xLabel}
      />
      <YAxis
        type="number"
        dataKey="y"
        domain={[0, 100]}
        width={28}
        tick={{ fill: "var(--muted)", fontSize: 8 }}
        tickLine={false}
        axisLine={false}
        name={yLabel}
      />
    </>
  );
}

function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[238px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>{children}</ScatterChart>
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

export function ScatterChartExamples() {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <ChartContainer
        title="Basic correlation"
        description="A clean point cloud reveals a positive relationship between two metrics."
      >
        <Canvas>
          <Axes xLabel="Spend" yLabel="Revenue" />
          <Scatter name="Accounts" data={correlationData} fill={purple} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Team comparison"
        description="Two point sets compare output and efficiency across teams."
      >
        <Canvas>
          <Axes />
          <Scatter name="Team A" data={teamAData} fill={purple} />
          <Scatter name="Team B" data={teamBData} fill={coral} shape="diamond" />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Bubble chart"
        description="Bubble size adds regional opportunity as a third dimension."
      >
        <Canvas>
          <Axes />
          <ZAxis type="number" dataKey="z" range={[60, 520]} name="Opportunity" />
          <Scatter name="Regions" data={bubbleData} fill={blue} fillOpacity={0.72} stroke={blue} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Quadrant analysis"
        description="Reference lines segment accounts into four performance groups."
      >
        <Canvas>
          <Axes />
          <ReferenceArea x1={50} x2={100} y1={50} y2={100} fill={purple} fillOpacity={0.06} />
          <ReferenceLine x={50} stroke="var(--muted)" strokeDasharray="4 4" />
          <ReferenceLine y={50} stroke="var(--muted)" strokeDasharray="4 4" />
          <Scatter name="Accounts" data={teamAData} fill={purple} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Connected observations"
        description="A joint line exposes progression through sequential observations."
      >
        <Canvas>
          <Axes />
          <Scatter
            name="Journey"
            data={correlationData}
            fill={coral}
            line={{ stroke: coral, strokeWidth: 1.5 }}
            shape="circle"
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Regression trend"
        description="A fitted line summarizes the direction behind the point cloud."
      >
        <Canvas>
          <Axes />
          <Scatter
            name="Trend"
            data={teamAData}
            fill={blue}
            line={{ stroke: blue, strokeWidth: 2, strokeDasharray: "5 4" }}
            lineType="fitting"
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Diamond markers"
        description="Diamond symbols create a distinctive campaign performance view."
      >
        <Canvas>
          <Axes />
          <Scatter name="Campaigns" data={teamBData} fill={pink} shape="diamond" />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Triangle markers"
        description="Directional markers suit momentum and forecast comparisons."
      >
        <Canvas>
          <Axes />
          <Scatter name="Forecast" data={correlationData} fill={coral} shape="triangle" />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Threshold distribution"
        description="A target line separates observations above and below expectation."
      >
        <Canvas>
          <Axes />
          <ReferenceLine
            y={65}
            stroke={pink}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            label={{ value: "Target", fill: pink, fontSize: 8, position: "insideTopRight" }}
          />
          <Scatter name="Performance" data={teamAData} fill={purple} shape="square" />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Outlier detection"
        description="A semantic accent isolates the exceptional observation."
      >
        <Canvas>
          <Axes />
          <Scatter name="Observations" data={outlierData}>
            {outlierData.map((item, index) => (
              <Cell key={index} fill={item.outlier ? coral : blue} />
            ))}
          </Scatter>
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Inverse relationship"
        description="A descending distribution shows metrics moving in opposite directions."
      >
        <Canvas>
          <Axes />
          <Scatter
            name="Churn risk"
            data={inverseData}
            fill={pink}
            line={{ stroke: pink, strokeOpacity: 0.5 }}
            lineType="fitting"
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Monochrome scatter"
        description="Opacity and outline preserve hierarchy using one project accent."
      >
        <Canvas>
          <Axes grid={false} />
          <Scatter name="Primary" data={teamAData} fill="var(--accent)" fillOpacity={0.78} />
          <Scatter
            name="Secondary"
            data={teamBData}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={1.5}
            shape="diamond"
          />
          {tooltip}
        </Canvas>
      </ChartContainer>
    </div>
  );
}
