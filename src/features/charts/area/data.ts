export const areaData = [
  { label: "Jan", primary: 34, secondary: 22, tertiary: 14, negative: -12, low: 25, high: 42 },
  { label: "Feb", primary: 42, secondary: 28, tertiary: 18, negative: -8, low: 31, high: 50 },
  { label: "Mar", primary: 38, secondary: 31, tertiary: 17, negative: -16, low: 28, high: 47 },
  { label: "Apr", primary: 55, secondary: 35, tertiary: 24, negative: -6, low: 43, high: 65 },
  { label: "May", primary: 61, secondary: 41, tertiary: 29, negative: -11, low: 48, high: 72 },
  { label: "Jun", primary: 68, secondary: 46, tertiary: 33, negative: -4, low: 54, high: 80 },
  { label: "Jul", primary: 72, secondary: 50, tertiary: 38, negative: -9, low: 58, high: 86 },
  { label: "Aug", primary: 81, secondary: 57, tertiary: 43, negative: -3, low: 65, high: 96 },
];
export const gapAreaData = areaData.map((item, index) => ({
  ...item,
  gap: index === 3 || index === 4 ? null : item.primary,
}));
export const percentageData = areaData.map((item) => {
  const total = item.primary + item.secondary + item.tertiary;
  return {
    label: item.label,
    primary: (item.primary / total) * 100,
    secondary: (item.secondary / total) * 100,
    tertiary: (item.tertiary / total) * 100,
  };
});
export const rangeData = areaData.map((item) => ({ ...item, range: [item.low, item.high] }));
