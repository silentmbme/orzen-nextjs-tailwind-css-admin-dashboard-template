"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AlertCircle, Cloud, MapPinned, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadMapLibrary } from "./google-map-loader";

type Props = {
  apiKey: string;
  mapId?: string;
  requireMapId?: boolean;
  label: string;
  className?: string;
  center: google.maps.LatLngLiteral;
  zoom: number;
  onReady?: (map: google.maps.Map) => void;
};

export function GoogleMapContainer({
  apiKey,
  mapId,
  requireMapId = false,
  label,
  className = "h-[340px]",
  center,
  zoom,
  onReady,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const onReadyRef = useRef(onReady);
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (!apiKey || (requireMapId && !mapId)) return;
    let cancelled = false;
    const hostNode = host.current;
    const authFailure = () => {
      if (!cancelled) {
        setError(
          "Google Maps authorization failed. Check billing, API restrictions, and allowed website referrers.",
        );
        setState("error");
      }
    };
    window.addEventListener("nova-google-maps-auth-failure", authFailure);
    loadMapLibrary(apiKey, mapId)
      .then(({ Map }) => {
        if (cancelled || !hostNode) return;
        const map = new Map(hostNode, {
          center,
          zoom,
          mapId,
          mapTypeId: "roadmap",
          mapTypeControl: true,
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "cooperative",
          colorScheme: document.documentElement.classList.contains("dark") ? "DARK" : "LIGHT",
        });
        mapRef.current = map;
        setState("ready");
        onReadyRef.current?.(map);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "The Google Maps JavaScript API could not load. Check the key, network, and enabled APIs.",
          );
          setState("error");
        }
      });
    return () => {
      cancelled = true;
      window.removeEventListener("nova-google-maps-auth-failure", authFailure);
      mapRef.current = null;
      hostNode?.replaceChildren();
    };
    // One map instance per mounted container. Controls update the map directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, mapId, requireMapId]);

  useEffect(() => {
    if (mapRef.current && resolvedTheme)
      mapRef.current.setOptions({ colorScheme: resolvedTheme === "dark" ? "DARK" : "LIGHT" });
  }, [resolvedTheme]);

  const missingKey = !apiKey;
  const missingMapId = requireMapId && !mapId;
  const unavailable = missingKey || missingMapId || state === "error";
  return (
    <div
      className={`relative min-w-0 overflow-hidden rounded-lg border border-border bg-surface-alt [&_.gm-style-iw]:!bg-surface [&_.gm-style-iw-d]:!bg-surface [&_.gm-style-iw-tc]:!hidden ${className}`}
      role="region"
      aria-label={label}
    >
      <div ref={host} className={`h-full w-full ${unavailable ? "invisible" : ""}`} />
      {(unavailable || state === "loading") && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:28px_28px]"
          role="status"
        >
          <div className="max-w-[350px] rounded-lg border border-border bg-surface px-5 py-5 shadow-sm">
            <span className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
              {state === "error" ? (
                <AlertCircle size={19} />
              ) : state === "loading" && !unavailable ? (
                <Cloud size={19} className="motion-safe:animate-pulse" />
              ) : (
                <MapPinned size={19} />
              )}
            </span>
            <h3 className="text-[13px] font-semibold text-foreground">
              {state === "error"
                ? "Map unavailable"
                : state === "loading" && !unavailable
                  ? "Loading Google Maps"
                  : "Configure Google Maps"}
            </h3>
            <p className="mt-2 text-[11px] leading-5 text-muted">
              {missingKey
                ? "Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable this live map."
                : missingMapId
                  ? "Add NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID for advanced markers and route endpoints."
                  : state === "error"
                    ? error
                    : "Connecting to the Google Maps JavaScript API..."}
            </p>
            {state === "error" && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                <RotateCcw size={13} /> Retry loading
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
