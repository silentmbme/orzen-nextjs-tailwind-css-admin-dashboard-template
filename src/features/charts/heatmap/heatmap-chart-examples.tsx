"use client";

import type { CSSProperties } from "react";
import { ChartContainer } from "@/components/charts/chart-container";
import {
  activityData,
  adoptionData,
  anomalyData,
  cohortData,
  conversionData,
  correlationData,
  deploymentData,
  engagementData,
  performanceData,
  riskData,
  supportData,
} from "./data";

type HeatGridProps = {
  title: string;
  values: Array<number | null>;
  rows: number;
  columns: number;
  color?: string;
  rowLabels?: string[];
  columnLabels?: string[];
  rounded?: boolean;
  showValues?: boolean;
  diverging?: boolean;
};

function cellBackground(value: number | null, color: string, diverging: boolean) {
  if (value === null) return "transparent";
  if (value === 0) return "var(--surface-alt)";
  if (diverging) {
    const tone = value >= 50 ? "#f9736b" : "#3b82f6";
    const strength = 18 + Math.abs(value - 50) * 1.45;
    return `color-mix(in srgb, ${tone} ${Math.min(strength, 88)}%, var(--surface-alt))`;
  }
  return `color-mix(in srgb, ${color} ${18 + value * 0.78}%, var(--surface-alt))`;
}

function HeatGrid({
  title,
  values,
  rows,
  columns,
  color = "#8b5cf6",
  rowLabels,
  columnLabels,
  rounded = true,
  showValues = false,
  diverging = false,
}: HeatGridProps) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(${showValues ? 28 : 14}px, 1fr))`,
  } as CSSProperties;
  return (
    <div className="grid gap-2.5">
      {columnLabels && (
        <div className="ml-10 grid gap-1" style={gridStyle}>
          {columnLabels.map((label) => (
            <span key={label} className="truncate text-center text-[7px] text-muted">
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        {rowLabels && (
          <div
            className="grid w-8 shrink-0 gap-1"
            style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
          >
            {rowLabels.map((label) => (
              <span key={label} className="flex items-center text-[7px] text-muted">
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="min-w-0 flex-1 overflow-x-auto pb-1">
          <div className="grid min-w-[260px] gap-1" style={gridStyle}>
            {values.map((value, index) => {
              const row = Math.floor(index / columns) + 1;
              const column = (index % columns) + 1;
              return (
                <button
                  key={`${title}-${index}`}
                  type="button"
                  disabled={value === null}
                  title={
                    value === null
                      ? "No data"
                      : `${title}: row ${row}, column ${column}, value ${value}`
                  }
                  aria-label={
                    value === null ? "No data" : `${title}, row ${row}, column ${column}: ${value}`
                  }
                  className={`aspect-square min-h-3 border border-transparent text-[7px] font-medium transition hover:scale-110 hover:border-foreground/20 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent ${rounded ? "rounded-[4px]" : "rounded-none"}`}
                  style={{
                    background: cellBackground(value, color, diverging),
                    color: showValues && value !== null ? "var(--foreground)" : "transparent",
                  }}
                >
                  {showValues && value !== null ? value : ""}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 text-[7px] text-muted">
        <span>Low</span>
        {[18, 36, 54, 72, 90].map((value) => (
          <i
            key={value}
            className="size-2.5 rounded-[3px]"
            style={{ background: cellBackground(value, color, diverging) }}
          />
        ))}
        <span>High</span>
      </div>
    </div>
  );
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"];

export function HeatmapChartExamples() {
  return (
    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
      <ChartContainer
        title="Activity calendar"
        description="Daily contribution intensity across fourteen recent weeks."
      >
        <HeatGrid
          title="Activity"
          values={activityData}
          rows={7}
          columns={14}
          rowLabels={days}
          color="#8b5cf6"
        />
      </ChartContainer>

      <ChartContainer
        title="Hourly engagement"
        description="A day-by-hour matrix reveals the strongest engagement windows."
      >
        <HeatGrid
          title="Engagement"
          values={engagementData}
          rows={7}
          columns={12}
          rowLabels={days}
          columnLabels={hours}
          color="#3b82f6"
        />
      </ChartContainer>

      <ChartContainer
        title="Cohort retention"
        description="A triangular cohort view tracks retention decay over eight periods."
      >
        <HeatGrid
          title="Retention"
          values={cohortData}
          rows={8}
          columns={8}
          rowLabels={["Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar"]}
          columnLabels={["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7"]}
          color="#318765"
        />
      </ChartContainer>

      <ChartContainer
        title="Conversion intensity"
        description="Funnel-stage performance is compared across ten acquisition sources."
      >
        <HeatGrid
          title="Conversion"
          values={conversionData}
          rows={5}
          columns={10}
          rowLabels={["Visit", "Lead", "MQL", "SQL", "Won"]}
          color="#f9736b"
          rounded={false}
        />
      </ChartContainer>

      <ChartContainer
        title="Risk matrix"
        description="Likelihood and impact combine into a readable five-by-five risk field."
      >
        <HeatGrid
          title="Risk"
          values={riskData}
          rows={5}
          columns={5}
          rowLabels={["Rare", "Low", "Possible", "Likely", "Certain"]}
          columnLabels={["Minor", "Low", "Medium", "High", "Critical"]}
          color="#e85d68"
          showValues
        />
      </ChartContainer>

      <ChartContainer
        title="Correlation matrix"
        description="A diverging matrix compares relationships among six business metrics."
      >
        <HeatGrid
          title="Correlation"
          values={correlationData}
          rows={6}
          columns={6}
          rowLabels={["ARR", "NRR", "CAC", "LTV", "WAU", "CSAT"]}
          columnLabels={["ARR", "NRR", "CAC", "LTV", "WAU", "CSAT"]}
          diverging
          showValues
        />
      </ChartContainer>

      <ChartContainer
        title="Support demand"
        description="Ticket volume highlights recurring demand by weekday and time window."
      >
        <HeatGrid
          title="Support"
          values={supportData}
          rows={7}
          columns={12}
          rowLabels={days}
          columnLabels={hours}
          color="#ec4899"
        />
      </ChartContainer>

      <ChartContainer
        title="Performance bands"
        description="Six teams are measured across ten compact operating indicators."
      >
        <HeatGrid
          title="Performance"
          values={performanceData}
          rows={6}
          columns={10}
          rowLabels={["Sales", "CS", "Ops", "Product", "Design", "Eng"]}
          color="#f59e0b"
          rounded={false}
        />
      </ChartContainer>

      <ChartContainer
        title="Deployment frequency"
        description="Release density shows delivery consistency across five environments."
      >
        <HeatGrid
          title="Deployments"
          values={deploymentData}
          rows={5}
          columns={14}
          rowLabels={["Prod", "Stage", "QA", "Dev", "Preview"]}
          color="#318765"
        />
      </ChartContainer>

      <ChartContainer
        title="Feature adoption"
        description="Usage intensity compares six customer segments across twelve features."
      >
        <HeatGrid
          title="Adoption"
          values={adoptionData}
          rows={6}
          columns={12}
          rowLabels={["Ent", "Scale", "Growth", "Team", "Start", "Free"]}
          color="#3b82f6"
        />
      </ChartContainer>

      <ChartContainer
        title="Anomaly density"
        description="Coral intensity isolates unusual operational concentrations."
      >
        <HeatGrid
          title="Anomalies"
          values={anomalyData}
          rows={6}
          columns={12}
          rowLabels={["API", "Jobs", "Auth", "DB", "Queue", "Edge"]}
          color="#f9736b"
          rounded={false}
        />
      </ChartContainer>

      <ChartContainer
        title="Monochrome usage"
        description="One theme accent creates a restrained activity-density overview."
      >
        <HeatGrid
          title="Usage"
          values={activityData}
          rows={7}
          columns={14}
          rowLabels={days}
          color="var(--accent)"
        />
      </ChartContainer>
    </div>
  );
}
