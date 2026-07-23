import { dataApi } from "../../config/axios/dataApi";
import type {
  SalesDashboardWorksApiResponse,
  SalesWorkItem,
} from "../../types/sales/dashboard-sales-works.response";

const DASHBOARD_SALES_WORKS_ENDPOINT = "/api/v1/sales/dashboard/sales-works/";

export async function getSalesDashboardWorks(): Promise<SalesWorkItem[]> {
  const response = await dataApi.get<SalesDashboardWorksApiResponse>(
    DASHBOARD_SALES_WORKS_ENDPOINT,
  );

  return response.data.data?.works ?? [];
}
