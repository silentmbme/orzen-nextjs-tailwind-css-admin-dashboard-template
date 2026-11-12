import type { HTMLAttributes, ReactNode } from "react";
export type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  title?: ReactNode;
  action?: ReactNode;
  flush?: boolean;
};
export function CardHeader({
  title,
  action,
  children,
  className = "",
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & { title?: ReactNode; action?: ReactNode }) {
  return (
    <div className={`ui-card__header ${className}`.trim()} {...props}>
      {children ?? (
        <>
          <h2 className="ui-card__title">{title}</h2>
          {action}
        </>
      )}
    </div>
  );
}
export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card__body ${className}`.trim()} {...props} />;
}
export function Card({
  title,
  action,
  flush = false,
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <section
      className={["ui-card", flush ? "ui-card--flush" : "", className].filter(Boolean).join(" ")}
      {...props}
    >
      {title && <CardHeader title={title} action={action} />}
      <CardContent>{children}</CardContent>
    </section>
  );
}
