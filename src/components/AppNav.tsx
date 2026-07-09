import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

interface AppNavProps {
  active?: "home" | "dashboard";
}

export function AppNav({ active = "home" }: AppNavProps) {
  return (
    <nav className="sticky top-4 z-30 mb-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/95 px-3 py-3 shadow-[0_14px_35px_rgba(22,35,26,0.10)] backdrop-blur">
        <Link href="/" className="flex items-center rounded-full px-2 py-1 transition hover:bg-[color:var(--brand-soft)]">
          <BrandMark compact className="rounded-full border border-[color:var(--brand-soft)] bg-[color:var(--surface)]/95 p-2 shadow-sm" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === "home"
                ? "bg-[color:var(--brand)] text-white shadow-[0_8px_18px_rgba(47,122,79,0.20)]"
                : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-strong)]"
            }`}
          >
            Accueil
          </Link>
          <Link
            href="/email"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active === "dashboard"
                ? "bg-[color:var(--brand)] text-white shadow-[0_8px_18px_rgba(47,122,79,0.20)]"
                : "text-[color:var(--foreground-muted)] hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-strong)]"
            }`}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
