import type { ReactNode } from "react";
import { Card, type CardProps } from "@/components/ui/card";

export function ChartCard({ children, summary, ...props }: CardProps & { summary?: ReactNode }) {
  return (
    <Card {...props}>
      {summary && <div className="chart-card-summary">{summary}</div>}
      {children}
    </Card>
  );
}
