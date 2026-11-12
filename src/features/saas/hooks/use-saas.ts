"use client";
import { useSyncExternalStore } from "react";
import { saasStore } from "../demo-service";
export function useSaas() {
  const snapshot = useSyncExternalStore(
    saasStore.subscribe,
    saasStore.getSnapshot,
    saasStore.getServerSnapshot,
  );
  return { ...snapshot, update: saasStore.update };
}
