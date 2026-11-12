"use client";
import { useSyncExternalStore } from "react";
import { hrStore } from "../demo-service";
export function useHr() {
  const state = useSyncExternalStore(
    hrStore.subscribe,
    hrStore.getSnapshot,
    hrStore.getServerSnapshot,
  );
  return { ...state, update: hrStore.update };
}
