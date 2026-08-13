import { dataApi } from "../../config/axios/dataApi";
import {
  emptySalesDashboardSummaryData,
  type SalesDashboardSummaryApiResponse,
  type SalesDashboardSummaryData,
} from "../../types/sales/dashboard-summary.response";

const DASHBOARD_SUMMARY_ENDPOINT = "/api/v1/sales/dashboard/summary/";

export async function getSalesDashboardSummary(
  startDate: string,
  endDate: string,
): Promise<SalesDashboardSummaryData> {
  const response = await dataApi.get<SalesDashboardSummaryApiResponse>(
    DASHBOARD_SUMMARY_ENDPOINT,
    {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    },
  );

  return response.data.data ?? emptySalesDashboardSummaryData;
}
