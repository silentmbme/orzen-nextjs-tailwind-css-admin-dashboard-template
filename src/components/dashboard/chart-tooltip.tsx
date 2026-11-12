type Entry = { name?: string | number; value?: string | number; color?: string };
export function ChartTooltip({
  active,
  payload,
  label,
  currency = false,
}: {
  active?: boolean;
  payload?: readonly Entry[];
  label?: string | number;
  currency?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label ?? "Channel distribution"}</strong>
      {payload.map((item, index) => (
        <div key={`${item.name}-${index}`}>
          <span>
            <i style={{ background: item.color ?? "var(--accent)" }} />
            {item.name}
          </span>
          <b>
            {currency ? "$" : ""}
            {Number(item.value).toLocaleString("en-US")}
          </b>
        </div>
      ))}
    </div>
  );
}
