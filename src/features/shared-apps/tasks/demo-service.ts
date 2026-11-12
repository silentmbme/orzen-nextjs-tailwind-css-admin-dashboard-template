"use client";
import { createLocalStore, isDate, uniqueIds } from "../common/store";
import { taskPeople, taskStatuses, type TaskData, type Task } from "./types";
const seed: TaskData = {
  tasks: [
    {
      id: "task-1",
      title: "Prepare release notes",
      description: "Summarize the key improvements and known demo limitations.",
      assigneeId: "alex",
      priority: "High",
      status: "In progress",
      due: "2026-11-04",
      labels: ["Release", "Writing"],
      subtasks: [
        { id: "sub-1", title: "Collect changes", completed: true },
        { id: "sub-2", title: "Review wording", completed: false },
      ],
    },
    {
      id: "task-2",
      title: "Review mobile layouts",
      description: "Check each workspace at 320px and tablet widths.",
      assigneeId: "priya",
      priority: "High",
      status: "To do",
      due: "2026-11-01",
      labels: ["Design", "QA"],
      subtasks: [{ id: "sub-3", title: "Check navigation", completed: false }],
    },
    {
      id: "task-3",
      title: "Verify local exports",
      description: "Confirm CSV, attachment and file downloads contain real demo data.",
      assigneeId: "daniel",
      priority: "Medium",
      status: "Review",
      due: "2026-11-05",
      labels: ["QA"],
      subtasks: [],
    },
    {
      id: "task-4",
      title: "Confirm review agenda",
      description: "Share the local demo agenda with the team.",
      assigneeId: "sofia",
      priority: "Low",
      status: "Done",
      due: "2026-10-30",
      labels: ["Planning"],
      subtasks: [{ id: "sub-4", title: "Draft agenda", completed: true }],
    },
  ],
};
export const taskStore = createLocalStore(
  "nova-tasks-demo-v1",
  seed,
  (v: unknown): v is TaskData => {
    const d = v as TaskData;
    return (
      !!d &&
      Array.isArray(d.tasks) &&
      uniqueIds(d.tasks) &&
      d.tasks.every(
        (t) =>
          typeof t.title === "string" &&
          !!t.title.trim() &&
          typeof t.description === "string" &&
          taskPeople.some((p) => p.id === t.assigneeId) &&
          ["High", "Medium", "Low"].includes(t.priority) &&
          taskStatuses.includes(t.status) &&
          isDate(t.due) &&
          Array.isArray(t.labels) &&
          t.labels.every((l) => typeof l === "string") &&
          Array.isArray(t.subtasks) &&
          uniqueIds(t.subtasks) &&
          t.subtasks.every(
            (s) =>
              typeof s.title === "string" && !!s.title.trim() && typeof s.completed === "boolean",
          ) &&
          (t.status !== "Done" || t.subtasks.every((s) => s.completed)),
      )
    );
  },
);
export function moveTask(id: string, status: Task["status"]) {
  return taskStore.update((d) => {
    const t = d.tasks.find((t) => t.id === id);
    if (!t) throw new Error("Task not found.");
    t.status = status;
    if (status === "Done")
      t.subtasks.forEach((s) => {
        s.completed = true;
      });
  });
}
