import { seed } from "./seed";
import { type CommerceData } from "./types";
import { validCommerceData } from "./schemas/persistence";

const key = "nova-ecommerce-demo-v1";
let snapshot = seed;
let warning = "";
let initialized = false;
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((listener) => listener());
}
function load() {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!validCommerceData(parsed)) throw new Error("Invalid demo data");
      snapshot = parsed;
    } else snapshot = structuredClone(seed);
    warning = "";
  } catch {
    snapshot = structuredClone(seed);
    warning =
      "Saved demo data could not be loaded. Showing the original dataset; saving again replaces it.";
  }
}
export const commerceStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!initialized) {
      initialized = true;
      load();
      queueMicrotask(notify);
      window.addEventListener("storage", (event) => {
        if (event.key === key) {
          load();
          notify();
        }
      });
    }
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => seed,
  getWarning: () => warning,
  update(change: (data: CommerceData) => void) {
    const draft = structuredClone(snapshot);
    change(draft);
    snapshot = draft;
    try {
      localStorage.setItem(key, JSON.stringify(draft));
      warning = "";
    } catch {
      warning =
        "Browser storage is unavailable or full. Changes are retained for this session only.";
    }
    notify();
  },
};

export function downloadReport(name: string, rows: Record<string, string | number>[]) {
  const columns = Object.keys(rows[0] ?? {});
  const cell = (value: unknown) =>
    `"${String(value ?? "")
      .replace(/^[=+@-]/, "'$&")
      .replaceAll('"', '""')}"`;
  const blob = new Blob(
    [
      [columns, ...rows.map((row) => columns.map((column) => row[column]))]
        .map((row) => row.map(cell).join(","))
        .join("\r\n"),
    ],
    { type: "text/csv;charset=utf-8" },
  );
  const url = URL.createObjectURL(blob),
    link = document.createElement("a");
  link.href = url;
  link.download = `${name}-demo.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
