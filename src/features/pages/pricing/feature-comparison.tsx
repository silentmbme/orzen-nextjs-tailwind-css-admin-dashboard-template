import { Check, Minus } from "lucide-react";
import { ShowcaseCard as Card } from "@/components/ui/showcase-card";
import { comparison, plans, type ComparisonCell } from "./pricing-data";

function Cell({ value }: { value: ComparisonCell }) {
  if (value === true)
    return <Check size={15} className="mx-auto text-accent" aria-label="Included" />;
  if (value === false)
    return <Minus size={13} className="mx-auto text-muted" aria-label="Not included" />;
  return <span>{value}</span>;
}

export function FeatureComparison() {
  return (
    <Card title="Compare every feature" className="min-w-0">
      <p className="mb-3 text-[11px] text-muted">
        Scroll the table on smaller screens to compare all four plans.
      </p>
      <div
        className="max-w-full overflow-x-auto rounded-md border border-border"
        tabIndex={0}
        role="region"
        aria-label="Scrollable plan comparison"
      >
        <table className="w-full min-w-[680px] border-collapse text-[11px]">
          <caption className="sr-only">
            Feature comparison for Starter, Professional, Business, and Enterprise
          </caption>
          <thead>
            <tr className="bg-surface-alt">
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-[190px] border-b border-border bg-surface-alt px-3 py-3 text-left font-semibold"
              >
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  scope="col"
                  key={plan.id}
                  className={`min-w-[115px] border-b border-border px-2 py-3 text-center font-semibold ${plan.id === "professional" ? "text-accent" : ""}`}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          {comparison.map((group) => (
            <tbody key={group.name}>
              <tr>
                <th
                  colSpan={5}
                  scope="rowgroup"
                  className="border-b border-border bg-surface-alt/60 px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[.04em] text-muted"
                >
                  {group.name}
                </th>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <th
                    scope="row"
                    className="sticky left-0 bg-surface px-3 py-2.5 text-left font-medium"
                  >
                    {row.feature}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={plans[index].id} className="px-2 py-2.5 text-center">
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </Card>
  );
}
