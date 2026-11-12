"use client";
import type { ReactNode } from "react";
import { useCrm } from "../hooks/use-crm";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "../crm.css";

export function CrmWorkspace({ children }: { children: ReactNode }) {
  const { error, ready } = useCrm();
  return (
    <div className="crm-workspace">
      {error && (
        <div className="crm-error" role="alert">
          {error}
        </div>
      )}
      {!ready && (
        <p className="crm-muted" role="status">
          Loading local demo workspace...
        </p>
      )}
      {children}
    </div>
  );
}
