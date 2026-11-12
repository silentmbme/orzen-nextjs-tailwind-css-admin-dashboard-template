import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let configured = false;

// The loader maintains one Maps bootstrap script across all three showcases.
export async function loadMapLibrary(key: string, mapId?: string) {
  if (!configured) {
    (window as Window & { gm_authFailure?: () => void }).gm_authFailure = () => {
      window.dispatchEvent(new Event("nova-google-maps-auth-failure"));
    };
    setOptions({ key, v: "weekly", ...(mapId ? { mapIds: [mapId] } : {}) });
    configured = true;
  }
  return importLibrary("maps");
}
