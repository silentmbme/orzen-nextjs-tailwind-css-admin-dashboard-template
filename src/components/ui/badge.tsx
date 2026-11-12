import type { HTMLAttributes } from "react";
export function Badge({
  tone = "neutral",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "danger";
}) {
  return (
    <span
      className={["ui-badge", tone !== "neutral" ? `ui-badge--${tone}` : "", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
