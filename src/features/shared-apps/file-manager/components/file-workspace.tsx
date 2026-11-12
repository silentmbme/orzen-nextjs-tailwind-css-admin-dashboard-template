"use client";
import { useState } from "react";
import {
  ChevronRight,
  Clock3,
  Folder,
  FolderPlus,
  HardDrive,
  LayoutGrid,
  List,
  Search,
  Star,
  Upload,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { AppTitle, AppField, SharedWorkspace } from "../../common/workspace";
import { AttachmentPreview, readAttachment } from "../../common/attachment";
import { today, uid } from "../../common/store";
import { fileStore } from "../demo-service";
import { additionalFiles } from "../sample-files";
import { FavoriteFiles, FileInsights, FileThumbnail } from "./file-insights";
import type { LocalFile } from "../types";
const bytes = (value: number) =>
  value >= 1048576
    ? `${(value / 1048576).toFixed(1)} MB`
    : value >= 1024
      ? `${(value / 1024).toFixed(1)} KB`
      : `${value} B`;
export function FileWorkspace() {
  const { data, warning, update } = fileStore.useStore(),
    [folder, setFolder] = useState("root"),
    [mode, setMode] = useState("folder"),
    [query, setQuery] = useState(""),
    [type, setType] = useState("all"),
    [sort, setSort] = useState("name"),
    [grid, setGrid] = useState(true),
    [selected, setSelected] = useState(""),
    [editor, setEditor] = useState<{
      kind: "folder" | "file";
      id: string;
    } | null>(null),
    [name, setName] = useState(""),
    [remove, setRemove] = useState<{
      kind: "folder" | "file";
      id: string;
    } | null>(null),
    [notice, setNotice] = useState(""),
    [loading, setLoading] = useState(false);
  const current = data.folders.find((f) => f.id === folder) || data.folders[0],
    file = data.files.find((f) => f.id === selected);
  const trail: typeof data.folders = [];
  let parent: typeof current | undefined = current;
  const seen = new Set<string>();
  while (parent && !seen.has(parent.id)) {
    seen.add(parent.id);
    trail.unshift(parent);
    parent = data.folders.find((f) => f.id === parent?.parentId);
  }
  const files = data.files
    .filter(
      (f) =>
        (mode === "favorites"
          ? f.favorite
          : mode === "recent"
            ? true
            : f.folderId === current.id) &&
        f.name.toLowerCase().includes(query.toLowerCase()) &&
        (type === "all" ||
          (type === "images" ? f.type.startsWith("image/") : !f.type.startsWith("image/"))),
    )
    .sort((a, b) =>
      sort === "size"
        ? b.size - a.size
        : sort === "recent" || mode === "recent"
          ? b.modified.localeCompare(a.modified)
          : a.name.localeCompare(b.name),
    );
  const folders =
    mode === "folder"
      ? data.folders.filter(
          (f) => f.parentId === current.id && f.name.toLowerCase().includes(query.toLowerCase()),
        )
      : [];
  const used = data.files.reduce((s, f) => s + (f.attachment?.size || 0), 0);
  function openFolder(id: string) {
    setFolder(id);
    setType("all");
    setMode("folder");
    setSelected("");
    setQuery("");
  }
  function edit(kind: "folder" | "file", id: string, oldName: string) {
    setEditor({ kind, id });
    setName(oldName);
    setNotice("");
  }
  function saveName() {
    const err = update((d) => {
      const clean = name.trim();
      if (!clean || clean === "." || clean === ".." || /[\\/]/.test(clean))
        throw new Error("Enter a name without slash characters.");
      if (editor?.kind === "folder") {
        const target = d.folders.find((f) => f.id === editor.id),
          parentId = target?.parentId || current.id;
        if (
          d.folders.some(
            (f) =>
              f.id !== editor.id &&
              f.parentId === parentId &&
              f.name.toLowerCase() === clean.toLowerCase(),
          )
        )
          throw new Error("A folder with this name already exists here.");
        if (target) target.name = clean;
        else d.folders.push({ id: uid(), parentId: current.id, name: clean });
      } else {
        const target = d.files.find((f) => f.id === editor?.id);
        if (target) {
          target.name = clean;
          if (target.attachment) target.attachment.name = clean;
        }
      }
    });
    setNotice(err || "Name saved locally.");
    if (!err) setEditor(null);
  }
  function removeItem() {
    const err = update((d) => {
      if (remove?.kind === "folder") {
        if (remove.id === "root") throw new Error("The root folder cannot be removed.");
        if (
          d.folders.some((f) => f.parentId === remove.id) ||
          d.files.some((f) => f.folderId === remove.id)
        )
          throw new Error(
            "This folder is not empty. Remove or relocate its contents before deleting it.",
          );
        d.folders = d.folders.filter((f) => f.id !== remove.id);
      } else d.files = d.files.filter((f) => f.id !== remove?.id);
    });
    setNotice(err || "Deleted locally.");
    if (!err) {
      setRemove(null);
      setSelected("");
    }
  }
  function favorite(f: LocalFile) {
    setNotice(
      update((d) => {
        d.files.find((x) => x.id === f.id)!.favorite = !f.favorite;
      }),
    );
  }
  return (
    <SharedWorkspace
      title="File manager"
      description="Local browser files and sample metadata · no cloud storage connection."
      warning={warning}
      actions={
        <>
          {additionalFiles.some((f) => !data.files.some((existing) => existing.id === f.id)) && (
            <Button
              variant="outline"
              onClick={() =>
                setNotice(
                  update((d) => {
                    d.files.push(
                      ...additionalFiles
                        .filter((f) => !d.files.some((existing) => existing.id === f.id))
                        .map((f) => ({
                          ...f,
                          folderId: d.folders.some((folder) => folder.id === f.folderId)
                            ? f.folderId
                            : "root",
                        })),
                    );
                  }) || "Sample files added. Your existing content was preserved.",
                )
              }
            >
              Add sample files
            </Button>
          )}
          <Button variant="outline" onClick={() => edit("folder", "new", "")}>
            <FolderPlus size={13} />
            New folder
          </Button>
          <label className="ui-button cursor-pointer">
            <Upload size={13} />
            {loading ? "Reading file…" : "Upload local file"}
            <input
              aria-label="Upload local file"
              type="file"
              className="sr-only"
              disabled={loading}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setLoading(true);
                try {
                  const a = await readAttachment(f);
                  setNotice(
                    update((d) =>
                      d.files.unshift({
                        id: uid(),
                        folderId: current.id,
                        name: a.name,
                        type: a.type,
                        size: a.size,
                        modified: today,
                        favorite: false,
                        attachment: a,
                      }),
                    ) || "File copied into the local demo. Nothing was uploaded to a server.",
                  );
                } catch (err) {
                  setNotice(err instanceof Error ? err.message : "File could not be read.");
                } finally {
                  setLoading(false);
                  e.target.value = "";
                }
              }}
            />
          </label>
        </>
      }
    >
      <div className="grid items-start gap-widget lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="space-y-widget">
          <Card title={<AppTitle icon={Folder}>Workspace</AppTitle>}>
            <div className="mt-3 space-y-1">
              {[
                { id: "folder", name: "My files", icon: Folder },
                { id: "recent", name: "Recent files", icon: Clock3 },
                { id: "favorites", name: "Favorites", icon: Star },
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setMode(id);
                    setQuery("");
                    if (id === "folder") setFolder("root");
                  }}
                  aria-pressed={mode === id}
                  className={`flex w-full items-center gap-2 rounded-control p-2 text-left text-label ${mode === id ? "bg-accent/10 text-accent" : "hover:bg-surface-alt"}`}
                >
                  <Icon size={13} />
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-4 border-t border-border pt-3 text-[10px] uppercase text-muted">
              Folders
            </p>
            {data.folders
              .filter((f) => f.parentId === "root")
              .map((f) => (
                <button
                  key={f.id}
                  onClick={() => openFolder(f.id)}
                  className="mt-1 flex w-full items-center gap-2 rounded-control p-2 text-left text-label hover:bg-surface-alt"
                >
                  <Folder size={13} />
                  {f.name}
                </button>
              ))}
          </Card>
          <Card title={<AppTitle icon={HardDrive}>Local storage</AppTitle>}>
            <div className="mt-3 flex items-center gap-3">
              <div
                role="img"
                aria-label="Stored image versus document sizes"
                className="h-12 w-12 shrink-0 rounded-full"
                style={{
                  background: `conic-gradient(var(--accent) ${used ? (data.files.filter((f) => f.attachment && f.type.startsWith("image/")).reduce((sum, f) => sum + f.size, 0) / used) * 100 : 0}%, var(--border) 0)`,
                }}
              />
              <div>
                <p className="text-xl font-semibold">{bytes(used)}</p>
                <p className="mt-1 text-[10px] text-muted">Images / documents</p>
              </div>
            </div>
            <p className="mt-1 text-tiny text-muted">{data.files.length} file records</p>
            <p className="mt-3 text-[10px] text-muted">
              Uploads: up to 2 MB each. Browser storage capacity varies; failed persistence is
              reported above.
            </p>
          </Card>
        </div>
        <div className="min-w-0 space-y-widget">
          {mode === "folder" && !query && <FavoriteFiles files={data.files} onOpen={setSelected} />}
          <Card
            title={
              <AppTitle icon={Folder}>
                {mode === "folder"
                  ? current.name
                  : mode === "recent"
                    ? "Recent files"
                    : "Favorite files"}
              </AppTitle>
            }
            action={
              <div className="flex gap-1">
                <Button
                  aria-label="File grid view"
                  variant={grid ? "secondary" : "ghost"}
                  onClick={() => setGrid(true)}
                >
                  <LayoutGrid size={13} />
                </Button>
                <Button
                  aria-label="File list view"
                  variant={!grid ? "secondary" : "ghost"}
                  onClick={() => setGrid(false)}
                >
                  <List size={13} />
                </Button>
              </div>
            }
          >
            <nav
              aria-label="Folder breadcrumb"
              className="mt-3 flex flex-wrap items-center gap-1 text-tiny"
            >
              {trail.map((f) => (
                <span key={f.id} className="inline-flex items-center gap-1">
                  <button onClick={() => openFolder(f.id)} className="text-accent">
                    {f.name}
                  </button>
                  <ChevronRight size={10} />
                </span>
              ))}
            </nav>
            <div className="my-3 flex flex-wrap gap-2">
              <Input
                aria-label="Search files and folders"
                placeholder="Search this view…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Select
                aria-label="File type filter"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All file types</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
              </Select>
              <Select aria-label="File sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Name A–Z</option>
                <option value="recent">Recently modified</option>
                <option value="size">Largest first</option>
              </Select>
            </div>
            {notice && (
              <p role="status" className="mb-3 text-label text-muted">
                {notice}
              </p>
            )}
            {folders.length > 0 && (
              <div className="mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {folders.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-control border border-border bg-surface-alt p-3"
                  >
                    <button
                      onClick={() => openFolder(f.id)}
                      className="flex items-center gap-2 text-label font-medium"
                    >
                      <Folder size={22} className="text-accent" />
                      {f.name}
                    </button>
                    <p className="mt-2 text-[10px] text-muted">
                      {data.files.filter((file) => file.folderId === f.id).length} files ·{" "}
                      {data.folders.filter((child) => child.parentId === f.id).length} subfolders
                    </p>
                    <div className="mt-3 flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => edit("folder", f.id, f.name)}
                      >
                        Rename folder
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setRemove({ kind: "folder", id: f.id });
                          setNotice("");
                        }}
                      >
                        Delete folder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {grid ? (
              <div className="grid gap-widget sm:grid-cols-2 xl:grid-cols-3">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-card border p-3 ${selected === f.id ? "border-accent" : "border-border"}`}
                  >
                    <FileThumbnail file={f} />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`${f.favorite ? "Unfavorite" : "Favorite"} ${f.name}`}
                        onClick={() => favorite(f)}
                      >
                        <Star size={13} fill={f.favorite ? "currentColor" : "none"} />
                      </Button>
                    </div>
                    <button
                      onClick={() => setSelected(f.id)}
                      className="mt-1 block w-full break-all text-left text-label font-medium"
                    >
                      {f.name}
                    </button>
                    <p className="mt-1 text-[10px] text-muted">
                      {bytes(f.size)} · {f.modified}
                    </p>
                    <p className="mt-2 text-[10px] text-muted">
                      {f.attachment ? "Local file available" : "Metadata-only sample"}
                    </p>
                    <div className="mt-3 flex gap-1 border-t border-border pt-2">
                      <Button size="sm" variant="outline" onClick={() => setSelected(f.id)}>
                        Details & preview
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => edit("file", f.id, f.name)}>
                        Rename
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <DataTable
                label="Files"
                rows={files}
                rowKey={(f) => f.id}
                columns={[
                  {
                    key: "name",
                    label: "File",
                    value: (f) => f.name,
                    render: (f) => (
                      <button className="text-accent" onClick={() => setSelected(f.id)}>
                        {f.name}
                      </button>
                    ),
                  },
                  {
                    key: "size",
                    label: "Size",
                    value: (f) => f.size,
                    render: (f) => bytes(f.size),
                  },
                  { key: "date", label: "Modified", value: (f) => f.modified },
                  {
                    key: "favorite",
                    label: "Favorite",
                    value: (f) => (f.favorite ? "Yes" : "No"),
                    render: (f) => (
                      <Button size="sm" variant="ghost" onClick={() => favorite(f)}>
                        {f.favorite ? "Unfavorite" : "Favorite"}
                      </Button>
                    ),
                  },
                ]}
              />
            )}
            {!files.length && !folders.length && (
              <div className="p-6 text-center">
                <Search className="mx-auto text-muted" />
                <p className="mt-2 text-label text-muted">
                  No files or folders match this selection.
                </p>
              </div>
            )}
          </Card>
          <FileInsights
            data={data}
            onOpen={setSelected}
            onFolder={openFolder}
            onType={(value) => {
              setMode("recent");
              setType(value);
              setQuery("");
            }}
          />
        </div>
      </div>
      <Dialog open={!!file} title="File details & preview" onClose={() => setSelected("")}>
        {file && (
          <div className="space-y-3">
            <p className="break-all text-label">
              {file.name} · {bytes(file.size)}
            </p>
            <p className="text-tiny text-muted">
              {file.type} · Modified {file.modified}
            </p>
            {file.attachment ? (
              <AttachmentPreview attachment={file.attachment} />
            ) : (
              <p className="rounded-control border border-border p-4 text-label text-muted">
                This sample contains metadata only. No preview or download data is available.
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  edit("file", file.id, file.name);
                  setSelected("");
                }}
              >
                Rename file
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setRemove({ kind: "file", id: file.id });
                  setSelected("");
                  setNotice("");
                }}
              >
                Delete file
              </Button>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        open={!!editor}
        title={editor?.id === "new" ? "Create folder" : "Rename item"}
        onClose={() => setEditor(null)}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveName();
          }}
          className="space-y-3"
        >
          <AppField label="Item name *">
            <Input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </AppField>
          {notice && (
            <p role="alert" className="text-label text-danger">
              {notice}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button type="submit">Save name</Button>
          </div>
        </form>
      </Dialog>
      <Dialog open={!!remove} title="Delete local item?" onClose={() => setRemove(null)}>
        <p className="text-label text-muted">
          The item is removed from local demo storage. Nonempty folders are protected.
        </p>
        {notice && (
          <p role="alert" className="mt-3 text-label text-danger">
            {notice}
          </p>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setRemove(null)}>
            Keep item
          </Button>
          <Button variant="destructive" onClick={removeItem}>
            Confirm delete
          </Button>
        </div>
      </Dialog>
    </SharedWorkspace>
  );
}
