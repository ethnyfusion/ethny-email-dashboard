"use client";

import { useEffect, useMemo, useState } from "react";
import { CampaignCard } from "@/components/CampaignCard";
import { EmailPreviewFrame } from "@/components/EmailPreviewFrame";
import { emailCampaigns, type EmailCampaign } from "@/lib/email-campaigns";
import { renderCampaignHtml } from "@/lib/email-renderer";
import type { CampaignVariables } from "@/lib/email-variables";

interface DashboardShellProps {
  initialCampaignId?: string;
}

export function DashboardShell({ initialCampaignId }: DashboardShellProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState(initialCampaignId ?? emailCampaigns[0].id);
  const [previewHtml, setPreviewHtml] = useState("");
  const [variables, setVariables] = useState<CampaignVariables>({
    firstName: "Alex",
    websiteLink: "https://www.ethny.com",
    bookingLink: "https://www.ethny.com/book",
    unsubscribeLink: "https://www.ethny.com/unsubscribe",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedCampaign = useMemo(
    () => emailCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? emailCampaigns[0],
    [selectedCampaignId],
  );

  useEffect(() => {
    void (async () => {
      const rendered = await renderCampaignHtml(selectedCampaign.id, variables);
      setPreviewHtml(rendered.html);
    })();
  }, [selectedCampaign.id, variables]);

  async function handleSendTest() {
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          variables,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to send test email");
      }

      setStatus("sent");
      setMessage(data.message ?? "Test sent successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7fbf4_0%,#f1f6ea_100%)] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[32px] border border-emerald-100 bg-white/90 p-8 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">Ethny Email Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Design, preview, and test your next Ethny campaign.
              </h1>
              <p className="mt-3 max-w-2xl text-base text-stone-600">
                Build polished email experiences with shared variables and send a test email through Resend.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              V1 • Secure, Vercel-ready, no secrets in the codebase.
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">Campaigns</h2>
              <div className="mt-4 space-y-3">
                {emailCampaigns.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    selected={selectedCampaign.id === campaign.id}
                    onSelect={setSelectedCampaignId}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-900">Variables</h2>
              <div className="mt-4 space-y-3">
                {[
                  { key: "firstName", label: "First name" },
                  { key: "websiteLink", label: "Website link" },
                  { key: "bookingLink", label: "Booking link" },
                  { key: "unsubscribeLink", label: "Unsubscribe link" },
                ].map((field) => (
                  <label key={field.key} className="block text-sm text-stone-700">
                    <span className="mb-1 block font-medium">{field.label}</span>
                    <input
                      className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none ring-0 focus:border-emerald-500"
                      value={variables[field.key as keyof CampaignVariables]}
                      onChange={(event) =>
                        setVariables((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[24px] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">{selectedCampaign.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-900">{selectedCampaign.name}</h2>
                  <p className="mt-2 text-sm text-stone-600">{selectedCampaign.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="rounded-full bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  {status === "sending" ? "Sending…" : "Send test"}
                </button>
              </div>
              {message ? (
                <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>
                  {message}
                </p>
              ) : null}
            </div>

            <EmailPreviewFrame html={previewHtml} />
          </section>
        </section>
      </div>
    </main>
  );
}
