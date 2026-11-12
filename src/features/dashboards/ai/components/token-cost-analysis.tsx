"use client";
import { useId, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Coins } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Button } from "@/components/ui/button";
import { AiTitle } from "@/features/ai/components/ai-workspace";
import { metrics, number, usd, type AiData, type ApiRequest } from "@/features/ai/types";
type SegmentProps = { x?: number; y?: number; width?: number; height?: number };
const chartAccent = "var(--accent)";
function InputSegment({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  patternId,
}: SegmentProps & { patternId: string }) {
  if (width <= 0 || height <= 0) return <g />;
  return (
    <rect
      x={x + 1}
      y={y + 1}
      width={Math.max(0, width - 2)}
      height={Math.max(0, height - 2)}
      rx={3}
      fill={`url(#${patternId})`}
    />
  );
}
function OutputSegment({ x = 0, y = 0, width = 0, height = 0 }: SegmentProps) {
  if (width <= 0 || height <= 0) return <g />;
  const gap = Math.min(3, height / 8),
    band = height * 0.26,
    cap = height - band - gap;
  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, cap - 1)}
        rx={3}
        fill={chartAccent}
      />
      <rect
        x={x + 1}
        y={y + cap + gap}
        width={Math.max(0, width - 2)}
        height={Math.max(0, band - 1)}
        rx={2}
        fill={`color-mix(in srgb, ${chartAccent} 32%, var(--surface))`}
      />
    </g>
  );
}
export function TokenCostAnalysis({ data, rows }: { data: AiData; rows: ApiRequest[] }) {
  const [mode, setMode] = useState("tokens");
  const patternId = `token-stripes-${useId().replace(/:/g, "")}`;
  const trend = [...new Set(rows.map((r) => r.time.slice(0, 10)))].sort().map((date) => {
    const m = metrics(
      rows.filter((r) => r.time.startsWith(date)),
      data.models,
    );
    return {
      date: date.slice(5),
      Input: m.input,
      Output: m.output,
      Cost: Number(m.cost.toFixed(4)),
    };
  });
  const total = metrics(rows, data.models);
  return (
    <ChartCard
      title={<AiTitle icon={Coins}>Token & cost intelligence</AiTitle>}
      action={
        <div className="flex gap-1">
          {["tokens", "cost"].map((value) => (
            <Button
              key={value}
              size="sm"
              variant={mode === value ? "secondary" : "ghost"}
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
            >
              {value === "tokens" ? "Tokens" : "Cost"}
            </Button>
          ))}
        </div>
      }
    >
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-control border border-border bg-surface-alt p-3 text-tiny text-muted">
        <span>
          Input{" "}
          <strong className="mt-1 block break-words text-body font-semibold text-foreground">
            {number(total.input)}
          </strong>
        </span>
        <span>
          Output{" "}
          <strong className="mt-1 block break-words text-body font-semibold text-foreground">
            {number(total.output)}
          </strong>
        </span>
        <span>
          Cost{" "}
          <strong className="mt-1 block break-words text-body font-semibold text-foreground">
            {usd(total.cost)}
          </strong>
        </span>
      </div>
      <div className="mt-3 h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} barCategoryGap="20%" margin={{ left: -14, right: 8 }}>
            <defs>
              <pattern
                id={patternId}
                patternUnits="userSpaceOnUse"
                width="7"
                height="7"
                patternTransform="rotate(30)"
              >
                <rect
                  width="7"
                  height="7"
                  fill={`color-mix(in srgb, ${chartAccent} 40%, var(--surface))`}
                />
                <rect width="2.5" height="7" fill="var(--surface)" />
              </pattern>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              minTickGap={25}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                borderRadius: 8,
                fontSize: 11,
              }}
              labelStyle={{ color: "var(--foreground)" }}
            />
            {mode === "tokens" ? (
              <>
                <Bar
                  dataKey="Input"
                  stackId="tokens"
                  fill={`url(#${patternId})`}
                  shape={(props: SegmentProps) => <InputSegment {...props} patternId={patternId} />}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  maxBarSize={46}
                  isAnimationActive={false}
                  radius={[4, 4, 4, 4]}
                />
                <Bar
                  dataKey="Output"
                  stackId="tokens"
                  fill={chartAccent}
                  shape={(props: SegmentProps) => <OutputSegment {...props} />}
                  radius={[4, 4, 4, 4]}
                  stroke="var(--surface)"
                  strokeWidth={2}
                  maxBarSize={46}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <Line dataKey="Cost" stroke="var(--accent)" strokeWidth={2} dot={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-tiny text-muted">
        {mode === "tokens"
          ? "Striped: input · Solid: output. Sample token counts, including input on errors."
          : "Estimated USD using fictional per-million-token rates."}
      </p>
    </ChartCard>
  );
}
