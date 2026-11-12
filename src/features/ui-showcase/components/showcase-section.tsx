import type { ReactNode } from "react";
import { Card } from "@/components/ui/showcase-card";
export function ShowcaseSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={className} title={title}>
      {description && (
        <p className="mb-4 mt-1 border-b border-border pb-3 text-[10px] text-muted">
          {description}
        </p>
      )}
      {children}
    </Card>
  );
}
