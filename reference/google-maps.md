# Google Maps showcase setup

The `/maps/google` page has three examples: a standard map, a location explorer, and a route planner. Without configuration, each keeps its layout and shows a setup state. No fake map tiles or routes are used.

1. Create a Google Cloud project and attach an active billing account.
2. Enable **Maps JavaScript API**. Enable **Routes API** for the directions example.
3. Create an API key restricted to **Websites**. Add the exact origins you use, for example `http://localhost:3000/*` during local development and `https://your-domain.example/*` in production. Restrict the key to **Maps JavaScript API** and **Routes API**.
4. Create a **JavaScript map ID** in Google Maps Platform and add it as `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`. Advanced markers require a map ID. A map ID is optional for the standard map, but required by the marker and route examples in this template.
5. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`. Restart the development server or rebuild for production. Never commit a live key. These `NEXT_PUBLIC_` values are intentionally visible to the browser; key restrictions are essential.

The route planner uses the Maps JavaScript API **Routes library** (`Route.computeRoutes`), which requires both Maps JavaScript API and Routes API. Requests happen only when the user chooses **Calculate route**. Google returns the route geometry, distance, and duration; the demo does not supply them.

References: [Maps JavaScript API loading](https://developers.google.com/maps/documentation/javascript/load-maps-js-api), [Advanced markers and map IDs](https://developers.google.com/maps/documentation/javascript/advanced-markers/start), [Routes library setup](https://developers.google.com/maps/documentation/javascript/routes/start), [API key security](https://developers.google.com/maps/api-security-best-practices).
