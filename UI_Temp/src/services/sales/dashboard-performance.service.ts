import { dataApi } from "../../config/axios/dataApi";
import type {
  DashboardPerformanceApiResponse,
  DashboardPerformanceItemResponse,
} from "../../types/sales/dashboard-performance.response";

export type DashboardModule = "lead" | "proposal" | "quotation" | "purchase";

const DASHBOARD_PERFORMANCE_ENDPOINT = "/api/v1/sales/dashboard/performance";

export async function getSalesDashboardPerformance(
  module: DashboardModule,
): Promise<DashboardPerformanceItemResponse[]> {
  const response = await dataApi.get<DashboardPerformanceApiResponse>(
    DASHBOARD_PERFORMANCE_ENDPOINT,
    {
      params: { module },
    },
  );

  return response.data.data?.chart_data ?? [];
}
