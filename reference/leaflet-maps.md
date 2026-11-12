# Leaflet maps

`/maps/leaflet` loads Leaflet only in the browser through a Next.js dynamic import. Three examples share a tile configuration and custom SVG markers. All facility data and coverage overlays are fictional. The dashed connecting line is an illustrative connection, not a road route.

The default basemap uses `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, with visible OpenStreetMap attribution. Data is licensed under ODbL; see https://www.openstreetmap.org/copyright. Community tiles have no availability guarantee. For a commercial deployment, select a suitable hosting provider and comply with its usage limits and attribution requirements.

Optional environment variables (restart or rebuild after changes):

```
NEXT_PUBLIC_LEAFLET_TILE_URL=https://your-provider.example/{z}/{x}/{y}.png
NEXT_PUBLIC_LEAFLET_TILE_NAME=Your provider
NEXT_PUBLIC_LEAFLET_TILE_ATTRIBUTION=Provider attribution HTML
```

Only use trusted attribution HTML. Keep all attribution required by your provider and its underlying data. No offline downloads, bulk prefetching, cache bypass, or custom request headers are used. Browser caching and referrers retain normal behavior. See https://operations.osmfoundation.org/policies/tiles/.

The application theme styles controls, markers, popups, and legends. Standard OpenStreetMap raster tiles keep their original light appearance; they are not recolored as a substitute for a licensed dark basemap.
