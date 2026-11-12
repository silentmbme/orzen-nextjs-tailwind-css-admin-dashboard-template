import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { Link2 } from "lucide-react";

export type AppId = "github" | "slack" | "drive" | "teams";
export type AppConnections = Record<AppId, boolean>;

const apps = [
  {
    id: "github",
    name: "GitHub",
    description: "Repository activity and project references.",
    initials: "GH",
    color: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team messages and workspace updates.",
    initials: "SL",
    color: "bg-violet-500/10 text-violet-500",
  },
  {
    id: "drive",
    name: "Google Drive",
    description: "Shared files and document references.",
    initials: "GD",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Collaboration and meeting references.",
    initials: "MT",
    color: "bg-rose-500/10 text-rose-500",
  },
] as const;

export function ConnectedApps({
  connections,
  onChange,
}: {
  connections: AppConnections;
  onChange: (id: AppId, connected: boolean) => void;
}) {
  return (
    <Card title="Connected applications" icon={Link2} action={<Badge>Demo connections</Badge>}>
      <p className="mb-3 text-[12px] text-muted">
        Preview integration preferences. These controls do not connect to external services.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {apps.map((app) => (
          <div
            key={app.id}
            className="flex min-w-0 items-center gap-3 rounded-lg border border-border p-3"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-md text-[10px] font-semibold ${app.color}`}
            >
              {app.initials}
            </span>
            <div className="min-w-0 flex-1">
              <b className="block text-[12px] font-medium">{app.name}</b>
              <p className="mt-0.5 text-[10px] leading-4 text-muted">{app.description}</p>
              <span
                className={`mt-1 inline-flex items-center gap-1 text-[10px] ${connections[app.id] ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}`}
              >
                <i
                  className={`size-1.5 rounded-full ${connections[app.id] ? "bg-emerald-500" : "bg-muted"}`}
                />
                {connections[app.id] ? "Connected preview" : "Not connected"}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange(app.id, !connections[app.id])}
            >
              {connections[app.id] ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
