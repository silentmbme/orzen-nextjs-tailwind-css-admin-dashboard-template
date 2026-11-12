"use client";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Info,
  Mail,
  PanelLeft,
  PanelRight,
  Plus,
  Settings,
  ShieldAlert,
  Trash2,
  UserPlus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Demo =
  | "basic"
  | "small"
  | "large"
  | "confirm"
  | "danger"
  | "form"
  | "success"
  | "media"
  | "right"
  | "left"
  | "bottom"
  | "details"
  | null;
export function ModalShowcase() {
  const [demo, setDemo] = useState<Demo>(null),
    [saved, setSaved] = useState(false);
  const close = () => setDemo(null);
  const title =
    demo === "basic"
      ? "Standard modal"
      : demo === "small"
        ? "Compact modal"
        : demo === "large"
          ? "Project overview"
          : demo === "confirm"
            ? "Confirm changes"
            : demo === "danger"
              ? "Delete workspace?"
              : demo === "form"
                ? "Invite teammate"
                : demo === "success"
                  ? "Payment successful"
                  : demo === "media"
                    ? "Media preview"
                    : demo === "left"
                      ? "Navigation drawer"
                      : demo === "bottom"
                        ? "Quick actions"
                        : demo === "details"
                          ? "Invoice details"
                          : "Workspace settings";
  const drawer = demo === "right" || demo === "left" || demo === "bottom" || demo === "details";
  return (
    <div className="grid gap-3">
      <Card title="Centered modals" action={<Badge>Shared Dialog</Badge>}>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["basic", Info, "Basic modal", "Standard content"],
            ["small", CheckCircle2, "Compact modal", "Short confirmation"],
            ["large", FileText, "Large modal", "Detailed content"],
            ["media", ImageIcon, "Media modal", "Preview layout"],
          ].map(([id, Icon, label, note]) => {
            const I = Icon as typeof Info;
            return (
              <button
                key={String(id)}
                onClick={() => setDemo(id as Demo)}
                className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:border-accent/50 hover:bg-surface-alt"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                  <I size={16} />
                </span>
                <span>
                  <b className="block text-[9px]">{String(label)}</b>
                  <small className="text-[8px] text-muted">{String(note)}</small>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Confirmation modal">
          <p className="text-[9px] leading-4 text-muted">
            Request confirmation before applying an important change.
          </p>
          <Button className="mt-4" onClick={() => setDemo("confirm")}>
            Open confirmation
          </Button>
        </Card>
        <Card title="Destructive modal">
          <p className="text-[9px] leading-4 text-muted">
            Use clear danger styling for irreversible actions.
          </p>
          <Button className="mt-4" variant="destructive" onClick={() => setDemo("danger")}>
            <Trash2 size={13} />
            Delete workspace
          </Button>
        </Card>
        <Card title="Form modal">
          <p className="text-[9px] leading-4 text-muted">
            Collect focused input without leaving the current page.
          </p>
          <Button className="mt-4" onClick={() => setDemo("form")}>
            <UserPlus size={13} />
            Invite teammate
          </Button>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Right drawer">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
              <PanelRight size={18} />
            </span>
            <Badge>640px</Badge>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setDemo("right")}>
            Open right drawer <ChevronRight size={12} />
          </Button>
        </Card>
        <Card title="Left drawer">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
              <PanelLeft size={18} />
            </span>
            <Badge>Navigation</Badge>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setDemo("left")}>
            <ArrowLeft size={12} />
            Open left drawer
          </Button>
        </Card>
        <Card title="Bottom drawer">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-success/10 text-success">
              <ArrowUp size={18} />
            </span>
            <Badge>Responsive</Badge>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setDemo("bottom")}>
            Open bottom sheet
          </Button>
        </Card>
        <Card title="Details drawer">
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <FileText size={18} />
            </span>
            <Badge>Data view</Badge>
          </div>
          <Button variant="outline" className="mt-4 w-full" onClick={() => setDemo("details")}>
            View invoice
          </Button>
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Modal sizes">
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Small", "small", "360px"],
              ["Default", "basic", "520px"],
              ["Large", "large", "760px"],
            ].map(([label, id, size]) => (
              <button
                key={label}
                onClick={() => setDemo(id as Demo)}
                className="rounded-lg border border-border p-3 text-center hover:border-accent"
              >
                <b className="block text-[9px]">{label}</b>
                <span className="mt-1 text-[8px] text-muted">{size}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Feedback modal">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={18} />
            </span>
            <div>
              <b className="text-[10px]">Success state</b>
              <p className="mt-1 text-[8px] text-muted">Communicate a completed action clearly.</p>
            </div>
          </div>
          <Button variant="outline" className="mt-4" onClick={() => setDemo("success")}>
            Show success modal
          </Button>
        </Card>
      </div>

      <Card title="Interaction guidance">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Escape to close", "Keyboard dismissal is supported."],
            ["Backdrop behavior", "Modal focus stays within the overlay."],
            ["Body scroll lock", "The page remains fixed while open."],
          ].map(([label, note], index) => (
            <div
              key={label}
              className="flex gap-3 rounded-lg border border-border bg-surface-alt p-3"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/10 text-[8px] font-semibold text-accent">
                {index + 1}
              </span>
              <div>
                <b className="text-[9px]">{label}</b>
                <p className="mt-1 text-[8px] leading-4 text-muted">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog
        open={demo !== null}
        title={title}
        onClose={close}
        variant={drawer ? "offcanvas" : "modal"}
        placement={demo === "left" ? "left" : demo === "bottom" ? "bottom" : "right"}
        offcanvasWidth={demo === "details" ? 720 : 560}
      >
        {demo === "form" ? (
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setSaved(true);
              setDemo("success");
            }}
          >
            <div className="grid gap-1.5">
              <label className="text-[9px] font-medium">Email address</label>
              <Input type="email" required placeholder="name@company.com" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-[9px] font-medium">Workspace role</label>
              <Select>
                <option>Editor</option>
                <option>Viewer</option>
                <option>Administrator</option>
              </Select>
            </div>
            <div className="rounded-lg bg-surface-alt p-3 text-[8px] text-muted">
              The invitation is simulated locally and no email is sent.
            </div>
            <div className="flex justify-end gap-2 border-t border-border pt-3">
              <Button type="button" variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">
                <Mail size={12} />
                Send invite
              </Button>
            </div>
          </form>
        ) : demo === "danger" ? (
          <div>
            <div className="flex gap-3 rounded-lg border border-danger/25 bg-danger/10 p-3">
              <ShieldAlert size={18} className="shrink-0 text-danger" />
              <div>
                <b className="text-[10px]">This action cannot be undone</b>
                <p className="mt-1 text-[8px] leading-4 text-muted">
                  All workspace data, members, and reports will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-1.5">
              <label className="text-[9px]">Type DELETE to confirm</label>
              <Input placeholder="DELETE" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={close}>
                <Trash2 size={12} />
                Delete permanently
              </Button>
            </div>
          </div>
        ) : demo === "success" ? (
          <div className="py-3 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
              <CheckCircle2 size={25} />
            </span>
            <h3 className="mt-4 text-[13px] font-semibold">
              {saved ? "Invitation sent" : "Payment completed"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-[9px] leading-4 text-muted">
              The local demo action completed successfully. You can safely close this window.
            </p>
            <Button className="mt-5" onClick={close}>
              Done
            </Button>
          </div>
        ) : drawer ? (
          <DrawerContent kind={demo} close={close} />
        ) : (
          <ModalContent kind={demo} close={close} />
        )}
      </Dialog>
    </div>
  );
}
function ModalContent({ kind, close }: { kind: Demo; close: () => void }) {
  if (kind === "media")
    return (
      <div>
        <div className="grid h-52 place-items-center rounded-xl border border-border bg-surface-alt">
          <ImageIcon size={34} className="text-accent" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <b className="text-[10px]">dashboard-preview.png</b>
            <p className="text-[8px] text-muted">1920 × 1080 · 842 KB</p>
          </div>
          <Button size="sm">Download</Button>
        </div>
      </div>
    );
  if (kind === "large")
    return (
      <div>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ["Progress", "78%"],
            ["Tasks", "24 / 32"],
            ["Members", "12"],
          ].map(([a, b]) => (
            <div key={a} className="rounded-lg border border-border bg-surface-alt p-3">
              <span className="text-[8px] text-muted">{a}</span>
              <b className="mt-1 block text-[13px]">{b}</b>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-border p-4">
          <b className="text-[10px]">Project summary</b>
          <p className="mt-2 text-[9px] leading-5 text-muted">
            The launch plan is on track. Core design work is complete and engineering validation is
            in progress.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={close}>View project</Button>
        </div>
      </div>
    );
  return (
    <div>
      <div
        className={`flex gap-3 rounded-lg p-3 ${kind === "confirm" ? "border border-amber-500/25 bg-amber-500/10" : "bg-surface-alt"}`}
      >
        <AlertTriangle
          size={17}
          className={kind === "confirm" ? "text-amber-500" : "text-accent"}
        />
        <p className="text-[9px] leading-4 text-muted">
          {kind === "confirm"
            ? "Review the settings before applying these changes to your workspace."
            : "This centered modal uses the shared responsive Dialog component."}
        </p>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={close}>
          Cancel
        </Button>
        <Button onClick={close}>Continue</Button>
      </div>
    </div>
  );
}
function DrawerContent({ kind, close }: { kind: Demo; close: () => void }) {
  if (kind === "left")
    return (
      <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr_auto] p-4">
        <div className="rounded-lg bg-surface-alt p-3">
          <b className="text-[10px]">Orzen workspace</b>
          <p className="mt-1 text-[8px] text-muted">Business administration</p>
        </div>
        <nav className="mt-4 grid content-start gap-1">
          {[
            [Settings, "Workspace"],
            [UserPlus, "Members"],
            [CreditCard, "Billing"],
            [FileText, "Reports"],
          ].map(([Icon, label], index) => {
            const I = Icon as typeof Settings;
            return (
              <button
                key={String(label)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[9px] ${index === 0 ? "bg-accent/10 text-accent" : "text-muted hover:bg-surface-alt"}`}
              >
                <I size={13} />
                {String(label)}
              </button>
            );
          })}
        </nav>
        <Button variant="outline" onClick={close}>
          Close navigation
        </Button>
      </div>
    );
  if (kind === "bottom")
    return (
      <div className="overflow-y-auto p-4">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="grid gap-2 sm:grid-cols-4">
          {[
            [Plus, "Create record"],
            [Mail, "Send message"],
            [CreditCard, "Add payment"],
            [FileText, "Generate report"],
          ].map(([Icon, label]) => {
            const I = Icon as typeof Plus;
            return (
              <button
                key={String(label)}
                className="grid justify-items-center gap-2 rounded-xl border border-border p-4 text-[9px] hover:bg-surface-alt"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-accent/10 text-accent">
                  <I size={16} />
                </span>
                {String(label)}
              </button>
            );
          })}
        </div>
      </div>
    );
  if (kind === "details")
    return (
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="flex justify-between rounded-xl border border-border bg-surface-alt p-4">
          <div>
            <Badge tone="success">Paid</Badge>
            <h3 className="mt-3 text-[12px] font-semibold">Invoice #ORZ-2048</h3>
            <p className="mt-1 text-[8px] text-muted">Orzen Creative Studio</p>
          </div>
          <strong className="text-[19px]">$4,820</strong>
        </div>
        <div className="mt-4 grid gap-2">
          {[
            ["Design system services", "$2,400"],
            ["Dashboard implementation", "$1,800"],
            ["Support and testing", "$620"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-border py-3 text-[9px]"
            >
              <span>{label}</span>
              <b>{value}</b>
            </div>
          ))}
        </div>
        <Button variant="outline" className="mt-5 w-full">
          Download invoice
        </Button>
      </div>
    );
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="grid gap-3">
        {[
          ["General settings", "Manage workspace identity and preferences."],
          ["Notifications", "Configure email and product alerts."],
          ["Security", "Review authentication and active sessions."],
          ["Integrations", "Connect third-party services."],
          ["Billing", "Manage plans, invoices, and payment methods."],
        ].map(([label, note]) => (
          <button
            key={label}
            className="flex items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-surface-alt"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
              <Settings size={14} />
            </span>
            <span className="flex-1">
              <b className="block text-[9px]">{label}</b>
              <small className="text-[8px] text-muted">{note}</small>
            </span>
            <ChevronRight size={12} />
          </button>
        ))}
      </div>
    </div>
  );
}
