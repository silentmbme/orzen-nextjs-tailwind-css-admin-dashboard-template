"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X } from "lucide-react";
import { navigation } from "@/config/navigation";

export type SidebarFlyoutState = {
  group: (typeof navigation)[number];
  label: string;
  path: string;
  top: number;
  left: number;
  trigger: HTMLButtonElement;
};

export function SidebarFlyout({
  state,
  onClose,
  onNavigate,
}: {
  state: SidebarFlyoutState;
  onClose: () => void;
  onNavigate: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[aria-current="page"], a')?.focus();
    function dismiss(event: PointerEvent) {
      if (
        !ref.current?.contains(event.target as Node) &&
        !state.trigger.contains(event.target as Node)
      )
        onClose();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        state.trigger.focus();
      }
    }
    function closeOnResize() {
      onClose();
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", closeOnResize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", closeOnResize);
    };
  }, [state, onClose]);

  const id = `sidebar-flyout-${state.group.section.toLowerCase().replace(/\s+/g, "-")}`;
  return createPortal(
    <div
      ref={ref}
      id={id}
      className="sidebar-flyout"
      style={{ top: state.top, left: state.left }}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget) &&
          event.relatedTarget !== state.trigger
        )
          onClose();
      }}
    >
      <div className="sidebar-flyout-header">
        <h2>{state.label}</h2>
        <button
          type="button"
          aria-label="Close submenu"
          onClick={() => {
            onClose();
            state.trigger.focus();
          }}
        >
          <X size={14} />
        </button>
      </div>
      <nav aria-label={`${state.label} submenu`} className="sidebar-flyout-links">
        {state.group.items.map((item) => {
          const Icon = item.icon;
          const active = state.path === item.href || state.path.startsWith(`${item.href}/`);
          return item.ready ? (
            <Link
              href={item.href}
              key={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                onClose();
                onNavigate();
              }}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="sidebar-flyout-disabled" key={item.href}>
              <Icon size={15} aria-hidden="true" />
              <span>{item.label}</span>
              <small>Soon</small>
            </span>
          );
        })}
      </nav>
    </div>,
    document.body,
  );
}
