import Link from "next/link";
export function Footer() {
  return (
    <footer className="app-footer">
      <span>
        &copy; {new Date().getFullYear()} Orzen &middot; A connected workspace for modern teams
      </span>
      <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link href="/dashboards/sales">Dashboards</Link>
        <span aria-hidden="true">&middot;</span>
        <Link href="/apps/tasks">Workspace</Link>
        <span aria-hidden="true">&middot;</span>
        <Link href="/pages/faq">Help center</Link>
      </nav>
    </footer>
  );
}
