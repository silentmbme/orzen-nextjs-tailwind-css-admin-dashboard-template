"use client";
import { useState, type FormEvent } from "react";
import {
  BookOpen,
  Copy,
  FileText,
  History,
  LayoutGrid,
  List,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { AiWorkspace, AiTitle } from "./ai-workspace";
import { MarkdownText } from "./conversation-message";
import { useAi } from "../hooks/use-ai";
import { deletePrompt, id, savePrompt } from "../demo-service";
import { variables } from "../schemas/validation";
import type { Prompt } from "../types";
function PromptForm({ prompt, onClose }: { prompt?: Prompt; onClose: () => void }) {
  const [draft, setDraft] = useState<Prompt>(
      prompt || {
        id: "",
        name: "",
        category: "Writing",
        description: "",
        content: "",
        favorite: false,
        versions: [],
      },
    ),
    [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const error = savePrompt(draft);
    if (error) setError(error);
    else onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="flex flex-col gap-1 text-label">
        Prompt name *
        <Input
          required
          maxLength={100}
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 text-label">
        Prompt category
        <Select
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          {["Writing", "Support", "Engineering", "Operations"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </label>
      <label className="flex flex-col gap-1 text-label">
        Description
        <Input
          maxLength={250}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>
      <label className="flex flex-col gap-1 text-label">
        Template content *
        <textarea
          required
          maxLength={12000}
          className="min-h-48 rounded-control border border-border bg-surface p-2 font-mono text-label outline-accent"
          value={draft.content}
          onChange={(e) => setDraft({ ...draft, content: e.target.value })}
        />
      </label>
      <p className="text-tiny text-muted">
        Use {"{{variable_name}}"} for reusable inputs. Detected:{" "}
        {variables(draft.content).join(", ") || "none"}.
      </p>
      {error && (
        <p role="alert" className="text-label text-danger">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save demo prompt</Button>
      </div>
    </form>
  );
}
export function PromptLibrary() {
  const { data, update } = useAi(),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("all"),
    [favorites, setFavorites] = useState(false),
    [list, setList] = useState(false),
    [edit, setEdit] = useState<string | null>(null),
    [preview, setPreview] = useState(""),
    [deleting, setDeleting] = useState(""),
    [notice, setNotice] = useState(""),
    [values, setValues] = useState<Record<string, string>>({});
  const prompts = data.prompts.filter(
      (p) =>
        `${p.name} ${p.content}`.toLowerCase().includes(query.toLowerCase()) &&
        (category === "all" || p.category === category) &&
        (!favorites || p.favorite),
    ),
    selected = data.prompts.find((p) => p.id === preview);
  async function copy(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setNotice("Prompt copied.");
    } catch {
      setNotice("Clipboard unavailable. Open the preview and select the template text.");
    }
  }
  function duplicate(prompt: Prompt) {
    setNotice(
      update((d) =>
        d.prompts.unshift({
          ...structuredClone(prompt),
          id: id(),
          name: `${prompt.name} copy`,
          versions: [],
        }),
      ) || "Prompt duplicated.",
    );
  }
  return (
    <AiWorkspace
      title="Prompt library"
      description="Reusable instructions, template variables and local version history."
      actions={
        <Button onClick={() => setEdit("new")}>
          <Plus size={13} />
          Create prompt
        </Button>
      }
    >
      <div className="grid items-start gap-widget xl:grid-cols-[190px_minmax(0,1fr)]">
        <Card title={<AiTitle icon={BookOpen}>Collections</AiTitle>}>
          <div className="mt-3 space-y-1">
            {["all", "Writing", "Support", "Engineering", "Operations"].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`flex w-full justify-between rounded-control p-2 text-left text-label ${category === c ? "bg-accent/10 text-accent" : "hover:bg-surface-alt"}`}
              >
                <span>{c === "all" ? "All templates" : c}</span>
                <span className="text-tiny text-muted">
                  {data.prompts.filter((p) => c === "all" || p.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <Button
            variant={favorites ? "secondary" : "ghost"}
            className="mt-3 w-full"
            aria-pressed={favorites}
            onClick={() => setFavorites(!favorites)}
          >
            <Star size={12} />
            Favorites only
          </Button>
        </Card>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Input
              aria-label="Search prompts"
              placeholder="Search instructions or titles…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1"
            />
            <Button
              variant={list ? "ghost" : "secondary"}
              aria-label="Prompt grid view"
              aria-pressed={!list}
              onClick={() => setList(false)}
            >
              <LayoutGrid size={13} />
            </Button>
            <Button
              variant={list ? "secondary" : "ghost"}
              aria-label="Prompt list view"
              aria-pressed={list}
              onClick={() => setList(true)}
            >
              <List size={13} />
            </Button>
          </div>
          {notice && (
            <p role="status" className="mb-3 text-label text-muted">
              {notice}
            </p>
          )}
          <div className={`grid gap-widget ${list ? "grid-cols-1" : "md:grid-cols-2"}`}>
            {prompts.map((p) => (
              <Card key={p.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-control bg-accent/10 px-2 py-1 text-tiny text-accent">
                    {p.category}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`${p.favorite ? "Unfavorite" : "Favorite"} ${p.name}`}
                    aria-pressed={p.favorite}
                    onClick={() =>
                      update((d) => {
                        d.prompts.find((x) => x.id === p.id)!.favorite = !p.favorite;
                      })
                    }
                  >
                    <Star size={13} fill={p.favorite ? "currentColor" : "none"} />
                  </Button>
                </div>
                <button
                  className="mt-3 text-left font-medium hover:text-accent"
                  onClick={() => {
                    setPreview(p.id);
                    setValues({});
                  }}
                >
                  {p.name}
                </button>
                <p className="mt-1 text-label text-muted">
                  {p.description || "Custom prompt template"}
                </p>
                <pre className="mt-3 max-h-24 overflow-hidden whitespace-pre-wrap break-words rounded-control border border-border bg-surface-alt p-2 font-mono text-[11px] text-muted">
                  {p.content.slice(0, 220)}
                </pre>
                <p className="mt-2 text-tiny text-muted">
                  {variables(p.content).length} variables · v{p.versions.length + 1}
                </p>
                <div className="mt-3 flex flex-wrap gap-1 border-t border-border pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreview(p.id);
                      setValues({});
                    }}
                  >
                    Preview
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEdit(p.id)}>
                    Edit
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Copy ${p.name}`}
                    onClick={() => void copy(p.content)}
                  >
                    <Copy size={12} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Duplicate ${p.name}`}
                    onClick={() => duplicate(p)}
                  >
                    <FileText size={12} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${p.name}`}
                    onClick={() => {
                      setDeleting(p.id);
                      setNotice("");
                    }}
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {!prompts.length && (
            <p className="rounded-card border border-dashed border-border bg-surface p-6 text-label text-muted">
              No prompt templates match this selection.
            </p>
          )}
        </div>
      </div>
      <Dialog
        open={edit !== null}
        title={edit === "new" ? "Create prompt" : "Edit prompt"}
        onClose={() => setEdit(null)}
      >
        {edit !== null && (
          <PromptForm
            key={edit}
            prompt={data.prompts.find((p) => p.id === edit)}
            onClose={() => setEdit(null)}
          />
        )}
      </Dialog>
      <Dialog open={!!selected} title="Prompt preview & history" onClose={() => setPreview("")}>
        {selected && (
          <div className="space-y-3">
            <p className="font-medium">{selected.name}</p>
            {variables(selected.content).map((variable) => (
              <label key={variable} className="flex flex-col gap-1 text-label">
                {variable}
                <Input
                  value={values[variable] || ""}
                  onChange={(e) => setValues({ ...values, [variable]: e.target.value })}
                />
              </label>
            ))}
            <div className="rounded-control border border-border bg-surface-alt p-3 text-label">
              <MarkdownText
                content={selected.content.replace(
                  /\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g,
                  (match, variable: string) => values[variable] || match,
                )}
              />
            </div>
            <Button
              onClick={() =>
                void copy(
                  selected.content.replace(
                    /\{\{\s*([a-zA-Z][\w]*)\s*\}\}/g,
                    (match, variable: string) => values[variable] || match,
                  ),
                )
              }
            >
              <Copy size={12} />
              Copy resolved prompt
            </Button>
            {notice && (
              <p role="status" className="text-tiny text-muted">
                {notice}
              </p>
            )}
            <details className="border-t border-border pt-3">
              <summary className="flex cursor-pointer items-center gap-1 text-label">
                <History size={12} />
                Version history ({selected.versions.length})
              </summary>
              {selected.versions.map((v, i) => (
                <div key={i} className="mt-3">
                  <p className="text-tiny text-muted">
                    v{v.version} · {v.date}
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap break-words text-label">{v.content}</pre>
                </div>
              ))}
              {!selected.versions.length && (
                <p className="mt-2 text-tiny text-muted">
                  No earlier versions. Editing creates a local snapshot.
                </p>
              )}
            </details>
          </div>
        )}
      </Dialog>
      <Dialog open={!!deleting} title="Delete prompt?" onClose={() => setDeleting("")}>
        <p className="text-label text-muted">
          Delete this local template? Referenced prompts are protected to preserve workflow and
          request history.
        </p>
        {notice && (
          <p role="alert" className="mt-2 text-label text-danger">
            {notice}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleting("")}>
            Keep prompt
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              const error = deletePrompt(deleting);
              setNotice(error || "Prompt deleted.");
              if (!error) setDeleting("");
            }}
          >
            Confirm delete
          </Button>
        </div>
      </Dialog>
    </AiWorkspace>
  );
}
