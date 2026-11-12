"use client";
import { useSyncExternalStore } from "react";
import { commerceStore } from "../demo-service";
export function useCommerce() {
  const data = useSyncExternalStore(
    commerceStore.subscribe,
    commerceStore.getSnapshot,
    commerceStore.getServerSnapshot,
  );
  return { data, update: commerceStore.update, warning: commerceStore.getWarning() };
}
