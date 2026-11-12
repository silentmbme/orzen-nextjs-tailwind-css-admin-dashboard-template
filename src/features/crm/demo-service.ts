import { seed } from "./seed";
import { collections, parseRecord, validStoredData } from "./schemas/records";
import { stages, type CrmData, type Entity, type Stage } from "./types";

const key = "nova-crm-demo-v1";
type Snapshot = { data: CrmData; error: string | null; ready: boolean };
const initial: Snapshot = { data: seed, error: null, ready: false };
let snapshot = initial;
let loaded = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function read() {
  try {
    const saved = localStorage.getItem(key);
    if (saved && saved.length > 3000000) throw new Error();
    const value: unknown = saved ? JSON.parse(saved) : seed;
    if (!validStoredData(value)) throw new Error();
    snapshot = { data: value, error: null, ready: true };
  } catch {
    snapshot = {
      data: seed,
      error:
        "Saved CRM data could not be read. Demo defaults are shown. New edits will replace unreadable saved data.",
      ready: true,
    };
  }
}
function commit(data: CrmData) {
  let error: string | null = null;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    error = "Browser storage is unavailable. Changes work in this tab but may be lost on reload.";
  }
  snapshot = { data, error, ready: true };
  notify();
}
export const crmService = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    if (!loaded) {
      loaded = true;
      read();
      queueMicrotask(notify);
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        read();
        notify();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => initial,
  save(entity: Entity, values: Record<string, string>, existingId?: string): string | null {
    const data = snapshot.data;
    const collection = collections[entity];
    if (existingId && !data[collection].some((row) => row.id === existingId))
      return "This record no longer exists. Refresh the page and try again.";
    if (!existingId && data[collection].length >= 1000)
      return "The demo supports up to 1,000 records of each type.";
    const id = existingId || `${entity}-${crypto.randomUUID()}`;
    const result = parseRecord(entity, values, id, data);
    if (result.error || !result.record) return result.error || "Unable to save this demo record.";
    const rows = [...data[collection].filter((row) => row.id !== id), result.record];
    commit({ ...data, [collection]: rows } as CrmData);
    return null;
  },
  moveDeal(id: string, stage: Stage) {
    if (!stages.includes(stage)) return;
    commit({
      ...snapshot.data,
      opportunities: snapshot.data.opportunities.map((deal) =>
        deal.id === id
          ? {
              ...deal,
              stage,
              probability:
                stage === "Won"
                  ? 100
                  : stage === "Lost"
                    ? 0
                    : { Discovery: 20, Qualified: 40, Proposal: 60, Negotiation: 80 }[stage],
            }
          : deal,
      ),
    });
  },
  toggle(entity: "activity" | "meeting", id: string) {
    const collection = collections[entity];
    commit({
      ...snapshot.data,
      [collection]: snapshot.data[collection].map((row) =>
        row.id === id ? { ...row, completed: !row.completed } : row,
      ),
    });
  },
};
