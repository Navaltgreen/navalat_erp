import { dataApi } from "../../config/axios/dataApi";
import type {
  SalesDashboardLogsApiResponse,
  SalesLogItem,
  SalesLogModule,
} from "../../types/sales/dashboard-logs.response";

const DASHBOARD_LOGS_ENDPOINT = "/api/v1/sales/dashboard/logs/";

export async function getSalesDashboardLogs(
  module: SalesLogModule,
): Promise<SalesLogItem[]> {
  const response = await dataApi.get<SalesDashboardLogsApiResponse>(
    DASHBOARD_LOGS_ENDPOINT,
    {
      params: { module },
    },
  );

  return response.data.data?.logs ?? [];
}
