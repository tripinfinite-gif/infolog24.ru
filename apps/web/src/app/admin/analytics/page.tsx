import { getAnalyticsData } from "@/lib/dal/admin";
import { AnalyticsClient } from "./_components/analytics-client";

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return <AnalyticsClient data={data} />;
}
