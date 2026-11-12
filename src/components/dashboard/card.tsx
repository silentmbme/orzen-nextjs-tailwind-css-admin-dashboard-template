import type { ReactNode } from "react";
import { Card as BaseCard } from "@/components/ui/card";
/** Backward-compatible dashboard wrapper; all new widgets should use UI Card directly. */
export function Card({
  title,
  extra,
  children,
  className = "",
}: {
  title: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <BaseCard title={title} action={extra} className={`widget ${className}`}>
      {children}
    </BaseCard>
  );
}
