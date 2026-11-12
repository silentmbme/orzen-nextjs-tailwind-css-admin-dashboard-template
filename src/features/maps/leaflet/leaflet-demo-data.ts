export type Category = "Offices" | "Warehouses" | "Service centers";
export type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: Category;
  description: string;
};
export const locations: Location[] = [
  {
    id: "central",
    name: "Central workspace",
    latitude: 51.5074,
    longitude: -0.1278,
    category: "Offices",
    description: "Fictional team workspace in central London.",
  },
  {
    id: "southbank",
    name: "Southbank office",
    latitude: 51.5055,
    longitude: -0.115,
    category: "Offices",
    description: "Client meetings and product collaboration.",
  },
  {
    id: "city",
    name: "City operations",
    latitude: 51.515,
    longitude: -0.092,
    category: "Offices",
    description: "Regional operations and account support.",
  },
  {
    id: "shoreditch",
    name: "East distribution",
    latitude: 51.524,
    longitude: -0.075,
    category: "Warehouses",
    description: "Illustrative stock and distribution location.",
  },
  {
    id: "bermondsey",
    name: "South distribution",
    latitude: 51.497,
    longitude: -0.063,
    category: "Warehouses",
    description: "Sample dispatch and inventory facility.",
  },
  {
    id: "waterloo",
    name: "Waterloo service",
    latitude: 51.501,
    longitude: -0.113,
    category: "Service centers",
    description: "Customer assistance and local support.",
  },
  {
    id: "kingscross",
    name: "North service",
    latitude: 51.531,
    longitude: -0.123,
    category: "Service centers",
    description: "Fictional customer service location.",
  },
  {
    id: "west",
    name: "West workspace",
    latitude: 51.514,
    longitude: -0.155,
    category: "Offices",
    description: "Team collaboration and partner appointments.",
  },
];
export const categories: Category[] = ["Offices", "Warehouses", "Service centers"];
export const colors: Record<Category, string> = {
  Offices: "var(--accent)",
  Warehouses: "var(--color-success)",
  "Service centers": "var(--color-danger)",
};
export const center: [number, number] = [51.513, -0.109];
export const tileProvider = {
  url: process.env.NEXT_PUBLIC_LEAFLET_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  name: process.env.NEXT_PUBLIC_LEAFLET_TILE_NAME || "OpenStreetMap",
  attribution:
    process.env.NEXT_PUBLIC_LEAFLET_TILE_ATTRIBUTION ||
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};
