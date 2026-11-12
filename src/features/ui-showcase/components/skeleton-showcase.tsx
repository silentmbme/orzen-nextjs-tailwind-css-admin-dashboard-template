"use client";
import { useState } from "react";
import { CheckCircle2, Grid2X2, List, RefreshCw, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/showcase-card";
import { UserAvatar } from "@/components/ui/user-avatar";

const pulse = "animate-pulse motion-reduce:animate-none",
  line = "rounded bg-surface-alt";
function Loaded({ title = "Content loaded" }: { title?: string }) {
  return (
    <div className="grid min-h-24 place-items-center rounded-lg border border-success/20 bg-success/5 p-4 text-center">
      <span>
        <CheckCircle2 size={18} className="mx-auto text-success" />
        <b className="mt-2 block text-[10px]">{title}</b>
        <small className="text-[8px] text-muted">Skeleton replaced by live content.</small>
      </span>
    </div>
  );
}
export function SkeletonShowcase() {
  const [loading, setLoading] = useState(true),
    [view, setView] = useState("Grid");
  return (
    <div className="grid gap-3">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[12px] font-semibold">Skeleton preview controls</h2>
            <p className="mt-1 text-[9px] text-muted">
              Switch all examples between loading placeholders and completed content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border p-1">
              <Button
                size="sm"
                variant={view === "Grid" ? "primary" : "ghost"}
                onClick={() => setView("Grid")}
              >
                <Grid2X2 size={11} />
                Grid
              </Button>
              <Button
                size="sm"
                variant={view === "List" ? "primary" : "ghost"}
                onClick={() => setView("List")}
              >
                <List size={11} />
                List
              </Button>
            </div>
            <Button variant="outline" onClick={() => setLoading(!loading)}>
              <RefreshCw size={12} />
              {loading ? "Show content" : "Show loading"}
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Text skeleton" action={<Badge>Article</Badge>}>
          {loading ? (
            <div className={`${pulse} grid gap-3`}>
              <div className={`${line} h-4 w-2/5`} />
              <div className="grid gap-2">
                <div className={`${line} h-2.5 w-full`} />
                <div className={`${line} h-2.5 w-[92%]`} />
                <div className={`${line} h-2.5 w-[84%]`} />
                <div className={`${line} h-2.5 w-3/5`} />
              </div>
            </div>
          ) : (
            <Loaded title="Article content loaded" />
          )}
        </Card>
        <Card title="Profile skeleton" action={<Badge>User</Badge>}>
          {loading ? (
            <div className={`${pulse} flex items-center gap-3`}>
              <div className={`${line} size-12 shrink-0 rounded-full`} />
              <div className="flex-1">
                <div className={`${line} h-3 w-1/2`} />
                <div className={`${line} mt-2 h-2 w-1/3`} />
                <div className="mt-3 flex gap-2">
                  <div className={`${line} h-5 w-14 rounded-full`} />
                  <div className={`${line} h-5 w-16 rounded-full`} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-border p-3">
              <UserAvatar name="Sofia Garcia" size={48} />
              <div>
                <b className="text-[10px]">Sofia Garcia</b>
                <p className="text-[8px] text-muted">Operations lead</p>
                <Badge tone="success" className="mt-2">
                  Available
                </Badge>
              </div>
            </div>
          )}
        </Card>
        <Card title="Metric skeleton" action={<Badge>Analytics</Badge>}>
          {loading ? (
            <div className={`${pulse}`}>
              <div className="flex items-center justify-between">
                <div className={`${line} h-2.5 w-20`} />
                <div className={`${line} size-8 rounded-lg`} />
              </div>
              <div className={`${line} mt-5 h-6 w-28`} />
              <div className={`${line} mt-3 h-2 w-full`} />
              <div className={`${line} mt-2 h-2 w-3/4`} />
            </div>
          ) : (
            <div>
              <p className="text-[9px] text-muted">Total revenue</p>
              <b className="mt-2 block text-[22px]">$84,320</b>
              <Badge tone="success" className="mt-3">
                +12.5%
              </Badge>
            </div>
          )}
        </Card>
      </div>

      <div className={`grid gap-3 ${view === "Grid" ? "md:grid-cols-2 xl:grid-cols-4" : ""}`}>
        {Array.from({ length: view === "Grid" ? 4 : 3 }).map((_, index) => (
          <Card key={index} title={index === 0 ? "Card skeleton" : undefined}>
            {loading ? (
              <div className={`${pulse} ${view === "List" ? "flex items-center gap-4" : ""}`}>
                <div
                  className={`${line} ${view === "List" ? "size-20 shrink-0" : "h-28 w-full"} rounded-lg`}
                />
                <div className={view === "List" ? "flex-1" : "mt-4"}>
                  <div className={`${line} h-3 w-2/3`} />
                  <div className={`${line} mt-2 h-2 w-full`} />
                  <div className={`${line} mt-2 h-2 w-4/5`} />
                  <div className={`${line} mt-4 h-7 w-24 rounded-md`} />
                </div>
              </div>
            ) : (
              <Loaded title={`${view} item ${index + 1}`} />
            )}
          </Card>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
        <Card title="Table skeleton" action={<Badge>6 rows</Badge>}>
          {loading ? (
            <div className={pulse}>
              <div className="grid grid-cols-[1.5fr_1fr_.7fr_.5fr] gap-3 border-b border-border pb-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={`${line} h-2 w-2/3`} />
                ))}
              </div>
              {Array.from({ length: 6 }).map((_, row) => (
                <div
                  key={row}
                  className="grid grid-cols-[1.5fr_1fr_.7fr_.5fr] items-center gap-3 border-b border-border py-3 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className={`${line} size-7 rounded-full`} />
                    <div className={`${line} h-2.5 w-24`} />
                  </div>
                  <div className={`${line} h-2.5 w-16`} />
                  <div className={`${line} h-5 w-14 rounded-full`} />
                  <div className={`${line} ml-auto size-6 rounded-md`} />
                </div>
              ))}
            </div>
          ) : (
            <Loaded title="Customer table loaded" />
          )}
        </Card>
        <Card title="List skeleton" action={<Badge>Activity</Badge>}>
          {loading ? (
            <div className={`${pulse} grid gap-4`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${line} size-9 shrink-0 rounded-full`} />
                  <div className="flex-1">
                    <div className={`${line} h-2.5 w-2/3`} />
                    <div className={`${line} mt-2 h-2 w-2/5`} />
                  </div>
                  <div className={`${line} h-2 w-10`} />
                </div>
              ))}
            </div>
          ) : (
            <Loaded title="Activity list loaded" />
          )}
        </Card>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card title="Chart skeleton" action={<Badge>Data visualization</Badge>}>
          {loading ? (
            <div className={`${pulse}`}>
              <div className="flex justify-between">
                <div>
                  <div className={`${line} h-3 w-24`} />
                  <div className={`${line} mt-2 h-5 w-32`} />
                </div>
                <div className={`${line} h-7 w-24 rounded-md`} />
              </div>
              <div className="mt-6 flex h-40 items-end gap-2 border-b border-l border-border p-3">
                {[44, 68, 52, 82, 64, 92, 74, 86, 58, 78].map((height, i) => (
                  <div
                    key={i}
                    className={`${line} flex-1 rounded-t`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <Loaded title="Revenue chart loaded" />
          )}
        </Card>
        <Card title="Dashboard skeleton" action={<Badge>Composite</Badge>}>
          {loading ? (
            <div className={`${pulse} grid gap-3`}>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className={`${line} h-2 w-1/2`} />
                    <div className={`${line} mt-3 h-5 w-2/3`} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[1.3fr_.7fr] gap-2">
                <div className={`${line} h-32 rounded-lg`} />
                <div className="grid gap-2">
                  <div className={`${line} rounded-lg`} />
                  <div className={`${line} rounded-lg`} />
                </div>
              </div>
            </div>
          ) : (
            <Loaded title="Dashboard loaded" />
          )}
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Card title="Commerce skeleton" action={<ShoppingBag size={14} className="text-muted" />}>
          {loading ? (
            <div className={pulse}>
              <div className={`${line} h-40 rounded-lg`} />
              <div className={`${line} mt-4 h-3 w-3/4`} />
              <div className={`${line} mt-2 h-2 w-1/2`} />
              <div className="mt-4 flex items-center justify-between">
                <div className={`${line} h-5 w-16`} />
                <div className={`${line} h-8 w-24 rounded-md`} />
              </div>
            </div>
          ) : (
            <Loaded title="Product card loaded" />
          )}
        </Card>
        <Card title="Form skeleton">
          {loading ? (
            <div className={`${pulse} grid gap-4`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className={`${line} mb-2 h-2 w-20`} />
                  <div className={`${line} h-9 w-full rounded-md`} />
                </div>
              ))}
              <div className="flex justify-end gap-2">
                <div className={`${line} h-8 w-20 rounded-md`} />
                <div className={`${line} h-8 w-24 rounded-md`} />
              </div>
            </div>
          ) : (
            <Loaded title="Form loaded" />
          )}
        </Card>
        <Card title="Media skeleton">
          {loading ? (
            <div className={`${pulse} relative h-52 overflow-hidden rounded-lg bg-surface-alt`}>
              <div className="absolute inset-0 grid place-items-center">
                <div className={`${line} size-10 rounded-full bg-border`} />
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <div className={`${line} h-3 w-2/3 bg-border`} />
                <div className={`${line} mt-2 h-2 w-1/3 bg-border`} />
              </div>
            </div>
          ) : (
            <Loaded title="Media preview loaded" />
          )}
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Avatar skeleton">
          <div className={`${pulse} flex flex-wrap gap-3`}>
            {[28, 36, 44, 52].map((size) => (
              <div
                key={size}
                className={`${line} rounded-full`}
                style={{ width: size, height: size }}
              />
            ))}
          </div>
        </Card>
        <Card title="Button skeleton">
          <div className={`${pulse} flex flex-wrap gap-2`}>
            <div className={`${line} h-7 w-16 rounded-md`} />
            <div className={`${line} h-8 w-24 rounded-md`} />
            <div className={`${line} h-9 w-28 rounded-md`} />
          </div>
        </Card>
        <Card title="Badge skeleton">
          <div className={`${pulse} flex flex-wrap gap-2`}>
            <div className={`${line} h-5 w-12 rounded-full`} />
            <div className={`${line} h-5 w-16 rounded-full`} />
            <div className={`${line} h-5 w-20 rounded-full`} />
          </div>
        </Card>
        <Card title="Navigation skeleton">
          <div className={`${pulse} grid gap-3`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`${line} size-5 rounded`} />
                <div className={`${line} h-2.5`} style={{ width: `${55 + i * 9}%` }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Page skeleton" action={<Badge>Full composition</Badge>}>
        {loading ? (
          <div className={`${pulse} grid gap-4`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`${line} h-5 w-44`} />
                <div className={`${line} mt-2 h-2.5 w-64 max-w-full`} />
              </div>
              <div className={`${line} h-9 w-28 rounded-md`} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className={`${line} h-2 w-20`} />
                  <div className={`${line} mt-3 h-6 w-28`} />
                  <div className={`${line} mt-3 h-1.5 w-full`} />
                </div>
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.4fr_.6fr]">
              <div className={`${line} h-52 rounded-lg`} />
              <div className="grid gap-3">
                <div className={`${line} rounded-lg`} />
                <div className={`${line} rounded-lg`} />
              </div>
            </div>
          </div>
        ) : (
          <Loaded title="Complete page loaded" />
        )}
      </Card>
    </div>
  );
}
