import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function MarketingContainer({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-[1180px] relative z-[2] px-5 sm:px-8 ${className}`}
      {...props}
    />
  );
}
export function MarketingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <MarketingContainer>
        <div className="mb-9 max-w-[620px]">
          {eyebrow && <p className="marketing-eyebrow">{eyebrow}</p>}
          <h2 className="marketing-heading">{title}</h2>
          {description && <p className="marketing-copy mt-4">{description}</p>}
        </div>
        {children}
      </MarketingContainer>
    </section>
  );
}
export function HeroAction({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`ui-button ui-button--lg ${secondary ? "" : "ui-button--dark"}`}>
      {children}
      <ArrowUpRight size={15} />
    </Link>
  );
}
