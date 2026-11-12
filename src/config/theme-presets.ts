export type ThemeSurface = {
  background: string;
  surface: string;
  alternate: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string;
};
export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  light: ThemeSurface;
  dark: ThemeSurface;
  radius: number;
  control: number;
  chart: string[];
};
function surface(values: string[]): ThemeSurface {
  const [background, surface, alternate, foreground, muted, border, accent] = values;
  return { background, surface, alternate, foreground, muted, border, accent };
}
function preset(
  id: string,
  name: string,
  description: string,
  light: string[],
  dark: string[],
  radius: number,
  control: number,
  chart: string[],
): ThemePreset {
  return {
    id,
    name,
    description,
    light: surface(light),
    dark: surface(dark),
    radius,
    control,
    chart,
  };
}
export const themePresets = [
  preset(
    "minimal",
    "Minimal",
    "Neutral & refined",
    ["#f6f6f6", "#ffffff", "#f4f4f5", "#202124", "#68696f", "#e2e2e5", "#50545d"],
    ["#111214", "#191b1e", "#22252a", "#f3f4f5", "#acb0b8", "#34383e", "#bbc2ce"],
    5,
    4,
    ["#8492a6", "#ba9586", "#a89ebc"],
  ),
  preset(
    "modern",
    "Modern",
    "Crisp cobalt",
    ["#f4f7fc", "#ffffff", "#edf2fa", "#1c293e", "#65718a", "#dce4ef", "#3266d6"],
    ["#101725", "#182236", "#222e44", "#edf3ff", "#a6b5ce", "#34445e", "#84aaff"],
    10,
    7,
    ["#5d9bc9", "#ed9a7d", "#a491d8"],
  ),
  preset(
    "material",
    "Material",
    "Indigo & teal",
    ["#f6f5fc", "#ffffff", "#eeedf8", "#28243f", "#716b86", "#dfdced", "#6251b5"],
    ["#171421", "#211e30", "#2c273e", "#f3edff", "#b6abc9", "#423951", "#bcacff"],
    12,
    8,
    ["#47a79b", "#e59c6b", "#c788ba"],
  ),
  preset(
    "saas",
    "SaaS",
    "Focused ocean",
    ["#f1f6f9", "#ffffff", "#eaf2f7", "#173044", "#60788b", "#d7e4ec", "#167695"],
    ["#0c1820", "#132630", "#1d3441", "#e5f4fa", "#9ab8c7", "#2d4857", "#65c6e3"],
    8,
    6,
    ["#6486ce", "#e89d79", "#8eac83"],
  ),
  preset(
    "flat",
    "Flat",
    "Clean & direct",
    ["#f3f7f5", "#ffffff", "#eaf2ee", "#20382e", "#687b72", "#d8e5dd", "#248365"],
    ["#101c17", "#182a21", "#22392d", "#ebf6ee", "#a2bcac", "#355442", "#7bcaa2"],
    2,
    3,
    ["#5e9ab3", "#db9875", "#ad94c6"],
  ),
  preset(
    "galaxy",
    "Galaxy",
    "Cosmic violet",
    ["#f5f3fc", "#ffffff", "#eee9fa", "#302048", "#7a6b91", "#e3daf0", "#8051c6"],
    ["#100d1c", "#1b152d", "#281f40", "#f4edff", "#baa8d5", "#43345d", "#c4a0ff"],
    10,
    7,
    ["#788fe8", "#d78ad1", "#75b9c6"],
  ),
  preset(
    "neon",
    "Neon",
    "Electric cyan",
    ["#f0f9fa", "#ffffff", "#e5f4f5", "#16343b", "#5e7c83", "#cce7e9", "#067d8d"],
    ["#07161b", "#10242d", "#18333f", "#e4faff", "#91bfc9", "#28505b", "#5ae5e9"],
    8,
    5,
    ["#a28cf2", "#ea89bd", "#b9cd67"],
  ),
  preset(
    "soft",
    "Soft",
    "Warm & gentle",
    ["#faf7f4", "#fffdfb", "#f3ede8", "#44352e", "#89766b", "#e8ded6", "#a96650"],
    ["#1e1917", "#2b2420", "#392f29", "#faeee5", "#c7b0a0", "#514237", "#e9ad90"],
    12,
    9,
    ["#8caea1", "#b5a0c8", "#d4b16f"],
  ),
  preset(
    "prism",
    "Prism",
    "Balanced spectrum",
    ["#f7f5fa", "#ffffff", "#f0ebf5", "#38253f", "#7d6a87", "#e5dceb", "#a04991"],
    ["#1b121e", "#281c2d", "#37263e", "#faecff", "#c6abcf", "#503757", "#e49bd8"],
    9,
    6,
    ["#6eabc2", "#c8ad65", "#9695d8"],
  ),
  preset(
    "nova",
    "Orzen",
    "Signature purple",
    ["#f8f8fa", "#ffffff", "#fafafa", "#111113", "#77777d", "#e5e5e8", "#9364e8"],
    ["#101115", "#181a20", "#202228", "#f2f2f4", "#a2a3ac", "#343640", "#ad8aff"],
    9,
    6,
    ["#7c83e8", "#e8847b", "#cf7cce"],
  ),
] satisfies ThemePreset[];
