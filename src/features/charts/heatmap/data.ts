export function createHeatmap(rows: number, columns: number, seed: number, ceiling = 100) {
  return Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    return (
      (row * 17 + column * 23 + seed * 11 + (((row + seed) * (column + 3)) % 31)) % (ceiling + 1)
    );
  });
}

export const activityData = createHeatmap(7, 14, 3);
export const engagementData = createHeatmap(7, 12, 7);
export const conversionData = createHeatmap(5, 10, 12);
export const supportData = createHeatmap(7, 12, 18);
export const performanceData = createHeatmap(6, 10, 22);
export const deploymentData = createHeatmap(5, 14, 28);
export const adoptionData = createHeatmap(6, 12, 31);
export const anomalyData = createHeatmap(6, 12, 39);

export const cohortData = Array.from({ length: 8 * 8 }, (_, index) => {
  const row = Math.floor(index / 8);
  const column = index % 8;
  return column > 7 - row ? null : Math.max(12, 96 - column * 11 - row * 4);
});

export const riskData = [
  12, 18, 25, 36, 48, 18, 27, 39, 52, 65, 24, 38, 54, 69, 78, 33, 49, 66, 81, 91, 46, 63, 77, 89,
  98,
];

const correlationBase = [
  100, 72, 45, 62, 31, 54, 72, 100, 58, 47, 66, 39, 45, 58, 100, 76, 52, 68, 62, 47, 76, 100, 61,
  44, 31, 66, 52, 61, 100, 73, 54, 39, 68, 44, 73, 100,
];
export const correlationData = correlationBase;
