"use client";
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { currency, demoToday, isOpenDeal, type Opportunity } from "@/features/crm/types";

export function RevenueForecast({ deals }: { deals: Opportunity[] }) {
  const [window, setWindow] = useState("90");
  const eligible = deals.filter((deal) => {
    const days = (Date.parse(deal.closeDate) - Date.parse(demoToday)) / 86400000;
    return isOpenDeal(deal) && days >= 0 && days <= Number(window);
  });
  const total = eligible.reduce((sum, deal) => sum + deal.value, 0);
  const weighted = eligible.reduce((sum, deal) => sum + (deal.value * deal.probability) / 100, 0);
  const bands = [
    { name: "High confidence", detail: "75–100% probability", min: 75, max: 100 },
    { name: "Developing", detail: "40–74% probability", min: 40, max: 74 },
    { name: "Early stage", detail: "Under 40% probability", min: 0, max: 39 },
  ].map((band) => {
    const group = eligible.filter(
      (deal) => deal.probability >= band.min && deal.probability <= band.max,
    );
    return {
      ...band,
      count: group.length,
      value: group.reduce((sum, deal) => sum + deal.value, 0),
      weighted: group.reduce((sum, deal) => sum + (deal.value * deal.probability) / 100, 0),
    };
  });
  return (
    <ChartCard
      className="crm-revenue-forecast"
      title={
        <>
          <TrendingUp size={14} /> REVENUE FORECAST
        </>
      }
      action={
        <Select
          aria-label="Forecast window"
          value={window}
          onChange={(event) => setWindow(event.target.value)}
        >
          <option value="30">Next 30 days</option>
          <option value="60">Next 60 days</option>
          <option value="90">Next 90 days</option>
        </Select>
      }
    >
      <div className="crm-forecast-total">
        <div>
          <strong>{currency(weighted)}</strong>
          <span>probability-weighted forecast</span>
        </div>
        <p>
          {currency(total)} face value
          <br />
          <b>{eligible.length}</b> open opportunities
        </p>
      </div>
      {eligible.length ? (
        <>
          <div
            className="crm-forecast-strip"
            role="img"
            aria-label={bands.map((band) => `${band.name}: ${currency(band.value)}`).join(", ")}
          >
            {bands.map((band, i) => (
              <span
                key={band.name}
                className={`crm-forecast-band-${i}`}
                style={{ width: `${total ? (band.value / total) * 100 : 0}%` }}
                title={`${band.name}: ${currency(band.value)}`}
              />
            ))}
          </div>
          <div className="crm-forecast-breakdown">
            {bands.map((band, i) => (
              <div key={band.name}>
                <i className={`crm-forecast-band-${i}`} />
                <span>
                  <b>{band.name}</b>
                  <small>
                    {band.detail} / {band.count} deals
                  </small>
                </span>
                <strong>
                  {currency(band.weighted)}
                  <small>weighted</small>
                </strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState>No open deals close within this forecast window.</EmptyState>
      )}
      <p className="crm-footnote">
        Deal value × probability, using expected close dates from the November 1 demo snapshot.
        Dashboard opportunity filters apply.
      </p>
    </ChartCard>
  );
}
