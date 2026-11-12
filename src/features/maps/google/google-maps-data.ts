export type DemoLocation = {
  id: string;
  name: string;
  address: string;
  position: google.maps.LatLngLiteral;
  category: "Office" | "Studio" | "Partner";
  description: string;
};

export const locations: DemoLocation[] = [
  {
    id: "hq",
    name: "Harbor Studio",
    address: "155 Steuart St, San Francisco, CA",
    position: { lat: 37.7935, lng: -122.3927 },
    category: "Office",
    description: "Fictional waterfront headquarters and client welcome desk.",
  },
  {
    id: "design",
    name: "Market Workshop",
    address: "450 Powell St, San Francisco, CA",
    position: { lat: 37.7887, lng: -122.4085 },
    category: "Studio",
    description: "Fictional design and product collaboration space.",
  },
  {
    id: "partner",
    name: "Mission Partner Hub",
    address: "826 Valencia St, San Francisco, CA",
    position: { lat: 37.7595, lng: -122.4211 },
    category: "Partner",
    description: "Fictional local partner and community meeting point.",
  },
  {
    id: "north",
    name: "Northside Office",
    address: "Pier 39, San Francisco, CA",
    position: { lat: 37.8087, lng: -122.4098 },
    category: "Office",
    description: "Fictional operations office near the northern waterfront.",
  },
];

export const categoryColor: Record<DemoLocation["category"], string> = {
  Office: "#8b5cf6",
  Studio: "#3b82f6",
  Partner: "#f9736b",
};
