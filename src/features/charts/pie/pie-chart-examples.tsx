"use client";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartContainer } from "@/components/charts/chart-container";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { deviceData, pieData, progressData, regionData, sentimentData } from "./data";
function Canvas({ children, height = 220 }: { children: React.ReactNode; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>{children}</PieChart>
      </ResponsiveContainer>
    </div>
  );
}
function Center({ title, note, y = 108 }: { title: string; note: string; y?: number }) {
  return (
    <>
      <text
        x="50%"
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--foreground)"
        fontSize="16"
        fontWeight="600"
      >
        {title}
      </text>
      <text
        x="50%"
        y={y + 18}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--muted)"
        fontSize="8"
      >
        {note}
      </text>
    </>
  );
}
export function PieChartExamples() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <ChartContainer
          title="Basic pie"
          description="A full-radius pie with four categorical sectors."
        >
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={82}
              stroke="var(--surface)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {pieData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Pie with labels"
          description="External percentage labels identify every sector."
        >
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={72}
              label={({ name, value }) => `${name} ${value}%`}
              labelLine
              isAnimationActive={false}
            >
              {pieData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer title="Padded pie" description="Wide angular spacing separates each slice.">
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={82}
              paddingAngle={5}
              stroke="none"
              isAnimationActive={false}
            >
              {pieData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Rounded sectors"
          description="Corner radii and narrow spacing soften the pie shape."
        >
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={82}
              paddingAngle={2}
              cornerRadius={7}
              stroke="none"
              isAnimationActive={false}
            >
              {pieData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Classic donut"
          description="A central cutout creates a clear ring shape."
        >
          <Canvas>
            <Pie
              data={deviceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {deviceData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />
            <Center title="3,240" note="TOTAL USERS" />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Thin donut"
          description="A narrow ring works well for compact distribution charts."
        >
          <Canvas>
            <Pie
              data={regionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={80}
              paddingAngle={3}
              stroke="none"
              isAnimationActive={false}
            >
              {regionData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Center title="100%" note="REGIONS" />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Semi donut"
          description="A half-ring creates a compact summary silhouette."
        >
          <Canvas height={190}>
            <Pie
              data={deviceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="76%"
              startAngle={180}
              endAngle={0}
              innerRadius={54}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {deviceData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Center title="56%" note="DESKTOP" y={132} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Gauge donut"
          description="A partial progress ring communicates a single score."
        >
          <Canvas height={190}>
            <Pie
              data={progressData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="72%"
              startAngle={210}
              endAngle={-30}
              innerRadius={56}
              outerRadius={72}
              cornerRadius={8}
              stroke="none"
              isAnimationActive={false}
            >
              {progressData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Center title="74" note="HEALTH SCORE" y={121} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Progress ring"
          description="One colored arc sits over a muted remainder track."
        >
          <Canvas>
            <Pie
              data={progressData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={66}
              outerRadius={79}
              startAngle={90}
              endAngle={-270}
              cornerRadius={8}
              stroke="none"
              isAnimationActive={false}
            >
              {progressData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Center title="74%" note="COMPLETE" />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Nested donuts"
          description="Two concentric rings compare device and region mix."
        >
          <Canvas>
            <Pie
              data={deviceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={56}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {deviceData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Pie
              data={regionData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={82}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {regionData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Multi-ring progress"
          description="Independent concentric arcs show three completion values."
        >
          <Canvas>
            <Pie
              data={[
                { name: "A", value: 82, color: "#8b5cf6" },
                { name: "R", value: 18, color: "var(--surface-alt)" },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={66}
              outerRadius={78}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="#8b5cf6" />
              <Cell fill="var(--surface-alt)" />
            </Pie>
            <Pie
              data={[
                { name: "A", value: 64 },
                { name: "R", value: 36 },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={59}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="#3b82f6" />
              <Cell fill="var(--surface-alt)" />
            </Pie>
            <Pie
              data={[
                { name: "A", value: 46 },
                { name: "R", value: 54 },
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={41}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill="#f9736b" />
              <Cell fill="var(--surface-alt)" />
            </Pie>
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Interactive selected slice"
          description="Click a sector to focus it and update the summary."
        >
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={76}
              onClick={(_, index) => setSelected(index)}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {pieData.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                  fillOpacity={selected === index ? 1 : 0.28}
                  stroke={selected === index ? item.color : "none"}
                  strokeWidth={selected === index ? 3 : 0}
                />
              ))}
            </Pie>
            <Center
              title={`${pieData[selected].value}%`}
              note={pieData[selected].name.toUpperCase()}
            />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Donut with legend"
          description="A wrapped legend supports categorical scanning."
        >
          <Canvas>
            <Pie
              data={regionData}
              dataKey="value"
              nameKey="name"
              cx="42%"
              cy="45%"
              innerRadius={42}
              outerRadius={68}
              stroke="none"
              isAnimationActive={false}
            >
              {regionData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 8 }} />
            <Tooltip content={<ChartTooltip />} />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Sentiment donut"
          description="Semantic colors communicate positive, neutral, and negative share."
        >
          <Canvas>
            <Pie
              data={sentimentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={80}
              paddingAngle={3}
              cornerRadius={5}
              stroke="none"
              isAnimationActive={false}
            >
              {sentimentData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip valueFormatter={(value) => `${value}%`} />} />
            <Center title="68%" note="POSITIVE" />
          </Canvas>
        </ChartContainer>
        <ChartContainer
          title="Monochrome donut"
          description="Opacity, not hue, separates slices within one brand color."
        >
          <Canvas>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={81}
              paddingAngle={1}
              stroke="none"
              isAnimationActive={false}
            >
              {pieData.map((item, index) => (
                <Cell key={item.name} fill="var(--accent)" fillOpacity={1 - index * 0.2} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Center title="4" note="CHANNELS" />
          </Canvas>
        </ChartContainer>
      </div>
    </div>
  );
}
