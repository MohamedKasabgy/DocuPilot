import DashboardClient from './DashboardClient';
import { loadDashboardData } from '@/lib/dashboard/load';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await loadDashboardData();
  return <DashboardClient data={data} />;
}
