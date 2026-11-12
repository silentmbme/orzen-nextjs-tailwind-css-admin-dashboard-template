"use client";
import { useSyncExternalStore } from "react";
import { crmService } from "../demo-service";

export function useCrm() {
  return useSyncExternalStore(
    crmService.subscribe,
    crmService.getSnapshot,
    crmService.getServerSnapshot,
  );
}
