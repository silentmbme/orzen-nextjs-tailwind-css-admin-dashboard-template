import { Input } from "./input";

export function TableToolbar({
  label,
  query,
  onQueryChange,
}: {
  label: string;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <Input
      aria-label={`Search ${label}`}
      placeholder={`Search ${label.toLowerCase()}...`}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
