"use client";
import { useEffect, type ReactNode } from "react";
import {
  animate,
  motion,
  MotionConfig,
  stagger,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
export function SaasExperience({ children }: { children: ReactNode }) {
  const [scope, animateScope] = useAnimate();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  useEffect(() => {
    if (reduce || !scope.current) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateScope(
              entry.target,
              { opacity: [0.7, 1], y: [18, 0] },
              { duration: 0.6, ease: "easeOut" },
            );
            if (entry.target.hasAttribute("data-saas-stagger"))
              animateScope(
                Array.from(entry.target.children),
                { opacity: [0.65, 1], y: [20, 0] },
                { delay: stagger(0.08), duration: 0.55 },
              );
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    scope.current
      .querySelectorAll(":scope > section, [data-saas-reveal], [data-saas-stagger]")
      .forEach((element: Element) => observer.observe(element));
    animateScope(
      ".saas-hero h1, .saas-hero h1 + p, .saas-hero h1 + p + div",
      { opacity: [0.65, 1], y: [12, 0] },
      { delay: stagger(0.09), duration: 0.6 },
    );
    return () => observer.disconnect();
  }, [animateScope, reduce, scope]);
  useEffect(() => {
    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'nav[aria-label="SaaS product navigation"] a[href^="#"]',
      ),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            for (const anchor of anchors) {
              const active = anchor.hash === `#${entry.target.id}`;
              anchor.classList.toggle("bg-accent/5", active);
              anchor.classList.toggle("text-accent", active);
              if (active) anchor.setAttribute("aria-current", "location");
              else anchor.removeAttribute("aria-current");
            }
      },
      { rootMargin: "-80px 0px -55% 0px", threshold: 0 },
    );
    anchors.forEach((anchor) => {
      const section = document.getElementById(anchor.hash.slice(1));
      if (section) observer.observe(section);
    });
    function scrollAnchor(event: MouseEvent) {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target || !scope.current?.contains(target)) return;
      event.preventDefault();
      history.pushState(null, "", link.hash);
      target.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" });
    }
    document.addEventListener("click", scrollAnchor);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", scrollAnchor);
      anchors.forEach((anchor) => {
        anchor.removeAttribute("aria-current");
        anchor.classList.remove("bg-accent/5", "text-accent");
      });
    };
  }, [reduce, scope]);
  return (
    <MotionConfig reducedMotion="user">
      <div ref={scope} className="saas-experience">
        <motion.div
          aria-hidden="true"
          className="saas-scroll-progress"
          style={{ scaleX: reduce ? scrollYProgress : progress }}
        />
        {children}
      </div>
    </MotionConfig>
  );
}
export function AnimatedMetric({ value, currency = true }: { value: number; currency?: boolean }) {
  const current = useMotionValue(value);
  const reduce = useReducedMotion();
  const formatted = useTransform(current, (latest) =>
    new Intl.NumberFormat(
      "en-US",
      currency
        ? { style: "currency", currency: "USD", maximumFractionDigits: 2 }
        : { maximumFractionDigits: 1 },
    ).format(latest),
  );
  useEffect(() => {
    const controls = animate(current, value, { duration: reduce ? 0 : 0.5 });
    return () => controls.stop();
  }, [current, reduce, value]);
  return <motion.span>{formatted}</motion.span>;
}
