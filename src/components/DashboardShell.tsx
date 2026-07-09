"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { CampaignCard } from "@/components/CampaignCard";
import { EmailPreviewFrame } from "@/components/EmailPreviewFrame";
import { emailCampaigns } from "@/lib/email-campaigns";
import { getDefaultCampaignContent, type CampaignTemplateContent } from "@/lib/email-content";
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
  const [content, setContent] = useState<CampaignTemplateContent>(getDefaultCampaignContent(emailCampaigns[0].id));

  const selectedCampaign = useMemo(
    () => emailCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? emailCampaigns[0],
    [selectedCampaignId],
  );

  useEffect(() => {
    setContent(getDefaultCampaignContent(selectedCampaign.id));
  }, [selectedCampaign.id]);

  useEffect(() => {
    void (async () => {
      const rendered = await renderCampaignHtml(selectedCampaign.id, variables, content);
      setPreviewHtml(rendered.html);
    })();
  }, [selectedCampaign.id, variables, content]);

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
          content,
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
    <main className="min-h-screen bg-[linear-gradient(135deg,var(--surface-elevated)_0%,var(--background)_100%)] px-4 py-10 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[32px] border border-[color:var(--border)] bg-[linear-gradient(135deg,var(--surface)_0%,var(--brand-soft)_100%)] p-8 shadow-[0_20px_50px_rgba(31,94,59,0.11)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-4">
              <BrandMark className="w-fit rounded-full border border-[color:var(--brand-soft)] bg-[color:var(--surface)]/95 p-3 shadow-sm" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[color:var(--brand)]">Ethny Email Dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
                  Refine every campaign with a stronger, brand-led experience.
                </h1>
                <p className="mt-3 max-w-2xl text-base text-[color:var(--foreground-muted)]">
                  Build polished email experiences with shared variables, sharper visuals, and a clearly visible Ethny identity.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)]/90 px-4 py-3 text-sm font-medium text-[color:var(--brand-strong)] shadow-sm">
              V1 • Brand-ready, fast to preview, and easy to refine.
            </div>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Campaigns</h2>
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

            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Variables</h2>
              <div className="mt-4 space-y-3">
                {[
                  { key: "firstName", label: "First name" },
                  { key: "websiteLink", label: "Website link" },
                  { key: "bookingLink", label: "Booking link" },
                  { key: "unsubscribeLink", label: "Unsubscribe link" },
                ].map((field) => (
                  <label key={field.key} className="block text-sm text-[color:var(--foreground-muted)]">
                    <span className="mb-1 block font-medium text-[color:var(--foreground)]">{field.label}</span>
                    <input
                      className="w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2 text-sm text-[color:var(--foreground)] outline-none ring-0 transition focus:border-[color:var(--brand)]"
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

            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[color:var(--foreground)]">Template content</h2>
              <div className="mt-4 space-y-3">
                {[
                  { key: "previewText", label: "Preview text" },
                  { key: "title", label: "Title" },
                  { key: "headerTitle", label: "Header title" },
                  { key: "headerSubtitle", label: "Header subtitle" },
                  { key: "intro", label: "Greeting" },
                  { key: "body", label: "Body" },
                  { key: "ctaLabel", label: "Button label" },
                ].map((field) => (
                  <label key={field.key} className="block text-sm text-[color:var(--foreground-muted)]">
                    <span className="mb-1 block font-medium text-[color:var(--foreground)]">{field.label}</span>
                    <textarea
                      className="min-h-24 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-elevated)] px-3 py-2 text-sm text-[color:var(--foreground)] outline-none ring-0 transition focus:border-[color:var(--brand)]"
                      value={content[field.key as keyof CampaignTemplateContent]}
                      onChange={(event) =>
                        setContent((current) => ({
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
            <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--brand)]">{selectedCampaign.category}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">{selectedCampaign.name}</h2>
                  <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">{selectedCampaign.subject}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSendTest}
                  className="rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]"
                >
                  {status === "sending" ? "Sending…" : "Send test"}
                </button>
              </div>
              {message ? (
                <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-[color:var(--brand)]"}`}>
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
