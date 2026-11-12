import type { ReactNode } from "react";
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="ui-empty" role="status">
      {children}
    </div>
  );
}
