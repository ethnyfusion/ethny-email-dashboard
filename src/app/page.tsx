import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { BrandMark } from "@/components/BrandMark";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-6 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <AppNav active="home" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[36px] border border-[color:var(--border)] bg-[color:var(--surface)]/95 p-8 shadow-[0_20px_45px_rgba(21,39,24,0.08)] backdrop-blur sm:p-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="max-w-2xl">
          <BrandMark className="mb-5" />
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Ethny Email Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
            Premium internal tools for Ethny email campaigns.
          </h1>
          <p className="mt-4 text-lg leading-8 text-[color:var(--foreground-muted)]">
            Preview launch, reactivation, and event emails with shared variables, quick content editing, and polished test sends through Resend.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/email" className="rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]">
              Open dashboard
            </Link>
            <a href="https://resend.com" target="_blank" rel="noreferrer" className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-5 py-3 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--brand)]">
              Learn about Resend
            </a>
          </div>
        </div>

        <div className="w-full max-w-md rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--brand)]">What you can do</p>
          <ul className="mt-4 space-y-3 text-sm text-[color:var(--foreground-muted)]">
            <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">Edit campaign copy and variables directly in one place.</li>
            <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">Preview the final email layout before sending a test version.</li>
            <li className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3">Keep the workflow lightweight and ready for future branding refinements.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
