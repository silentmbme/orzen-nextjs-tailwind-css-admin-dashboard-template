export type Market = { id: string; name: string; region: string; revenue: number; growth: number };

// Illustrative local figures. IDs are ISO 3166-1 numeric codes in Natural Earth.
export const markets: Market[] = [
  { id: "840", name: "United States", region: "North America", revenue: 184200, growth: 12.8 },
  { id: "124", name: "Canada", region: "North America", revenue: 48600, growth: 8.2 },
  { id: "484", name: "Mexico", region: "North America", revenue: 26700, growth: 6.4 },
  { id: "076", name: "Brazil", region: "South America", revenue: 42100, growth: 11.1 },
  { id: "826", name: "United Kingdom", region: "Europe", revenue: 72900, growth: 9.6 },
  { id: "250", name: "France", region: "Europe", revenue: 55300, growth: 7.3 },
  { id: "276", name: "Germany", region: "Europe", revenue: 65800, growth: 10.2 },
  { id: "356", name: "India", region: "Asia Pacific", revenue: 94300, growth: 18.6 },
  { id: "156", name: "China", region: "Asia Pacific", revenue: 77200, growth: 5.9 },
  { id: "392", name: "Japan", region: "Asia Pacific", revenue: 38900, growth: 4.7 },
  { id: "036", name: "Australia", region: "Asia Pacific", revenue: 34400, growth: 8.9 },
  { id: "710", name: "South Africa", region: "Africa", revenue: 18500, growth: 13.2 },
];

export type City = { name: string; country: string; coordinates: [number, number]; orders: number };
export const cities: City[] = [
  { name: "New York", country: "United States", coordinates: [-74.006, 40.713], orders: 4200 },
  {
    name: "San Francisco",
    country: "United States",
    coordinates: [-122.419, 37.775],
    orders: 2900,
  },
  { name: "Toronto", country: "Canada", coordinates: [-79.383, 43.653], orders: 1800 },
  { name: "São Paulo", country: "Brazil", coordinates: [-46.633, -23.55], orders: 2100 },
  { name: "London", country: "United Kingdom", coordinates: [-0.128, 51.507], orders: 3400 },
  { name: "Berlin", country: "Germany", coordinates: [13.405, 52.52], orders: 1600 },
  { name: "Mumbai", country: "India", coordinates: [72.878, 19.076], orders: 3600 },
  { name: "Tokyo", country: "Japan", coordinates: [139.692, 35.69], orders: 2700 },
  { name: "Sydney", country: "Australia", coordinates: [151.209, -33.869], orders: 1400 },
  { name: "Cape Town", country: "South Africa", coordinates: [18.424, -33.925], orders: 900 },
];

export const money = (value: number) =>
  `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;
