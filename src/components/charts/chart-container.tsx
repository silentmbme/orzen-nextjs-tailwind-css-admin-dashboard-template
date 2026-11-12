import type { CSSProperties, ReactNode } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { ShowcaseCard } from "@/components/ui/showcase-card";
export function ChartContainer({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const chartColors = { "--chart-blue": "#3b82f6", "--chart-coral": "#f9736b" } as CSSProperties;
  return (
    <ShowcaseCard
      className={className}
      style={chartColors}
      title={title}
      icon={ChartNoAxesCombined}
      action={action}
    >
      {description && <p className="mb-4 mt-1 text-[9px] text-muted">{description}</p>}
      {children}
    </ShowcaseCard>
  );
}
