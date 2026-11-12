import type { ReactNode } from "react";

export function PageHeader({ title, leading }: { title: string; leading?: ReactNode }) {
  return (
    <div className="header-title">
      {leading}
      <h1>{title}</h1>
    </div>
  );
}
