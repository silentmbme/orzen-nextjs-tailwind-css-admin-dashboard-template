"use client";

import { useMemo, useRef, useState } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Globe2,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cities, markets, money } from "./data";
import topologyData from "./countries-110m.json";

const WIDTH = 960;
const HEIGHT = 450;
const topology = topologyData as unknown as Topology;
const countries = (
  feature(topology, topology.objects.countries as GeometryCollection) as FeatureCollection<
    Geometry,
    { name: string }
  >
).features;
const projection = geoEqualEarth()
  .fitSize([WIDTH - 36, HEIGHT - 28], { type: "Sphere" })
  .translate([WIDTH / 2, HEIGHT / 2]);
const path = geoPath(projection);
const marketById = new Map(markets.map((market) => [market.id, market]));
const maxRevenue = Math.max(...markets.map((market) => market.revenue));
const regions = Array.from(new Set(markets.map((market) => market.region)))
  .map((name) => ({
    name,
    revenue: markets
      .filter((market) => market.region === name)
      .reduce((sum, market) => sum + market.revenue, 0),
    count: markets.filter((market) => market.region === name).length,
  }))
  .sort((a, b) => b.revenue - a.revenue);

type Country = Feature<Geometry, { name: string }>;
type MapProps = {
  variant: "choropleth" | "bubble" | "explorer";
  selectedId?: string;
  onSelect?: (id: string) => void;
  zoom?: number;
  center?: [number, number];
  onPan?: (dx: number, dy: number) => void;
};

function countryFill(country: Country, variant: MapProps["variant"], selectedId?: string) {
  const market = marketById.get(String(country.id));
  if (selectedId === String(country.id)) return "var(--accent)";
  if (variant !== "choropleth" || !market) return "var(--surface-alt)";
  const intensity = market.revenue / maxRevenue;
  return `color-mix(in srgb, var(--accent) ${Math.round(17 + intensity * 70)}%, var(--surface))`;
}

function VectorMap({
  variant,
  selectedId,
  onSelect,
  zoom = 1,
  center = [WIDTH / 2, HEIGHT / 2],
  onPan,
}: MapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const dragging = useRef<{ x: number; y: number } | null>(null);
  const viewWidth = WIDTH / zoom;
  const viewHeight = HEIGHT / zoom;
  const activeMarket = hovered ? marketById.get(hovered) : undefined;
  const activeCity = hovered?.startsWith("city-")
    ? cities.find((city) => `city-${city.name}` === hovered)
    : undefined;

  return (
    <div className="relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface-alt/45">
      <svg
        viewBox={`${center[0] - viewWidth / 2} ${center[1] - viewHeight / 2} ${viewWidth} ${viewHeight}`}
        className="block aspect-[960/450] w-full touch-none"
        role="img"
        aria-label={
          variant === "bubble"
            ? "World map showing city order volumes as proportional bubbles"
            : "Interactive world map with country-level sample revenue"
        }
        onPointerDown={
          onPan
            ? (event) => {
                dragging.current = { x: event.clientX, y: event.clientY };
                event.currentTarget.setPointerCapture(event.pointerId);
              }
            : undefined
        }
        onPointerMove={
          onPan
            ? (event) => {
                if (!dragging.current) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                onPan(
                  ((dragging.current.x - event.clientX) * viewWidth) / bounds.width,
                  ((dragging.current.y - event.clientY) * viewHeight) / bounds.height,
                );
                dragging.current = { x: event.clientX, y: event.clientY };
              }
            : undefined
        }
        onPointerUp={
          onPan
            ? () => {
                dragging.current = null;
              }
            : undefined
        }
        onPointerCancel={
          onPan
            ? () => {
                dragging.current = null;
              }
            : undefined
        }
      >
        <path
          d={path({ type: "Sphere" }) ?? ""}
          fill="var(--surface-alt)"
          stroke="var(--border)"
          strokeWidth={1}
        />
        {countries.map((country, index) => {
          const id = String(country.id);
          const market = marketById.get(id);
          const selectable = Boolean(onSelect && market);
          const label = `${country.properties.name}: ${market ? `${money(market.revenue)} demo revenue` : "no demo data"}`;
          return (
            <path
              key={`${id}-${index}`}
              d={path(country) ?? ""}
              fill={countryFill(country, variant, selectedId)}
              stroke={selectedId === id ? "var(--foreground)" : "var(--border)"}
              strokeWidth={selectedId === id ? 1.8 : 0.7}
              vectorEffect="non-scaling-stroke"
              className={
                selectable
                  ? "cursor-pointer outline-none focus:stroke-[3px] focus:stroke-foreground"
                  : ""
              }
              role={selectable ? "button" : undefined}
              tabIndex={selectable ? 0 : undefined}
              aria-label={selectable ? `Select ${label}` : undefined}
              aria-pressed={selectable ? selectedId === id : undefined}
              onClick={selectable ? () => onSelect?.(id) : undefined}
              onKeyDown={
                selectable
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect?.(id);
                      }
                    }
                  : undefined
              }
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
            >
              <title>{label}</title>
            </path>
          );
        })}
        {variant === "bubble" &&
          cities.map((city) => {
            const [x, y] = projection(city.coordinates) ?? [0, 0];
            const radius = Math.sqrt(city.orders / Math.PI) * 0.44;
            return (
              <circle
                key={city.name}
                cx={x}
                cy={y}
                r={radius}
                fill="var(--accent)"
                fillOpacity={0.55}
                stroke="var(--surface)"
                strokeWidth={2}
                onMouseEnter={() => setHovered(`city-${city.name}`)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(`city-${city.name}`)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="img"
                aria-label={`${city.name}, ${city.country}: ${city.orders.toLocaleString()} demo orders`}
                className="outline-none focus:stroke-foreground focus:stroke-[3px]"
              />
            );
          })}
      </svg>
      {(activeMarket || activeCity) && (
        <div
          className="pointer-events-none absolute left-2 top-2 max-w-[calc(100%-16px)] rounded-md border border-border bg-surface px-2.5 py-1.5 text-[11px] text-foreground shadow-sm"
          role="status"
        >
          <strong className="font-semibold">{activeCity?.name ?? activeMarket?.name}</strong>
          <span className="ml-2 text-muted">
            {activeCity
              ? `${activeCity.orders.toLocaleString()} orders`
              : `${money(activeMarket!.revenue)} revenue`}
          </span>
        </div>
      )}
    </div>
  );
}

function CardTitle({ icon: Icon, children }: { icon: typeof Globe2; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Icon size={15} aria-hidden="true" />
      {children}
    </span>
  );
}

function Choropleth() {
  const [selectedId, setSelectedId] = useState("840");
  const selected = marketById.get(selectedId)!;
  return (
    <Card
      title={<CardTitle icon={Globe2}>World revenue by country</CardTitle>}
      action={<span className="text-[11px] text-muted">Sample revenue · USD</span>}
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <VectorMap variant="choropleth" selectedId={selectedId} onSelect={setSelectedId} />
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-muted">
            <span>Lower revenue</span>
            <div className="flex gap-1" aria-hidden="true">
              {[20, 34, 49, 64, 79].map((value) => (
                <span
                  key={value}
                  className="h-2.5 w-7 rounded-sm"
                  style={{
                    background: `color-mix(in srgb, var(--accent) ${value}%, var(--surface))`,
                  }}
                />
              ))}
            </div>
            <span>Higher revenue</span>
            <span className="ml-auto flex items-center gap-1.5">
              <i className="size-2.5 rounded-sm border border-border bg-surface-alt" />
              No data
            </span>
          </div>
        </div>
        <aside className="min-w-0 rounded-lg border border-border bg-surface-alt/45 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Selected market
          </p>
          <h3 className="mt-1 text-[15px] font-semibold text-foreground">{selected.name}</h3>
          <p className="mt-1 text-[24px] font-semibold tabular-nums text-foreground">
            {money(selected.revenue)}
          </p>
          <p className="text-[11px] text-muted">+{selected.growth}% sample growth</p>
          <div className="my-4 border-t border-border" />
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Regional summary
          </p>
          <ul className="space-y-2">
            {regions.map((region) => (
              <li key={region.name} className="flex justify-between gap-2 text-[11px]">
                <span className="truncate text-muted">
                  {region.name} <span className="opacity-70">({region.count})</span>
                </span>
                <strong className="tabular-nums text-foreground">{money(region.revenue)}</strong>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Card>
  );
}

function BubbleMap() {
  const topCities = [...cities].sort((a, b) => b.orders - a.orders).slice(0, 5);
  return (
    <Card
      title={<CardTitle icon={MapPin}>Regional order activity</CardTitle>}
      action={<span className="text-[11px] text-muted">10 city markets</span>}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div className="min-w-0">
          <VectorMap variant="bubble" />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
            <span>Bubble area = sample orders</span>
            {[1000, 2500, 4000].map((value) => (
              <span key={value} className="inline-flex items-center gap-1.5">
                <i
                  className="inline-block rounded-full border border-accent bg-accent/30"
                  style={{
                    width: Math.sqrt(value / Math.PI) * 0.88,
                    height: Math.sqrt(value / Math.PI) * 0.88,
                  }}
                />
                {value.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
        <aside className="min-w-0">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Leading cities
          </p>
          <ol className="space-y-2">
            {topCities.map((city, index) => (
              <li
                key={city.name}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-alt/45 p-2.5"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-md bg-accent/10 text-[11px] font-semibold text-accent">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[12px] text-foreground">
                    {city.name}
                  </strong>
                  <span className="text-[10px] text-muted">{city.country}</span>
                </span>
                <strong className="text-[11px] tabular-nums text-foreground">
                  {city.orders.toLocaleString()}
                </strong>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Card>
  );
}

function CountryExplorer() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("356");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([WIDTH / 2, HEIGHT / 2]);
  const selected = marketById.get(selectedId)!;
  const filtered = useMemo(
    () =>
      markets.filter(
        (market) =>
          market.name.toLowerCase().includes(query.toLowerCase()) ||
          market.region.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  const selectCountry = (id: string) => {
    setSelectedId(id);
    const country = countries.find((item) => String(item.id) === id);
    if (country) {
      const [x, y] = path.centroid(country);
      if (Number.isFinite(x) && Number.isFinite(y)) setCenter([x, y]);
    }
    setZoom(1.8);
  };
  const move = (dx: number, dy: number) =>
    setCenter(([x, y]) => [
      Math.max(0, Math.min(WIDTH, x + dx)),
      Math.max(0, Math.min(HEIGHT, y + dy)),
    ]);
  const controls = [
    { label: "Pan left", icon: ArrowLeft, dx: -55, dy: 0 },
    { label: "Pan up", icon: ArrowUp, dx: 0, dy: -40 },
    { label: "Pan down", icon: ArrowDown, dx: 0, dy: 40 },
    { label: "Pan right", icon: ArrowRight, dx: 55, dy: 0 },
  ];
  return (
    <Card
      title={<CardTitle icon={Search}>Country explorer</CardTitle>}
      action={<span className="text-[11px] text-muted">Search · select · navigate</span>}
    >
      <div className="grid min-w-0 gap-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="min-w-0">
          <label
            htmlFor="map-country-search"
            className="mb-1.5 block text-[11px] font-medium text-muted"
          >
            Find a market or region
          </label>
          <Input
            id="map-country-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search countries..."
            className="w-full"
          />
          <div
            className="mt-2 max-h-[320px] space-y-1 overflow-y-auto pr-1"
            role="list"
            aria-label="Countries with demo revenue"
          >
            {filtered.length ? (
              filtered.map((market) => (
                <button
                  key={market.id}
                  type="button"
                  onClick={() => selectCountry(market.id)}
                  aria-pressed={selectedId === market.id}
                  className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selectedId === market.id ? "border-accent/40 bg-accent/10" : "border-transparent hover:border-border hover:bg-surface-alt"}`}
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${selectedId === market.id ? "bg-accent" : "bg-muted/40"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-[12px] font-medium text-foreground">
                      {market.name}
                    </strong>
                    <small className="text-[10px] text-muted">{market.region}</small>
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums text-foreground">
                    {money(market.revenue)}
                  </span>
                </button>
              ))
            ) : (
              <p className="p-3 text-[11px] text-muted">No matching demo markets.</p>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-muted">
              Drag the map to pan. Select a highlighted country for details.
            </p>
            <div className="flex items-center gap-1">
              {controls.map(({ label, icon: Icon, dx, dy }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  onClick={() => move(dx / zoom, dy / zoom)}
                  className="grid size-7 place-items-center rounded-md border border-border bg-surface text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
                >
                  <Icon size={13} />
                </button>
              ))}
              <span className="mx-0.5 h-4 border-l border-border" />
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(3, +(value + 0.3).toFixed(1)))}
                className="grid size-7 place-items-center rounded-md border border-border bg-surface text-muted hover:text-foreground"
              >
                <Plus size={13} />
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(1, +(value - 0.3).toFixed(1)))}
                className="grid size-7 place-items-center rounded-md border border-border bg-surface text-muted hover:text-foreground"
              >
                <Minus size={13} />
              </button>
              <button
                type="button"
                aria-label="Reset map view"
                onClick={() => {
                  setZoom(1);
                  setCenter([WIDTH / 2, HEIGHT / 2]);
                }}
                className="grid size-7 place-items-center rounded-md border border-border bg-surface text-muted hover:text-foreground"
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>
          <VectorMap
            variant="explorer"
            selectedId={selectedId}
            onSelect={selectCountry}
            zoom={zoom}
            center={center}
            onPan={move}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-border bg-surface-alt/45 px-3 py-2.5">
            <div className="min-w-[120px] flex-1">
              <span className="text-[10px] uppercase tracking-wide text-muted">
                Selected country
              </span>
              <strong className="block text-[13px] text-foreground">{selected.name}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide text-muted">Demo revenue</span>
              <strong className="block text-[13px] tabular-nums text-foreground">
                {money(selected.revenue)}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide text-muted">Growth</span>
              <strong className="block text-[13px] tabular-nums text-foreground">
                +{selected.growth}%
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wide text-muted">Region</span>
              <strong className="block text-[13px] text-foreground">{selected.region}</strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function VectorMapsPage() {
  return (
    <div className="grid min-w-0 gap-3">
      <div>
        <PageHeader title="Vector maps" />
        <p className="mt-1 text-[12px] text-muted">
          Explore illustrative market revenue and order activity across real country boundaries.
        </p>
      </div>
      <Choropleth />
      <BubbleMap />
      <CountryExplorer />
      <p className="text-[11px] text-muted">
        Map boundaries: Natural Earth 1:110m via World Atlas. Metrics are local illustrative data,
        not live geographic statistics.
      </p>
    </div>
  );
}
