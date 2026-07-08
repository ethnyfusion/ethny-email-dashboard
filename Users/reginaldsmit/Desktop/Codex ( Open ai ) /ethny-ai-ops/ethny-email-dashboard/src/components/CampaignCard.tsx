import Link from "next/link";
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
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-emerald-700 bg-emerald-50"
          : "border-stone-200 bg-white hover:border-emerald-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {campaign.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-stone-900">{campaign.name}</h3>
          <p className="mt-2 text-sm text-stone-600">{campaign.description}</p>
        </div>
        <Link href={`/email?campaign=${campaign.id}`} className="text-sm font-medium text-emerald-700">
          Open
        </Link>
      </div>
    </button>
  );
}
