"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./icon-button";
let openDialogCount = 0;
let previousBodyOverflow = "";

export function Dialog({
  open,
  title,
  onClose,
  children,
  variant = "modal",
  placement = "right",
  closeLabel,
  offcanvasWidth = 640,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  variant?: "modal" | "offcanvas";
  placement?: "right" | "left" | "bottom";
  closeLabel?: string;
  offcanvasWidth?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = ref.current;
    if (open && element && !element.open) element.showModal();
    if (!open && element?.open) element.close();
    if (!open) return;
    if (openDialogCount === 0) previousBodyOverflow = document.body.style.overflow;
    openDialogCount += 1;
    document.body.style.overflow = "hidden";
    return () => {
      openDialogCount -= 1;
      if (openDialogCount === 0) document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`ui-dialog ${variant === "offcanvas" ? "[&[open]]:flex [&[open]]:flex-col" : ""}`}
      style={
        variant === "offcanvas"
          ? placement === "bottom"
            ? {
                position: "fixed",
                inset: "auto 0 0 0",
                margin: 0,
                marginTop: "auto",
                width: "100vw",
                maxWidth: "100vw",
                height: "min(560px, 82dvh)",
                maxHeight: "82dvh",
                borderRadius: "12px 12px 0 0",
                padding: 0,
                borderWidth: "1px 0 0",
                overflow: "hidden",
              }
            : {
                position: "fixed",
                inset: placement === "left" ? "0 auto 0 0" : "0 0 0 auto",
                margin: 0,
                marginLeft: placement === "right" ? "auto" : 0,
                marginRight: placement === "left" ? "auto" : 0,
                width: `min(${offcanvasWidth}px, 100vw)`,
                maxWidth: "100vw",
                height: "100dvh",
                maxHeight: "100dvh",
                borderRadius: 0,
                padding: 0,
                borderWidth: placement === "left" ? "0 1px 0 0" : "0 0 0 1px",
                overflow: "hidden",
              }
          : undefined
      }
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (variant !== "offcanvas" || event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div
        className={`ui-dialog__header ${variant === "offcanvas" ? "mb-0! shrink-0 border-b border-border bg-surface px-4! py-3!" : ""}`}
      >
        <h2 id={titleId}>{title}</h2>
        <IconButton
          variant="ghost"
          aria-label={closeLabel ?? (variant === "offcanvas" ? "Close mail panel" : "Close dialog")}
          onClick={onClose}
        >
          <X size={16} />
        </IconButton>
      </div>
      {variant === "offcanvas" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
      ) : (
        children
      )}
    </dialog>
  );
}
