type Entry = { name?: string; value?: number | string; color?: string; dataKey?: string };
export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = (value) => String(value),
}: {
  active?: boolean;
  payload?: Entry[];
  label?: string;
  valueFormatter?: (value: number | string, name?: string) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border border-border bg-surface p-2.5 shadow-lg">
      <p className="mb-2 text-[8px] font-medium text-muted">{label}</p>
      <div className="grid gap-1.5">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey}-${index}`} className="flex items-center gap-2 text-[8px]">
            <i className="size-1.5 rounded-full" style={{ background: entry.color }} />
            <span className="flex-1 text-muted">{entry.name}</span>
            <b>{valueFormatter(entry.value ?? 0, entry.name)}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
