"use client";
import { useSyncExternalStore } from "react";
export function createLocalStore<T>(key: string, seed: T, valid: (value: unknown) => value is T) {
  const initial = { data: seed, warning: "" };
  let state = initial,
    initialized = false;
  const listeners = new Set<() => void>(),
    notify = () => listeners.forEach((l) => l());
  function load() {
    try {
      const raw = localStorage.getItem(key),
        data: unknown = raw ? JSON.parse(raw) : structuredClone(seed);
      if (!valid(data)) throw new Error();
      state = { data, warning: "" };
    } catch {
      state = {
        data: structuredClone(seed),
        warning:
          "Saved demo data could not be loaded. Original samples are shown; your next save replaces the invalid data.",
      };
    }
  }
  const store = {
    subscribe(l: () => void) {
      listeners.add(l);
      if (!initialized) {
        initialized = true;
        load();
        queueMicrotask(notify);
        window.addEventListener("storage", (e) => {
          if (e.key === key) {
            load();
            notify();
          }
        });
      }
      return () => {
        listeners.delete(l);
      };
    },
    getSnapshot: () => state,
    getServerSnapshot: () => initial,
    update(change: (data: T) => void) {
      try {
        const data = structuredClone(state.data);
        change(data);
        if (!valid(data)) throw new Error("Invalid demo records. The change was not saved.");
        let warning = "";
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch {
          warning =
            "Storage is unavailable or full. Changes are kept in memory for this session only.";
        }
        state = { data, warning };
        notify();
        return "";
      } catch (e) {
        return e instanceof Error ? e.message : "Unable to save changes.";
      }
    },
  };
  return {
    ...store,
    useStore: () => ({
      ...useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot),
      update: store.update,
    }),
  };
}
export const today = "2026-11-02";
export const uid = () => crypto.randomUUID();
export const dateLabel = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
export const offsetDate = (date: string, days: number) =>
  new Date(Date.parse(date.slice(0, 10)) + days * 86400000).toISOString().slice(0, 10);
export const stamp = () => `${today}T${new Date().toISOString().slice(11)}`;
export const isDate = (v: unknown): v is string =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;
export const uniqueIds = (items: { id: string }[]) =>
  items.every((i) => typeof i.id === "string" && !!i.id) &&
  new Set(items.map((i) => i.id)).size === items.length;
