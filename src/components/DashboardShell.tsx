"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { BrandMark } from "@/components/BrandMark";
import { CampaignCard } from "@/components/CampaignCard";
import { EmailPreviewFrame } from "@/components/EmailPreviewFrame";
import { getCampaignAssistantOutput } from "@/lib/campaign-assistant";
import { emailCampaigns } from "@/lib/email-campaigns";
import {
  getDefaultCampaignContent,
  type CampaignTemplateContent,
} from "@/lib/email-content";
import type { CampaignVariables } from "@/lib/email-variables";
import {
  parseRecipientsCsv,
  type AudienceRecipient,
} from "@/lib/recipient-utils";

const steps = [
  "Type",
  "Audience",
  "Contenu",
  "Aperçu",
  "Test",
  "Confirmation",
  "Envoi",
] as const;

interface DashboardShellProps {
  initialCampaignId?: string;
}

export function DashboardShell({ initialCampaignId }: DashboardShellProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    initialCampaignId ?? emailCampaigns[0].id,
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [content, setContent] = useState<CampaignTemplateContent>(
    getDefaultCampaignContent(emailCampaigns[0].id),
  );
  const [variables, setVariables] = useState<CampaignVariables>({
    firstName: "",
    lastName: "",
    email: "",
    eventType: "",
    eventDate: "",
    city: "",
    guestCount: "",
    websiteLink: "https://www.ethny.com",
    bookingLink: "https://www.ethny.com/book",
    unsubscribeLink: "https://www.ethny.com/unsubscribe",
  });
  const [csvInput, setCsvInput] = useState("");
  const [recipients, setRecipients] = useState<AudienceRecipient[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [invalidRows, setInvalidRows] = useState<string[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [search, setSearch] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sendToken, setSendToken] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading-preview" | "sending-test" | "sending-campaign" | "sent" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [lastTestResult, setLastTestResult] = useState<string>("Aucun test envoyé");
  const [campaignHistory, setCampaignHistory] = useState<
    { id: string; name: string; recipients: number; sentAt: string }[]
  >([]);

  const selectedCampaign = useMemo(
    () => emailCampaigns.find((campaign) => campaign.id === selectedCampaignId) ?? emailCampaigns[0],
    [selectedCampaignId],
  );

  const assistant = useMemo(
    () =>
      getCampaignAssistantOutput({
        content,
        variables,
        recipientCount: selectedEmails.length,
      }),
    [content, selectedEmails.length, variables],
  );

  const filteredRecipients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return recipients;
    }
    return recipients.filter((recipient) =>
      [recipient.email, recipient.firstName, recipient.lastName, recipient.city]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [recipients, search]);

  useEffect(() => {
    setContent(getDefaultCampaignContent(selectedCampaign.id));
    setStepIndex(0);
  }, [selectedCampaign.id]);

  useEffect(() => {
    const saved = localStorage.getItem("ethny-campaign-history");
    if (saved) {
      try {
        setCampaignHistory(JSON.parse(saved) as { id: string; name: string; recipients: number; sentAt: string }[]);
      } catch {
        setCampaignHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    void loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCampaign.id, content, variables]);

  async function loadPreview() {
    setStatus("loading-preview");
    try {
      const response = await fetch("/api/email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          variables,
          content,
        }),
      });

      const data = (await response.json()) as { html?: string; text?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Impossible de générer l’aperçu.");
      }

      setPreviewHtml(data.html ?? "");
      setPreviewText(data.text ?? "");
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Impossible de générer l’aperçu.");
    }
  }

  function importCsvAudience() {
    const parsed = parseRecipientsCsv(csvInput);
    setRecipients(parsed.recipients);
    setInvalidRows(parsed.invalidRows);
    setDuplicateCount(parsed.duplicateCount);
    setSelectedEmails(parsed.recipients.filter((recipient) => !recipient.unsubscribed).map((recipient) => recipient.email));
    setMessage(`${parsed.recipients.length} destinataires valides importés.`);
  }

  function toggleEmail(email: string) {
    setSelectedEmails((current) =>
      current.includes(email)
        ? current.filter((item) => item !== email)
        : [...current, email],
    );
  }

  async function handleSendTest() {
    setStatus("sending-test");
    setMessage("");

    try {
      const response = await fetch("/api/email/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          variables,
          content,
          testEmail: testEmail.trim() || undefined,
          idempotencyKey: `test-${selectedCampaign.id}-${Date.now()}`,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Envoi test impossible.");
      }

      setLastTestResult(data.message ?? "Test envoyé.");
      setStatus("idle");
      setMessage(data.message ?? "Test envoyé.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Envoi test impossible.");
    }
  }

  async function handleSendCampaign() {
    setStatus("sending-campaign");
    setMessage("");

    try {
      const selectedRecipients = recipients
        .filter((recipient) => selectedEmails.includes(recipient.email))
        .map((recipient) => ({ email: recipient.email }));

      const response = await fetch("/api/email/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          variables,
          content,
          recipients: selectedRecipients,
          confirmationText,
          idempotencyKey: `${selectedCampaign.id}:${content.subject}:${selectedRecipients.map((item) => item.email).join(",")}`,
          sendToken: sendToken.trim() || undefined,
        }),
      });

      const data = (await response.json()) as { error?: string; recipientCount?: number };
      if (!response.ok) {
        throw new Error(data.error ?? "Envoi campagne impossible.");
      }

      const historyItem = {
        id: `${selectedCampaign.id}-${Date.now()}`,
        name: content.subject,
        recipients: data.recipientCount ?? selectedRecipients.length,
        sentAt: new Date().toISOString(),
      };
      const updated = [historyItem, ...campaignHistory].slice(0, 8);
      setCampaignHistory(updated);
      localStorage.setItem("ethny-campaign-history", JSON.stringify(updated));

      setStatus("sent");
      setStepIndex(steps.length - 1);
      setMessage(`Campagne envoyée à ${historyItem.recipients} destinataires.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Envoi campagne impossible.");
    }
  }

  const expectedConfirmation = `ENVOYER ${selectedEmails.length}`;

  return (
    <main className="min-h-screen bg-[color:var(--background)] px-4 py-8 text-[color:var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <BrandMark />
            <button
              type="button"
              onClick={() => setStepIndex(0)}
              className="rounded-full bg-[color:var(--brand)] px-5 py-2 text-sm font-semibold text-[color:var(--surface)]"
            >
              Créer une campagne
            </button>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Ethny Email Dashboard
          </h1>
          <p className="mt-2 text-sm text-[color:var(--foreground-muted)]">
            Outil interne premium pour créer, tester et valider des campagnes Resend en toute sécurité.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Campagnes récentes" value={String(campaignHistory.length)} />
          <MetricCard label="Brouillons" value="1" />
          <MetricCard label="Destinataires sélectionnés" value={String(selectedEmails.length)} />
          <MetricCard label="Livraison / ouvertures / clics" value="Donnée indisponible" />
        </section>

        <section className="rounded-[28px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {steps.map((step, index) => (
              <button
                key={step}
                type="button"
                onClick={() => setStepIndex(index)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                  index === stepIndex
                    ? "bg-[color:var(--brand)] text-[color:var(--surface)]"
                    : "bg-[color:var(--surface-muted)] text-[color:var(--foreground-muted)]"
                }`}
              >
                {index + 1}. {step}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="space-y-3">
              {emailCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  selected={selectedCampaign.id === campaign.id}
                  onSelect={setSelectedCampaignId}
                />
              ))}
            </aside>

            <section className="space-y-4">
              {stepIndex === 0 ? (
                <StepPanel title="Type de campagne">
                  <p className="text-sm text-[color:var(--foreground-muted)]">
                    {selectedCampaign.description}
                  </p>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-sm">
                    Segment conseillé: {assistant.suggestions.suggestedSegment}
                  </div>
                </StepPanel>
              ) : null}

              {stepIndex === 1 ? (
                <StepPanel title="Audience">
                  <textarea
                    className="min-h-32 w-full rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-2 text-sm"
                    placeholder="email,firstName,lastName,eventType,eventDate,city,guestCount,unsubscribed"
                    value={csvInput}
                    onChange={(event) => setCsvInput(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={importCsvAudience}
                      className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-[color:var(--surface)]"
                    >
                      Importer CSV
                    </button>
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Rechercher un destinataire"
                      className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 text-sm"
                    />
                  </div>
                  <p className="text-xs text-[color:var(--foreground-muted)]">
                    {duplicateCount} doublon(s) supprimé(s) • {invalidRows.length} ligne(s) invalide(s)
                  </p>
                  <div className="max-h-56 space-y-2 overflow-y-auto rounded-xl border border-[color:var(--border)] p-3">
                    {filteredRecipients.map((recipient) => (
                      <label key={recipient.id} className="flex items-center justify-between gap-3 text-sm">
                        <span>{recipient.email}</span>
                        <input
                          type="checkbox"
                          checked={selectedEmails.includes(recipient.email)}
                          onChange={() => toggleEmail(recipient.email)}
                        />
                      </label>
                    ))}
                  </div>
                </StepPanel>
              ) : null}

              {stepIndex === 2 ? (
                <StepPanel title="Contenu">
                  <Field label="Objet">
                    <input
                      value={content.subject}
                      onChange={(event) => setContent((current) => ({ ...current, subject: event.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field label="Préheader">
                    <input
                      value={content.previewText}
                      onChange={(event) => setContent((current) => ({ ...current, previewText: event.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field label="Titre">
                    <input
                      value={content.title}
                      onChange={(event) => setContent((current) => ({ ...current, title: event.target.value }))}
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field label="Texte">
                    <textarea
                      value={content.body}
                      onChange={(event) => setContent((current) => ({ ...current, body: event.target.value }))}
                      className="min-h-28 w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>
                  <Field label="CTA">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        value={content.ctaLabel}
                        onChange={(event) => setContent((current) => ({ ...current, ctaLabel: event.target.value }))}
                        className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                      />
                      <input
                        value={content.ctaUrl}
                        onChange={(event) => setContent((current) => ({ ...current, ctaUrl: event.target.value }))}
                        className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                      />
                    </div>
                  </Field>
                  <Field label="Variables de prévisualisation">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { key: "firstName", label: "Prénom" },
                        { key: "lastName", label: "Nom" },
                        { key: "city", label: "Ville" },
                        { key: "eventType", label: "Type d’événement" },
                        { key: "websiteLink", label: "Lien site" },
                        { key: "bookingLink", label: "Lien booking" },
                      ].map((field) => (
                        <input
                          key={field.key}
                          value={variables[field.key as keyof CampaignVariables]}
                          onChange={(event) =>
                            setVariables((current) => ({
                              ...current,
                              [field.key]: event.target.value,
                            }))
                          }
                          placeholder={field.label}
                          className="rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                        />
                      ))}
                    </div>
                  </Field>
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-sm">
                    Angle éditorial proposé: {assistant.suggestions.editorialAngle}
                  </div>
                  {assistant.warnings.length > 0 ? (
                    <div className="rounded-xl border border-[#f1d7a7] bg-[#fff8ec] p-3 text-sm text-[#8a5d1c]">
                      {assistant.warnings.map((warning) => (
                        <p key={warning}>{warning}</p>
                      ))}
                    </div>
                  ) : null}
                </StepPanel>
              ) : null}

              {stepIndex === 3 ? (
                <StepPanel title="Aperçu">
                  <EmailPreviewFrame html={previewHtml} />
                  <div className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-sm">
                    <p className="font-semibold">Version texte brut</p>
                    <pre className="mt-2 whitespace-pre-wrap font-sans text-xs">{previewText}</pre>
                  </div>
                </StepPanel>
              ) : null}

              {stepIndex === 4 ? (
                <StepPanel title="Envoi test">
                  <Field label="Adresse test (optionnelle)">
                    <input
                      value={testEmail}
                      onChange={(event) => setTestEmail(event.target.value)}
                      placeholder="RESEND_TEST_EMAIL par défaut"
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={status === "sending-test"}
                    className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-[color:var(--surface)] disabled:opacity-50"
                  >
                    {status === "sending-test" ? "Envoi test..." : "Envoyer un test"}
                  </button>
                  <p className="text-sm text-[color:var(--foreground-muted)]">{lastTestResult}</p>
                </StepPanel>
              ) : null}

              {stepIndex === 5 ? (
                <StepPanel title="Confirmation finale">
                  <SummaryRow label="Nom de campagne" value={selectedCampaign.name} />
                  <SummaryRow label="Objet" value={content.subject} />
                  <SummaryRow label="Audience" value={`${selectedEmails.length} destinataires`} />
                  <SummaryRow label="CTA" value={`${content.ctaLabel} → ${content.ctaUrl}`} />
                  <SummaryRow label="Dernier test" value={lastTestResult} />
                  <SummaryRow label="Avertissements" value={assistant.warnings.length ? `${assistant.warnings.length} restant(s)` : "Aucun"} />

                  <Field label={`Tapez ${expectedConfirmation} pour confirmer`}>
                    <input
                      value={confirmationText}
                      onChange={(event) => setConfirmationText(event.target.value)}
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>

                  <Field label="Jeton d’envoi (si configuré côté serveur)">
                    <input
                      value={sendToken}
                      onChange={(event) => setSendToken(event.target.value)}
                      className="w-full rounded-xl border border-[color:var(--border)] px-3 py-2 text-sm"
                    />
                  </Field>

                  <p className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-3 text-xs text-[color:var(--foreground-muted)]">
                    Sans base de données configurée, l’historique est stocké côté navigateur uniquement.
                  </p>
                </StepPanel>
              ) : null}

              {stepIndex === 6 ? (
                <StepPanel title="Envoi">
                  <button
                    type="button"
                    onClick={handleSendCampaign}
                    disabled={
                      status === "sending-campaign" ||
                      confirmationText.trim().toUpperCase() !== expectedConfirmation
                    }
                    className="rounded-full bg-[color:var(--brand-strong)] px-5 py-2 text-sm font-semibold text-[color:var(--surface)] disabled:opacity-50"
                  >
                    {status === "sending-campaign" ? "Envoi en cours..." : "Envoyer la campagne"}
                  </button>
                </StepPanel>
              ) : null}

              {message ? (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    status === "error"
                      ? "bg-[#fff2f1] text-[#a43a2b]"
                      : "bg-[color:var(--surface-muted)] text-[color:var(--brand-strong)]"
                  }`}
                >
                  {message}
                </p>
              ) : null}
            </section>
          </div>
        </section>

        <footer className="rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-xs text-[color:var(--foreground-muted)]">
          Signature: Chef Réginald Smit · Ethny Kitchen
        </footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--foreground-muted)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{value}</p>
    </article>
  );
}

function StepPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-[color:var(--foreground)]">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="font-semibold">{label}:</span> {value}
    </p>
  );
}
