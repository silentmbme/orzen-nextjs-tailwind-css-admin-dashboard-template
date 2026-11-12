import Image from "next/image";

const portraits = ["alex-morgan", "priya-shah", "daniel-kim", "sofia-garcia"];
const namedPortraits: Record<string, string> = {
  "alex morgan": portraits[0],
  "priya shah": portraits[1],
  "daniel kim": portraits[2],
  "sofia garcia": portraits[3],
};
export function UserAvatar({
  name = "Orzen Demo",
  size = 32,
  className = "",
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  const key = name.trim().toLowerCase();
  const hash = Array.from(key).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  const portrait = namedPortraits[key] || portraits[hash % portraits.length];
  return (
    <Image
      src={`/images/sales-team/${portrait}.webp`}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`.trim()}
    />
  );
}
