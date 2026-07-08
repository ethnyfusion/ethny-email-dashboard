import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7fbf4_0%,#f1f6ea_100%)] px-6 py-16 text-stone-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-[32px] border border-emerald-100 bg-white/90 p-10 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Ethny Email Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">
            Premium internal tools for Ethny email campaigns.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-600">
            Preview launch, reactivation, and event emails with reusable variables and send polished test messages with Resend.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/email" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Open dashboard
          </Link>
          <a href="https://resend.com" target="_blank" rel="noreferrer" className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-emerald-400 hover:text-emerald-700">
            Learn about Resend
          </a>
        </div>
      </div>
    </main>
  );
}
