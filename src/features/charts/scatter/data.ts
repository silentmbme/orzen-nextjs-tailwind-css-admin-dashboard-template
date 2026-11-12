export const correlationData = [
  { x: 12, y: 24 },
  { x: 18, y: 31 },
  { x: 24, y: 29 },
  { x: 29, y: 43 },
  { x: 34, y: 48 },
  { x: 41, y: 53 },
  { x: 48, y: 59 },
  { x: 55, y: 64 },
  { x: 63, y: 72 },
  { x: 71, y: 77 },
  { x: 79, y: 86 },
  { x: 88, y: 91 },
];

export const teamAData = [
  { x: 15, y: 42 },
  { x: 24, y: 54 },
  { x: 36, y: 47 },
  { x: 45, y: 68 },
  { x: 58, y: 72 },
  { x: 67, y: 64 },
  { x: 78, y: 86 },
  { x: 89, y: 82 },
];

export const teamBData = [
  { x: 18, y: 28 },
  { x: 29, y: 38 },
  { x: 40, y: 52 },
  { x: 52, y: 45 },
  { x: 61, y: 61 },
  { x: 73, y: 69 },
  { x: 84, y: 73 },
  { x: 92, y: 88 },
];

export const bubbleData = [
  { x: 18, y: 72, z: 180, name: "North" },
  { x: 32, y: 48, z: 420, name: "West" },
  { x: 46, y: 83, z: 310, name: "Europe" },
  { x: 58, y: 61, z: 580, name: "Asia" },
  { x: 72, y: 76, z: 720, name: "Central" },
  { x: 86, y: 44, z: 250, name: "South" },
];

export const outlierData = [
  { x: 14, y: 22, outlier: false },
  { x: 22, y: 30, outlier: false },
  { x: 31, y: 34, outlier: false },
  { x: 39, y: 44, outlier: false },
  { x: 47, y: 51, outlier: false },
  { x: 56, y: 57, outlier: false },
  { x: 63, y: 66, outlier: false },
  { x: 70, y: 71, outlier: false },
  { x: 78, y: 26, outlier: true },
  { x: 86, y: 84, outlier: false },
];

export const inverseData = correlationData.map((item, index) => ({
  x: item.x,
  y: 96 - item.y + index * 1.5,
}));
