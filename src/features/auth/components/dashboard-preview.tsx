import { ArrowUpRight, CircleDollarSign, ShoppingBag, Sparkles, Users } from "lucide-react";

const bars = [42, 58, 49, 72, 64, 86, 76, 92, 70, 84, 96, 88];
export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -inset-10 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/95 p-3 shadow-[0_24px_80px_rgba(28,20,48,.12)] backdrop-blur dark:shadow-[0_24px_80px_rgba(0,0,0,.3)]">
        <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
          <span className="flex items-center gap-2">
            <i className="grid size-7 place-items-center rounded-lg bg-accent text-white">
              <Sparkles size={13} />
            </i>
            <span>
              <b className="block text-[11px]">Revenue workspace</b>
              <small className="text-[9px] text-muted">Live business overview</small>
            </span>
          </span>
          <span className="rounded-md border border-border bg-surface-alt px-2 py-1 text-[9px] text-muted">
            Last 30 days
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            [CircleDollarSign, "Revenue", "$84,320", "+12.5%"],
            [ShoppingBag, "Orders", "1,248", "+8.2%"],
            [Users, "Customers", "3,240", "+2.1%"],
          ].map(([Icon, label, value, change]) => {
            const I = Icon as typeof CircleDollarSign;
            return (
              <div
                key={String(label)}
                className="rounded-xl border border-border bg-surface-alt/60 p-3"
              >
                <span className="flex items-center justify-between">
                  <I size={14} className="text-accent" />
                  <small className="flex items-center text-[8px] text-success">
                    {String(change)}
                    <ArrowUpRight size={9} />
                  </small>
                </span>
                <small className="mt-4 block text-[9px] text-muted">{String(label)}</small>
                <b className="mt-1 block text-[16px]">{String(value)}</b>
              </div>
            );
          })}
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1.45fr_.75fr]">
          <div className="rounded-xl border border-border p-3">
            <div className="flex justify-between">
              <span>
                <b className="block text-[11px]">Sales momentum</b>
                <small className="text-[9px] text-muted">Monthly performance</small>
              </span>
              <b className="text-[13px]">$284.6k</b>
            </div>
            <div className="mt-5 flex h-32 items-end gap-1.5">
              {bars.map((height, index) => (
                <span
                  key={index}
                  className={`flex-1 rounded-t-sm ${index === 9 ? "bg-accent" : "bg-accent/20"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[8px] text-muted">
              <span>JAN</span>
              <span>JUN</span>
              <span>DEC</span>
            </div>
          </div>
          <div className="rounded-xl border border-border p-3">
            <b className="text-[11px]">Channel mix</b>
            <div className="mx-auto mt-5 grid size-28 place-items-center rounded-full bg-[conic-gradient(var(--color-accent)_0_48%,#3b82f6_48%_76%,#fb7185_76%)]">
              <span className="grid size-20 place-items-center rounded-full bg-surface text-center">
                <span>
                  <b className="block text-[16px]">$84k</b>
                  <small className="text-[8px] text-muted">TOTAL</small>
                </span>
              </span>
            </div>
            <div className="mt-4 grid gap-1.5 text-[9px]">
              <span className="flex justify-between">
                <i className="not-italic text-muted">Direct</i>
                <b>48%</b>
              </span>
              <span className="flex justify-between">
                <i className="not-italic text-muted">Partners</i>
                <b>28%</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative -mt-5 ml-auto mr-4 w-56 rounded-xl border border-border bg-surface p-3 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium">Quarterly target</span>
          <span className="text-[9px] text-success">84%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-alt">
          <div className="h-full w-[84%] rounded-full bg-accent" />
        </div>
        <p className="mt-2 text-[8px] text-muted">$42,800 remaining to plan</p>
      </div>
    </div>
  );
}
