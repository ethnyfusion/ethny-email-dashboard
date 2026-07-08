import { DashboardShell } from "@/components/DashboardShell";

export default async function EmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ campaign?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const campaignId = params?.campaign;

  return <DashboardShell initialCampaignId={campaignId} />;
}
