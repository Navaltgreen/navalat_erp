import { dataApi } from "../../../config/axios/dataApi";
import type { PaymentAllHistoryResponse } from "../../../types/accounts/payment_history/payment_history.response";

export async function getPaymentAllHistory(
  projectId: number,
  startDate?: string,
  endDate?: string,
) {
  const params: Record<string, string> = {
    project_id: String(projectId),
  };
  if (startDate) {
    params.start_date = startDate;
  }
  if (endDate) {
    params.end_date = endDate;
  }
  const { data } = await dataApi.get<PaymentAllHistoryResponse>(
    `/api/v1/project/payment-history/history/`,
    {
      params,
    },
  );

  return data;
}
