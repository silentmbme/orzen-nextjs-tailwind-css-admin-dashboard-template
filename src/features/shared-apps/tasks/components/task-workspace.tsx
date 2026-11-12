"use client";
import { useState, type FormEvent } from "react";
import { Check, ClipboardList, Columns3, List, Plus, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AppTitle, AppField, SharedWorkspace } from "../../common/workspace";
import { today, uid } from "../../common/store";
import { taskStore, moveTask } from "../demo-service";
import { taskStatuses, taskPeople, type Task } from "../types";
function TaskForm({
  task,
  onClose,
  initialStatus = "To do",
}: {
  task?: Task;
  onClose: () => void;
  initialStatus?: Task["status"];
}) {
  const [draft, setDraft] = useState<Task>(
      task || {
        id: "",
        title: "",
        description: "",
        assigneeId: "alex",
        priority: "Medium",
        status: initialStatus,
        due: today,
        labels: [],
        subtasks: [],
      },
    ),
    [labels, setLabels] = useState(task?.labels.join(", ") || ""),
    [subtask, setSubtask] = useState(""),
    [error, setError] = useState("");
  function save(e: FormEvent) {
    e.preventDefault();
    const error = taskStore.update((d) => {
      const saved = {
        ...draft,
        id: draft.id || uid(),
        title: draft.title.trim(),
        labels: [
          ...new Set(
            labels
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean),
          ),
        ],
      };
      if (saved.status === "Done")
        saved.subtasks.forEach((s) => {
          s.completed = true;
        });
      const index = d.tasks.findIndex((t) => t.id === saved.id);
      if (index < 0) d.tasks.unshift(saved);
      else d.tasks[index] = saved;
    });
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={save} className="space-y-3">
      <AppField label="Task title *">
        <Input
          required
          maxLength={150}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </AppField>
      <AppField label="Task description">
        <textarea
          maxLength={4000}
          className="min-h-24 rounded-control border border-border bg-surface p-2 outline-accent"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </AppField>
      <div className="grid gap-3 sm:grid-cols-2">
        <AppField label="Task assignee">
          <Select
            aria-label="Task assignee"
            value={draft.assigneeId}
            onChange={(e) => setDraft({ ...draft, assigneeId: e.target.value })}
          >
            {taskPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </AppField>
        <AppField label="Task priority">
          <Select
            aria-label="Task priority"
            value={draft.priority}
            onChange={(e) => setDraft({ ...draft, priority: e.target.value as Task["priority"] })}
          >
            {["High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
        </AppField>
        <AppField label="Task status">
          <Select
            aria-label="Task status"
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as Task["status"] })}
          >
            {taskStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </AppField>
        <AppField label="Task due date *">
          <Input
            required
            type="date"
            value={draft.due}
            onChange={(e) => setDraft({ ...draft, due: e.target.value })}
          />
        </AppField>
      </div>
      <AppField label="Labels (comma separated)">
        <Input maxLength={200} value={labels} onChange={(e) => setLabels(e.target.value)} />
      </AppField>
      <div>
        <p className="text-label font-medium">Subtasks</p>
        {draft.subtasks.map((s) => (
          <div key={s.id} className="mt-2 flex justify-between gap-2 text-label">
            <span>{s.title}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                setDraft({ ...draft, subtasks: draft.subtasks.filter((x) => x.id !== s.id) })
              }
            >
              Remove
            </Button>
          </div>
        ))}
        <div className="mt-2 flex gap-2">
          <Input
            aria-label="New subtask"
            maxLength={150}
            value={subtask}
            onChange={(e) => setSubtask(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={!subtask.trim()}
            onClick={() => {
              setDraft({
                ...draft,
                subtasks: [
                  ...draft.subtasks,
                  { id: uid(), title: subtask.trim(), completed: false },
                ],
              });
              setSubtask("");
            }}
          >
            Add subtask
          </Button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo task</Button>
      </div>
    </form>
  );
}
import { TaskBoard } from "./task-board";
export function TaskWorkspace() {
  const { data, warning, update } = taskStore.useStore(),
    [board, setBoard] = useState(true),
    [query, setQuery] = useState(""),
    [assignee, setAssignee] = useState("all"),
    [priority, setPriority] = useState("all"),
    [status, setStatus] = useState("all"),
    [sort, setSort] = useState("due"),
    [selected, setSelected] = useState(""),
    [editor, setEditor] = useState<string | null>(null),
    [remove, setRemove] = useState(false),
    [notice, setNotice] = useState("");
  const task = data.tasks.find((t) => t.id === selected);
  const rows = data.tasks
    .filter(
      (t) =>
        `${t.title} ${t.description} ${t.labels.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (assignee === "all" || t.assigneeId === assignee) &&
        (priority === "all" || t.priority === priority) &&
        (status === "all" || t.status === status),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : sort === "priority"
          ? ["High", "Medium", "Low"].indexOf(a.priority) -
            ["High", "Medium", "Low"].indexOf(b.priority)
          : a.due.localeCompare(b.due),
    );
  const done = rows.filter((t) => t.status === "Done").length,
    overdue = rows.filter((t) => t.status !== "Done" && t.due < today).length;
  const [newStatus, setNewStatus] = useState<Task["status"]>("To do");
  function create(status: Task["status"]) {
    setNewStatus(status);
    setEditor("new");
  }
  function checkSubtask(taskId: string, subId: string) {
    setNotice(
      update((d) => {
        const t = d.tasks.find((t) => t.id === taskId);
        const sub = t?.subtasks.find((s) => s.id === subId);
        if (t && sub) {
          sub.completed = !sub.completed;
          if (!sub.completed && t.status === "Done") t.status = "In progress";
        }
      }),
    );
  }
  function statusSelect(t: Task) {
    return (
      <Select
        aria-label={`Status for ${t.title}`}
        value={t.status}
        onChange={(e) =>
          setNotice(
            moveTask(t.id, e.target.value as Task["status"]) || "Task status saved locally.",
          )
        }
      >
        {taskStatuses.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </Select>
    );
  }
  return (
    <SharedWorkspace
      title="Task management"
      description="A local productivity workspace · overdue dates use the November 2, 2026 demo snapshot."
      warning={warning}
      actions={
        <Button onClick={() => create("To do")}>
          <Plus size={13} />
          Create task
        </Button>
      }
    >
      <Card
        title={<AppTitle icon={ClipboardList}>Team worklist</AppTitle>}
        action={
          <div className="flex gap-1">
            <Button
              aria-pressed={!board}
              variant={!board ? "secondary" : "ghost"}
              onClick={() => setBoard(false)}
            >
              <List size={13} />
              List
            </Button>
            <Button
              aria-pressed={board}
              variant={board ? "secondary" : "ghost"}
              onClick={() => setBoard(true)}
            >
              <Columns3 size={13} />
              Board
            </Button>
          </div>
        }
      >
        <div className="my-3 flex flex-wrap items-center justify-between gap-3 rounded-control border border-border bg-surface-alt p-3 text-label">
          <span className="inline-flex flex-wrap items-center gap-1.5">
            {rows.length} tasks ·{" "}
            <strong className="font-medium text-success">{done} completed</strong> ·{" "}
            <span className="text-danger">{overdue} overdue</span>
          </span>
          <span className="text-tiny text-muted">
            {rows.length ? Math.round((done / rows.length) * 100) : 0}% complete in this selection
          </span>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <Input
            aria-label="Search tasks"
            placeholder="Search titles, labels or notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select
            aria-label="Task assignee filter"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="all">All assignees</option>
            {taskPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
          <Select
            aria-label="Task priority filter"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All priorities</option>
            {["High", "Medium", "Low"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </Select>
          <Select
            aria-label="Task status filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All statuses</option>
            {taskStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Select aria-label="Sort tasks" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="due">Due date</option>
            <option value="name">Title A–Z</option>
            <option value="priority">Priority</option>
          </Select>
        </div>
        {notice && (
          <p role="status" className="mb-3 text-label text-muted">
            {notice}
          </p>
        )}
        {board ? (
          <>
            <p className="mb-3 text-[10px] text-muted">
              Your team board · drag to move tasks, or use the status selector. Done completes the
              checklist.
            </p>
            <TaskBoard
              tasks={rows}
              onOpen={(t) => {
                setSelected(t.id);
                setRemove(false);
              }}
              onCreate={create}
              onMove={(id, status) =>
                setNotice(moveTask(id, status) || "Task status saved locally.")
              }
              onCheck={checkSubtask}
            />
          </>
        ) : (
          <div className="[&_table]:min-w-[820px]">
            <DataTable
              label="Tasks"
              rows={rows}
              rowKey={(t) => t.id}
              pageSize={6}
              columns={[
                {
                  key: "title",
                  label: "Task",
                  value: (t) => t.title,
                  render: (t) => (
                    <button
                      className="text-left text-accent"
                      onClick={() => {
                        setSelected(t.id);
                        setRemove(false);
                      }}
                    >
                      {t.title}
                      <span className="mt-1 block text-[10px] text-muted">
                        {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length} subtasks
                      </span>
                    </button>
                  ),
                },
                {
                  key: "assignee",
                  label: "Assignee",
                  value: (t) => taskPeople.find((p) => p.id === t.assigneeId)?.name || "",
                  render: (t) => (
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        name={taskPeople.find((p) => p.id === t.assigneeId)?.name}
                        size={24}
                      />
                      {taskPeople.find((p) => p.id === t.assigneeId)?.name}
                    </div>
                  ),
                },
                {
                  key: "priority",
                  label: "Priority",
                  value: (t) => t.priority,
                  render: (t) => (
                    <Badge tone={t.priority === "High" ? "danger" : "neutral"}>{t.priority}</Badge>
                  ),
                },
                {
                  key: "due",
                  label: "Due",
                  value: (t) => t.due,
                  render: (t) => (
                    <span className={t.due < today && t.status !== "Done" ? "text-danger" : ""}>
                      {t.due}
                    </span>
                  ),
                },
                { key: "status", label: "Status", value: (t) => t.status, render: statusSelect },
              ]}
            />
          </div>
        )}
        {!rows.length && (
          <p className="py-4 text-label text-muted">No tasks match these filters.</p>
        )}
      </Card>
      <Dialog
        open={editor !== null}
        title={editor === "new" ? "Create task" : "Edit task"}
        onClose={() => setEditor(null)}
      >
        {editor !== null && (
          <TaskForm
            key={editor}
            initialStatus={newStatus}
            task={data.tasks.find((t) => t.id === editor)}
            onClose={() => setEditor(null)}
          />
        )}
      </Dialog>
      <Dialog
        open={!!task}
        title={remove ? "Delete task?" : "Task details"}
        onClose={() => setSelected("")}
      >
        {task && (
          <div className="space-y-3">
            <p className="text-[20px] font-semibold leading-snug">{task.title}</p>
            <p className="whitespace-pre-wrap break-words rounded-control border border-border bg-surface-alt p-3 text-label leading-relaxed text-muted">
              {task.description}
            </p>
            <div className="flex flex-wrap gap-2 text-tiny">
              <Badge>{task.priority}</Badge>
              <span>Due {task.due}</span>
              <span className="inline-flex items-center gap-1.5">
                <UserAvatar
                  name={taskPeople.find((p) => p.id === task.assigneeId)?.name}
                  size={24}
                  className="h-6 w-6"
                />
                {taskPeople.find((p) => p.id === task.assigneeId)?.name}
              </span>
            </div>
            {statusSelect(task)}
            <div className="flex flex-wrap gap-1">
              {task.labels.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 rounded-control bg-surface-alt p-1 text-tiny"
                >
                  <Tag size={10} />
                  {l}
                </span>
              ))}
            </div>
            <p className="border-t border-border pt-3 text-label font-medium">
              Checklist · {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </p>
            {task.subtasks.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-label">
                <input
                  type="checkbox"
                  checked={s.completed}
                  onChange={() =>
                    setNotice(
                      update((d) => {
                        const t = d.tasks.find((t) => t.id === task.id)!,
                          sub = t.subtasks.find((x) => x.id === s.id)!;
                        sub.completed = !sub.completed;
                        if (!sub.completed && t.status === "Done") t.status = "In progress";
                      }),
                    )
                  }
                />
                <span className={s.completed ? "text-muted line-through" : ""}>{s.title}</span>
                {s.completed && <Check size={12} className="text-success" />}
              </label>
            ))}
            {!task.subtasks.length && (
              <p className="text-tiny text-muted">No subtasks. Add checklist items in Edit task.</p>
            )}
            <div className="flex justify-end gap-2">
              {remove ? (
                <>
                  <Button variant="outline" onClick={() => setRemove(false)}>
                    Keep task
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setNotice(
                        update((d) => {
                          d.tasks = d.tasks.filter((t) => t.id !== task.id);
                        }) || "Task deleted.",
                      );
                      setSelected("");
                    }}
                  >
                    Confirm delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditor(task.id);
                      setSelected("");
                    }}
                  >
                    Edit task
                  </Button>
                  <Button variant="destructive" onClick={() => setRemove(true)}>
                    Delete task
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </SharedWorkspace>
  );
}
