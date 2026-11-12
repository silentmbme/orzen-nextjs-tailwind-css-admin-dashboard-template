"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronRight,
  Compass,
  MapPin,
  Navigation2,
  Route,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { GoogleMapContainer } from "./google-map-container";
import { locations, categoryColor } from "./google-maps-data";
import { importLibrary } from "@googlemaps/js-api-loader";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || undefined;
const defaultCenter = { lat: 37.787, lng: -122.408 };

function SectionTitle({
  icon: Icon,
  children,
}: {
  icon: typeof Compass;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <Icon size={15} aria-hidden="true" />
      {children}
    </span>
  );
}

function StandardMap() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "terrain" | "satellite">("roadmap");
  const ready = useCallback((instance: google.maps.Map) => setMap(instance), []);
  const chooseType = (type: typeof mapType) => {
    setMapType(type);
    map?.setMapTypeId(type);
  };
  return (
    <Card
      title={<SectionTitle icon={Compass}>Standard Google Map</SectionTitle>}
      action={<span className="text-[11px] text-muted">San Francisco, California</span>}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-[520px] text-[11px] leading-5 text-muted">
          Explore a live road map with Google controls, drag navigation, and a compact view
          switcher.
        </p>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Map view">
          {(["roadmap", "terrain", "satellite"] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={mapType === type ? "primary" : "outline"}
              disabled={!map}
              onClick={() => chooseType(type)}
              aria-pressed={mapType === type}
              className="capitalize"
            >
              {type === "roadmap" ? "Road" : type}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
            disabled={!map}
            onClick={() => {
              map?.setCenter(defaultCenter);
              map?.setZoom(12);
              chooseType("roadmap");
            }}
          >
            Reset view
          </Button>
        </div>
      </div>
      <GoogleMapContainer
        apiKey={apiKey}
        mapId={mapId}
        label="Standard interactive Google map"
        className="h-[260px] sm:h-[390px]"
        center={defaultCenter}
        zoom={12}
        onReady={ready}
      />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} />
          San Francisco Bay Area
        </span>
        <span>Google map controls remain available on the map when configured.</span>
      </div>
    </Card>
  );
}

function markerInfo(location: (typeof locations)[number]) {
  const content = document.createElement("div");
  content.style.cssText =
    "max-width:220px;padding:3px 5px;color:var(--foreground);background:var(--surface);font:12px Inter,Arial,sans-serif";
  const name = document.createElement("strong");
  name.textContent = location.name;
  name.style.cssText = "display:block;margin-bottom:4px;font-size:13px";
  const address = document.createElement("span");
  address.textContent = location.address;
  address.style.cssText = "display:block;color:var(--muted);font-size:11px";
  const description = document.createElement("p");
  description.textContent = location.description;
  description.style.cssText = "margin:7px 0 0;line-height:1.5";
  content.append(name, address, description);
  return content;
}

function MarkerExplorer() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(locations[0].id);
  const [infoOpen, setInfoOpen] = useState(true);
  const [markerError, setMarkerError] = useState("");
  const ready = useCallback((instance: google.maps.Map) => setMap(instance), []);
  const selected = locations.find((item) => item.id === selectedId);

  useEffect(() => {
    if (!map || !mapId) return;
    let cancelled = false;
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    let info: google.maps.InfoWindow | undefined;
    const capabilityListener = map.addListener("mapcapabilities_changed", () => {
      if (!map.getMapCapabilities().isAdvancedMarkersAvailable)
        setMarkerError(
          "Advanced markers are unavailable. Verify the configured Google Maps map ID.",
        );
    });
    importLibrary("marker")
      .then(({ AdvancedMarkerElement, PinElement }) => {
        if (cancelled) return;
        info = new google.maps.InfoWindow({ maxWidth: 250 });
        info.addListener("closeclick", () => setInfoOpen(false));
        locations.forEach((location) => {
          const active = location.id === selectedId;
          const pin = new PinElement({
            background: categoryColor[location.category],
            borderColor: "#ffffff",
            glyphColor: "#ffffff",
            scale: active ? 1.35 : 1.05,
          });
          const marker = new AdvancedMarkerElement({
            map,
            position: location.position,
            title: location.name,
            content: pin.element,
            zIndex: active ? 10 : 1,
          });
          marker.addListener("click", () => {
            setSelectedId(location.id);
            setInfoOpen(true);
          });
          markers.push(marker);
          if (active) {
            map.panTo(location.position);
            map.setZoom(13);
            if (infoOpen) {
              info!.setContent(markerInfo(location));
              info!.open({ map, anchor: marker });
            }
          }
        });
      })
      .catch(() => {
        if (!cancelled)
          setMarkerError(
            "Google's advanced marker library could not load. Check the map ID and Maps JavaScript API settings.",
          );
      });
    return () => {
      cancelled = true;
      capabilityListener.remove();
      info?.close();
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [map, selectedId, infoOpen]);

  const choose = (id: string) => {
    setSelectedId(id);
    setInfoOpen(true);
  };
  const matches = locations.filter((location) =>
    `${location.name} ${location.category} ${location.address}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <Card
      title={<SectionTitle icon={MapPin}>Custom markers & info windows</SectionTitle>}
      action={<span className="text-[11px] text-muted">{locations.length} demo locations</span>}
    >
      <p className="mb-3 text-[11px] leading-5 text-muted">
        Select a fictional workspace to focus its Google marker and open its location details.
      </p>
      <div className="grid min-w-0 gap-3 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="min-w-0">
          <label
            htmlFor="google-location-search"
            className="mb-1.5 block text-[11px] font-medium text-muted"
          >
            Search locations
          </label>
          <div className="relative">
            <Search
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              id="google-location-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name or category"
              className="w-full pl-9"
            />
          </div>
          <div className="mt-2 space-y-1.5">
            {matches.length ? (
              matches.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => choose(location.id)}
                  aria-pressed={selectedId === location.id}
                  className={`flex w-full gap-2.5 rounded-lg border px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${selectedId === location.id ? "border-accent/50 bg-accent/10" : "border-border hover:bg-surface-alt"}`}
                >
                  <span
                    className="mt-1 size-2.5 shrink-0 rounded-full"
                    style={{ background: categoryColor[location.category] }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
                      {location.category}
                    </span>
                    <strong className="mt-0.5 block truncate text-[12px] font-semibold text-foreground">
                      {location.name}
                    </strong>
                    <span className="mt-1 block text-[10px] leading-4 text-muted">
                      {location.address}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="rounded-lg border border-border p-3 text-[11px] text-muted">
                No locations match your search.
              </p>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <GoogleMapContainer
            apiKey={apiKey}
            mapId={mapId}
            requireMapId
            label="Google map with custom location markers"
            className="h-[300px] sm:h-[420px]"
            center={defaultCenter}
            zoom={12}
            onReady={ready}
          />
          {markerError && (
            <p
              role="alert"
              className="mt-2 rounded-md border border-border bg-surface-alt p-2 text-[11px] text-muted"
            >
              {markerError}
            </p>
          )}
          {selected && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-alt/60 p-2.5">
              <span
                className="size-2.5 rounded-full"
                style={{ background: categoryColor[selected.category] }}
              />
              <strong className="text-[12px] text-foreground">{selected.name}</strong>
              <span className="text-[11px] text-muted">{selected.description}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function DirectionsMap() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [originId, setOriginId] = useState(locations[0].id);
  const [destinationId, setDestinationId] = useState(locations[1].id);
  const [mode, setMode] = useState<"DRIVING" | "WALKING">("DRIVING");
  const [routes, setRoutes] = useState<google.maps.routes.Route[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const ready = useCallback((instance: google.maps.Map) => setMap(instance), []);
  const origin = locations.find((item) => item.id === originId)!;
  const destination = locations.find((item) => item.id === destinationId)!;
  const currentRoute = routes[routeIndex];

  useEffect(() => {
    if (!map || !currentRoute) return;
    let cancelled = false;
    const polylines = currentRoute.createPolylines({
      polylineOptions: { strokeColor: "#8b5cf6", strokeWeight: 6, strokeOpacity: 0.9 },
    });
    polylines.forEach((line) => line.setMap(map));
    const markers: google.maps.marker.AdvancedMarkerElement[] = [];
    importLibrary("marker")
      .then(({ AdvancedMarkerElement, PinElement }) => {
        if (cancelled) return;
        [origin, destination].forEach((place, index) => {
          const pin = new PinElement({
            background: index ? "#f9736b" : "#8b5cf6",
            borderColor: "#ffffff",
            glyphColor: "#ffffff",
            glyphText: index ? "B" : "A",
          });
          markers.push(
            new AdvancedMarkerElement({
              map,
              position: place.position,
              title: `${index ? "Destination" : "Origin"}: ${place.name}`,
              content: pin.element,
            }),
          );
        });
      })
      .catch(() => {
        if (!cancelled)
          setMessage(
            "Route loaded, but endpoint markers could not be displayed. Check the map ID.",
          );
      });
    if (currentRoute.viewport) map.fitBounds(currentRoute.viewport, 60);
    return () => {
      cancelled = true;
      polylines.forEach((line) => line.setMap(null));
      markers.forEach((marker) => {
        marker.map = null;
      });
    };
  }, [map, currentRoute, origin, destination]);

  const clearRoute = () => {
    setRoutes([]);
    setRouteIndex(0);
    setStatus("idle");
    setMessage("");
  };
  const calculate = async () => {
    if (!map || !mapId) return;
    if (originId === destinationId) {
      setStatus("error");
      setMessage("Choose two different locations to calculate a route.");
      return;
    }
    setStatus("loading");
    setMessage("Requesting a live route from Google...");
    setRoutes([]);
    try {
      const { Route: GoogleRoute } = await importLibrary("routes");
      const result = await GoogleRoute.computeRoutes({
        origin: origin.position,
        destination: destination.position,
        travelMode: mode,
        computeAlternativeRoutes: true,
        fields: ["path", "distanceMeters", "durationMillis", "viewport"],
      });
      if (!result.routes?.length) {
        setStatus("error");
        setMessage("Google returned no route for these locations and travel mode.");
        return;
      }
      setRoutes(result.routes);
      setRouteIndex(0);
      setStatus("success");
      setMessage(
        `${result.routes.length} live route${result.routes.length === 1 ? "" : "s"} returned by Google.`,
      );
    } catch {
      setStatus("error");
      setMessage(
        "Routes API is unavailable. Enable it for this key, verify billing and restrictions, then try again.",
      );
    }
  };
  const distance = currentRoute?.distanceMeters;
  const duration = currentRoute?.durationMillis;
  return (
    <Card
      title={<SectionTitle icon={Route}>Routes & directions</SectionTitle>}
      action={<span className="text-[11px] text-muted">Live Routes API request</span>}
    >
      <p className="mb-3 text-[11px] leading-5 text-muted">
        Choose two demo locations and request a real Google route. Distance and travel time appear
        only after Google returns them.
      </p>
      <div className="grid min-w-0 gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="min-w-0 rounded-lg border border-border bg-surface-alt/45 p-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
            <Navigation2 size={15} className="text-accent" /> Plan a route
          </div>
          <div className="mt-4 grid gap-3">
            <label className="block text-[11px] font-medium text-muted">
              Origin
              <Select
                value={originId}
                onChange={(event) => {
                  setOriginId(event.target.value);
                  clearRoute();
                }}
                className="mt-1.5 w-full"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-[11px] font-medium text-muted">
              Destination
              <Select
                value={destinationId}
                onChange={(event) => {
                  setDestinationId(event.target.value);
                  clearRoute();
                }}
                className="mt-1.5 w-full"
              >
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="block text-[11px] font-medium text-muted">
              Travel mode
              <Select
                value={mode}
                onChange={(event) => {
                  setMode(event.target.value as typeof mode);
                  clearRoute();
                }}
                className="mt-1.5 w-full"
              >
                <option value="DRIVING">Driving</option>
                <option value="WALKING">Walking</option>
              </Select>
            </label>
            <Button
              variant="primary"
              onClick={calculate}
              loading={status === "loading"}
              disabled={!map || !mapId}
              className="w-full"
            >
              Calculate route <ChevronRight size={14} />
            </Button>
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
              Route information
            </p>
            {currentRoute ? (
              <>
                <strong className="mt-2 block text-[12px] text-foreground">
                  {origin.name} → {destination.name}
                </strong>
                <div className="mt-2 flex flex-wrap gap-2">
                  {distance !== undefined && (
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-foreground">
                      {(distance / 1000).toFixed(1)} km
                    </span>
                  )}
                  {duration != null && (
                    <span className="rounded-md border border-border bg-surface px-2 py-1 text-[11px] text-foreground">
                      {Math.round(duration / 60000)} min
                    </span>
                  )}
                </div>
                {routes.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-1" aria-label="Route alternatives">
                    {routes.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={routeIndex === index ? "primary" : "outline"}
                        onClick={() => setRouteIndex(index)}
                        aria-pressed={routeIndex === index}
                      >
                        Route {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-[11px] leading-5 text-muted">
                {!apiKey || !mapId
                  ? "Configure both the API key and map ID to request routes."
                  : "No route requested yet. Google will calculate distance, duration, and geometry."}
              </p>
            )}
            {message && (
              <p
                role={status === "error" ? "alert" : "status"}
                className="mt-2 text-[11px] leading-5 text-muted"
              >
                {message}
              </p>
            )}
          </div>
        </div>
        <GoogleMapContainer
          apiKey={apiKey}
          mapId={mapId}
          requireMapId
          label="Google route and directions map"
          className="h-[300px] sm:h-[430px]"
          center={defaultCenter}
          zoom={12}
          onReady={ready}
        />
      </div>
    </Card>
  );
}

export function GoogleMapsPage() {
  return (
    <div className="grid min-w-0 gap-3">
      <div>
        <nav
          aria-label="Breadcrumb"
          className="mb-1 flex items-center gap-1 text-[11px] text-muted"
        >
          <span>Maps</span>
          <ChevronRight size={12} />
          <span aria-current="page">Google Maps</span>
        </nav>
        <PageHeader title="Google Maps" />
        <p className="mt-1 text-[12px] text-muted">
          Three ways to explore live Google maps, location markers, and directions.
        </p>
      </div>
      {!apiKey && (
        <div className="flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent/5 p-3 text-[11px] leading-5 text-foreground">
          <SlidersHorizontal size={16} className="mt-0.5 shrink-0 text-accent" />
          <p>
            <strong className="font-semibold">Google Maps setup needed.</strong> Add a
            browser-restricted API key and a map ID for markers and routes in{" "}
            <code className="rounded bg-surface px-1">.env.local</code>. The page will show live
            maps after configuration and restart.
          </p>
        </div>
      )}
      <StandardMap />
      <MarkerExplorer />
      <DirectionsMap />
    </div>
  );
}
