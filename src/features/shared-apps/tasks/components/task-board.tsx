"use client";
import { CalendarDays, CheckCircle2, Circle, GripVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { today } from "../../common/store";
import { taskPeople, taskStatuses, type Task } from "../types";
const statusColors = {
  "To do": "bg-muted",
  "In progress": "bg-accent",
  Review: "bg-trend-down",
  Done: "bg-success",
};
type Props = {
  tasks: Task[];
  onOpen: (task: Task) => void;
  onCreate: (status: Task["status"]) => void;
  onMove: (id: string, status: Task["status"]) => void;
  onCheck: (taskId: string, subtaskId: string) => void;
};
export function TaskBoard({ tasks, onOpen, onCreate, onMove, onCheck }: Props) {
  return (
    <div className="grid items-start gap-3 md:grid-cols-2 xl:grid-cols-4">
      {taskStatuses.map((status) => {
        const scoped = tasks.filter((t) => t.status === status);
        return (
          <section
            key={status}
            data-testid={`task-column-${status}`}
            aria-label={`${status} tasks`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onMove(e.dataTransfer.getData("text/plain"), status);
            }}
            className="min-h-[340px] rounded-card border border-border bg-surface-alt p-2"
          >
            <div className="flex items-center justify-between gap-2 px-1 py-1">
              <h3 className="flex items-center gap-2 text-label font-medium">
                <i className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
                {status}
                <span className="rounded-control border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                  {scoped.length}
                </span>
              </h3>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Create task in ${status}`}
                onClick={() => onCreate(status)}
              >
                <Plus size={13} />
              </Button>
            </div>
            <p className="mb-3 px-1 text-[10px] text-muted">
              {status === "To do"
                ? "Ready to be picked up"
                : status === "In progress"
                  ? "Work currently underway"
                  : status === "Review"
                    ? "Waiting for a final check"
                    : "Completed and checked off"}
            </p>
            <div className="space-y-3">
              {scoped.map((task) => {
                const owner = taskPeople.find((p) => p.id === task.assigneeId),
                  checked = task.subtasks.filter((s) => s.completed).length,
                  overdue = task.due < today && task.status !== "Done";
                return (
                  <article
                    key={task.id}
                    data-testid={`task-card-${task.id}`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
                    className="rounded-card border border-border bg-surface p-3 transition-colors hover:border-accent/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone={task.priority === "High" ? "danger" : "neutral"}>
                        {task.priority} priority
                      </Badge>
                      <GripVertical
                        size={13}
                        aria-label="Drag task"
                        className="shrink-0 text-muted"
                      />
                    </div>
                    <button
                      onClick={() => onOpen(task)}
                      className={`mt-3 block w-full break-words text-left text-body font-medium leading-snug hover:text-accent ${task.status === "Done" ? "text-muted" : ""}`}
                    >
                      {task.title}
                    </button>
                    <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">
                      {task.description || "Add details to give this task more context."}
                    </p>
                    {task.labels.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {task.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-control bg-accent/5 px-1.5 py-1 text-[10px] text-accent"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                    {task.subtasks.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-border pt-2">
                        <p className="flex items-center gap-1 text-[10px] text-muted">
                          <CheckCircle2 size={11} />
                          {checked}/{task.subtasks.length} checklist items
                        </p>
                        {task.subtasks.slice(0, 2).map((sub) => (
                          <label
                            key={sub.id}
                            className="flex items-start gap-1.5 text-[11px] text-muted"
                          >
                            <input
                              type="checkbox"
                              checked={sub.completed}
                              onChange={() => onCheck(task.id, sub.id)}
                              className="mt-0.5 shrink-0"
                            />
                            <span className={sub.completed ? "line-through" : ""}>{sub.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                      <span className="flex items-center gap-1.5">
                        <UserAvatar name={owner?.name} size={24} className="h-6 w-6" />
                        <span className="text-[10px] text-muted">{owner?.name.split(" ")[0]}</span>
                      </span>
                      <time
                        dateTime={task.due}
                        className={`inline-flex items-center gap-1 rounded-control px-1.5 py-1 text-[10px] ${overdue ? "bg-danger-subtle text-danger" : "bg-surface-alt text-muted"}`}
                      >
                        <CalendarDays size={10} />
                        {overdue ? "Overdue · " : ""}
                        {new Date(`${task.due}T12:00:00Z`).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                      </time>
                    </div>
                    <Select
                      aria-label={`Status for ${task.title}`}
                      className="mt-3 w-full"
                      value={task.status}
                      onChange={(e) => onMove(task.id, e.target.value as Task["status"])}
                    >
                      {taskStatuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  </article>
                );
              })}
            </div>
            {!scoped.length && (
              <button
                onClick={() => onCreate(status)}
                className="mt-3 flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-control border border-dashed border-border p-4 text-center hover:border-accent"
              >
                <Circle size={21} className="text-muted" />
                <span className="text-label text-muted">No tasks here yet</span>
                <span className="text-[10px] text-accent">Add a task or drop one here</span>
              </button>
            )}
            {scoped.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-3 w-full justify-start"
                onClick={() => onCreate(status)}
              >
                <Plus size={12} />
                Add task
              </Button>
            )}
          </section>
        );
      })}
    </div>
  );
}
