import { CheckCircle2, FileUp, MessageSquare, Pencil, UsersRound } from "lucide-react";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";

const activity = [
  {
    icon: Pencil,
    title: "Updated profile details",
    note: "Refined biography and location information.",
    time: "Today · 09:42",
    tone: "bg-accent/10 text-accent",
  },
  {
    icon: CheckCircle2,
    title: "Completed design review",
    note: "Approved the mobile onboarding interaction flow.",
    time: "Yesterday · 16:18",
    tone: "bg-success/10 text-success",
  },
  {
    icon: FileUp,
    title: "Uploaded research summary",
    note: "Added Customer-interviews-Q4.pdf to Mobile launch.",
    time: "Nov 7 · 11:04",
    tone: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: UsersRound,
    title: "Joined Design systems project",
    note: "Contributing to component governance and accessibility.",
    time: "Nov 5 · 14:25",
    tone: "bg-pink-500/10 text-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Added a project comment",
    note: "Shared recommendations for the next prototype iteration.",
    time: "Nov 4 · 10:12",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];
export function ProfileActivity() {
  return (
    <Card title="Recent activity">
      <ol className="mt-1">
        {activity.map(({ icon: Icon, title, note, time }, index) => (
          <li key={title} className="relative flex gap-3 pb-5 last:pb-0">
            <span
              className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-lg ${activity[index].tone}`}
            >
              <Icon size={14} />
            </span>
            {index < activity.length - 1 && (
              <i className="absolute left-4 top-8 h-[calc(100%-32px)] w-px bg-border" />
            )}
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap justify-between gap-2">
                <b className="text-[11px] font-medium">{title}</b>
                <time className="shrink-0 text-[9px] text-muted">{time}</time>
              </div>
              <p className="mt-1 text-[10px] leading-4 text-muted">{note}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
