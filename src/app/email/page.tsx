import { AppNav } from "@/components/AppNav";
import { DashboardShell } from "@/components/DashboardShell";

export default async function EmailPage({
  searchParams,
}: {
  searchParams?: Promise<{ campaign?: string; campaignId?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const campaignId = params?.campaignId ?? params?.campaign;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <AppNav active="dashboard" />
      <DashboardShell initialCampaignId={campaignId} />
    </div>
  );
}
