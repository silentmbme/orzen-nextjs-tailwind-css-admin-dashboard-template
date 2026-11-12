import type { HTMLAttributes } from "react";

export function PageContainer({
  className = "",
  id = "main-content",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <main id={id} className={`content ${className}`.trim()} {...props} />;
}
