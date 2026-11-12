"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Building2, Headset, Layers3, MapPin, RotateCcw, Warehouse } from "lucide-react";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  ScaleControl,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categories,
  center,
  colors,
  locations,
  tileProvider,
  type Category,
  type Location,
} from "./leaflet-demo-data";

const icons = { Offices: Building2, Warehouses: Warehouse, "Service centers": Headset };
const wrapper =
  "relative isolate min-w-0 overflow-hidden rounded-lg border border-border bg-surface-alt [&_.leaflet-container]:!font-[inherit] [&_.leaflet-popup-content-wrapper]:!rounded-lg [&_.leaflet-popup-content-wrapper]:!border [&_.leaflet-popup-content-wrapper]:!border-border [&_.leaflet-popup-content-wrapper]:!bg-surface [&_.leaflet-popup-content-wrapper]:!text-foreground [&_.leaflet-popup-tip]:!bg-surface [&_.leaflet-control-zoom_a]:!bg-surface [&_.leaflet-control-zoom_a]:!text-foreground [&_.leaflet-control-attribution]:!bg-surface [&_.leaflet-control-attribution]:!text-muted [&_.leaflet-control-attribution_a]:!text-accent";

function markerIcon(category: Category, selected: boolean) {
  const Icon = icons[category];
  return L.divIcon({
    className: "",
    iconSize: [30, 36],
    iconAnchor: [15, 34],
    popupAnchor: [0, -30],
    html: `<span style="display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:${colors[category]};color:white;border:2px solid var(--surface);${selected ? "outline:3px solid var(--foreground);" : ""}">${renderToStaticMarkup(<Icon size={15} />)}</span>`,
  });
}

function MapLifecycle({ selected }: { selected?: Location }) {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => {
    if (selected) map.setView([selected.latitude, selected.longitude], 16, { animate: false });
  }, [map, selected]);
  return null;
}

function Basemap({
  children,
  selected,
  height = "h-[300px] sm:h-[390px]",
}: {
  children: ReactNode;
  selected?: Location;
  height?: string;
}) {
  const [failed, setFailed] = useState(false);
  const layer = useRef<L.TileLayer>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  return (
    <div className={`${wrapper} ${height}`}>
      <MapContainer
        ref={setMap}
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full bg-surface-alt!"
        zoomAnimation={false}
        fadeAnimation={false}
        markerZoomAnimation={false}
      >
        <TileLayer
          ref={layer}
          url={tileProvider.url}
          attribution={tileProvider.attribution}
          maxZoom={19}
          eventHandlers={{ tileerror: () => setFailed(true) }}
        />
        <MapLifecycle selected={selected} />
        <ScaleControl imperial={false} />
        {children}
      </MapContainer>
      <Button
        size="sm"
        variant="outline"
        aria-label="Reset map view"
        className="absolute right-3 top-3 z-[1000] bg-surface!"
        onClick={() => map?.setView(center, 12, { animate: false })}
      >
        <RotateCcw size={13} />
        Reset
      </Button>
      {failed && (
        <div
          role="status"
          className="absolute bottom-7 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-surface p-2 text-[11px] text-muted"
        >
          <span>Some map tiles could not load. Check your connection or tile provider.</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFailed(false);
              layer.current?.redraw();
            }}
          >
            Retry tiles
          </Button>
        </div>
      )}
    </div>
  );
}

function LocationMarker({
  location,
  selected,
  onSelect,
}: {
  location: Location;
  selected: boolean;
  onSelect?: () => void;
}) {
  const marker = useRef<L.Marker>(null);
  useEffect(() => {
    if (selected) marker.current?.openPopup();
  }, [selected]);
  return (
    <Marker
      ref={marker}
      position={[location.latitude, location.longitude]}
      icon={markerIcon(location.category, selected)}
      title={location.name}
      alt={location.name}
      eventHandlers={{ click: () => onSelect?.() }}
    >
      <Popup maxWidth={230}>
        <div className="py-1">
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted">
            {location.category}
          </span>
          <strong className="mt-1 block text-[12px] font-semibold">{location.name}</strong>
          <p className="mt-1! mb-0! text-[11px] leading-5">{location.description}</p>
        </div>
      </Popup>
    </Marker>
  );
}

function Title({ icon: Icon, children }: { icon: typeof MapPin; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Icon size={15} aria-hidden="true" />
      {children}
    </span>
  );
}

function StandardMap() {
  return (
    <Card
      title={<Title icon={MapPin}>Standard OpenStreetMap</Title>}
      action={<span className="text-[11px] text-muted">London, United Kingdom</span>}
    >
      <p className="mb-3 text-[11px] leading-5 text-muted">
        Pan across the city, use the map zoom controls, or reset to the original view.
      </p>
      <Basemap>
        <LocationMarker location={locations[0]} selected={false} />
      </Basemap>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-muted">
        <span>Selected landmark: Central workspace</span>
        <span>Basemap: {tileProvider.name}</span>
        <span>Map tiles retain their original light style in both app themes.</span>
      </div>
    </Card>
  );
}

function ClusterMap() {
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Location | undefined>();
  const filtered = locations.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Card
      title={<Title icon={Building2}>Advanced markers & clusters</Title>}
      action={
        <span className="text-[11px] text-muted">{filtered.length} fictional facilities</span>
      }
    >
      <p className="mb-3 text-[11px] leading-5 text-muted">
        Explore offices, warehouses, and service centers. Select a cluster to expand nearby
        locations.
      </p>
      <div className="grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap gap-1" aria-label="Location categories">
            {(["All", ...categories] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "primary" : "outline"}
                onClick={() => {
                  setCategory(item);
                  setSelected(undefined);
                }}
                aria-pressed={category === item}
              >
                {item}
              </Button>
            ))}
          </div>
          <label htmlFor="leaflet-search" className="mb-1 block text-[11px] text-muted">
            Find a facility
          </label>
          <Input
            id="leaflet-search"
            className="w-full"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search locations..."
          />
          <div className="mt-2 max-h-[300px] space-y-1.5 overflow-y-auto p-0.5">
            {filtered.map((item) => {
              const Icon = icons[item.category];
              return (
                <button
                  key={item.id}
                  aria-pressed={selected?.id === item.id}
                  onClick={() => setSelected(item)}
                  className={`flex w-full gap-2 rounded-md border p-2.5 text-left focus-visible:outline-2 focus-visible:outline-accent ${selected?.id === item.id ? "border-accent bg-accent/10" : "border-border hover:bg-surface-alt"}`}
                >
                  <Icon
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: colors[item.category] }}
                  />
                  <span className="min-w-0">
                    <strong className="block text-[12px] font-medium text-foreground">
                      {item.name}
                    </strong>
                    <span className="block text-[10px] text-muted">{item.category}</span>
                    <span className="mt-1 block text-[11px] leading-4 text-muted">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
            {!filtered.length && (
              <p className="p-3 text-[11px] text-muted">No matching facilities.</p>
            )}
          </div>
        </div>
        <Basemap selected={selected} height="h-[330px] sm:h-[460px]">
          <MarkerClusterGroup
            key={`${category}-${query}`}
            animate={false}
            showCoverageOnHover={false}
            maxClusterRadius={55}
            iconCreateFunction={(cluster: { getChildCount: () => number }) =>
              L.divIcon({
                className: "",
                html: `<span style="display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--accent);color:white;border:5px solid color-mix(in srgb,var(--accent) 25%,var(--surface));font:600 12px Inter,sans-serif">${cluster.getChildCount()}</span>`,
                iconSize: [38, 38],
              })
            }
          >
            {filtered.map((item) => (
              <LocationMarker
                key={item.id}
                location={item}
                selected={selected?.id === item.id}
                onSelect={() => setSelected(item)}
              />
            ))}
          </MarkerClusterGroup>
        </Basemap>
      </div>
    </Card>
  );
}

const overlayLayers = [
  { id: "coverage", label: "Coverage radius", note: "1,200 m", color: "var(--accent)" },
  {
    id: "service",
    label: "Service boundary",
    note: "Fictional zone",
    color: "var(--color-success)",
  },
  {
    id: "connection",
    label: "Illustrative connection",
    note: "Not a road route",
    color: "var(--color-danger)",
  },
  { id: "boundary", label: "Planning boundary", note: "Rectangle", color: "var(--accent)" },
] as const;
function OverlayMap() {
  const [visible, setVisible] = useState<string[]>(overlayLayers.map((item) => item.id));
  const toggle = (id: string) =>
    setVisible((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  return (
    <Card
      title={<Title icon={Layers3}>Geographic shapes & overlays</Title>}
      action={<span className="text-[11px] text-muted">Illustrative coverage planning</span>}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {overlayLayers.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={visible.includes(item.id) ? "primary" : "outline"}
            aria-pressed={visible.includes(item.id)}
            onClick={() => toggle(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <Basemap height="h-[340px] sm:h-[440px]">
        {visible.includes("coverage") && (
          <Circle
            center={[51.5074, -0.1278]}
            radius={1200}
            pathOptions={{ color: "var(--accent)", fillOpacity: 0.14, weight: 2 }}
          >
            <Tooltip className="border-border! bg-surface! text-foreground!">
              Coverage radius - 1,200 meters
            </Tooltip>
          </Circle>
        )}
        {visible.includes("service") && (
          <Polygon
            positions={[
              [51.53, -0.105],
              [51.525, -0.055],
              [51.493, -0.065],
              [51.5, -0.11],
            ]}
            pathOptions={{ color: "var(--color-success)", fillOpacity: 0.15, weight: 2 }}
          >
            <Tooltip className="border-border! bg-surface! text-foreground!">
              Fictional east service boundary
            </Tooltip>
          </Polygon>
        )}
        {visible.includes("connection") && (
          <Polyline
            positions={[
              [51.5074, -0.1278],
              [51.515, -0.092],
              [51.524, -0.075],
            ]}
            pathOptions={{ color: "var(--color-danger)", weight: 3, dashArray: "7 6" }}
          >
            <Tooltip className="border-border! bg-surface! text-foreground!">
              Illustrative facility connection - not driving directions
            </Tooltip>
          </Polyline>
        )}
        {visible.includes("boundary") && (
          <Rectangle
            bounds={[
              [51.491, -0.16],
              [51.537, -0.05],
            ]}
            pathOptions={{ color: "var(--accent)", fill: false, weight: 2, dashArray: "4 5" }}
          >
            <Tooltip className="border-border! bg-surface! text-foreground!">
              Fictional planning boundary
            </Tooltip>
          </Rectangle>
        )}
      </Basemap>
      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4" aria-label="Overlay legend">
        {overlayLayers.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 rounded-md border border-border bg-surface-alt/50 p-2.5"
          >
            <span
              className="mt-1 size-2.5 shrink-0 rounded-sm"
              style={{ background: item.color }}
            />
            <span>
              <strong className="block text-[11px] font-medium text-foreground">
                {item.label}
              </strong>
              <span className="text-[10px] text-muted">{item.note}</span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function LeafletExamples() {
  return (
    <>
      <StandardMap />
      <ClusterMap />
      <OverlayMap />
    </>
  );
}
