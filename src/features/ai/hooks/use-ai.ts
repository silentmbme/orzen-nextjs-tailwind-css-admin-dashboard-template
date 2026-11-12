"use client";
import { useSyncExternalStore } from "react";
import { aiStore } from "../demo-service";
export function useAi() {
  return {
    ...useSyncExternalStore(aiStore.subscribe, aiStore.getSnapshot, aiStore.getServerSnapshot),
    update: aiStore.update,
  };
}
