import type { EmailCampaign } from "@/lib/email-campaigns";

interface CampaignCardProps {
  campaign: EmailCampaign;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function CampaignCard({ campaign, selected, onSelect }: CampaignCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(campaign.id)}
      className={`w-full rounded-[24px] border p-5 text-left transition-all ${
        selected
          ? "border-[color:var(--brand)] bg-[color:var(--brand-soft)] shadow-sm"
          : "border-[color:var(--border)] bg-[color:var(--surface)] hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--brand)]">
            {campaign.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">{campaign.name}</h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--foreground-muted)]">{campaign.description}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            selected
              ? "bg-[color:var(--surface)] text-[color:var(--brand-strong)]"
              : "bg-[color:var(--surface-muted)] text-[color:var(--foreground-muted)]"
          }`}
        >
          {selected ? "Active" : "Open"}
        </span>
      </div>
    </button>
  );
}
