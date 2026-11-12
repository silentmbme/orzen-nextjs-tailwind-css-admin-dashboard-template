export const taskStatuses = ["To do", "In progress", "Review", "Done"] as const;
export const taskPeople = [
  { id: "alex", name: "Alex Morgan" },
  { id: "priya", name: "Priya Shah" },
  { id: "daniel", name: "Daniel Kim" },
  { id: "sofia", name: "Sofia Garcia" },
];
export type Task = {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: "High" | "Medium" | "Low";
  status: (typeof taskStatuses)[number];
  due: string;
  labels: string[];
  subtasks: { id: string; title: string; completed: boolean }[];
};
export type TaskData = { tasks: Task[] };
