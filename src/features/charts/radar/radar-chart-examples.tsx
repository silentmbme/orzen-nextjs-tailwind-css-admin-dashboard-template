"use client";

import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { performanceData, riskData, skillsData } from "./data";

const purple = "#8b5cf6";
const blue = "#3b82f6";
const coral = "#f9736b";
const pink = "#ec4899";

function Canvas({ children, height = 238 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={performanceData} cx="50%" cy="50%" outerRadius="72%">
          {children}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

const angleAxis = <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted)", fontSize: 9 }} />;
const radiusAxis = (
  <PolarRadiusAxis
    angle={90}
    domain={[0, 100]}
    tick={{ fill: "var(--muted)", fontSize: 8 }}
    axisLine={false}
  />
);
const tooltip = <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />;

export function RadarChartExamples() {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <ChartContainer
        title="Filled radar"
        description="A translucent area emphasizes the overall performance shape."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={purple}
            fill={purple}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Outline radar"
        description="A clean outline preserves the grid and category detail."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          {radiusAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={blue}
            fill="transparent"
            strokeWidth={2.5}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Period comparison"
        description="Overlaid polygons compare current and previous performance."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={purple}
            fill={purple}
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Previous"
            dataKey="previous"
            stroke={coral}
            fill={coral}
            fillOpacity={0.12}
            strokeWidth={2}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Circular grid"
        description="Circular levels soften the silhouette for profile reporting."
      >
        <Canvas>
          <PolarGrid gridType="circle" stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={pink}
            fill={pink}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Target benchmark"
        description="A dashed target boundary frames actual performance."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Target"
            dataKey="target"
            stroke={coral}
            fill="transparent"
            strokeDasharray="5 4"
            strokeWidth={2}
          />
          <Radar
            name="Current"
            dataKey="current"
            stroke={blue}
            fill={blue}
            fillOpacity={0.22}
            strokeWidth={2}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Capability matrix"
        description="Three disciplines reveal complementary team strengths."
      >
        <div style={{ height: 238 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillsData} cx="50%" cy="48%" outerRadius="66%">
              <PolarGrid stroke="var(--border)" />
              {angleAxis}
              <Radar
                name="Design"
                dataKey="design"
                stroke={purple}
                fill={purple}
                fillOpacity={0.12}
                strokeWidth={2}
              />
              <Radar
                name="Engineering"
                dataKey="engineering"
                stroke={blue}
                fill={blue}
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Product"
                dataKey="product"
                stroke={coral}
                fill={coral}
                fillOpacity={0.08}
                strokeWidth={2}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9 }} />
              {tooltip}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <ChartContainer
        title="Risk threshold"
        description="Exposure remains visible inside a fixed tolerance boundary."
      >
        <div style={{ height: 238 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={riskData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="var(--border)" />
              {angleAxis}
              <Radar
                name="Limit"
                dataKey="limit"
                stroke={coral}
                fill={coral}
                fillOpacity={0.05}
                strokeDasharray="4 4"
              />
              <Radar
                name="Exposure"
                dataKey="value"
                stroke={purple}
                fill={purple}
                fillOpacity={0.28}
                strokeWidth={2}
              />
              {tooltip}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      <ChartContainer
        title="Dot profile"
        description="Prominent vertices make exact category positions easier to scan."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={coral}
            fill={coral}
            fillOpacity={0.12}
            strokeWidth={2}
            dot={{ r: 4, fill: coral, stroke: "var(--surface)", strokeWidth: 2 }}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Minimal radar"
        description="Reduced grid detail creates a lightweight executive summary."
      >
        <Canvas>
          <PolarGrid radialLines={false} stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke={purple}
            fill={purple}
            fillOpacity={0.34}
            strokeWidth={2}
          />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Compact score"
        description="A smaller profile suits dense dashboard side panels."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          <Radar
            name="Current"
            dataKey="current"
            stroke={blue}
            fill={blue}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <text
            x="50%"
            y="49%"
            textAnchor="middle"
            fill="var(--foreground)"
            fontSize="18"
            fontWeight="600"
          >
            80
          </text>
          <text x="50%" y="57%" textAnchor="middle" fill="var(--muted)" fontSize="8">
            AVG SCORE
          </text>
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Layered opacity"
        description="Opacity separates three periods without visual noise."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar name="Target" dataKey="target" stroke={pink} fill={pink} fillOpacity={0.08} />
          <Radar
            name="Current"
            dataKey="current"
            stroke={purple}
            fill={purple}
            fillOpacity={0.18}
            strokeWidth={2}
          />
          <Radar name="Previous" dataKey="previous" stroke={blue} fill={blue} fillOpacity={0.08} />
          {tooltip}
        </Canvas>
      </ChartContainer>

      <ChartContainer
        title="Monochrome comparison"
        description="One brand hue uses stroke weight and dash patterns for hierarchy."
      >
        <Canvas>
          <PolarGrid stroke="var(--border)" />
          {angleAxis}
          <Radar
            name="Current"
            dataKey="current"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.2}
            strokeWidth={2.5}
          />
          <Radar
            name="Previous"
            dataKey="previous"
            stroke="var(--accent)"
            fill="transparent"
            strokeOpacity={0.55}
            strokeDasharray="4 4"
          />
          {tooltip}
        </Canvas>
      </ChartContainer>
    </div>
  );
}
